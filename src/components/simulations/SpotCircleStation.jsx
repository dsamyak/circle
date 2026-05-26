import React, { useState, useEffect, useRef } from 'react';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { simulateNarrationC, spotFoundNarration, spotWrongNarration, spotCompleteNarration } from '../../utils/narration';

// Circle objects in the classroom scene
const CIRCLE_OBJECTS = [
  { id: 'clock', cx: 420, cy: 80, r: 40, label: 'clock face', emoji: '⏰' },
  { id: 'doorknob', cx: 580, cy: 290, r: 22, label: 'door knob', emoji: '🔘' },
  { id: 'cup_top', cx: 150, cy: 340, r: 24, label: 'cup opening', emoji: '☕' },
  { id: 'coin', cx: 230, cy: 410, r: 18, label: 'coin on desk', emoji: '🪙' },
  { id: 'ball', cx: 60, cy: 460, r: 30, label: 'ball on floor', emoji: '⚽' },
  { id: 'wheel', cx: 500, cy: 470, r: 26, label: 'toy car wheel', emoji: '🛞' },
];

const SpotCircleStation = ({ onComplete, audioEnabled }) => {
  const [foundCircles, setFoundCircles] = useState([]);
  const [lastTap, setLastTap] = useState(null); // 'found'|'wrong'|null
  const [lastLabel, setLastLabel] = useState('');
  const [complete, setComplete] = useState(false);
  const narrated = useRef(false);

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(simulateNarrationC(), audioEnabled);
    }
  }, [audioEnabled]);

  const handleSceneClick = (e) => {
    if (complete) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 640 / rect.width;
    const scaleY = 520 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hit = CIRCLE_OBJECTS.find(obj => {
      const dist = Math.hypot(x - obj.cx, y - obj.cy);
      return dist <= obj.r * 2 && !foundCircles.includes(obj.id);
    });

    if (hit) {
      const newFound = [...foundCircles, hit.id];
      setFoundCircles(newFound);
      setLastTap('found');
      setLastLabel(hit.label);
      narrate(spotFoundNarration(hit.label), audioEnabled);

      if (newFound.length === CIRCLE_OBJECTS.length) {
        setComplete(true);
        setTimeout(() => {
          narrate(spotCompleteNarration(), audioEnabled);
          setTimeout(() => onComplete(), 2000);
        }, 800);
      }
    } else {
      setLastTap('wrong');
      setLastLabel('');
      narrate(spotWrongNarration(), audioEnabled);
    }

    setTimeout(() => setLastTap(null), 1500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 16,
    }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: '#27AE60', margin: 0 }}>
        🔍 Spot the Circle
      </h3>
      <p style={{ fontSize: 16, color: '#757575', margin: 0 }}>
        Found {foundCircles.length} of {CIRCLE_OBJECTS.length} circles!
      </p>

      {/* Scene SVG */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
      }}>
        <svg
          viewBox="0 0 640 520"
          width="100%"
          style={{ maxWidth: 580, display: 'block', backgroundColor: '#FFF9C4' }}
          onClick={handleSceneClick}
        >
          {/* Classroom Background */}
          <rect x="0" y="0" width="640" height="520" fill="#FFF9C4" />

          {/* Wall */}
          <rect x="0" y="0" width="640" height="360" fill="#E8F5E9" />

          {/* Chalkboard (rectangle — distractor) */}
          <rect x="180" y="30" width="260" height="160" rx="8" fill="#37474F" stroke="#5D4037" strokeWidth="6" />
          <text x="310" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontFamily="'Fredoka', cursive">Shapes!</text>

          {/* Window (rectangle — distractor) */}
          <rect x="30" y="50" width="100" height="120" rx="4" fill="#BBDEFB" stroke="#5D4037" strokeWidth="4" />
          <line x1="80" y1="50" x2="80" y2="170" stroke="#5D4037" strokeWidth="3" />
          <line x1="30" y1="110" x2="130" y2="110" stroke="#5D4037" strokeWidth="3" />

          {/* Clock on wall (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[0].cx} cy={CIRCLE_OBJECTS[0].cy} r={CIRCLE_OBJECTS[0].r}
            fill={foundCircles.includes('clock') ? '#BBDEFB' : '#FFFFFF'}
            stroke={foundCircles.includes('clock') ? '#4A90D9' : '#9E9E9E'}
            strokeWidth={foundCircles.includes('clock') ? 4 : 2}
            className={foundCircles.includes('clock') ? 'animate-circle-glow' : ''}
          />
          <text x={CIRCLE_OBJECTS[0].cx} y={CIRCLE_OBJECTS[0].cy + 6} textAnchor="middle" fontSize="24">
            {foundCircles.includes('clock') ? '✅' : '🕐'}
          </text>

          {/* Door */}
          <rect x="540" y="150" width="80" height="210" rx="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />

          {/* Door knob (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[1].cx} cy={CIRCLE_OBJECTS[1].cy} r={CIRCLE_OBJECTS[1].r}
            fill={foundCircles.includes('doorknob') ? '#BBDEFB' : '#FFD54F'}
            stroke={foundCircles.includes('doorknob') ? '#4A90D9' : '#F9A825'}
            strokeWidth={foundCircles.includes('doorknob') ? 4 : 2}
          />
          {foundCircles.includes('doorknob') && <text x={CIRCLE_OBJECTS[1].cx} y={CIRCLE_OBJECTS[1].cy + 6} textAnchor="middle" fontSize="16">✅</text>}

          {/* Floor */}
          <rect x="0" y="360" width="640" height="160" fill="#EFEBE9" />

          {/* Desk */}
          <rect x="100" y="340" width="300" height="20" rx="4" fill="#8D6E63" />
          <rect x="120" y="360" width="10" height="80" fill="#795548" />
          <rect x="380" y="360" width="10" height="80" fill="#795548" />

          {/* Cup opening (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[2].cx} cy={CIRCLE_OBJECTS[2].cy} r={CIRCLE_OBJECTS[2].r}
            fill={foundCircles.includes('cup_top') ? '#BBDEFB' : '#FFFFFF'}
            stroke={foundCircles.includes('cup_top') ? '#4A90D9' : '#9E9E9E'}
            strokeWidth={foundCircles.includes('cup_top') ? 4 : 2}
          />
          {foundCircles.includes('cup_top') && <text x={CIRCLE_OBJECTS[2].cx} y={CIRCLE_OBJECTS[2].cy + 6} textAnchor="middle" fontSize="16">✅</text>}

          {/* Books on desk (rectangle — distractor) */}
          <rect x="280" y="310" width="40" height="30" rx="3" fill="#E57373" />
          <rect x="325" y="315" width="35" height="25" rx="3" fill="#64B5F6" />

          {/* Coin on desk (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[3].cx} cy={CIRCLE_OBJECTS[3].cy} r={CIRCLE_OBJECTS[3].r}
            fill={foundCircles.includes('coin') ? '#BBDEFB' : '#FFD54F'}
            stroke={foundCircles.includes('coin') ? '#4A90D9' : '#FFA000'}
            strokeWidth={foundCircles.includes('coin') ? 4 : 2}
          />
          {foundCircles.includes('coin') && <text x={CIRCLE_OBJECTS[3].cx} y={CIRCLE_OBJECTS[3].cy + 5} textAnchor="middle" fontSize="12">✅</text>}

          {/* Ball on floor (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[4].cx} cy={CIRCLE_OBJECTS[4].cy} r={CIRCLE_OBJECTS[4].r}
            fill={foundCircles.includes('ball') ? '#BBDEFB' : '#FF7043'}
            stroke={foundCircles.includes('ball') ? '#4A90D9' : '#E64A19'}
            strokeWidth={foundCircles.includes('ball') ? 4 : 2}
          />
          {foundCircles.includes('ball') && <text x={CIRCLE_OBJECTS[4].cx} y={CIRCLE_OBJECTS[4].cy + 6} textAnchor="middle" fontSize="18">✅</text>}

          {/* Toy car body (rectangle — distractor) */}
          <rect x="460" y="450" width="80" height="30" rx="8" fill="#42A5F5" />
          <rect x="465" y="440" width="40" height="15" rx="5" fill="#64B5F6" />

          {/* Toy car wheel (CIRCLE!) */}
          <circle cx={CIRCLE_OBJECTS[5].cx} cy={CIRCLE_OBJECTS[5].cy} r={CIRCLE_OBJECTS[5].r}
            fill={foundCircles.includes('wheel') ? '#BBDEFB' : '#424242'}
            stroke={foundCircles.includes('wheel') ? '#4A90D9' : '#212121'}
            strokeWidth={foundCircles.includes('wheel') ? 4 : 2}
          />
          {foundCircles.includes('wheel') && <text x={CIRCLE_OBJECTS[5].cx} y={CIRCLE_OBJECTS[5].cy + 6} textAnchor="middle" fontSize="16">✅</text>}

          {/* Triangle sign on wall (distractor) */}
          <polygon points="520,40 500,80 540,80" fill="#FFEB3B" stroke="#F57F17" strokeWidth="2" />
        </svg>
      </div>

      {/* Tap feedback */}
      {lastTap && (
        <p style={{
          fontWeight: 700,
          fontSize: 18,
          color: lastTap === 'found' ? '#4CAF50' : '#FF6B6B',
          margin: 0,
          animation: 'fadeIn 0.3s ease',
        }}>
          {lastTap === 'found' ? `You found the ${lastLabel}! ✅` : "That has corners! Look for round shapes! 🤔"}
        </p>
      )}

      {complete && (
        <div className="animate-bounce-in" style={{ textAlign: 'center' }}>
          <Mascot mood="celebrating" size={100} />
          <p style={{ fontFamily: "'Fredoka One', cursive", color: '#4CAF50', fontSize: 22 }}>
            You found all the circles! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default SpotCircleStation;
