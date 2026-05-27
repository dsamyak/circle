import React from 'react';
import { useGameState, ACTIONS } from './hooks/useGameState';
import { useLocalStorage } from './hooks/useLocalStorage';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';

import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

const PHASES = [
  { id: 'wonder', label: 'Wonder', icon: '🔍', num: '01' },
  { id: 'story', label: 'Story', icon: '📖', num: '02' },
  { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'play', label: 'Play', icon: '🎮', num: '04' },
  { id: 'reflect', label: 'Reflect', icon: '📓', num: '05' },
];

function App() {
  const [state, dispatch] = useGameState();

  const handleAudioToggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_AUDIO });
  };

  const navigateTo = (phaseId) => {
    dispatch({ type: ACTIONS.SET_PHASE, payload: phaseId });
  };

  const goHome = () => navigateTo('intro');

  const showNav = state.phase !== 'intro' && state.phase !== 'results';

  const renderPhase = () => {
    switch (state.phase) {
      case 'intro':
        return <IntroScreen onStart={() => navigateTo('wonder')} audioEnabled={state.audioEnabled} />;
      case 'wonder':
        return <WonderPhase 
                 onComplete={() => {
                   dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'wonder' });
                   navigateTo('story');
                 }} 
                 audioEnabled={state.audioEnabled} 
               />;
      case 'story':
        return <StoryPhase 
                 onComplete={() => {
                   dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'story' });
                   navigateTo('simulate');
                 }}
                 audioEnabled={state.audioEnabled}
               />;
      case 'simulate':
        return <SimulatePhase 
                 state={state}
                 dispatch={dispatch}
                 onComplete={() => {
                   dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'simulate' });
                   navigateTo('play');
                 }}
                 audioEnabled={state.audioEnabled}
               />;
      case 'play':
        return <PlayPhase 
                 state={state}
                 dispatch={dispatch}
                 onComplete={() => {
                   dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'play' });
                   navigateTo('reflect');
                 }}
                 audioEnabled={state.audioEnabled}
               />;
      case 'reflect':
        return <ReflectPhase 
                 state={state}
                 dispatch={dispatch}
                 onComplete={() => {
                   dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: 'reflect' });
                   navigateTo('results');
                 }}
                 audioEnabled={state.audioEnabled}
               />;
      case 'results':
        return (
          <div className="reflect-phase" style={{ justifyContent: 'center' }}>
            <div className="certificate-card">
              <div className="cert-badge">🏆</div>
              <h2 className="cert-title">Lesson Complete!</h2>
              <p className="cert-subtitle">You are a true Circle Explorer!</p>
              <div className="cert-stats">
                <div className="cert-stat">
                  <div className="cert-stat-value">⚡ {state.xp}</div>
                  <div className="cert-stat-label">XP Earned</div>
                </div>
                <div className="cert-stat">
                  <div className="cert-stat-value">⭐ {state.totalStars}</div>
                  <div className="cert-stat-label">Stars</div>
                </div>
                <div className="cert-stat">
                  <div className="cert-stat-value">🔥 {state.maxStreak}</div>
                  <div className="cert-stat-label">Best Streak</div>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: ACTIONS.RESET_SESSION })}>
                Play Again 🎉
              </button>
            </div>
          </div>
        );
      default:
        return <IntroScreen onStart={() => navigateTo('wonder')} audioEnabled={state.audioEnabled} />;
    }
  };

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        
        {/* Home Button */}
        {showNav && (
          <button className="home-btn" onClick={goHome}>
            ⬤ Circle
          </button>
        )}

        {/* Journey Bar */}
        {showNav && (
          <div className="journey-bar">
            {PHASES.map((p, i) => {
              const isActive = state.phase === p.id;
              const isCompleted = state.phaseComplete[p.id];
              const phaseIndex = PHASES.findIndex(ph => ph.id === state.phase);
              const isFilled = i < phaseIndex;

              return (
                <React.Fragment key={p.id}>
                  <div 
                    className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      if (isCompleted || isActive) {
                        navigateTo(p.id);
                      }
                    }}
                    style={{ cursor: isCompleted || isActive ? 'pointer' : 'default' }}
                  >
                    <div className="journey-step-dot">
                      {isCompleted ? '✓' : p.num}
                    </div>
                    <span className="journey-step-label">{p.label}</span>
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className={`journey-connector ${isFilled || isCompleted ? 'filled' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Audio Toggle */}
        <button className="audio-toggle-btn" onClick={handleAudioToggle}>
          {state.audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Main Content */}
        {renderPhase()}
      </div>
    </>
  );
}

export default App;
