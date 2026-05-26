import { useReducer, useEffect } from 'react';

const initialState = {
  // Navigation
  phase: 'intro',       // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  currentSimStation: 0, // 0=DrawCircle, 1=ShapeSorter, 2=SpotCircle
  simStationsComplete: [false, false, false],

  // Draw Circle Station (Station A)
  drawAttempts: 0,
  drawAccuracy: null,   // 0–100 percentage

  // Shape Sorter Station (Station B)
  sorterCardIndex: 0,   // 0–9
  sorterScore: 0,

  // Spot Circle Station (Station C)
  foundCircles: [],     // array of circle object IDs found
  totalCirclesInScene: 6,

  // Play / Challenge phase
  questionSet: [],        // 100 shuffled question objects
  currentQuestion: 0,     // 0–99
  currentWorld: 0,        // 0–9
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,
  audioVolume: 1.0,
};

export const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  SET_DRAW_ACCURACY: 'SET_DRAW_ACCURACY',
  ADVANCE_SORTER_CARD: 'ADVANCE_SORTER_CARD',
  SCORE_SORTER: 'SCORE_SORTER',
  FIND_CIRCLE_IN_SCENE: 'FIND_CIRCLE_IN_SCENE',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PHASE:
      return { ...state, phase: action.payload };
      
    case ACTIONS.ADVANCE_SIM_STATION:
      return { ...state, currentSimStation: state.currentSimStation + 1 };
      
    case ACTIONS.COMPLETE_SIM_STATION: {
      const newComplete = [...state.simStationsComplete];
      newComplete[action.payload] = true;
      return { ...state, simStationsComplete: newComplete };
    }
      
    case ACTIONS.SET_DRAW_ACCURACY:
      return { 
        ...state, 
        drawAccuracy: action.payload.accuracy,
        drawAttempts: state.drawAttempts + 1
      };
      
    case ACTIONS.ADVANCE_SORTER_CARD:
      return { ...state, sorterCardIndex: state.sorterCardIndex + 1 };
      
    case ACTIONS.SCORE_SORTER:
      return { ...state, sorterScore: state.sorterScore + 1 };
      
    case ACTIONS.FIND_CIRCLE_IN_SCENE:
      if (state.foundCircles.includes(action.payload)) return state;
      return { ...state, foundCircles: [...state.foundCircles, action.payload] };
      
    case ACTIONS.LOAD_QUESTIONS:
      return { ...state, questionSet: action.payload };
      
    case ACTIONS.ANSWER_CORRECT: {
      const { xpEarned, starsEarned, isNewWorld } = action.payload;
      const newStreak = state.streak + 1;
      
      const newWorldScores = [...state.worldScores];
      if (newWorldScores[state.currentWorld] === null) {
        newWorldScores[state.currentWorld] = 1;
      } else {
        newWorldScores[state.currentWorld] += 1;
      }
      
      return { 
        ...state, 
        xp: state.xp + xpEarned,
        totalStars: state.totalStars + starsEarned,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        worldScores: newWorldScores
      };
    }
      
    case ACTIONS.ANSWER_INCORRECT:
      return { 
        ...state, 
        streak: 0,
        attemptCount: state.attemptCount + 1
      };
      
    case ACTIONS.USE_HINT:
      return { ...state, hintsUsed: state.hintsUsed + 1 };
      
    case ACTIONS.NEXT_QUESTION: {
      const nextQ = state.currentQuestion + 1;
      const nextWorld = Math.floor(nextQ / 10);
      return { 
        ...state, 
        currentQuestion: nextQ,
        currentWorld: nextWorld,
        hintsUsed: 0,
        attemptCount: 0
      };
    }
      
    case ACTIONS.UNLOCK_BADGE:
      if (state.badges.includes(action.payload)) return state;
      return { ...state, badges: [...state.badges, action.payload] };
      
    case ACTIONS.COMPLETE_PHASE:
      return {
        ...state,
        phaseComplete: { ...state.phaseComplete, [action.payload]: true }
      };
      
    case ACTIONS.TOGGLE_AUDIO:
      return { ...state, audioEnabled: !state.audioEnabled };
      
    case ACTIONS.RESTORE_SESSION:
      return { ...initialState, ...action.payload, sessionId: state.sessionId };
      
    case ACTIONS.RESET_SESSION:
      return { ...initialState, sessionId: crypto.randomUUID(), audioEnabled: state.audioEnabled };
      
    default:
      return state;
  }
}

export function useGameState() {
  return useReducer(reducer, initialState);
}
