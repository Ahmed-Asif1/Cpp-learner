import React, { useState } from 'react';
import { Compass, Zap, Shield, ArrowRight, Play, Terminal, RotateCcw } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';
import { CppSimulator } from '../../engine/cppInterpreter';

export const PointerRefLab: React.FC = () => {
  const [targetVal, setTargetVal] = useState<number>(42);
  const [pointerAddr] = useState<string>('0x7ffd28');
  const [targetAddr] = useState<string>('0x7ffd20');
  const [logs, setLogs] = useState<string[]>([
    'Initialized variable original = 42 at address 0x7ffd20',
    'Created pointer ptr = &original at address 0x7ffd28',
    'Created reference ref = original (shares address 0x7ffd20)',
  ]);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const sampleCode = `// Pointers vs References in C++
#include <iostream>
using namespace std;

int main() {
    int original = 42;
    int* ptr = &original; // Pointer stores address
    int& ref = original;  // Reference is an alias

    cout << "Original value: " << original << endl;
    cout << "Via pointer (*ptr): " << *ptr << endl;
    cout << "Via reference (ref): " << ref << endl;

    *ptr = 100; // Mutate through pointer
    cout << "After *ptr = 100, original is: " << original << endl;

    ref = 250; // Mutate through reference
    cout << "After ref = 250, original is: " << original << endl;
    return 0;
}`;

  const mutateViaVal = () => {
    soundManager.playClick();
    const next = targetVal + 10;
    setTargetVal(next);
    setLogs((prev) => [...prev, `[Value Mutation] original = ${next} updated directly in RAM.`]);
  };

  const mutateViaPtr = () => {
    soundManager.playPointerHop();
    const next = targetVal + 50;
    setTargetVal(next);
    setLogs((prev) => [...prev, `[Pointer Dereference] *ptr = ${next} modified target at ${targetAddr}.`]);
  };

  const mutateViaRef = () => {
    soundManager.playSuccess();
    const next = targetVal + 100;
    setTargetVal(next);
    setLogs((prev) => [...prev, `[Reference Mutation] ref = ${next} modified alias binding at ${targetAddr}.`]);
  };

  const handleRunCode = () => {
    soundManager.playClick();
    const res = CppSimulator.runProgram(sampleCode);
    setRunOutput(res.stdout);
    soundManager.playSuccess();
  };

  const handleReset = () => {
    soundManager.playClick();
    setTargetVal(42);
    setLogs([
      'Reset state: original = 42 at 0x7ffd20',
      'ptr = &original at 0x7ffd28',
      'ref = original at 0x7ffd20',
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-6 border border-slate-800 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/40">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Interactive Pointer vs Reference Simulator</span>
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Master the exact difference between raw values, memory pointers (`type*`), and references (`type&`). Observe physical addresses in RAM and see how each mutates the underlying hardware slot.
        </p>
      </div>

      {/* Memory Grid Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Original Variable */}
        <div className="glass-panel p-5 border border-cyan-500/30 bg-cyan-950/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">int original</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Address: {targetAddr}
            </span>
          </div>
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-2xl font-mono font-black text-cyan-400">{targetVal}</div>
            <div className="text-[11px] text-slate-400 mt-1">Direct Value (4 bytes)</div>
          </div>
          <button
            onClick={mutateViaVal}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
          >
            original += 10
          </button>
        </div>

        {/* Box 2: Pointer */}
        <div className="glass-panel p-5 border border-amber-500/30 bg-amber-950/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">int* ptr = &original</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">
              Address: {pointerAddr}
            </span>
          </div>
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-base font-mono font-bold text-amber-400">{targetAddr}</div>
            <div className="text-[11px] text-slate-400 mt-1">Holds Address of original (8 bytes)</div>
          </div>
          <button
            onClick={mutateViaPtr}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition"
          >
            *ptr += 50 (Dereference Mutate)
          </button>
        </div>

        {/* Box 3: Reference */}
        <div className="glass-panel p-5 border border-emerald-500/30 bg-emerald-950/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">int& ref = original</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              Shares: {targetAddr}
            </span>
          </div>
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-2xl font-mono font-black text-emerald-400">{targetVal}</div>
            <div className="text-[11px] text-slate-400 mt-1">Indivisible Alias (0 extra bytes)</div>
          </div>
          <button
            onClick={mutateViaRef}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition"
          >
            ref += 100 (Alias Mutate)
          </button>
        </div>
      </div>

      {/* Live Event Log */}
      <div className="glass-panel p-4 border border-slate-800 rounded-2xl bg-slate-950/80">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-xs font-mono text-slate-400 font-semibold">Memory Operation Log</span>
          <button onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        <div className="space-y-1 font-mono text-xs text-slate-300 max-h-28 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-cyan-400">»</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Code Demonstration */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden bg-[#070b14]">
        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/70">
          <span className="text-xs font-mono text-slate-200 font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Interactive Demonstration: Pointers & References</span>
          </span>
          <button
            onClick={handleRunCode}
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
