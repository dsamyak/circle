import React, { useEffect } from 'react';
import DrawCircleStation from '../simulations/DrawCircleStation';
import ShapeSorterStation from '../simulations/ShapeSorterStation';
import SpotCircleStation from '../simulations/SpotCircleStation';
import Mascot from '../shared/Mascot';
import { ACTIONS } from '../../hooks/useGameState';
import { narrate, stopAudio } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';

const STATIONS = [
  { id: 'draw', title: 'Draw a Circle', desc: 'Trace the perfect shape' },
  { id: 'sort', title: 'Shape Sorter', desc: 'Find the circles' },
  { id: 'spot', title: 'Spot the Circle', desc: 'Circles in the real world' },
];

const SimulatePhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const currentStationIndex = state.currentSimStation;
  const isLastStation = currentStationIndex === STATIONS.length - 1;

  useEffect(() => {
    stopAudio();
    narrate(simulateNarration(currentStationIndex), audioEnabled);
  }, [currentStationIndex, audioEnabled]);

  const handleStationComplete = () => {
    dispatch({ type: ACTIONS.COMPLETE_SIM_STATION, payload: currentStationIndex });
  };

  const handleNextStation = () => {
    if (isLastStation) {
      onComplete();
    } else {
      dispatch({ type: ACTIONS.ADVANCE_SIM_STATION });
    }
  };

  return (
    <div className="simulate-phase">
      
      {/* Header */}
      <div className="simulate-header">
        <div className="simulate-label">Station {currentStationIndex + 1} of {STATIONS.length}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '8px' }}>
          {STATIONS[currentStationIndex].title}
        </h2>
        <div className="simulate-sublabel">{STATIONS[currentStationIndex].desc}</div>
      </div>

      {/* Navigation Dots */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        {STATIONS.map((st, i) => (
          <div key={st.id} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === currentStationIndex ? 'active' : state.simStationsComplete[i] ? 'completed' : ''}`} style={{ width: 16, height: 16 }} />
            <span className="simulate-dot-label" style={{ color: i === currentStationIndex ? 'var(--gold)' : 'var(--text-muted)' }}>
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="simulate-tip">
        💡 {currentStationIndex === 0 ? "Trace the dotted line!" : currentStationIndex === 1 ? "Drag shapes to the right box." : "Click all the circles you see!"}
      </div>

      {/* Main Station Content Container */}
      <div style={{ width: '100%', maxWidth: '700px' }}>
        {currentStationIndex === 0 && (
          <DrawCircleStation 
            state={state} 
            dispatch={dispatch} 
            onComplete={handleStationComplete} 
          />
        )}
        {currentStationIndex === 1 && (
          <ShapeSorterStation 
            state={state} 
            dispatch={dispatch} 
            onComplete={handleStationComplete} 
          />
        )}
        {currentStationIndex === 2 && (
          <SpotCircleStation 
            state={state} 
            dispatch={dispatch} 
            onComplete={handleStationComplete} 
          />
        )}
      </div>

      {/* Next / Complete button - shown only when current station is complete */}
      {state.simStationsComplete[currentStationIndex] && (
        <div style={{ marginTop: '24px', animation: 'bounceIn 0.5s' }}>
          <button className="btn btn-primary" onClick={handleNextStation}>
            {isLastStation ? 'Ready to Play! 🎮' : 'Next Station ➡️'}
          </button>
        </div>
      )}

      {/* Mascot Cheer on completion */}
      {state.simStationsComplete[currentStationIndex] && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Mascot mood="happy" size={50} />
          <span style={{ fontStyle: 'italic', color: 'var(--green-light)', fontWeight: 600 }}>Great job!</span>
        </div>
      )}
    </div>
  );
};

export default SimulatePhase;
