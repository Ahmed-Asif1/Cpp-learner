import React, { useState } from 'react';
import { BookOpen, ArrowRight, Zap, Cpu, Check, Layers } from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

interface ComparisonTopic {
  id: string;
  title: string;
  tag: string;
  cpp: string;
  python: string;
  javascript: string;
  java: string;
  takeaway: string;
}

const COMPARISONS: ComparisonTopic[] = [
  {
    id: 'memory-management',
    title: 'Memory Management & Lifetimes',
    tag: 'Hardware & Performance',
    cpp: `// C++: Deterministic Stack & RAII
{
    std::string text = "Hello";
} // Memory freed the EXACT nanosecond scope ends!`,
    python: `# Python: Traced Garbage Collection
text = "Hello"
# Cleaned up later when GC cyclic scanner runs`,
    javascript: `// JavaScript: V8 Traced Heap GC
let text = "Hello";
// Managed by V8 nursery generation GC`,
    java: `// Java: JVM Garbage Collector
String text = "Hello";
// Cleaned up whenever Young Gen GC triggers`,
    takeaway: 'C++ has zero runtime garbage collection pauses. Destruction is deterministic and immediate, making it essential for game loops, audio engines, and robotics.',
  },
  {
    id: 'passing-arguments',
    title: 'Passing Large Objects to Functions',
    tag: 'Performance & Zero-Copy',
    cpp: `// C++: const Reference (Zero Copy!)
void process(const std::vector<int>& data) {
    // 0 bytes copied! Direct read-only hardware access.
}`,
    python: `# Python: Pass-by-object-reference
def process(data):
    # Passes reference to mutable list object
    pass`,
    javascript: `// JavaScript: Pass-by-sharing
function process(data) {
    // Passes object reference
}`,
    java: `// Java: Pass-by-value of reference
void process(List<Integer> data) {
    // Passes copy of the pointer reference
}`,
    takeaway: 'In C++, you have explicit control: pass by value (copy), pass by reference (mutate caller), or pass by const reference (zero copy read-only).',
  },
  {
    id: 'dynamic-arrays',
    title: 'Dynamic Arrays & Memory Layout',
    tag: 'Data Structures',
    cpp: `// C++: Contiguous physical cache line!
std::vector<int> numbers = {1, 2, 3, 4};
// All 4 ints sit adjacent in physical RAM.
// CPU prefetcher loads them in 1 cache line!`,
    python: `# Python: List of pointer boxed objects
numbers = [1, 2, 3, 4]
# An array of PyObject* pointers scattered in RAM!`,
    javascript: `// JavaScript: Array (can be fast or hash map)
const numbers = [1, 2, 3, 4];
// Fast packed SMI elements in V8`,
    java: `// Java: ArrayList<Integer>
List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
// Array of references to boxed Integer objects`,
    takeaway: 'std::vector lays out data contiguously in physical cache lines. This yields up to 10x-50x faster iteration speeds than boxed pointer arrays!',
  },
];

export const RosettaStoneLab: React.FC = () => {
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [activeLang, setActiveLang] = useState<'python' | 'javascript' | 'java'>('python');

  const topic = COMPARISONS[activeTopicIndex];

  return (
    <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/50 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>The C++ Rosetta Stone: Polyglot Comparison</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Coming from Python, JavaScript, or Java? See side-by-side how C++ manages memory, hardware, and performance.
          </p>
        </div>

        {/* Language Switcher for Right Panel */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-md">
          <span className="text-[11px] text-zinc-400 font-mono px-2">Compare C++ with:</span>
          {(['python', 'javascript', 'java'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                soundManager.playClick();
                setActiveLang(lang);
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-colors ${
                activeLang === lang
                  ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {COMPARISONS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              soundManager.playClick();
              setActiveTopicIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              idx === activeTopicIndex
                ? 'bg-zinc-800 border-zinc-700 text-cyan-300 font-semibold'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Modern C++ */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
            <div className="flex items-center gap-2">
              <span>⚡ Modern C++ (Direct to Silicon)</span>
            </div>
            <span className="text-[10px] text-zinc-500">ISO C++20</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
            <code>{topic.cpp}</code>
          </pre>
        </div>

        {/* Right: Selected Comparison Language */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
            <span className="capitalize">{activeLang} Equivalent</span>
            <span className="text-[10px] text-zinc-500">Managed Runtime</span>
          </div>
          <pre className="p-4 text-xs font-mono text-amber-200 leading-relaxed overflow-x-auto">
            <code>
              {activeLang === 'python'
                ? topic.python
                : activeLang === 'javascript'
                  ? topic.javascript
                  : topic.java}
            </code>
          </pre>
        </div>
      </div>

      {/* Takeaway Box */}
      <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-md flex items-start gap-3 text-xs text-zinc-300">
        <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300 block mb-0.5 tracking-tight">The C++ Advantage:</span>
          <span className="text-zinc-400">{topic.takeaway}</span>
        </div>
      </div>
    </div>
  );
};
