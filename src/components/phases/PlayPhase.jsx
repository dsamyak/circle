import React, { useState, useEffect, useRef } from 'react';
import { ACTIONS } from '../../hooks/useGameState';
import QuestionRenderer from '../quiz/QuestionRenderer';
import Mascot from '../shared/Mascot';
import { calcXP, calcStars, canUnlockNextWorld } from '../../utils/scoring';
import { checkBadges } from '../../utils/badgeEngine';
import { generateSessionQuestions, shuffleOptions } from '../../utils/shuffle';
import { narrate, stopAudio } from '../../utils/audio';
import { PRAISE_VARIANTS, WRONG_VARIANTS, HINT_VARIANTS } from '../../utils/narration';
import questionBank from '../../data/questionBank';

const WORLD_THEMES = [
  { name: 'Circle Island', emoji: '🏝️', color: '#87CEEB' },
  { name: 'Coin Kingdom', emoji: '👑', color: '#FFD700' },
  { name: 'Shape Safari', emoji: '🌿', color: '#4CAF50' },
  { name: 'Corner Check', emoji: '🔷', color: '#1565C0' },
  { name: 'Pattern Path', emoji: '🧩', color: '#9575CD' },
  { name: 'TF Tower', emoji: '🏰', color: '#FF7043' },
  { name: 'Oddity Ocean', emoji: '🌊', color: '#00BCD4' },
  { name: 'Scene Search', emoji: '🔎', color: '#795548' },
  { name: 'Word World', emoji: '📝', color: '#E91E63' },
  { name: 'Circle Palace', emoji: '🏛️', color: '#F9A825' },
];

const PlayPhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [localHints, setLocalHints] = useState(0);
  const [localAttempts, setLocalAttempts] = useState(0);
  const [showWorldMap, setShowWorldMap] = useState(true);
  const [worldCorrect, setWorldCorrect] = useState(0);
  const initialized = useRef(false);

  // Initialize questions on first render
  useEffect(() => {
    if (!initialized.current && state.questionSet.length === 0) {
      initialized.current = true;
      const questions = generateSessionQuestions(questionBank);
      dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: questions });
    }
  }, [dispatch, state.questionSet.length]);

  const currentQ = state.questionSet[state.currentQuestion];
  const currentWorld = Math.floor(state.currentQuestion / 10);
  const questionInWorld = state.currentQuestion % 10;

  // Check if all 100 questions done
  if (state.currentQuestion >= 100 || state.currentQuestion >= state.questionSet.length) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center',
      }}>
        <Mascot mood="celebrating" size={140} />
        <h2 style={{ fontFamily: "'Fredoka One', cursive", color: '#4A90D9', margin: '16px 0' }}>
          All Worlds Complete! 🎉
        </h2>
        <p style={{ fontSize: 20, color: '#757575' }}>
          Total XP: {state.xp} • Stars: {'⭐'.repeat(state.totalStars)}
        </p>
        <button className="btn-primary" onClick={onComplete} style={{ marginTop: 24 }}>
          Continue to Reflect 📓
        </button>
      </div>
    );
  }

  // World Map view
  if (showWorldMap) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: 24, overflow: 'auto',
        background: 'linear-gradient(180deg, #E8EAF6 0%, #F0F7FF 100%)',
      }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", color: '#4A90D9', margin: '0 0 8px' }}>
          🗺️ World Map
        </h2>
        <p style={{ fontSize: 16, color: '#757575', margin: '0 0 24px' }}>
          XP: {state.xp} • Streak: 🔥 {state.streak}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 700,
        }}>
          {WORLD_THEMES.map((world, i) => {
            const isUnlocked = i === 0 || canUnlockNextWorld(state.worldScores[i - 1]);
            const score = state.worldScores[i];
            const stars = score !== null ? calcStars(score) : 0;
            const isCurrent = i === currentWorld;

            return (
              <button
                key={i}
                onClick={() => {
                  if (isUnlocked && (isCurrent || score === null)) {
                    setShowWorldMap(false);
                  }
                }}
                disabled={!isUnlocked}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: isCurrent ? `3px solid ${world.color}` : '3px solid transparent',
                  backgroundColor: isUnlocked ? '#FFFFFF' : '#F5F5F5',
                  opacity: isUnlocked ? 1 : 0.5,
                  cursor: isUnlocked ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isCurrent ? `0 4px 16px ${world.color}40` : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 32 }}>{world.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: world.color }}>
                  {world.name}
                </span>
                {score !== null && (
                  <span style={{ fontSize: 16 }}>
                    {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                  </span>
                )}
                {!isUnlocked && <span style={{ fontSize: 20 }}>🔒</span>}
                {isCurrent && score === null && (
                  <span style={{
                    fontSize: 12, color: '#FFFFFF', backgroundColor: world.color,
                    padding: '2px 8px', borderRadius: 8, fontWeight: 700,
                  }}>
                    PLAY
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Badges */}
        {state.badges.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <h4 style={{ color: '#757575' }}>Badges Earned</h4>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {state.badges.map(b => (
                <span key={b} style={{ fontSize: 24 }}>
                  {b === 'circle_spotter' ? '🔵' : b === 'shape_sorter' ? '🏅' : b === 'circle_champion' ? '🥈' :
                   b === 'shape_master' ? '🥇' : b === 'perfect_round' ? '💎' : b === 'streak_legend' ? '🔥' :
                   b === 'full_explorer' ? '🌟' : '⭐'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Question view
  if (!currentQ) return null;

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    stopAudio();

    const isCorrect = String(answer) === String(currentQ.correctAnswer);

    if (isCorrect) {
      const xpEarned = calcXP(localAttempts + 1, localHints, state.streak);
      dispatch({ type: ACTIONS.ANSWER_CORRECT, payload: { xpEarned, starsEarned: 0 } });

      // Check badges
      const newBadges = checkBadges({ ...state, streak: state.streak + 1, maxStreak: Math.max(state.maxStreak, state.streak + 1) });
      newBadges.forEach(b => dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: b }));

      const praiseVariant = PRAISE_VARIANTS[Math.floor(Math.random() * PRAISE_VARIANTS.length)];
      narrate([praiseVariant], audioEnabled);

      setFeedbackData({ isCorrect: true, message: currentQ.explanation });
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackData(null);
        setLocalHints(0);
        setLocalAttempts(0);

        // Check if world just finished (every 10 questions)
        if ((state.currentQuestion + 1) % 10 === 0) {
          // Move to next question and show world map
          dispatch({ type: ACTIONS.NEXT_QUESTION });
          setShowWorldMap(true);
        } else {
          dispatch({ type: ACTIONS.NEXT_QUESTION });
        }
      }, 2000);
    } else {
      const newAttempts = localAttempts + 1;
      setLocalAttempts(newAttempts);
      dispatch({ type: ACTIONS.ANSWER_INCORRECT });

      const wrongVariant = WRONG_VARIANTS[Math.floor(Math.random() * WRONG_VARIANTS.length)];
      narrate([wrongVariant], audioEnabled);

      if (newAttempts >= 2) {
        // Show explanation and auto-advance
        setFeedbackData({ isCorrect: false, message: currentQ.explanation });
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackData(null);
          setLocalHints(0);
          setLocalAttempts(0);

          if ((state.currentQuestion + 1) % 10 === 0) {
            dispatch({ type: ACTIONS.NEXT_QUESTION });
            setShowWorldMap(true);
          } else {
            dispatch({ type: ACTIONS.NEXT_QUESTION });
          }
        }, 3000);
      } else {
        // Show hint
        setLocalHints(prev => prev + 1);
        dispatch({ type: ACTIONS.USE_HINT });
      }
    }
  };

  const handleHint = () => {
    if (localHints < 2) {
      setLocalHints(prev => prev + 1);
      dispatch({ type: ACTIONS.USE_HINT });
      const hintVariant = HINT_VARIANTS[Math.floor(Math.random() * HINT_VARIANTS.length)];
      narrate([hintVariant], audioEnabled);
    }
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: 24, overflow: 'auto',
      background: `linear-gradient(180deg, ${WORLD_THEMES[currentWorld]?.color}15 0%, #F0F7FF 100%)`,
      position: 'relative',
    }}>
      {/* World + Question header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <span style={{
          backgroundColor: WORLD_THEMES[currentWorld]?.color,
          color: '#FFFFFF',
          padding: '4px 12px',
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 14,
        }}>
          {WORLD_THEMES[currentWorld]?.emoji} {WORLD_THEMES[currentWorld]?.name}
        </span>
        <span style={{ fontSize: 16, color: '#757575', fontWeight: 600 }}>
          Q{questionInWorld + 1}/10
        </span>
        <span style={{ fontSize: 16, color: '#757575' }}>
          XP: {state.xp} • 🔥{state.streak}
        </span>
        <button
          onClick={() => setShowWorldMap(true)}
          style={{
            background: 'none', border: '2px solid #E0E0E0',
            borderRadius: 8, padding: '4px 12px', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: '#757575',
          }}
        >
          🗺️ Map
        </button>
      </div>

      {/* Question progress bar */}
      <div style={{
        width: '100%', maxWidth: 500, height: 8, backgroundColor: '#E0E0E0',
        borderRadius: 4, marginBottom: 20, overflow: 'hidden',
      }}>
        <div style={{
          width: `${((questionInWorld) / 10) * 100}%`,
          height: '100%',
          backgroundColor: WORLD_THEMES[currentWorld]?.color || '#4A90D9',
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Hint button */}
      {localHints < 2 && !showFeedback && (
        <button
          onClick={handleHint}
          style={{
            marginBottom: 16,
            padding: '8px 20px',
            borderRadius: 50,
            border: '2px solid #FFB300',
            backgroundColor: '#FFF8E1',
            color: '#F57F17',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          💡 Hint ({2 - localHints} left)
        </button>
      )}

      {/* Question card */}
      <QuestionRenderer
        question={currentQ}
        onAnswer={handleAnswer}
        hintsUsed={localHints}
        attemptCount={localAttempts}
      />

      {/* Feedback overlay */}
      {showFeedback && feedbackData && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: feedbackData.isCorrect ? 'rgba(76,175,80,0.12)' : 'rgba(255,107,107,0.12)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
        }}>
          <div className={feedbackData.isCorrect ? 'animate-bounce-in' : 'animate-shake'} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '24px 32px',
            maxWidth: 400,
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: `4px solid ${feedbackData.isCorrect ? '#4CAF50' : '#FF6B6B'}`,
          }}>
            <Mascot mood={feedbackData.isCorrect ? 'celebrating' : 'thinking'} size={80} />
            <h3 style={{
              fontFamily: "'Fredoka One', cursive",
              color: feedbackData.isCorrect ? '#4CAF50' : '#FF6B6B',
              margin: '8px 0',
            }}>
              {feedbackData.isCorrect ? 'Correct! ✅' : 'Not quite 🤔'}
            </h3>
            <p style={{ fontSize: 16, color: '#4A4A4A', lineHeight: 1.4 }}>
              {feedbackData.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayPhase;
