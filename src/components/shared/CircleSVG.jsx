import React from 'react';

const CircleSVG = ({
  size = 120,
  fill = '#4A90D9',
  stroke = '#2E6DB4',
  strokeWidth = 3,
  animated = false,
  glow = false,
  dashed = false,
  label,
  onClick,
}) => (
  <svg 
    viewBox={`0 0 ${size} ${size}`}
    width={size} 
    height={size}
    role="img" 
    aria-label={label || "circle"}
    className={`circle-svg ${animated ? 'animate-bounce-in' : ''} ${glow ? 'animate-pulse-glow' : ''} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
    style={{ overflow: 'visible' }}
  >
    <defs>
      <radialGradient id="circleGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#7BC8F6" />
        <stop offset="100%" stopColor={fill} />
      </radialGradient>
    </defs>
    <circle
      cx={size / 2} 
      cy={size / 2} 
      r={size / 2 - strokeWidth}
      fill={dashed ? '#F0F7FF' : 'url(#circleGrad)'}
      stroke={dashed ? '#FFB300' : stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '8,4' : 'none'} 
      className={glow ? 'animate-circle-glow' : ''}
    />
  </svg>
);

export default CircleSVG;
