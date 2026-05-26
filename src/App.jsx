import React from 'react';
import { useGameState, ACTIONS } from './hooks/useGameState';
import { useLocalStorage } from './hooks/useLocalStorage';
import AudioButton from './components/shared/AudioButton';
import IntroScreen from './components/IntroScreen';
import ProgressMap from './components/ProgressMap';

import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

function App() {
  const [state, dispatch] = useGameState();
  useLocalStorage(state, dispatch);

  const handleAudioToggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_AUDIO });
  };

  const navigateTo = (phaseId) => {
    dispatch({ type: ACTIONS.SET_PHASE, payload: phaseId });
  };

  const renderPhase = () => {
    switch (state.phase) {
      case 'intro':
        return <IntroScreen onStart={() => navigateTo('wonder')} />;
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
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2>Lesson Complete!</h2>
            <button className="btn-primary" onClick={() => dispatch({ type: ACTIONS.RESET_SESSION })}>
              Play Again
            </button>
          </div>
        );
      default:
        return <IntroScreen onStart={() => navigateTo('wonder')} />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            background: '#4A90D9', color: 'white', fontWeight: 'bold', 
            width: 32, height: 32, borderRadius: 8, display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}>
            I
          </div>
          <h1 style={{ fontSize: 20, color: '#4A4A4A', margin: 0, fontFamily: "'Fredoka One', cursive" }}>
            Circle
          </h1>
        </div>
        
        {state.phase !== 'intro' && state.phase !== 'results' && (
          <ProgressMap currentPhase={state.phase} phaseComplete={state.phaseComplete} />
        )}
        
        <AudioButton audioEnabled={state.audioEnabled} onToggle={handleAudioToggle} />
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {renderPhase()}
      </main>

    </div>
  );
}

export default App;
