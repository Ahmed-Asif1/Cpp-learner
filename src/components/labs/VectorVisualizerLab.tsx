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
    <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/50 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <span>std::vector Capacity Doubling & Reallocation Lab</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualize contiguous memory growth, amortized O(1) appending, and why reserve() is critical.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-zinc-950/80 border border-zinc-800 px-2.5 py-1.5 rounded-md text-zinc-300 tabular-nums">
            size(): <span className="text-emerald-400 font-bold">{elements.length}</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 px-2.5 py-1.5 rounded-md text-zinc-300 tabular-nums">
            capacity(): <span className="text-cyan-400 font-bold">{capacity}</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 px-2.5 py-1.5 rounded-md text-zinc-300 tabular-nums">
            Reallocations: <span className="text-amber-400 font-bold">{reallocCount}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePushBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>push_back()</span>
        </button>

        <button
          onClick={handlePopBack}
          disabled={elements.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-800 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>pop_back()</span>
        </button>

        <button
          onClick={() => handleReserve(16)}
          className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-medium text-xs border border-zinc-800 transition-colors"
        >
          reserve(16)
        </button>

        <button
          onClick={handleShrinkToFit}
          className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-medium text-xs border border-zinc-800 transition-colors"
        >
          shrink_to_fit()
        </button>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-rose-300 font-medium text-xs border border-zinc-800 transition-colors"
        >
          clear()
        </button>
      </div>

      {/* Status Bar */}
      <div className={`p-2.5 rounded-md border text-xs font-mono transition-colors ${
        isReallocating 
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
          : 'bg-zinc-950/80 border-zinc-800 text-zinc-300'
      }`}>
        <span className="text-cyan-400 font-bold">&gt;&gt; </span> {lastAction}
      </div>

      {/* Physical Heap Buffer Representation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Contiguous Heap Buffer [0 .. {capacity - 1}]</span>
          <span className="tabular-nums">{capacity * 4} bytes total buffer</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-2">
          {Array.from({ length: Math.max(capacity, 8) }).map((_, idx) => {
            const hasItem = idx < elements.length;
            const isAllocatedCapacity = idx < capacity;

            return (
              <div
                key={idx}
                className={`h-20 rounded-md border p-2 flex flex-col justify-between font-mono text-xs transition-colors duration-200 ${
                  hasItem
                    ? isReallocating
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-100 scale-105'
                      : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : isAllocatedCapacity
                      ? 'bg-zinc-950/50 border-dashed border-cyan-500/30 text-zinc-600'
                      : 'bg-zinc-950/30 border-dashed border-zinc-800 text-zinc-700 opacity-40'
                }`}
              >
                <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>[{idx}]</span>
                  {hasItem && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>

                <div className="text-center font-bold text-sm tabular-nums">
                  {hasItem ? (
                    <span className="text-zinc-100">{elements[idx]}</span>
                  ) : isAllocatedCapacity ? (
                    <span className="text-[10px] text-zinc-600 italic">empty</span>
                  ) : (
                    <span className="text-[10px] text-zinc-800">n/a</span>
                  )}
                </div>

                <div className="text-[9px] text-zinc-600 text-center tabular-nums">
                  +{(idx * 4)}B
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architectural Explanation */}
      <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-md text-xs text-zinc-300 space-y-1.5">
        <div className="font-semibold text-zinc-100 flex items-center gap-1.5 tracking-tight">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Why Amortized O(1)?
        </div>
        <p className="leading-relaxed text-zinc-400">
          Doubling capacity ensures that an expensive $O(N)$ reallocation copy only happens exponentially rarely (at sizes 1, 2, 4, 8, 16, 32...). Over $N$ total insertions, the average cost per insertion approaches a constant $O(1)$!
        </p>
      </div>
    </div>
  );
};
