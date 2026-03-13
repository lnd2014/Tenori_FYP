import React, { useRef, useState, useEffect } from 'react';
import { engine } from '../services/AudioEngine';

const XYPad = () => {
  const padRef = useRef(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = (clientX - rect.left) / rect.width;
    let y = 1 - (clientY - rect.top) / rect.height; // Invert Y for frequency

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    setPos({ x, y });

    // 实时更新音频引擎的音色参数
    engine.updateTimbre(x, y);
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDragging) handleMove(e);
    };
    const onMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
        <span>Resonance (X)</span>
        <span>Cutoff (Y)</span>
      </div>
      <div 
        ref={padRef}
        className="xy-pad"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        <div className="xy-grid" />
        <div 
          className="xy-cursor"
          style={{ 
            left: `${pos.x * 100}%`, 
            top: `${(1 - pos.y) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default XYPad;
