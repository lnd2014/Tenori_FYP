import React from 'react';

/**
 * NoteSquare 组件：网格中的单个音符单元
 * 负责渲染音符的激活状态、播放进度高亮以及根据音色快照计算颜色
 */

const NoteSquare = ({ active, isCurrentStep, onClick, timbre }) => {
  // Calculate color based on timbre cutoff
  const getStyle = () => {
    if (!active) return {};
    
    // Map cutoff (100-8000) to brightness/hue
    const hue = 160; // Emerald base
    const lightness = 40 + ((timbre?.cutoff || 2000) / 8000) * 30;
    const alpha = 0.4 + ((timbre?.q || 1) / 15) * 0.6;
    
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
