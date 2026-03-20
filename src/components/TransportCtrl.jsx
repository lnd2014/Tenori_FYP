import React, { useState } from 'react';
import { Play, Square, Activity, SquareX } from 'lucide-react';
import { engine } from '../services/AudioEngine';

/**
 * TransportCtrl 组件：播放/停止控制与 BPM 调节
 */

const TransportCtrl = ({ isPlaying, setIsPlaying, onClear }) => {
    const [bpm, setBpm] = useState(120);

    const togglePlay = () => {
        if (isPlaying) {
            engine.stop();
        } else {
            engine.start();
        }
        setIsPlaying(!isPlaying);
    };

    const handleBpmChange = (e) => {
        const val = parseInt(e.target.value);
        setBpm(val);
        engine.setBpm(val);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-8">
            <button
                onClick={togglePlay}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isPlaying
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
            >
                {isPlaying ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
            </button>

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white/60">
                        <Activity size={14} />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Tempo</span>
                    </div>
                    <span className="text-sm font-mono text-emerald-400">{bpm} BPM</span>
                </div>
                <input
                    type="range"
                    min="40"
                    max="240"
                    value={bpm}
                    onChange={handleBpmChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
            </div>
            <button
                onClick={onClear}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all group"
            >
                <SquareX
                    size={16}
                    className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>Clear Grid</span>
            </button>
        </div>
    );
};

export default TransportCtrl;
