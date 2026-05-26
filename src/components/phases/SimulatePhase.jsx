import React, { useState } from 'react';
import { ACTIONS } from '../../hooks/useGameState';
import DrawCircleStation from '../simulations/DrawCircleStation';
import ShapeSorterStation from '../simulations/ShapeSorterStation';
import SpotCircleStation from '../simulations/SpotCircleStation';

const STATIONS = [
  { id: 0, name: 'Draw a Circle', icon: '✏️', color: '#4A90D9' },
  { id: 1, name: 'Shape Sorter', icon: '🗂️', color: '#9B59B6' },
  { id: 2, name: 'Spot the Circle', icon: '🔍', color: '#27AE60' },
];

const SimulatePhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const [activeStation, setActiveStation] = useState(
    state.simStationsComplete.findIndex(c => !c) >= 0 
      ? state.simStationsComplete.findIndex(c => !c) 
      : 0
  );

  const handleStationComplete = (stationIndex) => {
    dispatch({ type: ACTIONS.COMPLETE_SIM_STATION, payload: stationIndex });

    // Check if all done
    const newComplete = [...state.simStationsComplete];
    newComplete[stationIndex] = true;
    
    if (newComplete.every(Boolean)) {
      setTimeout(() => onComplete(), 500);
    } else {
      // Move to next incomplete station
      const next = newComplete.findIndex(c => !c);
      if (next >= 0) {
        setTimeout(() => setActiveStation(next), 500);
      }
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F3E5F5',
    }}>
      {/* Station tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 16px 0',
      }}>
        {STATIONS.map((station) => {
          const isComplete = state.simStationsComplete[station.id];
          const isActive = activeStation === station.id;

          return (
            <button
              key={station.id}
              onClick={() => setActiveStation(station.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '16px 16px 0 0',
                border: 'none',
                backgroundColor: isActive ? '#FFFFFF' : isComplete ? '#E8F5E9' : '#F5F5F5',
                color: isComplete ? '#4CAF50' : isActive ? station.color : '#9E9E9E',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                borderBottom: isActive ? `3px solid ${station.color}` : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {station.icon} {station.name} {isComplete ? '✅' : ''}
            </button>
          );
        })}
      </div>

      {/* Station content */}
      <div style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: 16,
      }}>
        {activeStation === 0 && (
          <DrawCircleStation
            onComplete={() => handleStationComplete(0)}
            audioEnabled={audioEnabled}
          />
        )}
        {activeStation === 1 && (
          <ShapeSorterStation
            onComplete={() => handleStationComplete(1)}
            audioEnabled={audioEnabled}
          />
        )}
        {activeStation === 2 && (
          <SpotCircleStation
            onComplete={() => handleStationComplete(2)}
            audioEnabled={audioEnabled}
          />
        )}
      </div>
    </div>
  );
};

export default SimulatePhase;
