import React, { useState, useEffect, useRef } from 'react';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';

const WONDER_ITEMS = [
  { emoji: '🪙', label: 'Coin' },
  { emoji: '⏰', label: 'Clock' },
  { emoji: '⚽', label: 'Ball' },
  { emoji: '☀️', label: 'Sun' },
];

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  emoji: ['✨', '⭐', '💫', '🌟', '⬤', '◯', '●', '○'][i],
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 80}%`,
  delay: `${i * 0.8}s`,
}));

const WonderPhase = ({ onComplete, audioEnabled }) => {
  const [step, setStep] = useState(0); // 0=qmark, 1=mascot, 2=question, 3=button
  const [qmarkRevealed, setQmarkRevealed] = useState(false);
  const narrated = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setQmarkRevealed(true), 300);
    const t2 = setTimeout(() => setStep(1), 1200);
    const t3 = setTimeout(() => {
      setStep(2);
      if (!narrated.current) {
        narrated.current = true;
        narrate(wonderNarration(), audioEnabled).then(() => setStep(3));
      }
    }, 2000);
    const fallback = setTimeout(() => setStep(3), 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fallback);
      stopAudio();
    };
  }, [audioEnabled]);

  return (
    <div className="wonder-phase">
      {/* Particles */}
      <div className="wonder-particles">
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className="wonder-particle"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, fontSize: '2rem' }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div className="wonder-content">
        {/* Question Mark Orb */}
        <div className={`wonder-qmark ${qmarkRevealed ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>

        {/* Mascot */}
        <div className={`wonder-mascot ${step >= 1 ? 'visible' : ''}`}>
          <div className="mascot-container">
            <Mascot mood="thinking" size={80} />
            <div className="speech-bubble wonder-bubble">
              What shape do they all share?
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`wonder-question-card ${step >= 2 ? 'visible' : ''}`}>
          <div className="wonder-emoji">🔵</div>
          <div className="wonder-question-text">
            A coin is round. A clock is round. The sun is round!<br />
            What shape do they all share?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 12 }}>
            {WONDER_ITEMS.map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card-icon">{item.emoji}</div>
                <div className="feature-card-label">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="wonder-subtext" style={{ marginTop: 16 }}>
            They're all circles — the most perfect shape! ⬤
          </p>
        </div>

        {/* CTA Button */}
        <button
          className={`btn btn-wonder ${step >= 3 ? 'visible' : ''}`}
          onClick={onComplete}
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let's Explore!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
};

export default WonderPhase;
