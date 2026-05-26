import React, { useState } from 'react';

const ShapeCard = ({ shape, onDrop, disabled = false }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    if (disabled) return;
    e.dataTransfer.setData('shapeId', shape.id);
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  // Simple touch handling for mobile drop fallback
  const handleTouchEnd = () => {
    if (disabled || !onDrop) return;
    // In a real app we'd measure intersections, here we'll simulate a tap to open a bin selector
    onDrop(shape);
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchEnd={handleTouchEnd}
      className={`shape-card ${dragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      role="button"
      aria-label={`Drag ${shape.label} to the correct bin`}
      tabIndex={disabled ? -1 : 0}
      style={{
        width: 140,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        boxShadow: dragging ? '0 12px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        cursor: disabled ? 'default' : 'grab',
        transition: 'all 0.2s ease',
        transform: dragging ? 'scale(1.05)' : 'scale(1)',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {shape.svg}
      </div>
      <span style={{ 
        marginTop: 8, 
        fontFamily: "'Nunito', sans-serif", 
        fontWeight: 600, 
        color: '#4A4A4A',
        fontSize: 16,
      }}>
        {shape.label}
      </span>
    </div>
  );
};

export default ShapeCard;
