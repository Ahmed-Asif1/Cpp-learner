import React, { useState, useEffect, useRef } from 'react';
import { CppSimulator } from '../../engine/cppInterpreter';
import { ExecutionSnapshot } from '../../types';
import { MemoryVisualizer } from './MemoryVisualizer';
import { CodeEditor, CODE_PRESETS } from './CodeEditor';
import { ConsoleOutput } from './ConsoleOutput';
import { soundManager } from '../../services/soundEffects';

interface VisualizerViewProps {
  onXpGain?: (amount: number) => void;
  initialCode?: string;
}

export const VisualizerView: React.FC<VisualizerViewProps> = ({ onXpGain, initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || CODE_PRESETS[0].code);
  const [snapshots, setSnapshots] = useState<ExecutionSnapshot[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(800);
  const [lastDuration, setLastDuration] = useState<number>(6);
  const [hasRunDirectly, setHasRunDirectly] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Compile / simulate whenever code changes or user clicks reset
  const recompute = (newCode: string) => {
    const snaps = CppSimulator.simulate(newCode);
    setSnapshots(snaps);
    setCurrentStep(0);
    setIsRunning(false);
    setHasRunDirectly(false);
  };

  useEffect(() => {
    const codeToRun = initialCode || code;
    setCode(codeToRun);
    recompute(codeToRun);
  }, [initialCode]);

  // Handle auto-playing steps
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < snapshots.length - 1) {
            const nextIdx = prev + 1;
            const snap = snapshots[nextIdx];
            if (snap.sourceLine.includes('new')) soundManager.playAlloc();
            else if (snap.sourceLine.includes('delete')) soundManager.playDealloc();
            else if (snap.sourceLine.includes('&') || snap.sourceLine.includes('*')) soundManager.playPointerHop();
            else if (snap.hasLeak || snap.isError) soundManager.playError();
            return nextIdx;
          } else {
            setIsRunning(false);
            clearInterval(timerRef.current);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, snapshots, speed]);

  // Run Program to Completion (Instant Execution)
  const handleRunAll = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const result = CppSimulator.runProgram(code);
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = Math.max(1, Math.round(t1 - t0));

    setLastDuration(duration);
    setHasRunDirectly(true);
    setSnapshots(result.allSnapshots);
    setCurrentStep(result.allSnapshots.length - 1);

    if (result.isError) {
      soundManager.playError();
    } else {
      soundManager.playSuccess();
      if (onXpGain) onXpGain(15);
    }
  };

  const handleStep = () => {
    if (currentStep < snapshots.length - 1) {
      const nextIdx = currentStep + 1;
      const snap = snapshots[nextIdx];
      if (snap.sourceLine.includes('new')) soundManager.playAlloc();
      else if (snap.sourceLine.includes('delete')) soundManager.playDealloc();
      else if (snap.sourceLine.includes('&') || snap.sourceLine.includes('*')) soundManager.playPointerHop();
      else if (snap.hasLeak || snap.isError) soundManager.playError();
      setCurrentStep(nextIdx);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentStep(0);
    setHasRunDirectly(false);
  };

  const handleSelectPreset = (presetCode: string) => {
    setCode(presetCode);
    recompute(presetCode);
  };

  const currentSnapshot = snapshots[currentStep] || {
    lineIndex: 0,
    sourceLine: '',
    explanation: 'Ready.',
    stack: [],
    heap: [],
    stdout: [],
  };

  const displayStdout = hasRunDirectly && snapshots.length > 0
    ? snapshots[snapshots.length - 1].stdout
    : currentSnapshot.stdout;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] p-2 sm:p-4 max-w-[1600px] mx-auto gap-4">
      {/* Visualizer Header banner */}
      <div className="flex flex-wrap items-center justify-between pb-1 gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">⚡</span> Live C++ Memory & Execution Sandbox
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute C++ programs directly or step through instructions line-by-line to inspect physical stack frames, heap allocations, and pointer addresses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <span>Step {currentStep + 1} of {Math.max(1, snapshots.length)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">{currentSnapshot.stack[0]?.variables.length || 0} Stack Vars</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-semibold">{currentSnapshot.heap.length} Heap Blocks</span>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Code Editor & Console Output */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-0">
          <div className="flex-1 min-h-[300px]">
            <CodeEditor
              code={code}
              onChange={(newCode) => {
                setCode(newCode);
                recompute(newCode);
              }}
              currentLineIndex={currentSnapshot.lineIndex}
              isRunning={isRunning}
              onRunAll={handleRunAll}
              onPlay={() => setIsRunning(true)}
              onPause={() => setIsRunning(false)}
              onStep={handleStep}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          <div className="h-48 min-h-[160px]">
            <ConsoleOutput
              output={displayStdout}
              onClear={() => {
                soundManager.playClick();
                recompute(code);
              }}
              isError={currentSnapshot.isError}
              errorMessage={currentSnapshot.errorMessage}
              hasLeak={currentSnapshot.hasLeak}
              exitCode={currentSnapshot.isError ? 139 : 0}
              durationMs={lastDuration}
            />
          </div>
        </div>

        {/* Right Column: Visual Memory Model (Stack + Heap + Explanations) */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <MemoryVisualizer
              stack={currentSnapshot.stack}
              heap={currentSnapshot.heap}
              hasLeak={currentSnapshot.hasLeak}
              explanation={currentSnapshot.explanation}
              isError={currentSnapshot.isError}
              errorMessage={currentSnapshot.errorMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
