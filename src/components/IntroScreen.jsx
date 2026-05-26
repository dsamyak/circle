import React from 'react';
import CircleSVG from './shared/CircleSVG';

const IntroScreen = ({ onStart }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 24,
      textAlign: 'center',
      backgroundColor: '#FFFFFF',
    }}>
      <div className="animate-bounce-in" style={{ marginBottom: 32 }}>
        <CircleSVG size={180} animated={true} glow={true} />
      </div>
      
      <h1 style={{ 
        fontFamily: "'Fredoka One', cursive", 
        fontSize: '3rem', 
        color: '#4A90D9',
        margin: '0 0 16px 0'
      }}>
        Welcome to Circles!
      </h1>
      
      <p style={{ 
        fontFamily: "'Nunito', sans-serif", 
        fontSize: '1.25rem', 
        color: '#757575',
        maxWidth: 500,
        margin: '0 0 40px 0',
        lineHeight: 1.5
      }}>
        Today we're going to learn all about the shape called a circle. Are you ready to explore?
      </p>
      
      <button 
        className="btn-primary animate-slide-up"
        onClick={onStart}
        style={{ fontSize: 24, padding: '16px 48px' }}
      >
        Let's Start! 🔵
      </button>

      {/* Phase preview map */}
      <div style={{ marginTop: 64, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '🔍', title: 'Wonder', color: 'var(--wonder-color)' },
          { icon: '📖', title: 'Story', color: 'var(--story-color)' },
          { icon: '🧪', title: 'Simulate', color: 'var(--simulate-color)' },
          { icon: '🎮', title: 'Play', color: 'var(--play-color)' },
          { icon: '📓', title: 'Reflect', color: 'var(--reflect-color)' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: '50%', backgroundColor: p.color, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {p.icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 'bold', color: '#757575' }}>{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroScreen;
