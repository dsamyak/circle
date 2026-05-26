import React from 'react';

// Simple SVG Robot Mascot for Intellia SG
const Mascot = ({ mood = 'idle', size = 120, className = '' }) => {
  
  const getAnimationClass = () => {
    switch(mood) {
      case 'happy': return 'animate-bounce';
      case 'thinking': return 'animate-float';
      case 'celebrating': return 'animate-celebrate';
      case 'idle':
      default: return 'animate-float-slow';
    }
  };

  const getEyeComponent = () => {
    switch(mood) {
      case 'happy':
      case 'celebrating':
        return (
          <>
            <path d="M 30 45 Q 40 35 50 45" fill="none" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 70 45 Q 80 35 90 45" fill="none" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="40" cy="45" r="5" fill="#2B2B2B" />
            <circle cx="80" cy="40" r="5" fill="#2B2B2B" />
            <line x1="75" y1="30" x2="85" y2="25" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <circle cx="40" cy="45" r="5" fill="#2B2B2B" />
            <circle cx="80" cy="45" r="5" fill="#2B2B2B" />
          </>
        );
    }
  };

  const getMouthComponent = () => {
    switch(mood) {
      case 'happy':
      case 'celebrating':
        return <path d="M 40 65 Q 60 80 80 65" fill="none" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />;
      case 'thinking':
        return <circle cx="60" cy="70" r="4" fill="#2B2B2B" />;
      case 'idle':
      default:
        return <path d="M 45 65 Q 60 70 75 65" fill="none" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />;
    }
  };

  return (
    <div className={`mascot-container ${getAnimationClass()} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E3F2FD" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
          </filter>
        </defs>
        
        {/* Antenna */}
        <line x1="60" y1="25" x2="60" y2="10" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="10" r="4" fill={mood === 'celebrating' ? '#FFB300' : '#4A90D9'} 
                className={mood === 'thinking' ? 'animate-pulse' : ''} />
        
        {/* Ears */}
        <rect x="15" y="45" width="10" height="20" rx="3" fill="#9E9E9E" />
        <rect x="95" y="45" width="10" height="20" rx="3" fill="#9E9E9E" />
        
        {/* Body/Head */}
        <rect x="20" y="25" width="80" height="70" rx="20" fill="url(#bodyGrad)" filter="url(#shadow)" stroke="#BEE0FE" strokeWidth="2" />
        
        {/* Face Screen */}
        <rect x="28" y="33" width="64" height="54" rx="12" fill="#F0F7FF" />
        
        {/* Eyes & Mouth */}
        {getEyeComponent()}
        {getMouthComponent()}
        
        {/* Cheeks */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <circle cx="35" cy="55" r="4" fill="#FFCDD2" opacity="0.8" />
            <circle cx="85" cy="55" r="4" fill="#FFCDD2" opacity="0.8" />
          </>
        ) : null}
      </svg>
    </div>
  );
};

export default Mascot;
