import React, { useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, BookOpen, Code2, Zap } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  currentLineIndex: number;
  isRunning: boolean;
  onRunAll: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (spd: number) => void;
  onSelectPreset: (presetCode: string) => void;
}

export const CODE_PRESETS = [
  {
    name: '1. Fundamentals: Variables & I/O Streams',
    code: `// C++ Variable Types & Output Streams
#include <iostream>
#include <string>
using namespace std;

int main() {
    int packetCount = 128;
    double latencyMs = 2.45;
    char statusFlag = 'A';
    string host = "192.168.1.1";
    bool isConnected = true;
    
    cout << "Connected Host: " << host << endl;
    cout << "Packets: " << packetCount << " | Latency: " << latencyMs << " ms" << endl;
    cout << "Status Flag: " << statusFlag << " | Active: " << isConnected << endl;
    return 0;
}`,
  },
  {
    name: '2. Pointers & Memory Addresses (& and *)',
    code: `// C++ Pointer Mechanics & Direct Memory Access
#include <iostream>
using namespace std;

int main() {
    int sensorReading = 42;
    int* bufferPtr = &sensorReading; // Pointer stores physical RAM address
    
    cout << "Sensor value: " << sensorReading << endl;
    cout << "Address in RAM (&sensorReading): " << &sensorReading << endl;
    cout << "Pointer value (bufferPtr): " << bufferPtr << endl;
    
    // Mutate original value via pointer dereference
    *bufferPtr = 100;
    cout << "Updated sensor value (*bufferPtr = 100): " << sensorReading << endl;
    return 0;
}`,
  },
  {
    name: '3. Dynamic Memory Allocation (new & delete)',
    code: `// Stack vs Heap Allocation (CS214 Systems Model)
#include <iostream>
using namespace std;

int main() {
    int stackValue = 16;
    int* heapBuffer = new int(256); // Explicitly allocated on Heap
    
    cout << "Stack variable value: " << stackValue << endl;
    cout << "Heap object value: " << *heapBuffer << endl;
    cout << "Heap memory address: " << heapBuffer << endl;
    
    // Deterministic deallocation
    delete heapBuffer;
    heapBuffer = nullptr; // Clear pointer to prevent dangling reference
    cout << "Heap memory deallocated safely." << endl;
    return 0;
}`,
  },
  {
    name: '4. Memory Leak Diagnostic (Audit Trap)',
    code: `// Memory Leak Detection Analysis
#include <iostream>
using namespace std;

int main() {
    cout << "Allocating dynamic buffer on the heap..." << endl;
    int* leakNode = new int(4096);
    
    cout << "Buffer allocated at: " << leakNode << endl;
    cout << "Buffer payload: " << *leakNode << endl;
    
    // WARNING: Missing 'delete leakNode;' before function return!
    // The engine's memory profiler detects this unreleased allocation.
    return 0;
}`,
  },
  {
    name: '5. References & Pass-by-Reference Semantics',
    code: `// C++ References: Zero-Overhead Aliases
#include <iostream>
using namespace std;

int main() {
    int initialBalance = 500;
    int& accountRef = initialBalance; // Direct hardware alias
    
    cout << "Initial balance: $" << initialBalance << endl;
    cout << "Alias reference: $" << accountRef << endl;
    
    accountRef += 250; // Directly mutates underlying storage
    cout << "New balance after transaction: $" << initialBalance << endl;
    return 0;
}`,
  },
  {
    name: '6. Modern C++: unique_ptr & Ownership Transfer',
    code: `// Modern C++ (C++20) RAII Smart Pointers
#include <iostream>
#include <memory>
using namespace std;

int main() {
    // make_unique guarantees exception-safe heap allocation
    unique_ptr<int> primaryNode = make_unique<int>(1024);
    cout << "Primary node value: " << *primaryNode << endl;
    
    // Transfer exclusive ownership using std::move
    unique_ptr<int> secondaryNode = std::move(primaryNode);
    cout << "Ownership transferred to secondary: " << *secondaryNode << endl;
    
    // RAII destructor cleans up memory automatically upon return
    return 0;
}`,
  },
  {
    name: '7. Contiguous Array Indexing & Memory Layout',
    code: `// Contiguous Stack Arrays & Sizing
#include <iostream>
using namespace std;

int main() {
    int buffer[3] = {100, 200, 300};
    
    cout << "Element [0]: " << buffer[0] << " at " << &buffer[0] << endl;
    cout << "Element [1]: " << buffer[1] << " at " << &buffer[1] << endl;
    cout << "Element [2]: " << buffer[2] << " at " << &buffer[2] << endl;
    cout << "Size of element (int): " << sizeof(int) << " bytes" << endl;
    cout << "Total array footprint:  " << sizeof(buffer) << " bytes" << endl;
    return 0;
}`,
  },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  currentLineIndex,
  isRunning,
  onRunAll,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  onSelectPreset,
}) => {
  const lineGutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  const handleScroll = () => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      soundManager.playClick();
      onRunAll();
    }
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden bg-[#070b14]">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 sm:p-2.5 border-b border-slate-800 bg-slate-900/70 gap-2 shrink-0">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            onChange={(e) => {
              soundManager.playClick();
              onSelectPreset(e.target.value);
            }}
            className="w-full sm:w-auto bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer truncate max-w-full sm:max-w-[240px]"
            defaultValue=""
          >
            <option value="" disabled>Load C++ Code Example...</option>
            {CODE_PRESETS.map((p, idx) => (
              <option key={idx} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Execution & Stepping Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5">
          {/* Primary Instant Run Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRunAll();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
            title="Execute code directly (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code »</span>
          </button>

          {/* Stepping controls */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 gap-0.5">
            {isRunning ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPause();
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition"
                title="Pause Execution"
              >
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPlay();
                }}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-cyan-300 font-semibold text-xs transition"
                title="Animate line-by-line"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden xs:inline">Animate</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playPointerHop();
                onStep();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition"
              title="Step Over Next Line"
            >
              <SkipForward className="w-3 h-3" />
              <span>Step</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onReset();
              }}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Reset Code & Memory to Initial State"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Speed Selector */}
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-[11px] rounded-lg px-2 py-1 text-slate-400 focus:outline-none hidden sm:inline-block"
            title="Animation Step Speed"
          >
            <option value={1500}>0.5x</option>
            <option value={800}>1x</option>
            <option value={400}>2x</option>
          </select>
        </div>
      </div>

      {/* Editor Body with Synchronized Gutter */}
      <div className="flex-1 flex overflow-hidden relative bg-[#070b14]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineGutterRef}
          className="w-10 sm:w-11 bg-slate-950/80 border-r border-slate-800/80 py-3 flex flex-col items-center select-none text-[11px] font-mono text-slate-600 shrink-0 overflow-hidden"
        >
          {lines.map((_, idx) => (
            <div
              key={idx}
              className={`h-6 w-full flex items-center justify-between px-1 sm:px-1.5 ${
                idx === currentLineIndex ? 'text-cyan-400 font-bold bg-cyan-950/30' : ''
              }`}
            >
              <span>{idx + 1}</span>
              {idx === currentLineIndex && (
                <span className="text-cyan-400 text-[10px]">▶</span>
              )}
            </div>
          ))}
        </div>

        {/* Code Content Overlay / Textarea */}
        <div className="flex-1 relative overflow-hidden py-3">
          {/* Active Line Highlight Ribbon */}
          <div
            className="absolute left-0 right-0 h-6 active-execution-line border-l-2 pointer-events-none transition-all duration-150"
            style={{
              top: `${currentLineIndex * 24 + 12}px`,
              display: currentLineIndex >= 0 && currentLineIndex < lines.length ? 'block' : 'none',
            }}
          />

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full bg-transparent font-mono text-xs sm:text-[13px] text-slate-200 resize-none outline-none leading-6 px-3 whitespace-pre overflow-auto z-10 relative selection:bg-cyan-500/30"
            style={{
              fontFamily: "'Fira Code', monospace",
              tabSize: 4,
            }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>C++20 (Ctrl+Enter to Run)</span>
        </div>
        <div>
          Line {currentLineIndex + 1} of {lines.length}
        </div>
      </div>
    </div>
  );
};
