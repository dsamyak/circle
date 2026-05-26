import React, { useState, useEffect, useRef } from 'react';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';

const OBJECTS = [
  { emoji: '🪙', label: 'Coin', delay: 300 },
  { emoji: '⏰', label: 'Clock', delay: 900 },
  { emoji: '⚽', label: 'Ball', delay: 1500 },
  { emoji: '☀️', label: 'Sun', delay: 2100 },
];

const WonderPhase = ({ onComplete, audioEnabled }) => {
  const [visibleObjects, setVisibleObjects] = useState([]);
  const [showMascot, setShowMascot] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const narrated = useRef(false);

  useEffect(() => {
    // Fade in background
    const bgTimer = setTimeout(() => setBgOpacity(1), 100);

    // Animate objects in one by one
    const timers = OBJECTS.map((obj, i) =>
      setTimeout(() => {
        setVisibleObjects(prev => [...prev, i]);
      }, obj.delay)
    );

    // Mascot appears
    const mascotTimer = setTimeout(() => setShowMascot(true), 2700);

    // Show question text
    const questionTimer = setTimeout(() => {
      setShowQuestion(true);
      // Play narration
      if (!narrated.current) {
        narrated.current = true;
        narrate(wonderNarration(), audioEnabled).then(() => {
          setShowButton(true);
        });
      }
    }, 3400);

    // Fallback: show button after 8s even if audio fails
    const fallbackTimer = setTimeout(() => setShowButton(true), 8000);

    return () => {
      clearTimeout(bgTimer);
      timers.forEach(clearTimeout);
      clearTimeout(mascotTimer);
      clearTimeout(questionTimer);
      clearTimeout(fallbackTimer);
      stopAudio();
    };
  }, [audioEnabled]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 50%, #F0F7FF 100%)',
      opacity: bgOpacity,
      transition: 'opacity 0.8s ease',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating circular objects */}
      <div style={{
        display: 'flex',
        gap: 32,
        marginBottom: 40,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {OBJECTS.map((obj, i) => (
          <div
            key={i}
            className={visibleObjects.includes(i) ? 'animate-bounce-in' : ''}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)',
              boxShadow: '0 8px 24px rgba(74,144,217,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              opacity: visibleObjects.includes(i) ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          >
            <span className={visibleObjects.includes(i) ? 'animate-spin' : ''} style={{ animationDuration: '8s' }}>
              {obj.emoji}
            </span>
          </div>
        ))}
      </div>

      {/* Mascot */}
      {showMascot && (
        <div className="animate-slide-up" style={{ marginBottom: 24 }}>
          <Mascot mood="thinking" size={120} />
        </div>
      )}

      {/* Question Text */}
      {showQuestion && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: 20,
          padding: '24px 32px',
          maxWidth: 550,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          marginBottom: 32,
        }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#4A4A4A',
            lineHeight: 1.5,
            margin: 0,
          }}>
            Have you ever noticed? A coin is round. A clock is round. The sun is round! 
            <span style={{ color: '#4A90D9', fontWeight: 800 }}> What shape do they all share?</span>
          </p>
        </div>
      )}

      {/* CTA Button */}
      {showButton && (
        <button
          className="btn-primary animate-bounce-in"
          onClick={onComplete}
          style={{
            fontSize: 24,
            padding: '18px 48px',
            minHeight: 56,
          }}
        >
          Let's Explore! 🔍
        </button>
      )}
    </div>
  );
};

export default WonderPhase;
