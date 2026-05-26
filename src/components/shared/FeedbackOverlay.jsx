import React, { useEffect } from 'react';
import Mascot from './Mascot';

const FeedbackOverlay = ({ isCorrect, title, message, onContinue, showMascot = true }) => {
  useEffect(() => {
    // Auto-focus the continue button when feedback appears
    const btn = document.getElementById('feedback-continue-btn');
    if (btn) btn.focus();
  }, []);

  return (
    <div 
      className="feedback-overlay"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 107, 107, 0.15)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 40,
        zIndex: 100,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div 
        className={`feedback-card ${isCorrect ? 'animate-bounce-in' : 'animate-shake'}`}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 32px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '90%',
          textAlign: 'center',
          border: `4px solid ${isCorrect ? '#4CAF50' : '#FF6B6B'}`,
        }}
      >
        {showMascot && (
          <div style={{ marginTop: -60, marginBottom: 8 }}>
            <Mascot mood={isCorrect ? 'celebrating' : 'thinking'} size={100} />
          </div>
        )}
        
        <h2 style={{ 
          fontFamily: "'Fredoka One', cursive", 
          color: isCorrect ? '#4CAF50' : '#FF6B6B',
          margin: '0 0 12px 0',
          fontSize: 28 
        }}>
          {title || (isCorrect ? "Fantastic!" : "Let's look again!")}
        </h2>
        
        <p style={{ 
          fontFamily: "'Nunito', sans-serif", 
          fontSize: 18, 
          color: '#4A4A4A',
          margin: '0 0 24px 0',
          lineHeight: 1.4
        }}>
          {message}
        </p>
        
        <button
          id="feedback-continue-btn"
          onClick={onContinue}
          style={{
            backgroundColor: isCorrect ? '#4CAF50' : '#FF6B6B',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 50,
            padding: '12px 32px',
            fontSize: 18,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isCorrect ? 'Continue' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
