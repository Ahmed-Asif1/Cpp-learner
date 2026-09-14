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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive C++ Architecture & STL Labs</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hands-on visual playgrounds demonstrating memory mechanics, cache lines, pointer addresses, struct padding, and language comparisons.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('vector');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'vector'
                ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>std::vector Lab</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('smart');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'smart'
                ? 'bg-zinc-800 text-amber-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Pointers</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('pointer');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'pointer'
                ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pointers & Refs</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('padding');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'padding'
                ? 'bg-zinc-800 text-pink-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5 text-pink-400" />
            <span>Struct Padding</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('rosetta');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              activeTab === 'rosetta'
                ? 'bg-zinc-800 text-purple-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
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
