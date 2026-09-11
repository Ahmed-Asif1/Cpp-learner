import React, { useState } from 'react';
import { X, FileText, Bookmark, Search, Check, Copy, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

interface CheatSheetModalProps {
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pointers' | 'smart' | 'stl' | 'gotchas'>('pointers');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel border border-slate-700 w-full max-w-3xl max-h-[85vh] rounded-2xl relative shadow-md bg-[#0e1424] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">C++ Engineer Cheat Sheet & Reference</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
          {[
            { id: 'pointers', label: 'Pointers & References' },
            { id: 'smart', label: 'Smart Pointers' },
            { id: 'stl', label: 'STL Complexity' },
            { id: 'gotchas', label: 'Interview Pitfalls' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'pointers' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Pointers vs References vs Value</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="pb-2">Feature</th>
                      <th className="pb-2">Pointer (T*)</th>
                      <th className="pb-2">Reference (T&)</th>
                      <th className="pb-2">Value (T)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                    <tr>
                      <td className="py-2.5 font-bold text-white">Can be Null?</td>
                      <td className="py-2.5 text-cyan-400">Yes (nullptr)</td>
                      <td className="py-2.5 text-emerald-400">No (Must bind)</td>
                      <td className="py-2.5 text-slate-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Can Rebind?</td>
                      <td className="py-2.5 text-cyan-400">Yes (p = &other)</td>
                      <td className="py-2.5 text-rose-400">No (Permanent alias)</td>
                      <td className="py-2.5 text-slate-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Syntax to Access</td>
                      <td className="py-2.5 text-cyan-400">*p or p-&gt;member</td>
                      <td className="py-2.5 text-emerald-400">ref.member (Direct)</td>
                      <td className="py-2.5 text-slate-300">val.member</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Memory Storage</td>
                      <td className="py-2.5 text-slate-400">8 Bytes (64-bit)</td>
                      <td className="py-2.5 text-slate-400">0 Bytes (Compiler alias)</td>
                      <td className="py-2.5 text-slate-400">sizeof(T)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-emerald-300 space-y-1">
                <div>int x = 10;</div>
                <div>int* p = &x;     <span className="text-slate-500">// p holds memory address of x</span></div>
                <div>int& r = x;      <span className="text-slate-500">// r is an alias of x (same address)</span></div>
                <div>*p = 20;         <span className="text-slate-500">// x is now 20</span></div>
                <div>r = 30;          <span className="text-slate-500">// x is now 30</span></div>
              </div>
            </div>
          )}

          {activeTab === 'smart' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Modern C++ Smart Pointers Cheat Sheet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                  <div className="font-bold text-amber-400 font-mono">std::unique_ptr&lt;T&gt;</div>
                  <p className="text-slate-300 leading-relaxed">
                    Exclusive ownership. Exactly 0 runtime overhead compared to a raw pointer. Cannot be copied!
                  </p>
                  <pre className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-amber-200">
                    auto p = std::make_unique&lt;Foo&gt;();<br/>
                    auto p2 = std::move(p); // Transferred!
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">std::shared_ptr&lt;T&gt;</div>
                  <p className="text-slate-300 leading-relaxed">
                    Shared ownership. Reference-counted control block. Destroys resource when ref count drops to 0.
                  </p>
                  <pre className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-cyan-200">
                    auto s1 = std::make_shared&lt;Foo&gt;();<br/>
                    auto s2 = s1; // ref count is 2
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stl' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Standard Template Library (STL) Time Complexities</h3>
              <table className="w-full border-collapse font-mono text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">Container</th>
                    <th className="pb-2">Random Access</th>
                    <th className="pb-2">Insert/Delete (Back)</th>
                    <th className="pb-2">Insert/Delete (Middle)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
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
          )}

          {activeTab === 'gotchas' && (
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Top 3 C++ Interview Pitfalls</h3>
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-1.5">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  1. Non-Virtual Destructors in Base Classes
                </div>
                <p className="text-slate-300 leading-relaxed">
                  If you delete a derived class object through a base class pointer (`Base* b = new Derived(); delete b;`), and `~Base()` is not marked `virtual`, the derived destructor will NEVER run, causing memory leaks and undefined behavior!
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  2. Object Slicing
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Passing a derived object by value to a function expecting a base class copies only the base portion of the object. The derived members and polymorphic vtable are "sliced" off. Always pass polymorphic objects by pointer or reference!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
