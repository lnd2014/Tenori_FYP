import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Header from './components/Header';
import Grid from './components/Grid';
import XYPad from './components/XYPad.jsx';
import TransportCtrl from './components/TransportCtrl';
import { engine } from './services/AudioEngine';
import { SquareX } from 'lucide-react';

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

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <Header />

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
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
          />

          <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            {/* TODO 把清除按钮的逻辑放入TransportCtrl中，并把图标依赖一起放过去，修改图标依赖的CSS */}
            <button
              onClick={clearGrid}
              className="text-[10px] font-mono uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
            >
              <SquareX fill="black" size={20} />Clear All
            </button>
          </div>
          
        </div>

        <div className="space-y-8">
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

          
        </div>
      </div>
    </div>
  );
};

export default App;
