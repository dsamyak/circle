import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CircleSVG from '../shared/CircleSVG';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { storyNarration } from '../../utils/narration';
import { storyPanels } from '../../data/storyContent';

const StoryPhase = ({ onComplete, audioEnabled }) => {
  const [panelIndex, setPanelIndex] = useState(0);
  const [showInteractive, setShowInteractive] = useState(false);
  const [letterReveal, setLetterReveal] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const narrationDone = useRef({});
  const [revealed, setRevealed] = useState(false);

  const panel = storyPanels[panelIndex];
  const isLast = panelIndex === storyPanels.length - 1;

  useEffect(() => {
    setRevealed(false);
    const revealTimer = setTimeout(() => setRevealed(true), 100);

    if (narrationDone.current[panelIndex]) return () => clearTimeout(revealTimer);
    narrationDone.current[panelIndex] = true;

    setIsNarrating(true);
    const segments = storyNarration(panelIndex);
    narrate(segments, audioEnabled).then(() => {
      setIsNarrating(false);
      if (panel.isInteractive) {
        setShowInteractive(true);
      }
    });

    return () => {
      clearTimeout(revealTimer);
      stopAudio();
    };
  }, [panelIndex, audioEnabled, panel.isInteractive]);

  // Letter-by-letter reveal for the interactive panel
  useEffect(() => {
    if (!showInteractive) return;
    const letters = 'CIRCLE';
    if (letterReveal >= letters.length) return;
    const timer = setTimeout(() => setLetterReveal(prev => prev + 1), 400);
    return () => clearTimeout(timer);
  }, [showInteractive, letterReveal]);

  const goNext = () => {
    stopAudio();
    if (isLast) {
      onComplete();
    } else {
      setPanelIndex(prev => Math.min(prev + 1, storyPanels.length - 1));
      setShowInteractive(false);
      setLetterReveal(0);
    }
  };

  const goBack = () => {
    stopAudio();
    setPanelIndex(prev => Math.max(prev - 1, 0));
    setShowInteractive(false);
    setLetterReveal(0);
  };

  return (
    <div className="story-phase">
      {/* Progress Bar */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div 
            className="story-progress-fill"
            style={{ width: `${((panelIndex + 1) / storyPanels.length) * 100}%` }}
          />
        </div>
        <div className="story-progress-label">
          Page {panelIndex + 1} of {storyPanels.length}
        </div>
      </div>

      {/* Story Panel Content */}
      <div className={`story-card ${!revealed ? 'flipping' : ''}`}>
        <div className="story-text-section" style={{ textAlign: 'center' }}>
          {/* Illustration */}
          {panel.image ? (
            <div className="story-image-section" style={{ borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              <img src={`/assets/images/${panel.image}`} alt={panel.text} className="story-image" />
            </div>
          ) : (
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
              {panel.emoji}
            </div>
          )}

          <div className="story-title">The Story of Circle</div>

          {/* Story text */}
          <div className={`story-text ${revealed ? 'revealed' : ''}`}>
            {panel.text}
          </div>

          {/* Interactive circle for Panel 4 (highlight) */}
          {panel.isHighlight && (
            <div className={`story-highlight ${revealed ? 'visible' : ''}`}>
              <div className="story-highlight-text">A Perfect Round Shape</div>
              <CircleSVG size={60} animated glow />
            </div>
          )}

          {/* Interactive letter reveal for Panel 5 */}
          {showInteractive && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 24,
            }}>
              {'CIRCLE'.split('').map((letter, i) => (
                <span
                  key={i}
                  className={i < letterReveal ? 'animate-bounce-in' : ''}
                  style={{
                    width: 40,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: i < letterReveal ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                    color: i < letterReveal ? '#1a1a2e' : 'rgba(255,255,255,0.3)',
                    borderRadius: 8,
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    border: i < letterReveal ? 'none' : '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {i < letterReveal ? letter : '?'}
                </span>
              ))}
            </div>
          )}

          {/* Mascot peek */}
          <div className="story-mascot" style={{ justifyContent: 'center' }}>
            <Mascot mood={panel.isHighlight ? 'happy' : 'idle'} size={60} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav">
        <button
          onClick={goBack}
          disabled={panelIndex === 0}
          style={{
            background: 'none',
            border: 'none',
            cursor: panelIndex === 0 ? 'default' : 'pointer',
            opacity: panelIndex === 0 ? 0.3 : 1,
            padding: 8,
            color: 'var(--gold)',
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={36} />
        </button>

        {/* Dots */}
        <div className="story-dots">
          {storyPanels.map((_, i) => (
            <div 
              key={i} 
              className={`story-dot ${i === panelIndex ? 'active' : i < panelIndex ? 'completed' : ''}`} 
            />
          ))}
        </div>

        <button
          onClick={goNext}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            color: 'var(--gold)',
          }}
          aria-label="Next"
        >
          <ChevronRight size={36} />
        </button>
      </div>

      {/* Next Phase button on last panel */}
      {isLast && letterReveal >= 6 && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.6s' }}>
          <button className="btn btn-primary btn-lg" onClick={onComplete}>
            Let's Explore Circles! 🔵
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryPhase;
