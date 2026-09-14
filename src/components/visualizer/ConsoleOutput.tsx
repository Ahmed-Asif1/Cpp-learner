import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, Copy, Check, CheckCircle2, AlertOctagon, Clock, CornerDownLeft } from 'lucide-react';

interface ConsoleOutputProps {
  output: string[];
  onClear: () => void;
  isError?: boolean;
  errorMessage?: string;
  hasLeak?: boolean;
  exitCode?: number;
  durationMs?: number;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  onClear,
  isError,
  errorMessage,
  hasLeak,
  exitCode = 0,
  durationMs = 8,
}) => {
  const [copied, setCopied] = React.useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fullText = output.join('');

  // Auto-scroll terminal when new output streams
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCopy = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-zinc-800 rounded-lg flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/70 gap-2 shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-200 font-semibold">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Standard Output (Terminal)</span>
        </div>

        {/* Execution Status Badge */}
        <div className="flex items-center gap-2">
          {output.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              {isError ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 font-semibold">
                  <AlertOctagon className="w-3 h-3 text-rose-400" />
                  <span>Exit 139 (Fault)</span>
                </span>
              ) : hasLeak ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/50 font-semibold">
                  <AlertOctagon className="w-3 h-3 text-amber-400" />
                  <span>Exit 0 (Leaked)</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Exit 0 (Success)</span>
                </span>
              )}
              <span className="text-zinc-500 hidden sm:inline flex items-center gap-0.5 tabular-nums">
                <Clock className="w-3 h-3" /> {durationMs}ms
              </span>
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={output.length === 0}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors text-[11px] flex items-center gap-1"
            title="Copy Output to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            disabled={output.length === 0}
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 disabled:opacity-30 transition-colors text-[11px]"
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen (Standard Output) */}
      <div
        ref={terminalRef}
        className="flex-1 p-3.5 font-mono text-xs overflow-y-auto leading-relaxed text-emerald-400 whitespace-pre-wrap select-text bg-[#030712] border-t border-zinc-900"
      >
        {output.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 py-6">
            <CornerDownLeft className="w-6 h-6 mb-1.5 opacity-40" />
            <p className="font-sans text-xs text-zinc-400 font-medium">No program output yet</p>
            <p className="font-mono text-[11px] text-zinc-600 mt-0.5">Click &ldquo;Run Code »&rdquo; or press Ctrl+Enter to execute.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {output.map((line, idx) => (
              <span key={idx} className={isError && idx === output.length - 1 ? 'text-rose-400 font-bold block mt-1 bg-rose-950/30 p-1 rounded' : ''}>
                {line}
              </span>
            ))}
            {errorMessage && (
              <div className="text-rose-400 font-bold text-[11px] mt-2 border-t border-rose-900/50 pt-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Runtime Error: {errorMessage}</span>
              </div>
            )}
            {hasLeak && (
              <div className="text-amber-400 font-bold text-[11px] mt-1.5 border-t border-amber-900/50 pt-1 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Memory Warning: Heap memory was allocated but never freed with delete.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-3 py-1 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0">
        <span>Standard Output Terminal</span>
        <span>{output.length} stream event(s)</span>
      </div>
    </div>
  );
};
