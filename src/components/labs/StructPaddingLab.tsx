import React, { useState } from 'react';
import { Layers, Play, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';
import { CppSimulator } from '../../engine/cppInterpreter';

export const StructPaddingLab: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'unoptimized' | 'optimized'>('unoptimized');
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const sampleCode = `// Memory Alignment & Struct Padding in C++
#include <iostream>
using namespace std;

struct BadOrder {
    char a;    // 1 byte + 3 bytes padding
    int b;     // 4 bytes
    char c;    // 1 byte + 3 bytes padding
}; // Total: 12 bytes! (6 bytes wasted!)

struct GoodOrder {
    int b;     // 4 bytes
    char a;    // 1 byte
    char c;    // 1 byte + 2 bytes padding
}; // Total: 8 bytes! (Only 2 bytes padding)

int main() {
    cout << "Size of BadOrder struct:  " << sizeof(BadOrder) << " bytes" << endl;
    cout << "Size of GoodOrder struct: " << sizeof(GoodOrder) << " bytes" << endl;
    cout << "Memory saved by reordering: 4 bytes per instance!" << endl;
    return 0;
}`;

  const handleRun = () => {
    soundManager.playClick();
    const res = CppSimulator.runProgram(sampleCode);
    setRunOutput(res.stdout);
    soundManager.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border border-slate-800 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/40">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Memory Alignment & Struct Padding Visualizer</span>
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Modern 64-bit CPUs read memory in 4-byte or 8-byte chunks (words). When struct members are not naturally aligned, the compiler injects invisible padding bytes, wasting RAM! See how member reordering saves memory.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            setLayoutMode('unoptimized');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
            layoutMode === 'unoptimized'
              ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Unoptimized Struct (12 Bytes - 50% Wasted)
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setLayoutMode('optimized');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
            layoutMode === 'optimized'
              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Optimized Struct (8 Bytes - Compact)
        </button>
      </div>

      {/* 12-Byte / 8-Byte Memory Ribbon */}
      <div className="glass-panel p-6 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold">Physical RAM Byte Layout:</span>
          <span className="text-cyan-400">
            Total Footprint: {layoutMode === 'unoptimized' ? '12 Bytes' : '8 Bytes'}
          </span>
        </div>

        {layoutMode === 'unoptimized' ? (
          <div className="grid grid-cols-12 gap-1.5 font-mono text-[11px] text-center">
            {/* char a */}
            <div className="col-span-1 p-3 rounded-lg bg-cyan-900/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">a</div>
              <div className="text-[9px] text-slate-400">1B</div>
            </div>
            {/* 3 bytes padding */}
            <div className="col-span-3 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 border-dashed">
              <div className="font-bold italic">padding</div>
              <div className="text-[9px] text-rose-500">3B wasted</div>
            </div>
            {/* int b */}
            <div className="col-span-4 p-3 rounded-lg bg-emerald-900/60 border border-emerald-500/50 text-emerald-200">
              <div className="font-bold">int b</div>
              <div className="text-[9px] text-slate-400">4B aligned</div>
            </div>
            {/* char c */}
            <div className="col-span-1 p-3 rounded-lg bg-cyan-900/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">c</div>
              <div className="text-[9px] text-slate-400">1B</div>
            </div>
            {/* 3 bytes padding */}
            <div className="col-span-3 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 border-dashed">
              <div className="font-bold italic">padding</div>
              <div className="text-[9px] text-rose-500">3B wasted</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1.5 font-mono text-[11px] text-center">
            {/* int b */}
            <div className="col-span-4 p-3 rounded-lg bg-emerald-900/60 border border-emerald-500/50 text-emerald-200">
              <div className="font-bold">int b</div>
              <div className="text-[9px] text-slate-400">4B aligned</div>
            </div>
            {/* char a */}
            <div className="col-span-1 p-3 rounded-lg bg-cyan-900/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">a</div>
              <div className="text-[9px] text-slate-400">1B</div>
            </div>
            {/* char c */}
            <div className="col-span-1 p-3 rounded-lg bg-cyan-900/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">c</div>
              <div className="text-[9px] text-slate-400">1B</div>
            </div>
            {/* 2 bytes padding */}
            <div className="col-span-2 p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-500 border-dashed">
              <div className="font-bold italic">pad</div>
              <div className="text-[9px] text-slate-600">2B pad</div>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          {layoutMode === 'unoptimized'
            ? 'In BadOrder, char a requires 1 byte, but int b must start at an address divisible by 4. So the compiler inserts 3 dead bytes between them, plus 3 tail padding bytes.'
            : 'In GoodOrder, ordering members largest-to-smallest (int first, then both chars) packs the variables snugly, shrinking struct footprint from 12 bytes down to 8 bytes!'}
        </p>
      </div>

      {/* Executable Code Demo */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden bg-[#070b14]">
        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/70">
          <span className="text-xs font-mono text-slate-200 font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Executable Code Demo: Struct Sizing & Memory Layout</span>
          </span>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code »</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto bg-[#070b14]">
          <code>{sampleCode}</code>
        </pre>
        {runOutput !== null && (
          <div className="p-3 bg-[#030712] border-t border-slate-800">
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">Standard Output:</div>
            <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{runOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
