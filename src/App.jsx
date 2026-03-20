import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Header from './components/Header';
import Grid from './components/Grid';
import XYPad from './components/XYPad.jsx';
import TransportCtrl from './components/TransportCtrl';
import { engine } from './services/AudioEngine';
import { SquareX } from 'lucide-react';
import { PRESETS } from './constants/Presets';
import PresetSelector from './components/PresetsSelector';

/**
 * App 根组件
 * 负责协调网格状态、音频序列调度以及整体 UI 布局
 */

const App = () => {
  const [grid, setGrid] = useState(
    Array(16).fill(null).map(() =>
      Array(16).fill(null).map(() => ({ active: false, timbre: null }))
    )
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    // Create the sequence
    const sequence = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        const column = gridRef.current[step];
        column.forEach((cell, rowIdx) => {
          if (cell.active) {
            engine.playNote(rowIdx, cell.timbre, time);
          }
        });
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n'
    ).start(0);

    return () => {
      sequence.dispose();
    };
  }, []);

  const clearGrid = () => {
    setGrid(
      Array(16).fill(null).map(() =>
        Array(16).fill(null).map(() => ({ active: false, timbre: null }))
      )
    );
  };

  /**
 * 加载预设并更新网格状态
 * @param {string} presetName 预设名称
 */
  const handleLoadPreset = (presetName) => {
    const coords = PRESETS[presetName];
    if (!coords) return;

    // 初始化为对象数组
    const newGrid = Array(16).fill(null).map(() =>
      Array(16).fill(null).map(() => ({ active: false, timbre: null }))
    );

    // 2. 根据坐标点亮格子
    coords.forEach(([row, col]) => {
      if (row < 16 && col < 16) {
        // 修改对象的 active 属性
        newGrid[row][col].active = true;

        // 如果预设需要默认音色，也可以在这里设置
        newGrid[row][col].timbre = null; 
      }
    });

    console.log("预设加载成功，数据结构已同步:", newGrid[15][0]); // 应该显示 {active: true, ...}

    setGrid(newGrid);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <Header />

      <div className="grid lg:grid-cols-[1fr_650px] gap-12 items-start">
        <div className="space-y-8">
          <Grid
            grid={grid}
            setGrid={setGrid}
            currentStep={currentStep}
          />

          {/* 播放按钮 */}
          <TransportCtrl
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onClear={clearGrid} 
          />
          
        </div>

        <div className="flex flex-row-reverse gap-6 items-start">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white/60">KAOSS Controller</h2>
            </div>

                {/* XY 触摸板：控制全局音色 */}
                <XYPad />

            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[11px] leading-relaxed text-white/40 italic">
                Tip: Click a grid square to lock in the current XY Pad timbre.
              </p>
            </div>
            
          </div>

          <div className="w-64 shrink-0"> {/* 给预设面板一个固定宽度，例如 16rem */}
            <PresetSelector onSelect={handleLoadPreset} />
          </div>


          
        </div>
      </div>
    </div>
  );
};

export default App;
