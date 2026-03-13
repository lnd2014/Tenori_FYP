import React from 'react';

const NoteSquare = ({ active, isCurrentStep, onClick, timbre }) => {
  // Calculate color based on timbre cutoff
  const getStyle = () => {
    if (!active) return {};
    
    // Map cutoff (100-8000) to brightness/hue
    const hue = 160; // Emerald base
    const lightness = 40 + (timbre.cutoff / 8000) * 30;
    const alpha = 0.4 + (timbre.q / 15) * 0.6;
    
    return {
      backgroundColor: `hsla(${hue}, 100%, ${lightness}%, ${alpha})`,
      boxShadow: `0 0 15px hsla(${hue}, 100%, ${lightness}%, 0.5)`
    };
  };

  return (
    <div 
      className={`note-square ${active ? 'active' : ''} ${isCurrentStep ? 'current-step' : ''}`}
      onClick={onClick}
      style={getStyle()}
    />
  );
};

export default NoteSquare;
