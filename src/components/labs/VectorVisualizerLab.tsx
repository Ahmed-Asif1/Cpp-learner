import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, TrendingUp, Sparkles, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

export const VectorVisualizerLab: React.FC = () => {
  const [elements, setElements] = useState<number[]>([10, 20, 30]);
  const [capacity, setCapacity] = useState<number>(4);
  const [reallocCount, setReallocCount] = useState<number>(1);
  const [lastAction, setLastAction] = useState<string>('Vector initialized with capacity 4.');
  const [isReallocating, setIsReallocating] = useState<boolean>(false);

  const handlePushBack = () => {
    soundManager.playClick();
    const nextVal = (elements.length + 1) * 10 + Math.floor(Math.random() * 9);

    if (elements.length >= capacity) {
      // Trigger Reallocation!
      soundManager.playAlloc();
      setIsReallocating(true);
      const newCapacity = capacity === 0 ? 1 : capacity * 2;
      setLastAction(`⚠️ Reallocation triggered! Capacity doubled from ${capacity} to ${newCapacity}. Elements copied to new heap buffer.`);
      setCapacity(newCapacity);
      setReallocCount((r) => r + 1);
      setElements((prev) => [...prev, nextVal]);

      setTimeout(() => setIsReallocating(false), 800);
    } else {
      soundManager.playPointerHop();
      setLastAction(`pushed ${nextVal} into pre-allocated slot ${elements.length}. Instant O(1) operation!`);
      setElements((prev) => [...prev, nextVal]);
    }
  };

  const handlePopBack = () => {
    if (elements.length === 0) return;
    soundManager.playDealloc();
    const popped = elements[elements.length - 1];
    setElements((prev) => prev.slice(0, -1));
    setLastAction(`pop_back() removed ${popped}. Size is now ${elements.length - 1}, but capacity remains ${capacity}.`);
  };

  const handleReserve = (n: number) => {
    soundManager.playAlloc();
    if (n > capacity) {
      setCapacity(n);
      setReallocCount((r) => r + 1);
      setLastAction(`reserve(${n}) called! Pre-allocated ${n * 4} bytes on heap in a single step.`);
    }
  };

  const handleShrinkToFit = () => {
    soundManager.playClick();
    if (capacity > elements.length) {
      setCapacity(elements.length);
      setReallocCount((r) => r + 1);
      setLastAction(`shrink_to_fit() released ${ (capacity - elements.length) * 4 } unused bytes back to system.`);
    }
  };

  const handleClear = () => {
    soundManager.playClick();
    setElements([]);
    setLastAction('clear() called. Size is 0, but capacity buffer is preserved for fast future insertions!');
  };

  return (
    <div className="glass-panel p-6 border border-slate-800 rounded-2xl space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <span>std::vector Capacity Doubling & Reallocation Lab</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize contiguous memory growth, amortized O(1) appending, and why reserve() is critical.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            size(): <span className="text-emerald-400 font-bold">{elements.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            capacity(): <span className="text-cyan-400 font-bold">{capacity}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            Reallocations: <span className="text-amber-400 font-bold">{reallocCount}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handlePushBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>push_back()</span>
        </button>

        <button
          onClick={handlePopBack}
          disabled={elements.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
          <span>pop_back()</span>
        </button>

        <button
          onClick={() => handleReserve(16)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 transition"
        >
          reserve(16)
        </button>

        <button
          onClick={handleShrinkToFit}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-slate-700 transition"
        >
          shrink_to_fit()
        </button>

        <button
          onClick={handleClear}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs border border-slate-700 transition"
        >
          clear()
        </button>
      </div>

      {/* Status Bar */}
      <div className={`p-3 rounded-xl border text-xs font-mono transition-all ${
        isReallocating 
          ? 'bg-amber-950/50 border-amber-500 text-amber-200' 
          : 'bg-slate-900/70 border-slate-800 text-slate-300'
      }`}>
        <span className="text-cyan-400 font-bold">&gt;&gt; </span> {lastAction}
      </div>

      {/* Physical Heap Buffer Representation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Contiguous Heap Buffer [0 .. {capacity - 1}]</span>
          <span>{capacity * 4} bytes total buffer</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-2">
          {Array.from({ length: Math.max(capacity, 8) }).map((_, idx) => {
            const hasItem = idx < elements.length;
            const isAllocatedCapacity = idx < capacity;

            return (
              <div
                key={idx}
                className={`h-20 rounded-xl border p-2 flex flex-col justify-between font-mono text-xs transition-all duration-300 ${
                  hasItem
                    ? isReallocating
                      ? 'bg-amber-900/60 border-amber-500 text-amber-100 scale-105'
                      : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : isAllocatedCapacity
                      ? 'bg-slate-900/50 border-dashed border-cyan-500/30 text-slate-600'
                      : 'bg-slate-950/30 border-dashed border-slate-800 text-slate-700 opacity-40'
                }`}
              >
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>[{idx}]</span>
                  {hasItem && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>

                <div className="text-center font-bold text-sm">
                  {hasItem ? (
                    <span className="text-white">{elements[idx]}</span>
                  ) : isAllocatedCapacity ? (
                    <span className="text-[10px] text-slate-600 italic">empty</span>
                  ) : (
                    <span className="text-[10px] text-slate-800">n/a</span>
                  )}
                </div>

                <div className="text-[9px] text-slate-600 text-center">
                  +{(idx * 4)}B
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Explanation */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1.5">
        <div className="font-bold text-white flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Why Amortized O(1)?
        </div>
        <p className="leading-relaxed">
          Doubling capacity ensures that an expensive $O(N)$ reallocation copy only happens exponentially rarely (at sizes 1, 2, 4, 8, 16, 32...). Over $N$ total insertions, the average cost per insertion approaches a constant $O(1)$!
        </p>
      </div>
    </div>
  );
};
