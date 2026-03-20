import React from 'react';
import { Save, ChevronRight } from 'lucide-react';
import { PRESETS } from '../constants/Presets.jsx';

// 预设选择组件，返回一个预设选择的界面

const PresetSelector = ({ onSelect }) => {
    return (
        <div className="glass-panel p-4 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-white/60 mb-2">
                <Save size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Presets (预设库)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {Object.keys(PRESETS).map((name) => (
                    <button
                        key={name}
                        onClick={() => onSelect(name)}
                        className="flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 rounded-lg text-xs text-white/70 hover:text-emerald-400 transition-all group"
                    >
                        {name}
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PresetSelector;