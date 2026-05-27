import React from 'react';
import CircleSVG from './shared/CircleSVG';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'Spark your curiosity' },
  { icon: '📖', label: 'Story', desc: 'Hear the tale' },
  { icon: '🧪', label: 'Simulate', desc: 'Explore & discover' },
  { icon: '🎮', label: 'Play', desc: 'Test your skills' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  return (
    <div className="intro-screen">
      <div className="intro-badge">
        ✨· Grade 1
      </div>

      <h1 className="intro-title">
        Circle<br />
        <span style={{ color: 'var(--gold)' }}>Introduction to Geometry</span>
      </h1>

      <p className="intro-desc">
        Discover what makes a circle special! Explore, play, and learn all about
        the most perfect shape in nature. 🔵
      </p>

      <div className="intro-start-btn">
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          Start the Journey ✨
        </button>
      </div>

      <div className="intro-journey-map">
        <div className="intro-journey-title">Your Learning Journey</div>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((phase, i) => (
            <React.Fragment key={i}>
              <div className="intro-journey-step">
                <div className="intro-journey-icon">{phase.icon}</div>
                <div className="intro-journey-info">
                  <div className="intro-journey-label">{phase.label}</div>
                  <div className="intro-journey-desc">{phase.desc}</div>
                </div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && (
                <span className="intro-journey-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
