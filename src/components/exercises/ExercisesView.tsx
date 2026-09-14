import React, { useState } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  Terminal,
  Filter,
  Check,
  AlertCircle,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';
import { CODING_EXERCISES } from '../../data/exercisesData';
import { CodingExercise } from '../../types';
import { CppSimulator } from '../../engine/cppInterpreter';

interface ExercisesViewProps {
  completedExerciseIds?: string[];
  onSolveExercise: (exerciseId: string, xpReward: number) => void;
  onOpenInSandbox: (code: string) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  completedExerciseIds = [],
  onSolveExercise,
  onOpenInSandbox,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(CODING_EXERCISES[0].id);
  const [userCodeMap, setUserCodeMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    CODING_EXERCISES.forEach((ex) => {
      map[ex.id] = ex.starterCode;
    });
    return map;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMobileTab, setActiveMobileTab] = useState<'instructions' | 'editor'>('editor');
  const [stdoutOutput, setStdoutOutput] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<{
    tested: boolean;
    passed: boolean;
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const categories = ['All', 'Fundamentals', 'Pointers & Memory', 'Dynamic Allocation', 'References', 'Classes & RAII', 'Modern C++'];

  const filteredExercises = CODING_EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentExercise = CODING_EXERCISES.find((ex) => ex.id === selectedExerciseId) || CODING_EXERCISES[0];
  const currentCode = userCodeMap[currentExercise.id] ?? currentExercise.starterCode;
  const isCompleted = completedExerciseIds.includes(currentExercise.id);

  const handleSelectExercise = (ex: CodingExercise) => {
    soundManager.playClick();
    setSelectedExerciseId(ex.id);
    setStdoutOutput(null);
    setValidationStatus(null);
    setShowHint(false);
    setShowSolution(false);
    if (!userCodeMap[ex.id]) {
      setUserCodeMap((prev) => ({ ...prev, [ex.id]: ex.starterCode }));
    }
  };

  const handleCodeChange = (newCode: string) => {
    setUserCodeMap((prev) => ({ ...prev, [currentExercise.id]: newCode }));
    if (validationStatus) setValidationStatus(null);
  };

  const handleResetCode = () => {
    soundManager.playClick();
    setUserCodeMap((prev) => ({ ...prev, [currentExercise.id]: currentExercise.starterCode }));
    setStdoutOutput(null);
    setValidationStatus(null);
  };

  const handleRunCode = () => {
    soundManager.playClick();
    try {
      const result = CppSimulator.runProgram(currentCode);
      const out = result.stdout.length > 0 ? result.stdout : '[Program produced no standard output]';
      setStdoutOutput(out);
      setValidationStatus(null);
    } catch (err: any) {
      setStdoutOutput(`Runtime Error: ${err?.message || 'Unknown simulator fault'}`);
    }
  };

  const handleValidateExercise = () => {
    soundManager.playClick();
    try {
      const result = CppSimulator.runProgram(currentCode);
      const actual = result.stdout.trim();
      const expected = currentExercise.expectedOutput.trim();

      const out = result.stdout.length > 0 ? result.stdout : '[No output generated]\n';
      setStdoutOutput(out);

      if (actual === expected) {
        setValidationStatus({
          tested: true,
          passed: true,
          message: 'All test assertions passed! Output precisely matches expectations.',
        });
        soundManager.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        if (!isCompleted) {
          onSolveExercise(currentExercise.id, currentExercise.xpReward);
        }
      } else {
        setValidationStatus({
          tested: true,
          passed: false,
          message: `Output mismatch. Expected:\n"${expected}"\n\nReceived:\n"${actual}"`,
        });
      }
    } catch (err: any) {
      setStdoutOutput(`Runtime Error: ${err?.message || 'Simulator error'}`);
      setValidationStatus({
        tested: true,
        passed: false,
        message: `Execution failed: ${err?.message || 'Syntax or runtime error in simulation.'}`,
      });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Interactive Practice
            </span>
            <span className="text-xs text-zinc-400 tabular-nums">
              {completedExerciseIds.length} of {CODING_EXERCISES.length} Completed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mt-1">
            C++ Systems Coding Exercises
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Hands-on programming challenges with in-browser compilation, automated test runners, and real-time memory simulation.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 w-full sm:w-48 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden rounded-lg bg-zinc-900/90 p-1 border border-zinc-800">
        <button
          onClick={() => setActiveMobileTab('instructions')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
            activeMobileTab === 'instructions'
              ? 'bg-zinc-800 text-cyan-400 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Instructions & Specs
        </button>
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
            activeMobileTab === 'editor'
              ? 'bg-zinc-800 text-cyan-400 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Editor & Output
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge Catalog & Description */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            activeMobileTab === 'instructions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Challenge Selector List */}
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950/60 max-h-[300px] overflow-y-auto space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Challenge Index</span>
              <span className="tabular-nums">{filteredExercises.length} items</span>
            </div>
            {filteredExercises.map((ex) => {
              const active = ex.id === currentExercise.id;
              const completed = completedExerciseIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between gap-3 border ${
                    active
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold truncate">{ex.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-cyan-400">{ex.category}</span>
                      <span className="text-[10px] text-zinc-500">•</span>
                      <span
                        className={`text-[10px] font-medium ${
                          ex.difficulty === 'Beginner'
                            ? 'text-emerald-400'
                            : ex.difficulty === 'Intermediate'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-amber-400 font-bold tabular-nums">+{ex.xpReward} XP</span>
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current Challenge Specification Card */}
          <div className="border border-zinc-800 rounded-lg p-4 sm:p-5 bg-zinc-950/70 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                    {currentExercise.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      currentExercise.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : currentExercise.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {currentExercise.difficulty}
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3 h-3" /> Solved
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  {currentExercise.title}
                </h2>
              </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold tabular-nums shrink-0">
                  +{currentExercise.xpReward} XP
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentExercise.description}
              </p>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                  Requirements
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {currentExercise.instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Output Card */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Expected Output (stdout)
                  </span>
                </div>
                <pre className="p-3 rounded-md bg-[#030712] border border-zinc-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {currentExercise.expectedOutput}
                </pre>
              </div>

              {/* Hint & Solution Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowHint(!showHint);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowSolution(!showSolution);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showSolution ? 'Hide Solution' : 'View Reference Solution'}</span>
                </button>
              </div>

              {showHint && (
                <div className="p-3 rounded-md bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Implementation Hint:</strong>
                    {currentExercise.hint}
                  </div>
                </div>
              )}

              {showSolution && currentExercise.solutionCode && (
                <div className="space-y-1.5 p-3 rounded-md bg-zinc-900/90 border border-zinc-800">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                    Canonical Reference Solution:
                  </div>
                  <pre className="p-3 rounded-md bg-[#030712] font-mono text-xs text-cyan-300 overflow-x-auto">
                    <code>{currentExercise.solutionCode}</code>
                  </pre>
                </div>
              )}
          </div>
        </div>

        {/* Right Column: Code Editor & Output Terminal */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Editor Container */}
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 flex flex-col shadow-sm">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/60 gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-zinc-300 font-medium pl-1">
                  solution.cpp
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={() => onOpenInSandbox(currentCode)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors text-xs border border-cyan-500/30"
                  title="Trace memory line-by-line in Sandbox"
                >
                  <Cpu className="w-3 h-3" />
                  <span className="hidden sm:inline">Open in Sandbox</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </button>

                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Run</span>
                </button>

                <button
                  onClick={handleValidateExercise}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Validate & Submit</span>
                </button>
              </div>
            </div>

            {/* Code Input */}
            <div className="relative flex">
              <div className="select-none py-3.5 px-2 bg-zinc-950 border-r border-zinc-800 font-mono text-[11px] text-zinc-600 text-right w-10 shrink-0">
                {currentCode.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                className="w-full h-80 sm:h-96 p-3.5 bg-transparent font-mono text-xs text-emerald-300 leading-relaxed resize-none focus:outline-none selection:bg-cyan-500/30"
              />
            </div>
          </div>

          {/* Validation Status Banner */}
          {validationStatus && (
            <div
              className={`p-4 rounded-lg border transition-all ${
                validationStatus.passed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {validationStatus.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider">
                    {validationStatus.passed ? 'Verification Succeeded' : 'Verification Mismatch'}
                  </h4>
                  <pre className="text-xs font-mono mt-1 whitespace-pre-wrap leading-relaxed opacity-90">
                    {validationStatus.message}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Output Terminal */}
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/60">
              <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Standard Output (Console)
              </span>
              {stdoutOutput !== null && (
                <button
                  onClick={() => setStdoutOutput(null)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear Console
                </button>
              )}
            </div>
            <pre className="p-3.5 sm:p-4 text-xs font-mono text-emerald-400 bg-[#030712] min-h-[120px] max-h-[220px] overflow-y-auto whitespace-pre-wrap">
              {stdoutOutput ?? (
                <span className="text-zinc-600 italic">
                  Press &ldquo;Run&rdquo; or &ldquo;Validate &amp; Submit&rdquo; to execute code and view output...
                </span>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
