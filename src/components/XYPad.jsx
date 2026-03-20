import React, { useRef, useState, useEffect } from 'react';
import { engine } from '../services/AudioEngine';

const XYPad = () => {
  const padRef = useRef(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  // 滤波器类型变量
  const filterTypes = ['lowpass', 'highpass', 'bandpass', 'notch'];
  const [currentFilter, setCurrentFilter] = useState('lowpass');

  // 管理滤波器类型变化
  const handleFilterChange = (type) => {
    setCurrentFilter(type);
    engine.setFilterType(type);
  };

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
      <div className="space-y-4">
        {/* 过滤器类型切换按钮组 */}
        <div className="flex gap-2">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-tighter rounded-full border transition-all ${currentFilter === type
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default XYPad;
