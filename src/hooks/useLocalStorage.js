import { useEffect } from 'react';
import { ACTIONS } from './useGameState';

const SESSION_KEY = 'intellia_circle_v1';
const SESSION_EXPIRY_MS = 86400000; // 24 hours

export function useLocalStorage(state, dispatch) {
  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < SESSION_EXPIRY_MS) {
          dispatch({ type: ACTIONS.RESTORE_SESSION, payload: parsed });
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  }, [dispatch]);

  // Save session on state change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const dataToSave = {
          phase: state.phase,
          currentSimStation: state.currentSimStation,
          simStationsComplete: state.simStationsComplete,
          drawAttempts: state.drawAttempts,
          drawAccuracy: state.drawAccuracy,
          sorterCardIndex: state.sorterCardIndex,
          sorterScore: state.sorterScore,
          foundCircles: state.foundCircles,
          currentQuestion: state.currentQuestion,
          currentWorld: state.currentWorld,
          worldScores: state.worldScores,
          xp: state.xp,
          totalStars: state.totalStars,
          streak: state.streak,
          maxStreak: state.maxStreak,
          badges: state.badges,
          phaseComplete: state.phaseComplete,
          timestamp: Date.now(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to save session:', e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);
}
