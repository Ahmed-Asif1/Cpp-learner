import React, { useState, useEffect } from 'react';
import { X, FileText, Bookmark, Search, Check, Copy, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

interface CheatSheetModalProps {
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pointers' | 'smart' | 'stl' | 'gotchas'>('pointers');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheatsheet-modal-title"
    >
      <div className="glass-panel border border-zinc-800 w-full max-w-3xl max-h-[88vh] sm:max-h-[85vh] rounded-lg relative shadow-md bg-zinc-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 id="cheatsheet-modal-title" className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">
              C++ Engineer Cheat Sheet & Reference
            </h2>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors active:scale-95"
            aria-label="Close Cheat Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs - Mobile Horizontal Scroll with no-scrollbar */}
        <div
          className="flex items-center gap-1.5 p-2 border-b border-zinc-800/80 bg-zinc-950/80 shrink-0 overflow-x-auto no-scrollbar scroll-smooth"
          role="tablist"
          aria-label="Cheat Sheet Topics"
        >
          {[
            { id: 'pointers', label: 'Pointers & References' },
            { id: 'smart', label: 'Smart Pointers' },
            { id: 'stl', label: 'STL Complexity' },
            { id: 'gotchas', label: 'Interview Pitfalls' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`min-h-[40px] sm:min-h-[42px] px-3.5 py-2 rounded-md text-xs font-mono font-medium transition-colors shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'pointers' && (
            <div className="space-y-4">
              <h3 className="font-bold text-zinc-100 text-sm tracking-tight">Pointers vs References vs Value</h3>
              <div className="overflow-x-auto no-scrollbar sm:overflow-x-auto -mx-1 px-1">
                <table className="min-w-[480px] w-full border-collapse font-mono text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="pb-2">Feature</th>
                      <th className="pb-2">Pointer (T*)</th>
                      <th className="pb-2">Reference (T&)</th>
                      <th className="pb-2">Value (T)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300 text-xs">
                    <tr>
                      <td className="py-2.5 font-bold text-zinc-100">Can be Null?</td>
                      <td className="py-2.5 text-cyan-400">Yes (nullptr)</td>
                      <td className="py-2.5 text-emerald-400">No (Must bind)</td>
                      <td className="py-2.5 text-zinc-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-zinc-100">Can Rebind?</td>
                      <td className="py-2.5 text-cyan-400">Yes (p = &other)</td>
                      <td className="py-2.5 text-rose-400">No (Permanent alias)</td>
                      <td className="py-2.5 text-zinc-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-zinc-100">Syntax to Access</td>
                      <td className="py-2.5 text-cyan-400">*p or p-&gt;member</td>
                      <td className="py-2.5 text-emerald-400">ref.member (Direct)</td>
                      <td className="py-2.5 text-zinc-300">val.member</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-zinc-100">Memory Storage</td>
                      <td className="py-2.5 text-zinc-400 tabular-nums">8 Bytes (64-bit)</td>
                      <td className="py-2.5 text-zinc-400 tabular-nums">0 Bytes (Compiler alias)</td>
                      <td className="py-2.5 text-zinc-400">sizeof(T)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-zinc-950 p-4 rounded-md border border-zinc-800 font-mono text-emerald-300 space-y-1 overflow-x-auto no-scrollbar">
                <div>int x = 10;</div>
                <div>int* p = &x;     <span className="text-zinc-500">// p holds memory address of x</span></div>
                <div>int& r = x;      <span className="text-zinc-500">// r is an alias of x (same address)</span></div>
                <div>*p = 20;         <span className="text-zinc-500">// x is now 20</span></div>
                <div>r = 30;          <span className="text-zinc-500">// x is now 30</span></div>
              </div>
            </div>
          )}

          {activeTab === 'smart' && (
            <div className="space-y-4">
              <h3 className="font-bold text-zinc-100 text-sm tracking-tight">Modern C++ Smart Pointers Cheat Sheet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-md border border-amber-500/30 bg-amber-950/10 space-y-2">
                  <div className="font-bold text-amber-400 font-mono">std::unique_ptr&lt;T&gt;</div>
                  <p className="text-zinc-300 leading-relaxed">
                    Exclusive ownership. Exactly 0 runtime overhead compared to a raw pointer. Cannot be copied!
                  </p>
                  <pre className="p-2 bg-zinc-950 rounded-md border border-zinc-800 text-[11px] font-mono text-amber-200 overflow-x-auto no-scrollbar">
                    auto p = std::make_unique&lt;Foo&gt;();<br/>
                    auto p2 = std::move(p); // Transferred!
                  </pre>
                </div>

                <div className="p-3.5 rounded-md border border-cyan-500/30 bg-cyan-950/10 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">std::shared_ptr&lt;T&gt;</div>
                  <p className="text-zinc-300 leading-relaxed">
                    Shared ownership. Reference-counted control block. Destroys resource when ref count drops to 0.
                  </p>
                  <pre className="p-2 bg-zinc-950 rounded-md border border-zinc-800 text-[11px] font-mono text-cyan-200 overflow-x-auto no-scrollbar">
                    auto s1 = std::make_shared&lt;Foo&gt;();<br/>
                    auto s2 = s1; // ref count is 2
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stl' && (
            <div className="space-y-4">
              <h3 className="font-bold text-zinc-100 text-sm tracking-tight">Standard Template Library (STL) Time Complexities</h3>
              <div className="overflow-x-auto no-scrollbar sm:overflow-x-auto -mx-1 px-1">
                <table className="min-w-[520px] w-full border-collapse font-mono text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="pb-2">Container</th>
                      <th className="pb-2">Random Access</th>
                      <th className="pb-2">Insert/Delete (Back)</th>
                      <th className="pb-2">Insert/Delete (Middle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300 text-xs">
                    <tr>
                      <td className="py-2.5 font-bold text-cyan-400">std::vector</td>
                      <td className="py-2.5 text-emerald-400">O(1)</td>
                      <td className="py-2.5 text-emerald-400">O(1) amortized</td>
                      <td className="py-2.5 text-rose-400">O(N) (shifts elements)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-cyan-400">std::deque</td>
                      <td className="py-2.5 text-emerald-400">O(1)</td>
                      <td className="py-2.5 text-emerald-400">O(1) front & back</td>
                      <td className="py-2.5 text-rose-400">O(N)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-cyan-400">std::list</td>
                      <td className="py-2.5 text-rose-400">O(N)</td>
                      <td className="py-2.5 text-emerald-400">O(1)</td>
                      <td className="py-2.5 text-emerald-400">O(1) (with iterator)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-amber-400">std::map</td>
                      <td className="py-2.5 text-amber-400">O(log N)</td>
                      <td className="py-2.5 text-amber-400">O(log N) (Red-Black)</td>
                      <td className="py-2.5 text-amber-400">O(log N)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-emerald-400">std::unordered_map</td>
                      <td className="py-2.5 text-emerald-400">O(1) avg</td>
                      <td className="py-2.5 text-emerald-400">O(1) avg (Hash)</td>
                      <td className="py-2.5 text-emerald-400">O(1) avg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gotchas' && (
            <div className="space-y-3">
              <h3 className="font-bold text-zinc-100 text-sm tracking-tight">Top 3 C++ Interview Pitfalls</h3>
              <div className="p-3.5 rounded-md border border-rose-500/30 bg-rose-950/10 space-y-1.5">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  1. Non-Virtual Destructors in Base Classes
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  If you delete a derived class object through a base class pointer (`Base* b = new Derived(); delete b;`), and `~Base()` is not marked `virtual`, the derived destructor will NEVER run, causing memory leaks and undefined behavior!
                </p>
              </div>

              <div className="p-3.5 rounded-md border border-amber-500/30 bg-amber-950/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  2. Object Slicing
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Passing a derived object by value to a function expecting a base class copies only the base portion of the object. The derived members and polymorphic vtable are &ldquo;sliced&rdquo; off. Always pass polymorphic objects by pointer or reference!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
