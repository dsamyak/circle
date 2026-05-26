import React from 'react';

const phases = [
  { id: 'wonder', colorClass: 'wonder' },
  { id: 'story', colorClass: 'story' },
  { id: 'simulate', colorClass: 'simulate' },
  { id: 'play', colorClass: 'play' },
  { id: 'reflect', colorClass: 'reflect' },
];

const ProgressMap = ({ currentPhase, phaseComplete }) => {
  return (
    <div className="progress-dots" aria-label="Lesson Progress">
      {phases.map((phase, index) => {
        const isActive = currentPhase === phase.id;
        const isCompleted = phaseComplete[phase.id];
        
        let classes = `progress-dot ${phase.colorClass}`;
        if (isActive) classes += ' active';
        if (isCompleted) classes += ' completed';
        
        return (
          <div 
            key={phase.id} 
            className={classes}
            title={phase.id}
          />
        );
      })}
    </div>
  );
};

export default ProgressMap;
