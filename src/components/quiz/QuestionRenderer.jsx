import React from 'react';
import CircleSVG from '../shared/CircleSVG';
import { SquareSVG, RectangleSVG, TriangleSVG, OvalSVG, SemiCircleSVG } from '../shared/OtherShapes';

/**
 * Maps shape name strings to SVG components for visual rendering in questions.
 */
export function getShapeSVG(shapeName, size = 80) {
  switch (shapeName?.toLowerCase()) {
    case 'circle':     return <CircleSVG size={size} />;
    case 'square':     return <SquareSVG size={size} />;
    case 'rectangle':  return <RectangleSVG size={size} />;
    case 'triangle':   return <TriangleSVG size={size} />;
    case 'oval':       return <OvalSVG size={size} />;
    case 'semicircle': return <SemiCircleSVG size={size} />;
    default:           return <CircleSVG size={size} dashed />;
  }
}

/**
 * QuestionRenderer: Polymorphic dispatcher for 10 question types.
 * Renders a generic card-based layout with type-specific visuals.
 */
const QuestionRenderer = ({ question, onAnswer, hintsUsed, attemptCount }) => {
  const { type, questionText, options, visual, targetShape, shapes, patternSequence } = question;

  return (
    <div className="animate-fade-in" style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      padding: '28px 32px',
      maxWidth: 600,
      width: '100%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      {/* Question text */}
      <h3 style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 22,
        fontWeight: 800,
        color: '#4A4A4A',
        textAlign: 'center',
        margin: 0,
        lineHeight: 1.4,
      }}>
        {questionText}
      </h3>

      {/* Visual area based on question type */}
      {renderVisual(type, visual, targetShape, shapes, patternSequence, options)}

      {/* Answer options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: (type === 'pick_circle' || type === 'odd_one_out') ? '1fr 1fr' : '1fr 1fr',
        gap: 12,
        width: '100%',
        maxWidth: 450,
      }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt)}
            style={{
              padding: (type === 'pick_circle' || type === 'odd_one_out') ? '16px' : '14px 20px',
              borderRadius: 16,
              border: '3px solid #E8E8E8',
              backgroundColor: '#FAFAFA',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: '#4A4A4A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s',
              minHeight: 52,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#4A90D9';
              e.currentTarget.style.backgroundColor = '#E3F2FD';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E8E8E8';
              e.currentTarget.style.backgroundColor = '#FAFAFA';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {(type === 'pick_circle' || type === 'odd_one_out') && typeof opt === 'string' && 
              ['circle','square','triangle','rectangle','oval','semicircle'].includes(opt.toLowerCase()) && (
              <div>{getShapeSVG(opt, 56)}</div>
            )}
            <span>{typeof opt === 'string' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt}</span>
          </button>
        ))}
      </div>

      {/* Hints display */}
      {hintsUsed > 0 && (
        <div style={{
          backgroundColor: '#FFF8E1',
          borderRadius: 12,
          padding: '12px 16px',
          width: '100%',
          borderLeft: '4px solid #FFB300',
        }}>
          <p style={{ fontSize: 16, color: '#F57F17', margin: 0, fontWeight: 600 }}>
            💡 {hintsUsed === 1 ? question.hint1 : question.hint2}
          </p>
        </div>
      )}

      {/* Explanation after 2 wrong attempts */}
      {attemptCount >= 2 && (
        <div style={{
          backgroundColor: '#E8F5E9',
          borderRadius: 12,
          padding: '12px 16px',
          width: '100%',
          borderLeft: '4px solid #4CAF50',
        }}>
          <p style={{ fontSize: 16, color: '#2E7D32', margin: 0, fontWeight: 600 }}>
            📖 {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

function renderVisual(type, visual, targetShape, shapes, patternSequence, options) {
  // Single shape display
  if (visual === 'single_shape' && targetShape) {
    return (
      <div style={{ padding: 16 }}>
        {getShapeSVG(targetShape, 120)}
      </div>
    );
  }

  // Shape group for counting
  if (visual === 'shape_group' && shapes) {
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', padding: 8 }}>
        {shapes.map((s, i) => (
          <div key={i}>{getShapeSVG(s, 56)}</div>
        ))}
      </div>
    );
  }

  // Pattern row
  if (visual === 'pattern_row' && patternSequence) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: 8 }}>
        {patternSequence.map((s, i) => (
          <div key={i}>
            {s === '?' ? (
              <div style={{
                width: 52, height: 52, borderRadius: 12, border: '3px dashed #FFB300',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 'bold', color: '#FFB300',
              }}>?</div>
            ) : (
              getShapeSVG(s, 48)
            )}
          </div>
        ))}
      </div>
    );
  }

  // Real-world objects (emoji-based)
  if (visual === 'real_objects') {
    return null; // Options already contain emojis
  }

  // True/False and text_mcq — no extra visual needed
  return null;
}

export default QuestionRenderer;
