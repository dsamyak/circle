import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot';
import { narrate, stopAudio } from '../../utils/audio';
import { reflectNarration } from '../../utils/narration';
import CircleSVG from '../shared/CircleSVG';

const REFLECT_QUESTIONS = [
  {
    question: "What makes a circle special?",
    options: [
      { text: "It has 4 straight sides", correct: false, emoji: "🟦" },
      { text: "It is perfectly round with no corners", correct: true, emoji: "🔵" },
      { text: "It has 3 pointy corners", correct: false, emoji: "🔺" }
    ]
  },
  {
    question: "Which of these is a circle?",
    options: [
      { text: "A computer screen", correct: false, emoji: "💻" },
      { text: "A pizza", correct: true, emoji: "🍕" },
      { text: "A book", correct: false, emoji: "📖" }
    ]
  },
  {
    question: "How do you draw a circle?",
    options: [
      { text: "Draw one continuous curve", correct: true, emoji: "✍️" },
      { text: "Draw straight lines", correct: false, emoji: "📏" },
      { text: "Draw zig-zags", correct: false, emoji: "⚡" }
    ]
  }
];

const ReflectPhase = ({ state, dispatch, onComplete, audioEnabled }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    stopAudio();
    narrate(reflectNarration(currentQIndex, completed), audioEnabled);
  }, [currentQIndex, completed, audioEnabled]);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQIndex < REFLECT_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleConfidenceSelect = (level) => {
    setConfidence(level);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (completed) {
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <div className="reflect-label">Self Reflection</div>
          <h2>How do you feel about circles?</h2>
        </div>
        
        <div className="reflect-card">
          <Mascot mood="happy" size={100} style={{ margin: '0 auto 24px' }} />
          
          <div className="confidence-grid">
            <button 
              className={`confidence-btn ${confidence === 'great' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--green)' }}
              onClick={() => handleConfidenceSelect('great')}
            >
              <span className="confidence-emoji">🤩</span>
              <span className="confidence-label">I'm a Circle Master!</span>
            </button>
            <button 
              className={`confidence-btn ${confidence === 'good' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--gold)' }}
              onClick={() => handleConfidenceSelect('good')}
            >
              <span className="confidence-emoji">🙂</span>
              <span className="confidence-label">I feel good about them.</span>
            </button>
            <button 
              className={`confidence-btn ${confidence === 'need_practice' ? 'selected' : ''}`}
              style={{ '--conf-color': 'var(--blue-bright)' }}
              onClick={() => handleConfidenceSelect('need_practice')}
            >
              <span className="confidence-emoji">🤔</span>
              <span className="confidence-label">I need a little more practice.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = REFLECT_QUESTIONS[currentQIndex];

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <div className="reflect-label">Reflection Time</div>
        <div className="reflect-sublabel">Let's see what you remember!</div>
      </div>

      <div className="reflect-card">
        <div className="reflect-mascot-row">
          <Mascot mood={selectedOption !== null ? (currentQ.options[selectedOption].correct ? 'celebrating' : 'thinking') : 'idle'} size={70} />
          <h3 className="reflect-card-title" style={{ margin: 0, textAlign: 'left', flex: 1 }}>{currentQ.question}</h3>
        </div>

        <div className="reflect-options">
          {currentQ.options.map((opt, i) => {
            let btnClass = "reflect-option";
            if (selectedOption !== null) {
              if (i === selectedOption) {
                btnClass += opt.correct ? " correct" : " wrong";
              } else if (opt.correct) {
                btnClass += " correct"; // highlight the correct one anyway
              }
            }
            
            return (
              <button
                key={i}
                disabled={selectedOption !== null}
                className={btnClass}
                onClick={() => handleOptionSelect(i)}
              >
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={{ marginTop: '24px', animation: 'bounceIn 0.5s' }}>
            {currentQ.options[selectedOption].correct ? (
              <p style={{ color: 'var(--green-light)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px' }}>
                Spot on! ✅
              </p>
            ) : (
              <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px' }}>
                Not quite! The correct answer is highlighted above.
              </p>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {currentQIndex < REFLECT_QUESTIONS.length - 1 ? 'Next Question ➡️' : 'Finish Reflection 🌟'}
            </button>
          </div>
        )}
      </div>

      <div className="reflect-progress">
        {REFLECT_QUESTIONS.map((_, i) => (
          <div key={i} className={`reflect-dot ${i === currentQIndex ? 'active' : i < currentQIndex ? 'done' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default ReflectPhase;
