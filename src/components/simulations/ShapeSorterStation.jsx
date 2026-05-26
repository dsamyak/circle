import React, { useState, useEffect, useRef } from 'react';
import CircleSVG from '../shared/CircleSVG';
import { SquareSVG, RectangleSVG, TriangleSVG, OvalSVG, SemiCircleSVG } from '../shared/OtherShapes';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { simulateNarrationB, sorterCorrectNarration, sorterWrongNarration, ovalNotCircleNarration } from '../../utils/narration';

const SHAPE_CARDS = [
  { id: 's1', shape: 'circle', isCircle: true, label: 'Circle', svg: <CircleSVG size={80} /> },
  { id: 's2', shape: 'square', isCircle: false, label: 'Square', svg: <SquareSVG size={80} /> },
  { id: 's3', shape: 'triangle', isCircle: false, label: 'Triangle', svg: <TriangleSVG size={80} /> },
  { id: 's4', shape: 'circle', isCircle: true, label: 'Circle', svg: <CircleSVG size={80} /> },
  { id: 's5', shape: 'rectangle', isCircle: false, label: 'Rectangle', svg: <RectangleSVG size={80} /> },
  { id: 's6', shape: 'oval', isCircle: false, label: 'Oval', svg: <OvalSVG size={80} /> },
  { id: 's7', shape: 'circle', isCircle: true, label: 'Circle', svg: <CircleSVG size={80} /> },
  { id: 's8', shape: 'semicircle', isCircle: false, label: 'Semi-circle', svg: <SemiCircleSVG size={80} /> },
  { id: 's9', shape: 'oval', isCircle: false, label: 'Oval', svg: <OvalSVG size={80} /> },
  { id: 's10', shape: 'circle', isCircle: true, label: 'Circle', svg: <CircleSVG size={80} /> },
];

const ShapeSorterStation = ({ onComplete, audioEnabled }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct'|'wrong'|null
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [complete, setComplete] = useState(false);
  const narrated = useRef(false);

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(simulateNarrationB(), audioEnabled);
    }
  }, [audioEnabled]);

  const card = SHAPE_CARDS[cardIndex];

  const handleSort = (binType) => {
    if (feedback) return; // Prevent double-tap

    const isCorrect =
      (binType === 'circle' && card.isCircle) ||
      (binType === 'not-circle' && !card.isCircle);

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);

      narrate(sorterCorrectNarration(), audioEnabled);

      setTimeout(() => {
        setFeedback(null);
        setWrongAttempts(0);
        if (cardIndex >= SHAPE_CARDS.length - 1) {
          setComplete(true);
          setTimeout(() => onComplete(), 1500);
        } else {
          setCardIndex(prev => prev + 1);
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      const newWrong = wrongAttempts + 1;
      setWrongAttempts(newWrong);

      if (card.shape === 'oval') {
        narrate(ovalNotCircleNarration(), audioEnabled);
      } else {
        narrate(sorterWrongNarration(), audioEnabled);
      }

      setTimeout(() => {
        setFeedback(null);
        if (newWrong >= 2) {
          // Auto-advance after 2 wrong attempts
          setWrongAttempts(0);
          if (cardIndex >= SHAPE_CARDS.length - 1) {
            setComplete(true);
            setTimeout(() => onComplete(), 1500);
          } else {
            setCardIndex(prev => prev + 1);
          }
        }
      }, 1500);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, binType) => {
    e.preventDefault();
    handleSort(binType);
  };

  if (complete) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Mascot mood="celebrating" size={120} />
        <h3 style={{ fontFamily: "'Fredoka One', cursive", color: '#4CAF50', marginTop: 16 }}>
          Great Sorting! {score}/{SHAPE_CARDS.length} correct! 🎉
        </h3>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: 16,
    }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: '#9B59B6', margin: 0 }}>
        🗂️ Shape Sorter
      </h3>
      <p style={{ fontSize: 16, color: '#757575', margin: 0 }}>
        Card {cardIndex + 1} of {SHAPE_CARDS.length} • Score: {score}
      </p>

      {/* Current shape card */}
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text', 'shape')}
        className={`${feedback === 'correct' ? 'animate-bounce-in' : ''} ${feedback === 'wrong' ? 'animate-shake' : ''}`}
        style={{
          width: 140,
          height: 160,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          cursor: 'grab',
          border: feedback === 'correct' ? '4px solid #4CAF50' : feedback === 'wrong' ? '4px solid #FF6B6B' : '4px solid transparent',
          transition: 'border-color 0.3s',
        }}
      >
        {card.svg}
        <span style={{ fontWeight: 700, marginTop: 8, fontSize: 16 }}>{card.label}</span>
      </div>

      {/* Bins */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Circle Bin */}
        <button
          onClick={() => handleSort('circle')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'circle')}
          style={{
            width: 140,
            height: 100,
            borderRadius: 16,
            border: '3px dashed #4A90D9',
            backgroundColor: '#E3F2FD',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 700,
            color: '#4A90D9',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ⭕ Circle
        </button>

        {/* Not-Circle Bin */}
        <button
          onClick={() => handleSort('not-circle')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'not-circle')}
          style={{
            width: 140,
            height: 100,
            borderRadius: 16,
            border: '3px dashed #FF6B6B',
            backgroundColor: '#FFEBEE',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 700,
            color: '#FF6B6B',
            fontFamily: "'Nunito', sans-serif",
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ✕ Not a Circle
        </button>
      </div>

      {/* Feedback message */}
      {feedback && (
        <p style={{
          fontWeight: 700,
          fontSize: 18,
          color: feedback === 'correct' ? '#4CAF50' : '#FF6B6B',
          margin: 0,
        }}>
          {feedback === 'correct' ? "That's right! ✅" : "Look again! Does it have corners? 🤔"}
        </p>
      )}
    </div>
  );
};

export default ShapeSorterStation;
