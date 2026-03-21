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
    <div className="min-h-screen p-8 max-w-[1600px] mx-auto"> {/* 修改：增加最大宽度以适应三列横向布局 */}
      <Header />

      {/* 将 lg:grid-cols-[1fr_650px] 改为三列布局 */}
      {/* 第一列固定 256px (预设)，第二列自适应 (网格)，第三列固定 350px (控制器) */}
      <div className="grid lg:grid-cols-[256px_1fr_350px] gap-8 items-start">

        {/* 左侧列：放置预设面板 (PresetSelector) */}
        <div className="w-full shrink-0">
          <PresetSelector onSelect={handleLoadPreset} />
          <div className='glass-panel p-6 rounded-2xl space-y-6'>
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4">使用指南</h2>
              <ul className="text-[11px] text-white/40 space-y-2 list-disc pl-4">
                <li>使用 KAOSS控制器 调制滤波器的截止频率，共鸣和类型。</li>
                <li>点击网格上的方块来添加音符。</li>
                <li>每个音符都会“记住”它被创建时的音色。如果你想演奏中即时用KAOSS修改音色，请打开全局模式。</li>
                <li>调整 BPM 滑块来改变序列的播放速度。</li>
                <li>按播放按钮来播放和暂停，使用清除按钮清除网格</li>
                <li>在左侧预设面板可以使用准备好的预设</li>
              </ul>
            </div>
          </div>
        </div>

        

        {/* 中央列：放置音乐网格与播放控制 (Grid & Transport) */}
        <div className="space-y-8">
          <Grid
            grid={grid}
            setGrid={setGrid}
            currentStep={currentStep}
          />

          <TransportCtrl
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onClear={clearGrid}
          />
        </div>

        {/* 3. 右侧列：放置 XY 控制器 (XYPad) */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white/60">KAOSS Controller</h2>
          </div>

          {/* XY 触摸板 */}
          <XYPad />

          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[11px] leading-relaxed text-white/40 italic">
              Tip: Click a grid square to lock in the current XY Pad timbre.
            </p>
          </div>
        </div>

        

      </div>
    </div>
  );
};

export default App;
