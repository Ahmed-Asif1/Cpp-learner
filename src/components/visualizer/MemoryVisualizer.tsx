import React from 'react';
import { HeapBlock, MemoryVariable, StackFrame } from '../../types';
import { AlertOctagon, CheckCircle2, Cpu, Database, Layers, Link as LinkIcon, ShieldAlert } from 'lucide-react';

interface MemoryVisualizerProps {
  stack: StackFrame[];
  heap: HeapBlock[];
  hasLeak?: boolean;
  explanation?: string;
  isError?: boolean;
  errorMessage?: string;
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({
  stack,
  heap,
  hasLeak,
  explanation,
  isError,
  errorMessage,
}) => {
  const activeFrame = stack[stack.length - 1];
  const variables = activeFrame ? activeFrame.variables : [];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Dynamic pedagogical explanation bar */}
      <div className={`p-3 rounded-xl border transition-all text-sm flex items-start gap-2.5 ${
        isError 
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          : hasLeak 
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
      }`}>
        {isError ? (
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : hasLeak ? (
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 leading-relaxed">
          <div className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-0.5">
            {isError ? 'Hardware Fault / Error' : hasLeak ? 'Memory Leak Warning' : 'CPU Execution Step'}
          </div>
          <p>{explanation || 'Ready to execute C++ instructions.'}</p>
        </div>
      </div>

      {/* Memory Leak Alert Banner */}
      {hasLeak && (
        <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3 text-rose-300 text-xs flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold">Memory Leak Detected:</span> Heap allocations were not deallocated with <code className="bg-rose-950 px-1 py-0.5 rounded font-mono text-rose-200">delete</code> before scope exit. In long-running systems, this causes crashes!
          </div>
        </div>
      )}

      {/* Memory Grid: Stack on Left, Heap on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* STACK MEMORY PANEL */}
        <div className="glass-panel p-4 flex flex-col border border-emerald-500/20 bg-gradient-to-b from-emerald-950/10 to-transparent">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>THE STACK (Automatic LIFO)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-500/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Grows Downwards ↓
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {stack.map((frame) => (
              <div key={frame.id} className="border border-emerald-500/30 rounded-lg p-2.5 bg-slate-900/60">
                <div className="text-xs font-mono text-emerald-300 font-medium pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>Stack Frame: {frame.functionName}</span>
                  <span className="text-[10px] text-slate-500">{frame.variables.length} var(s)</span>
                </div>

                {frame.variables.length === 0 ? (
                  <div className="text-center py-6 text-slate-600 text-xs font-mono">
                    [ Empty Stack Frame ]
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    {frame.variables.map((v) => (
                      <div
                        key={v.id}
                        className={`p-2 rounded border text-xs font-mono transition-all ${
                          v.isDangling
                            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                            : v.isPointer
                              ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                              : v.isReference
                                ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                                : 'bg-slate-800/80 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{v.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{v.address}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-mono">{v.type} ({v.sizeBytes}B)</span>
                          <span className="font-bold">
                            {v.isPointer ? (
                              <span className="flex items-center gap-1 text-cyan-400">
                                <LinkIcon className="w-3 h-3" />
                                {v.pointsToAddress ? v.pointsToAddress : 'nullptr'}
                              </span>
                            ) : v.isReference ? (
                              <span className="text-purple-300">
                                &rarr; alias of <code className="text-white font-bold">{v.refTargetName}</code> ({v.value})
                              </span>
                            ) : (
                              <span className="text-emerald-300">{String(v.value)}</span>
                            )}
                          </span>
                        </div>

                        {/* Array elements visualizer */}
                        {v.arrayElements && (
                          <div className="mt-2 pt-2 border-t border-slate-700/60 grid grid-cols-3 gap-1">
                            {v.arrayElements.map((elem) => (
                              <div key={elem.index} className="bg-slate-900/90 p-1 rounded text-center border border-slate-700">
                                <div className="text-[9px] text-slate-500">[{elem.index}] {elem.address.slice(-4)}</div>
                                <div className="font-bold text-amber-300">{elem.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {v.isDangling && (
                          <div className="mt-1 text-[10px] text-rose-400 font-sans font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Dangling pointer! Target memory was freed.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HEAP MEMORY PANEL */}
        <div className="glass-panel p-4 flex flex-col border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-transparent">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>THE HEAP (Dynamic new / delete)</span>
            </div>
            <span className="text-[11px] font-mono text-amber-500/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Manual Lifecycle
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {heap.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                <Database className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs font-mono">[ No Heap Allocations ]</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                  Use <code className="text-amber-400 font-mono">new</code> or <code className="text-cyan-400 font-mono">make_unique</code> to allocate memory here.
                </p>
              </div>
            ) : (
              heap.map((block) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                    block.status === 'allocated'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : block.status === 'freed'
                        ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through'
                        : 'bg-rose-950/50 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300">
                      {block.address}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase font-bold tracking-wider ${
                      block.status === 'allocated'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : block.status === 'freed'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-rose-900 text-rose-200 border border-rose-500'
                    }`}>
                      {block.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-1">
                    <span className="text-slate-400">
                      {block.type} ({block.sizeBytes} Bytes)
                      {block.refCount !== undefined && ` | RefCount: ${block.refCount}`}
                    </span>
                    <span className="font-bold text-white text-sm">
                      Val: {String(block.value)}
                    </span>
                  </div>

                  {block.ownerVariable && (
                    <div className="mt-1 text-[10px] text-slate-400 font-sans">
                      Owner: <code className="text-cyan-300 font-mono">{block.ownerVariable}</code>
                    </div>
                  )}

                  {block.status === 'leaked' && (
                    <div className="mt-1 text-[10px] text-rose-300 font-sans font-semibold flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3 text-rose-400" /> Leaked byte block! Never deleted.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
