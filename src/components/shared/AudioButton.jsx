import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioButton = ({ audioEnabled, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="audio-button"
      aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
      title={audioEnabled ? "Mute audio" : "Enable audio"}
    >
      {audioEnabled ? <Volume2 size={24} color="#4A90D9" /> : <VolumeX size={24} color="#9E9E9E" />}
    </button>
  );
};

export default AudioButton;
