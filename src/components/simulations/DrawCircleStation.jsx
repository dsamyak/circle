import React, { useRef, useState, useEffect, useCallback } from 'react';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { simulateNarrationA, drawSuccessNarration, drawRetryNarration } from '../../utils/narration';

const GUIDE_CX = 160;
const GUIDE_CY = 160;
const GUIDE_R = 100;
const CANVAS_SIZE = 320;

const DrawCircleStation = ({ onComplete, audioEnabled }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState('');
  const narrated = useRef(false);

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(simulateNarrationA(), audioEnabled);
    }
    drawGuideline();
  }, [audioEnabled]);

  const drawGuideline = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Guideline circle
    ctx.beginPath();
    ctx.arc(GUIDE_CX, GUIDE_CY, GUIDE_R, 0, Math.PI * 2);
    ctx.setLineDash([8, 4]);
    ctx.strokeStyle = 'rgba(74, 144, 217, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    if (complete) return;
    setIsDrawing(true);
    const pos = getPos(e);
    setTrailPoints([pos]);
  };

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing || complete) return;
    const pos = getPos(e);
    setTrailPoints(prev => [...prev, pos]);

    // Draw trail
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pts = [...trailPoints, pos];
    if (pts.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#4A90D9';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [isDrawing, complete, trailPoints]);

  const endDraw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);

    if (trailPoints.length < 10) {
      setMessage('Draw a bigger circle!');
      return;
    }

    // Check if the circle is closed (start and end points are close)
    const startPoint = trailPoints[0];
    const endPoint = trailPoints[trailPoints.length - 1];
    const distanceBetweenEnds = Math.hypot(startPoint.x - endPoint.x, startPoint.y - endPoint.y);

    if (distanceBetweenEnds > 50) {
      setMessage('Almost! Make sure to connect the ends to close the circle! 🔄');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts < 3) {
        narrate(drawRetryNarration(), audioEnabled);
        return;
      }
    }

    // Measure accuracy
    const acc = measureAccuracy(trailPoints);
    setAccuracy(Math.round(acc));
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if ((acc >= 60 && distanceBetweenEnds <= 50) || newAttempts >= 3) {
      setComplete(true);
      setMessage(`${acc >= 60 ? 'Great circle!' : 'Good effort!'} Accuracy: ${Math.round(acc)}%`);
      narrate(drawSuccessNarration(), audioEnabled);
      setTimeout(() => onComplete(), 2000);
    } else {
      setMessage(`Almost! Accuracy: ${Math.round(acc)}%. Try again! (${newAttempts}/3)`);
      narrate(drawRetryNarration(), audioEnabled);
    }
  };

  const measureAccuracy = (points) => {
    if (points.length === 0) return 0;
    const deviations = points.map(p => {
      const dist = Math.hypot(p.x - GUIDE_CX, p.y - GUIDE_CY);
      return Math.abs(dist - GUIDE_R);
    });
    const avg = deviations.reduce((a, b) => a + b, 0) / deviations.length;
    return Math.max(0, 100 - (avg / GUIDE_R) * 100);
  };

  const reset = () => {
    setTrailPoints([]);
    setAccuracy(null);
    setMessage('');
    drawGuideline();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 16,
    }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: '#4A90D9', margin: 0 }}>
        ✏️ Draw a Circle
      </h3>
      <p style={{ fontSize: 16, color: '#757575', margin: 0, textAlign: 'center' }}>
        Trace the dotted circle with your finger! Keep it smooth and round!
      </p>

      <div style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        background: '#FAFFFE',
        touchAction: 'none',
      }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ width: '100%', maxWidth: '320px', aspectRatio: '1/1', height: 'auto', cursor: 'crosshair', display: 'block' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {complete && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
          }}>
            <Mascot mood="celebrating" size={60} />
          </div>
        )}
      </div>

      {message && (
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: complete ? '#4CAF50' : '#FF6B6B',
          textAlign: 'center',
        }}>
          {message}
        </p>
      )}

      {!complete && (
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              borderRadius: 50,
              border: '2px solid #E0E0E0',
              background: 'white',
              fontSize: 16,
              fontWeight: 700,
              color: '#757575',
              cursor: 'pointer',
            }}
          >
            Try Again 🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawCircleStation;
