import React, { useState, useEffect, useRef } from 'react';
import { ACTIONS } from '../../hooks/useGameState';
import Mascot from '../shared/Mascot';
import CircleSVG from '../shared/CircleSVG';
import { checkBadges } from '../../utils/badgeEngine';
import { narrate, stopAudio } from '../../utils/audio';
import { reflectNarration, lessonCompleteNarration } from '../../utils/narration';

const ReflectPhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const [journalText, setJournalText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const narrated = useRef(false);

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration(), audioEnabled);
    }
    // Check for final badges
    const newBadges = checkBadges(state);
    newBadges.forEach(b => dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: b }));
  }, [audioEnabled, state, dispatch]);

  const handleSubmit = () => {
    setSubmitted(true);
    narrate(lessonCompleteNarration(), audioEnabled);

    // Unlock full explorer badge
    dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'reflect' });
    const newBadges = checkBadges({
      ...state,
      phaseComplete: { ...state.phaseComplete, reflect: true }
    });
    newBadges.forEach(b => dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: b }));
  };

  if (submitted) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 40,
        background: 'linear-gradient(180deg, #E8F5E9 0%, #F0F7FF 100%)',
        textAlign: 'center',
      }}>
        <div className="animate-bounce-in">
          <Mascot mood="celebrating" size={140} />
        </div>
        
        <h2 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 32,
          color: '#4CAF50',
          margin: '16px 0',
        }}>
          🌟 Lesson Complete! 🌟
        </h2>
        
        <p style={{ fontSize: 20, color: '#4A4A4A', maxWidth: 500, lineHeight: 1.5 }}>
          You are a true Circle Explorer! Well done!
        </p>

        {/* Stats summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          marginTop: 24,
          marginBottom: 32,
        }}>
          {[
            { label: 'XP Earned', value: state.xp, emoji: '⚡' },
            { label: 'Stars', value: state.totalStars, emoji: '⭐' },
            { label: 'Best Streak', value: state.maxStreak, emoji: '🔥' },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 28 }}>{stat.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 24, color: '#4A90D9' }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#757575', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {state.badges.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: '#757575', marginBottom: 8 }}>Badges Earned</h4>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {state.badges.map(b => (
                <span key={b} style={{
                  fontSize: 32,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}>
                  {b === 'circle_spotter' ? '🔵' : b === 'shape_sorter' ? '🏅' : b === 'circle_champion' ? '🥈' :
                   b === 'shape_master' ? '🥇' : b === 'perfect_round' ? '💎' : b === 'streak_legend' ? '🔥' :
                   b === 'full_explorer' ? '🌟' : '⭐'}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={onComplete}
          style={{ fontSize: 20, padding: '14px 40px' }}
        >
          Finish 🎉
        </button>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32,
      background: 'linear-gradient(180deg, #E3F2FD 0%, #F0F7FF 100%)',
    }}>
      <Mascot mood="happy" size={100} />
      
      <h2 style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: 28,
        color: '#4A90D9',
        margin: '16px 0',
        textAlign: 'center',
      }}>
        📓 Time to Reflect!
      </h2>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: '24px 32px',
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <CircleSVG size={80} glow />
        </div>

        <p style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.5,
          marginBottom: 20,
        }}>
          Wow — you explored circles today! Can you name three circles you see at home?
        </p>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="I see circles on... a plate, a clock, and..."
          style={{
            width: '100%',
            minHeight: 120,
            borderRadius: 16,
            border: '3px solid #E0E0E0',
            padding: 16,
            fontSize: 18,
            fontFamily: "'Nunito', sans-serif",
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#4A90D9'}
          onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
        />

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={journalText.trim().length < 3}
          style={{
            width: '100%',
            marginTop: 16,
            fontSize: 20,
            opacity: journalText.trim().length < 3 ? 0.5 : 1,
          }}
        >
          Submit & Complete! ✅
        </button>
      </div>
    </div>
  );
};

export default ReflectPhase;
