import React from 'react';
import CircleSVG from '../shared/CircleSVG';
import { SquareSVG, RectangleSVG, TriangleSVG, OvalSVG, SemiCircleSVG } from '../shared/OtherShapes';

export function getShapeSVG(shapeName, size = 80) {
  switch (shapeName?.toLowerCase()) {
    case 'circle':     return <CircleSVG size={size} animated glow />;
    case 'square':     return <SquareSVG size={size} />;
    case 'rectangle':  return <RectangleSVG size={size} />;
    case 'triangle':   return <TriangleSVG size={size} />;
    case 'oval':       return <OvalSVG size={size} />;
    case 'semicircle': return <SemiCircleSVG size={size} />;
    default:           return <CircleSVG size={size} dashed />;
  }
}

const QuestionRenderer = ({ question, onAnswer, hintsUsed, attemptCount }) => {
  const { type, questionText, options, visual, targetShape, shapes, patternSequence } = question;

  return (
    <div className="question-card animate-fade-in">
      <h3 className="question-text">{questionText}</h3>

      {renderVisual(type, visual, targetShape, shapes, patternSequence, options)}

      <div className="options-grid">
        {options.map((opt, i) => {
          const isShapeOpt = (type === 'pick_circle' || type === 'odd_one_out') && typeof opt === 'string' && ['circle','square','triangle','rectangle','oval','semicircle'].includes(opt.toLowerCase());
          
          return (
            <button
              key={i}
              onClick={() => onAnswer(opt)}
              className="option-btn"
            >
              {isShapeOpt && (
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {getShapeSVG(opt, 56)}
                </div>
              )}
              <span>{typeof opt === 'string' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt}</span>
            </button>
          );
        })}
      </div>

      {hintsUsed > 0 && (
        <div className="hint-text">
          💡 {hintsUsed === 1 ? question.hint1 : question.hint2}
        </div>
      )}

      {attemptCount >= 2 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(76,175,80,0.2)',
          borderLeft: '4px solid var(--green)',
          textAlign: 'left'
        }}>
          <p style={{ color: 'var(--green-light)', margin: 0, fontSize: '0.95rem' }}>
            📖 {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

function renderVisual(type, visual, targetShape, shapes, patternSequence, options) {
  if (visual === 'single_shape' && targetShape) {
    return (
      <div style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
        {getShapeSVG(targetShape, 120)}
      </div>
    );
  }

  if (visual === 'shape_group' && shapes) {
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', padding: 16 }}>
        {shapes.map((s, i) => (
          <div key={i}>{getShapeSVG(s, 56)}</div>
        ))}
      </div>
    );
  }

  if (visual === 'pattern_row' && patternSequence) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: 16 }}>
        {patternSequence.map((s, i) => (
          <div key={i}>
            {s === '?' ? (
              <div style={{
                width: 52, height: 52, borderRadius: 12, border: '3px dashed var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 'bold', color: 'var(--gold)',
              }}>?</div>
            ) : (
              getShapeSVG(s, 48)
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default QuestionRenderer;
