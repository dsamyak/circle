import React, { useState, useEffect, useRef } from 'react';
import { ACTIONS } from '../../hooks/useGameState';
import QuestionRenderer from '../quiz/QuestionRenderer';
import Mascot from '../shared/Mascot';
import { calcXP, calcStars, canUnlockNextWorld } from '../../utils/scoring';
import { checkBadges } from '../../utils/badgeEngine';
import { generateSessionQuestions } from '../../utils/shuffle';
import { narrate, stopAudio } from '../../utils/audio';
import { PRAISE_VARIANTS, WRONG_VARIANTS, HINT_VARIANTS } from '../../utils/narration';
import questionBank from '../../data/questionBank';

const WORLD_THEMES = [
  { name: 'Circle Island', emoji: '🏝️', color: '#3f51b5' },
  { name: 'Coin Kingdom', emoji: '👑', color: '#ffc107' },
  { name: 'Shape Safari', emoji: '🌿', color: '#4caf50' },
  { name: 'Corner Check', emoji: '🔷', color: '#1a237e' },
  { name: 'Pattern Path', emoji: '🧩', color: '#7c5cbf' },
  { name: 'TF Tower', emoji: '🏰', color: '#ff7043' },
  { name: 'Oddity Ocean', emoji: '🌊', color: '#283593' },
  { name: 'Scene Search', emoji: '🔎', color: '#8d6e63' },
  { name: 'Word World', emoji: '📝', color: '#e91e63' },
  { name: 'Circle Palace', emoji: '🏛️', color: '#f9a825' },
];

const PlayPhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [localHints, setLocalHints] = useState(0);
  const [localAttempts, setLocalAttempts] = useState(0);
  const [showWorldMap, setShowWorldMap] = useState(true);
  const initialized = useRef(false);

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

  if (state.currentQuestion >= 100 || state.currentQuestion >= state.questionSet.length) {
    return (
      <div className="play-phase" style={{ justifyContent: 'center' }}>
        <div className="world-complete-card">
          <Mascot mood="celebrating" size={120} />
          <h2 className="world-complete-title">All Worlds Complete! 🎉</h2>
          <div className="world-complete-score">
            Total XP: {state.xp}
          </div>
          <div className="world-complete-stars">
            {'⭐'.repeat(Math.min(5, state.totalStars))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={onComplete} style={{ marginTop: '24px' }}>
            Continue to Reflect 📓
          </button>
        </div>
      </div>
    );
  }

  if (showWorldMap) {
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🗺️ World Map</h2>
          <div className="play-subtitle">
            <span className="play-xp-badge">XP: {state.xp} • 🔥 Streak: {state.streak}</span>
          </div>
        </div>

        <div className="world-map">
          {WORLD_THEMES.map((world, i) => {
            const isUnlocked = i === 0 || canUnlockNextWorld(state.worldScores[i - 1]);
            const score = state.worldScores[i];
            const stars = score !== null ? calcStars(score) : 0;
            const isCurrent = i === currentWorld;

            return (
              <div
                key={i}
                className={`world-card ${isUnlocked ? 'unlocked' : 'locked'} ${score !== null ? 'completed' : ''}`}
                style={{ '--world-color': world.color, borderColor: isCurrent ? world.color : '' }}
                onClick={() => {
                  if (isUnlocked && (isCurrent || score === null)) setShowWorldMap(false);
                }}
              >
                {!isUnlocked && <div className="world-lock">🔒</div>}
                <div className="world-icon">{world.emoji}</div>
                <div className="world-name" style={{ color: isCurrent ? world.color : 'inherit' }}>{world.name}</div>
                
                {score !== null && (
                  <div className="world-stars">
                    {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    <span className="world-score">Score: {score}</span>
                  </div>
                )}
                
                {isCurrent && score === null && (
                  <div className="world-play-btn">PLAY</div>
                )}
              </div>
            );
          })}
        </div>

        {state.badges.length > 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Badges Earned</h4>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '2rem' }}>
              {state.badges.map(b => (
                <span key={b} title={b}>
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

  if (!currentQ) return null;

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    stopAudio();

    const isCorrect = String(answer) === String(currentQ.correctAnswer);

    if (isCorrect) {
      const xpEarned = calcXP(localAttempts + 1, localHints, state.streak);
      dispatch({ type: ACTIONS.ANSWER_CORRECT, payload: { xpEarned, starsEarned: 0 } });

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

        if ((state.currentQuestion + 1) % 10 === 0) {
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
    <div className="play-phase">
      <div className="hud">
        <div className="hud-item" style={{ color: WORLD_THEMES[currentWorld]?.color }}>
          {WORLD_THEMES[currentWorld]?.emoji} {WORLD_THEMES[currentWorld]?.name}
        </div>
        <div className="hud-item" style={{ color: 'var(--gold)' }}>
          ⚡ {state.xp} | 🔥 {state.streak}
        </div>
        <button className="btn-outline btn-sm" onClick={() => setShowWorldMap(true)} style={{ borderRadius: 'var(--radius-full)' }}>
          🗺️ Map
        </button>
      </div>

      <div className="progress-bar-container" style={{ maxWidth: '700px', marginBottom: '24px' }}>
        <div className="progress-bar-label">
          <span>Question {questionInWorld + 1} of 10</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${((questionInWorld) / 10) * 100}%`,
              background: WORLD_THEMES[currentWorld]?.color || 'var(--gold)'
            }} 
          />
        </div>
      </div>

      {localHints < 2 && !showFeedback && (
        <button className="btn-outline btn-sm" onClick={handleHint} style={{ marginBottom: '16px', color: 'var(--gold)', borderColor: 'var(--gold)' }}>
          💡 Hint ({2 - localHints} left)
        </button>
      )}

      <QuestionRenderer
        question={currentQ}
        onAnswer={handleAnswer}
        hintsUsed={localHints}
        attemptCount={localAttempts}
      />

      {showFeedback && feedbackData && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedbackData.isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-emoji">{feedbackData.isCorrect ? '✨' : '🤔'}</div>
            <div className="feedback-message">{feedbackData.isCorrect ? 'Excellent!' : 'Not Quite!'}</div>
            <div className="feedback-sub">{feedbackData.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayPhase;
