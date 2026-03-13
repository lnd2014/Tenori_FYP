import React from 'react';
import { Music, Zap } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Music className="text-black" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">KAOSS-TENORI</h1>
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Step Sequencer & Timbre Modulator</p>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Zap size={12} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-white/60">TONE.JS</span>
            </div>
        </header>
    );
};

export default Header;
