import React, { useState } from 'react';
import { Zap, ArrowRight, ShieldCheck, Trash2, Plus, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

export const SmartPointerLab: React.FC = () => {
  // Unique Pointer State
  const [u1Owner, setU1Owner] = useState<boolean>(true);
  const [u2Owner, setU2Owner] = useState<boolean>(false);
  const [uniqueHeapVal, setUniqueHeapVal] = useState<string | null>('Engine::V8');

  // Shared Pointer State
  const [sharedOwners, setSharedOwners] = useState<{ id: string; name: string }[]>([
    { id: 's1', name: 'spMain' },
  ]);
  const [sharedHeapVal, setSharedHeapVal] = useState<string | null>('Texture::Dragon4K');

  // UNIQUE POINTER ACTIONS
  const handleCreateUnique = () => {
    soundManager.playAlloc();
    setUniqueHeapVal('Engine::V8');
    setU1Owner(true);
    setU2Owner(false);
  };

  const handleMoveUnique = () => {
    if (!u1Owner || !uniqueHeapVal) return;
    soundManager.playPointerHop();
    setU1Owner(false);
    setU2Owner(true);
  };

  const handleResetUnique = () => {
    soundManager.playDealloc();
    setUniqueHeapVal(null);
    setU1Owner(false);
    setU2Owner(false);
  };

  // SHARED POINTER ACTIONS
  const handleAddShared = (name: string) => {
    if (!sharedHeapVal) {
      soundManager.playAlloc();
      setSharedHeapVal('Texture::Dragon4K');
      setSharedOwners([{ id: 's1', name: 'spMain' }]);
      return;
    }
    soundManager.playPointerHop();
    setSharedOwners((prev) => [...prev, { id: `s-${Date.now()}`, name }]);
  };

  const handleRemoveShared = (id: string) => {
    soundManager.playDealloc();
    const remaining = sharedOwners.filter((o) => o.id !== id);
    setSharedOwners(remaining);
    if (remaining.length === 0) {
      setSharedHeapVal(null); // Ref count hit 0!
    }
  };

  return (
    <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/50 space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-zinc-800">
        <h2 className="text-base font-bold text-zinc-100 tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Modern C++ Smart Pointer & Ownership Lab</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          See exclusive ownership with <code className="text-amber-400 font-mono">std::unique_ptr</code> and reference-counted shared ownership with <code className="text-cyan-400 font-mono">std::shared_ptr</code>.
        </p>
      </div>

      {/* SECTION 1: UNIQUE PTR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
              1. std::unique_ptr&lt;T&gt; (Sole Exclusive Owner)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!uniqueHeapVal ? (
              <button
                onClick={handleCreateUnique}
                className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>make_unique&lt;Engine&gt;()</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleMoveUnique}
                  disabled={!u1Owner}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-zinc-800 font-medium text-xs transition-colors flex items-center gap-1.5 disabled:opacity-30"
                >
                  <span>u2 = std::move(u1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetUnique}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-rose-300 font-medium text-xs border border-zinc-800 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>.reset()</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Visual Unique Stack and Heap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pointer u1 on stack */}
          <div className={`p-4 rounded-md border font-mono text-xs transition-colors ${
            u1Owner ? 'bg-amber-950/25 border-amber-500/50 text-amber-200' : 'bg-zinc-950/40 border-zinc-800 text-zinc-600'
          }`}>
            <div className="text-[10px] text-zinc-500 mb-1">Stack Variable</div>
            <div className="font-bold text-zinc-100 text-sm">unique_ptr u1</div>
            <div className="mt-2 text-xs">
              Value: {u1Owner ? <span className="text-amber-400 tabular-nums">0x00A1F0 (Owner)</span> : <span className="text-zinc-600">nullptr</span>}
            </div>
          </div>

          {/* Pointer u2 on stack */}
          <div className={`p-4 rounded-md border font-mono text-xs transition-colors ${
            u2Owner ? 'bg-cyan-950/25 border-cyan-500/50 text-cyan-200' : 'bg-zinc-950/40 border-zinc-800 text-zinc-600'
          }`}>
            <div className="text-[10px] text-zinc-500 mb-1">Stack Variable</div>
            <div className="font-bold text-zinc-100 text-sm">unique_ptr u2</div>
            <div className="mt-2 text-xs">
              Value: {u2Owner ? <span className="text-cyan-400 tabular-nums">0x00A1F0 (Owner)</span> : <span className="text-zinc-600">nullptr</span>}
            </div>
          </div>

          {/* Target Heap Object */}
          <div className={`p-4 rounded-md border font-mono text-xs transition-colors ${
            uniqueHeapVal ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' : 'bg-zinc-950/20 border-dashed border-zinc-800 text-zinc-700'
          }`}>
            <div className="text-[10px] text-zinc-500 mb-1 tabular-nums">Heap Address: 0x00A1F0</div>
            <div className="font-bold text-zinc-100 text-sm">
              {uniqueHeapVal ? uniqueHeapVal : '[ Deallocated from Heap ]'}
            </div>
            <div className="mt-2 text-[11px] text-zinc-400">
              {uniqueHeapVal ? 'Owned exclusively. Zero leak possibility.' : 'Cleanly freed when owner reset or moved.'}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SHARED PTR */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              2. std::shared_ptr&lt;T&gt; (Reference Counted Ownership)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddShared(`spOwner${sharedOwners.length + 1}`)}
              className="px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Clone Shared Pointer (spCopy = spMain)</span>
            </button>
          </div>
        </div>

        {/* Visual Shared Owners & Heap Target */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Owners list */}
          <div className="md:col-span-2 p-4 border border-zinc-800 bg-zinc-950/50 rounded-md space-y-2">
            <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Active shared_ptr stack instances</span>
              <span className="text-cyan-400 font-bold tabular-nums">use_count(): {sharedOwners.length}</span>
            </div>

            {sharedOwners.length === 0 ? (
              <div className="text-xs text-zinc-600 italic py-4 text-center">
                All shared pointers destroyed. Heap memory released!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sharedOwners.map((owner) => (
                  <div
                    key={owner.id}
                    className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-md flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="text-zinc-100 font-semibold">{owner.name}</span>
                      <span className="text-zinc-500 block text-[10px] tabular-nums">Points to 0x00FF88</span>
                    </div>
                    <button
                      onClick={() => handleRemoveShared(owner.id)}
                      className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Destroy this shared_ptr (reset)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shared Heap Block with Control Block */}
          <div className={`p-4 rounded-md border font-mono text-xs flex flex-col justify-between ${
            sharedHeapVal ? 'bg-cyan-950/25 border-cyan-500/50 text-cyan-200' : 'bg-zinc-950/20 border-dashed border-zinc-800 text-zinc-700'
          }`}>
            <div>
              <div className="text-[10px] text-zinc-500 mb-1 tabular-nums">Heap Address: 0x00FF88</div>
              <div className="font-bold text-zinc-100 text-base">
                {sharedHeapVal ? sharedHeapVal : '[ Automatic Deallocation ]'}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-zinc-800 text-[11px] flex items-center justify-between">
              <span className="text-zinc-400">Control Block Ref Count:</span>
              <span className={`text-base font-bold tabular-nums ${sharedOwners.length > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>
                {sharedOwners.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
