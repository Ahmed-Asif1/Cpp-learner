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
      <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/60">
        <h2 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Memory Alignment & Struct Padding Visualizer</span>
        </h2>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
          Modern 64-bit CPUs read memory in 4-byte or 8-byte chunks (words). When struct members are not naturally aligned, the compiler injects invisible padding bytes, wasting RAM! See how member reordering saves memory.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setLayoutMode('unoptimized');
          }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            layoutMode === 'unoptimized'
              ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Unoptimized Struct (12 Bytes - 50% Wasted)
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setLayoutMode('optimized');
          }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
            layoutMode === 'optimized'
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Optimized Struct (8 Bytes - Compact)
        </button>
      </div>

      {/* 12-Byte / 8-Byte Memory Ribbon */}
      <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/50 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-300 font-semibold">Physical RAM Byte Layout:</span>
          <span className="text-cyan-400 tabular-nums">
            Total Footprint: {layoutMode === 'unoptimized' ? '12 Bytes' : '8 Bytes'}
          </span>
        </div>

        {layoutMode === 'unoptimized' ? (
          <div className="grid grid-cols-12 gap-1.5 font-mono text-[11px] text-center">
            {/* char a */}
            <div className="col-span-1 p-2.5 rounded-md bg-cyan-950/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">a</div>
              <div className="text-[9px] text-zinc-400">1B</div>
            </div>
            {/* 3 bytes padding */}
            <div className="col-span-3 p-2.5 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-400 border-dashed">
              <div className="font-bold italic">padding</div>
              <div className="text-[9px] text-rose-500">3B wasted</div>
            </div>
            {/* int b */}
            <div className="col-span-4 p-2.5 rounded-md bg-emerald-950/60 border border-emerald-500/50 text-emerald-200">
              <div className="font-bold">int b</div>
              <div className="text-[9px] text-zinc-400">4B aligned</div>
            </div>
            {/* char c */}
            <div className="col-span-1 p-2.5 rounded-md bg-cyan-950/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">c</div>
              <div className="text-[9px] text-zinc-400">1B</div>
            </div>
            {/* 3 bytes padding */}
            <div className="col-span-3 p-2.5 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-400 border-dashed">
              <div className="font-bold italic">padding</div>
              <div className="text-[9px] text-rose-500">3B wasted</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1.5 font-mono text-[11px] text-center">
            {/* int b */}
            <div className="col-span-4 p-2.5 rounded-md bg-emerald-950/60 border border-emerald-500/50 text-emerald-200">
              <div className="font-bold">int b</div>
              <div className="text-[9px] text-zinc-400">4B aligned</div>
            </div>
            {/* char a */}
            <div className="col-span-1 p-2.5 rounded-md bg-cyan-950/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">a</div>
              <div className="text-[9px] text-zinc-400">1B</div>
            </div>
            {/* char c */}
            <div className="col-span-1 p-2.5 rounded-md bg-cyan-950/60 border border-cyan-500/50 text-cyan-200">
              <div className="font-bold">c</div>
              <div className="text-[9px] text-zinc-400">1B</div>
            </div>
            {/* 2 bytes padding */}
            <div className="col-span-2 p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 border-dashed">
              <div className="font-bold italic">pad</div>
              <div className="text-[9px] text-zinc-600">2B pad</div>
            </div>
          </div>
        )}

        <p className="text-xs text-zinc-400 leading-relaxed">
          {layoutMode === 'unoptimized'
            ? 'In BadOrder, char a requires 1 byte, but int b must start at an address divisible by 4. So the compiler inserts 3 dead bytes between them, plus 3 tail padding bytes.'
            : 'In GoodOrder, ordering members largest-to-smallest (int first, then both chars) packs the variables snugly, shrinking struct footprint from 12 bytes down to 8 bytes!'}
        </p>
      </div>

      {/* Executable Code Demo */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/70">
          <span className="text-xs font-mono text-zinc-200 font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Executable Code Demo: Struct Sizing & Memory Layout</span>
          </span>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code »</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto bg-zinc-950">
          <code>{sampleCode}</code>
        </pre>
        {runOutput !== null && (
          <div className="p-3 bg-[#030712] border-t border-zinc-800">
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">Standard Output:</div>
            <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{runOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
