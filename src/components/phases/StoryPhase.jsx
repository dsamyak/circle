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

  const panel = storyPanels[panelIndex];
  const isLast = panelIndex === storyPanels.length - 1;

  useEffect(() => {
    if (narrationDone.current[panelIndex]) return;
    narrationDone.current[panelIndex] = true;

    setIsNarrating(true);
    const segments = storyNarration(panelIndex);
    narrate(segments, audioEnabled).then(() => {
      setIsNarrating(false);
      if (panel.isInteractive) {
        setShowInteractive(true);
      }
    });

    return () => stopAudio();
  }, [panelIndex, audioEnabled]);

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
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: panel.bg,
      transition: 'background-color 0.5s ease',
      padding: 24,
      position: 'relative',
    }}>
      {/* Story Panel Content */}
      <div
        className="animate-fade-in"
        key={panelIndex}
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          padding: '32px 40px',
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        {/* Emoji illustration */}
        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {panel.emoji}
        </div>

        {/* Story text */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#4A4A4A',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
        }}>
          {panel.text}
        </p>

        {/* Interactive circle for Panel 4 (highlight) */}
        {panel.isHighlight && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <CircleSVG size={120} animated glow />
          </div>
        )}

        {/* Interactive letter reveal for Panel 5 */}
        {showInteractive && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}>
            {'CIRCLE'.split('').map((letter, i) => (
              <span
                key={i}
                className={i < letterReveal ? 'animate-bounce-in' : ''}
                style={{
                  width: 48,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: i < letterReveal ? '#4A90D9' : '#E0E0E0',
                  color: i < letterReveal ? '#FFFFFF' : '#E0E0E0',
                  borderRadius: 12,
                  fontSize: 28,
                  fontFamily: "'Fredoka One', cursive",
                  fontWeight: 700,
                  transition: 'all 0.3s',
                }}
              >
                {i < letterReveal ? letter : '?'}
              </span>
            ))}
          </div>
        )}

        {/* Mascot peek */}
        <div style={{ position: 'absolute', bottom: -30, right: -10 }}>
          <Mascot mood={panel.isHighlight ? 'happy' : 'idle'} size={70} />
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginTop: 32,
      }}>
        <button
          onClick={goBack}
          disabled={panelIndex === 0}
          style={{
            background: 'none',
            border: 'none',
            cursor: panelIndex === 0 ? 'default' : 'pointer',
            opacity: panelIndex === 0 ? 0.3 : 1,
            padding: 8,
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={36} color="#4A90D9" />
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {storyPanels.map((_, i) => (
            <div key={i} style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: i <= panelIndex ? '#4A90D9' : '#D0D0D0',
              transition: 'background-color 0.3s',
            }} />
          ))}
        </div>

        <button
          onClick={goNext}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
          aria-label="Next"
        >
          <ChevronRight size={36} color="#4A90D9" />
        </button>
      </div>

      {/* Next Phase button on last panel */}
      {isLast && letterReveal >= 6 && (
        <button
          className="btn-primary animate-bounce-in"
          onClick={onComplete}
          style={{ marginTop: 24, fontSize: 20, padding: '14px 40px' }}
        >
          Let's Explore Circles! 🔵
        </button>
      )}
    </div>
  );
};

export default StoryPhase;
