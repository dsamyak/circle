import React from 'react';

// Distractor Shapes used across the application

export const SquareSVG = ({ size = 100, fill = '#FF8A50', stroke = '#E64A19', strokeWidth = 3 }) => (
  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="square">
    <rect x={strokeWidth} y={strokeWidth} width={size - strokeWidth * 2} height={size - strokeWidth * 2} 
          fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx="4" />
  </svg>
);

export const RectangleSVG = ({ size = 100, fill = '#9B59B6', stroke = '#8E44AD', strokeWidth = 3 }) => (
  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="rectangle">
    <rect x={strokeWidth} y={size * 0.25} width={size - strokeWidth * 2} height={size * 0.5} 
          fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx="4" />
  </svg>
);

export const TriangleSVG = ({ size = 100, fill = '#27AE60', stroke = '#2ECC71', strokeWidth = 3 }) => {
  const h = size - strokeWidth * 2;
  const w = size - strokeWidth * 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="triangle">
      <polygon 
        points={`${size/2},${strokeWidth} ${strokeWidth},${h} ${w + strokeWidth},${h}`}
        fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
};

export const OvalSVG = ({ size = 100, fill = '#E74C3C', stroke = '#C0392B', strokeWidth = 3 }) => (
  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="oval">
    <ellipse cx={size/2} cy={size/2} rx={size/2 - strokeWidth} ry={size/3 - strokeWidth} 
             fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  </svg>
);

export const SemiCircleSVG = ({ size = 100, fill = '#F39C12', stroke = '#D35400', strokeWidth = 3 }) => {
  const r = size / 2 - strokeWidth;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label="semi-circle">
      <path 
        d={`M ${strokeWidth} ${size/2} A ${r} ${r} 0 0 1 ${size - strokeWidth} ${size/2} Z`}
        fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
};
