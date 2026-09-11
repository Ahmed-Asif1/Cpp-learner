import React, { useState } from 'react';
import { VectorVisualizerLab } from './VectorVisualizerLab';
import { SmartPointerLab } from './SmartPointerLab';
import { RosettaStoneLab } from './RosettaStoneLab';
import { PointerRefLab } from './PointerRefLab';
import { StructPaddingLab } from './StructPaddingLab';
import { TrendingUp, Zap, BookOpen, Layers, Compass, AlignJustify } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

export const LabsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vector' | 'smart' | 'pointer' | 'padding' | 'rosetta'>('vector');

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-6">
      {/* Top Navigator */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive C++ Architecture & STL Labs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-on visual playgrounds demonstrating memory mechanics, cache lines, pointer addresses, struct padding, and language comparisons.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('vector');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
              activeTab === 'vector'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>std::vector Lab</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('smart');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
              activeTab === 'smart'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Pointers</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('pointer');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
              activeTab === 'pointer'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Pointers & Refs</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('padding');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
              activeTab === 'padding'
                ? 'bg-pink-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span>Struct Padding</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('rosetta');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
              activeTab === 'rosetta'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rosetta Stone</span>
          </button>
        </div>
      </div>

      {/* Render Active Lab */}
      <div>
        {activeTab === 'vector' && <VectorVisualizerLab />}
        {activeTab === 'smart' && <SmartPointerLab />}
        {activeTab === 'pointer' && <PointerRefLab />}
        {activeTab === 'padding' && <StructPaddingLab />}
        {activeTab === 'rosetta' && <RosettaStoneLab />}
      </div>
    </div>
  );
};
