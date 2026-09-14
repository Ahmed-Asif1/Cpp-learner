import React, { useState, useMemo, useCallback } from 'react';
import { CURRICULUM_MODULES } from '../../data/curriculumData';
import { Lesson, Module, CodeExampleItem } from '../../types';
import { QuizModal } from './QuizModal';
import { CppSimulator } from '../../engine/cppInterpreter';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Flame,
  HelpCircle,
  Lightbulb,
  Play,
  Shield,
  Sparkles,
  Zap,
  Boxes,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Search,
  Check,
  Copy,
  RotateCcw,
  CheckCircle,
  Menu,
  X,
  AlertCircle,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';
import { CODING_EXERCISES } from '../../data/exercisesData';

interface CurriculumViewProps {
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onOpenInSandbox: (code: string) => void;
  completedExerciseIds?: string[];
  onSolveExercise?: (exerciseId: string, xpReward: number) => void;
  onNavigateToExercises?: () => void;
}

// Inline runnable code block with instant terminal output
const InteractiveCodeBlock: React.FC<{
  title?: string;
  description?: string;
  code: string;
  explanation?: string;
  onOpenInSandbox: (code: string) => void;
}> = ({ title, description, code, explanation, onOpenInSandbox }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    soundManager.playClick();
    setTimeout(() => {
      const result = CppSimulator.runProgram(code);
      setOutput(result.stdout || '// Program completed successfully with no stdout.');
      setIsRunning(false);
      soundManager.playSuccess();
    }, 40);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-sm">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-zinc-800 bg-zinc-900/70 gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-200 font-semibold truncate">
          <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{title || 'Code Example'}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Green Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            title="Execute code directly and display output"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Running…' : 'Run Code »'}</span>
          </button>

          {/* Open in Sandbox */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenInSandbox(code);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-xs font-mono transition-colors border border-zinc-700"
            title="Open in Full C++ Memory Visualizer"
          >
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">Sandbox</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {description && (
        <div className="px-3 sm:px-4 py-2 bg-zinc-900/40 text-xs text-zinc-300 border-b border-zinc-800/80">
          {description}
        </div>
      )}

      {/* Code Area */}
      <pre className="p-3 sm:p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto selection:bg-cyan-500/30 bg-zinc-950">
        <code>{code}</code>
      </pre>

      {/* Output Pane */}
      {output !== null && (
        <div className="border-t border-zinc-800 bg-[#030712] p-3 sm:p-3.5">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Terminal className="w-3 h-3" /> Standard Output (stdout):
            </span>
            <button
              onClick={() => setOutput(null)}
              className="hover:text-zinc-200 text-zinc-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Close Output
            </button>
          </div>
          <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
            {output}
          </pre>
        </div>
      )}

      {explanation && (
        <div className="px-3 sm:px-4 py-2 bg-zinc-900/60 border-t border-zinc-800 text-[11px] text-zinc-400">
          <strong className="text-cyan-400 font-mono">Architecture Note: </strong>
          {explanation}
        </div>
      )}
    </div>
  );
};

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  completedLessonIds,
  onCompleteLesson,
  onOpenInSandbox,
  completedExerciseIds = [],
  onSolveExercise,
  onNavigateToExercises,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(CURRICULUM_MODULES[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(CURRICULUM_MODULES[0].lessons[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Flatten all lessons across all modules for search & sequential navigation
  const allLessons = useMemo(() => {
    return CURRICULUM_MODULES.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleTitle: m.title, parentModuleId: m.id }))
    );
  }, []);

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.moduleTitle.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.content?.hook?.toLowerCase().includes(q) ||
        l.content?.mentalModel?.toLowerCase().includes(q) ||
        l.badgeId?.toLowerCase().includes(q)
    );
  }, [allLessons, searchQuery]);

  const activeModule = useMemo(() => {
    return CURRICULUM_MODULES.find((m) => m.id === activeModuleId) || CURRICULUM_MODULES[0];
  }, [activeModuleId]);

  const activeLesson = useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) || activeModule.lessons[0];
  }, [allLessons, activeLessonId, activeModule]);

  const currentOverallIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentOverallIndex > 0 ? allLessons[currentOverallIndex - 1] : null;
  const nextLesson = currentOverallIndex < allLessons.length - 1 ? allLessons[currentOverallIndex + 1] : null;

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  // In-Quest Interactive Coding Exercise Logic
  const lessonExercise = useMemo(() => {
    return CODING_EXERCISES.find((ex) => ex.lessonId === activeLesson.id);
  }, [activeLesson.id]);

  const [exerciseCodeMap, setExerciseCodeMap] = useState<Record<string, string>>({});
  const [exerciseOutput, setExerciseOutput] = useState<string | null>(null);
  const [exerciseValidation, setExerciseValidation] = useState<{
    tested: boolean;
    passed: boolean;
    message: string;
  } | null>(null);
  const [showExerciseHint, setShowExerciseHint] = useState<boolean>(false);
  const [showExerciseSolution, setShowExerciseSolution] = useState<boolean>(false);

  const currentExerciseCode = lessonExercise
    ? exerciseCodeMap[lessonExercise.id] ?? lessonExercise.starterCode
    : '';

  const isExerciseCompleted = lessonExercise
    ? completedExerciseIds.includes(lessonExercise.id)
    : false;

  const handleExerciseCodeChange = useCallback((code: string) => {
    if (!lessonExercise) return;
    setExerciseCodeMap((prev) => ({ ...prev, [lessonExercise.id]: code }));
    if (exerciseValidation) setExerciseValidation(null);
  }, [lessonExercise, exerciseValidation]);

  const handleResetExerciseCode = useCallback(() => {
    if (!lessonExercise) return;
    soundManager.playClick();
    setExerciseCodeMap((prev) => ({ ...prev, [lessonExercise.id]: lessonExercise.starterCode }));
    setExerciseOutput(null);
    setExerciseValidation(null);
  }, [lessonExercise]);

  const handleRunExercise = useCallback(() => {
    if (!lessonExercise) return;
    soundManager.playClick();
    try {
      const result = CppSimulator.runProgram(currentExerciseCode);
      if (result.isError) {
        setExerciseOutput(`Simulator Error: ${result.errorMessage || 'Execution failed'}`);
      } else {
        const out = result.stdout.length > 0 ? result.stdout : '[No standard output produced]';
        setExerciseOutput(out);
      }
      setExerciseValidation(null);
    } catch (err: any) {
      setExerciseOutput(`Runtime Error: ${err?.message || 'Execution fault'}`);
    }
  }, [lessonExercise, currentExerciseCode]);

  const handleValidateExercise = useCallback(() => {
    if (!lessonExercise) return;
    soundManager.playClick();
    try {
      const result = CppSimulator.runProgram(currentExerciseCode);
      if (result.isError) {
        setExerciseOutput(`Simulator Error: ${result.errorMessage || 'Execution failed'}`);
        setExerciseValidation({
          tested: true,
          passed: false,
          message: `Simulator Runtime Error: ${result.errorMessage || 'Execution failure'}`,
        });
        soundManager.playError();
        return;
      }

      const actual = result.stdout.trim();
      const expected = lessonExercise.expectedOutput.trim();

      const out = result.stdout.length > 0 ? result.stdout : '[No output generated]\n';
      setExerciseOutput(out);

      if (actual === expected) {
        setExerciseValidation({
          tested: true,
          passed: true,
          message: 'Output verified! Test assertions satisfied.',
        });
        soundManager.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        if (!isExerciseCompleted && onSolveExercise) {
          onSolveExercise(lessonExercise.id, lessonExercise.xpReward);
        }
      } else {
        soundManager.playError();
        setExerciseValidation({
          tested: true,
          passed: false,
          message: `Output mismatch. Expected:\n"${expected}"\n\nReceived:\n"${actual}"`,
        });
      }
    } catch (err: any) {
      setExerciseOutput(`Simulator Error: ${err?.message}`);
      setExerciseValidation({
        tested: true,
        passed: false,
        message: `Execution failed: ${err?.message}`,
      });
    }
  }, [lessonExercise, currentExerciseCode, isExerciseCompleted, onSolveExercise]);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Shield': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Boxes': return <Boxes className="w-4 h-4 text-pink-400" />;
      default: return <BookOpen className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleSelectLesson = useCallback((lessonId: string, modId?: string) => {
    soundManager.playClick();
    setActiveLessonId(lessonId);
    if (modId) setActiveModuleId(modId);
    setMobileDrawerOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6 min-h-[calc(100vh-80px)]">
      {/* 1. TOP MODULE NAVIGATION BAR */}
      <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-1.5 sm:p-2 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-1.5 min-w-max">
          {CURRICULUM_MODULES.map((mod, idx) => {
            const isActive = mod.id === activeModuleId;
            const completedCount = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const isAllDone = completedCount === mod.lessons.length;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveModuleId(mod.id);
                  setActiveLessonId(mod.lessons[0].id);
                  setSearchQuery('');
                  setMobileDrawerOpen(false);
                }}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-md text-xs font-semibold transition-colors border ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                {getModuleIcon(mod.iconName)}
                <span>
                  {idx + 1}. {mod.title.split(':')[0]}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 tabular-nums">
                  {completedCount}/{mod.lessons.length}
                </span>
                {isAllDone && <CheckCircle className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE DRAWER TRIGGER (Visible only on mobile / small screens) */}
      <div className="md:hidden flex items-center justify-between p-3 bg-zinc-900/90 border border-zinc-800 rounded-md">
        <div className="flex items-center gap-2 truncate pr-2">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs text-zinc-200 font-semibold truncate">{activeLesson.title}</span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-cyan-300 shrink-0 font-medium transition-colors"
        >
          {mobileDrawerOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>{mobileDrawerOpen ? 'Close' : 'Browse'}</span>
        </button>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + LECTURE CONTENT */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDEBAR: Search & Lecture List (Hidden on mobile unless toggled) */}
        <div className={`w-full md:w-80 shrink-0 space-y-4 ${mobileDrawerOpen ? 'block' : 'hidden md:block'}`}>
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures (e.g. pointers, classes)..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results OR Current Module Lesson Tree */}
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950/70">
            <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-zinc-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                {searchQuery ? `Search Results (${filteredLessons.length})` : `${activeModule.title.split(':')[0]} Lectures`}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                {searchQuery ? 'Global Search' : `${activeModule.lessons.length} Lectures`}
              </span>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {(searchQuery ? filteredLessons : activeModule.lessons).map((lesson, idx) => {
                const isSelected = lesson.id === activeLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson.id, (lesson as any).parentModuleId || activeModuleId)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between border ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-700 text-cyan-300 font-semibold shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-zinc-800/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0 tabular-nums">{idx + 1}.</span>
                      <span className="truncate">{lesson.title}</span>
                    </div>

                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 tabular-nums">
                        +{lesson.xpReward} XP
                      </span>
                    )}
                  </button>
                );
              })}

              {searchQuery && filteredLessons.length === 0 && (
                <div className="text-center py-6 text-xs text-zinc-500">
                  No lectures found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: MAIN LECTURE VIEW */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-cyan-400 font-semibold">{activeModule.title.split(':')[0]}</span>
            <span>/</span>
            <span className="text-zinc-200 truncate">{activeLesson.title}</span>
          </div>

          {/* Lesson Header Banner */}
          <div className="p-4 sm:p-5 border border-zinc-800 rounded-lg relative overflow-hidden bg-zinc-900/60">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {activeModule.title}
              </span>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" /> {activeLesson.durationMinutes} min
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
                  <Sparkles className="w-3.5 h-3.5" /> +{activeLesson.xpReward} XP
                </span>
                {isCurrentCompleted && (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-1 leading-snug tracking-tight">{activeLesson.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-400">{activeLesson.subtitle}</p>
          </div>

          {/* Engineering Context & Mental Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 border border-cyan-500/20 bg-cyan-950/10 rounded-lg flex gap-3.5">
              <Flame className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 tracking-tight">Systems Context</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeLesson.content.hook}</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 border border-purple-500/20 bg-purple-950/10 rounded-lg flex gap-3.5">
              <Lightbulb className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 tracking-tight">Memory Architecture Model</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeLesson.content.mentalModel}</p>
              </div>
            </div>
          </div>

          {/* Core Concept Explanation */}
          <div className="p-4 sm:p-5 border border-zinc-800 rounded-lg space-y-4 bg-zinc-950/60">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-cyan-400 flex items-center gap-2 tracking-tight">
              <BookOpen className="w-4 h-4" /> Core Concepts & Specifications
            </h3>

            <div className="space-y-3">
              {activeLesson.content.explanation.map((para, idx) => (
                <p key={`${activeLesson.id}-explanation-${idx}`} className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Primary Interactive Code Example */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Code Example</span>
              </h3>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">Instant in-browser execution</span>
            </div>

            <InteractiveCodeBlock
              title={`${activeLesson.title} - Implementation`}
              code={activeLesson.content.codeExample}
              onOpenInSandbox={onOpenInSandbox}
            />
          </div>

          {/* Multiple Practical Examples (if present) */}
          {activeLesson.content.examples && activeLesson.content.examples.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Additional Production Patterns & Use Cases</span>
              </h3>

              <div className="space-y-4">
                {activeLesson.content.examples.map((ex, idx) => (
                  <InteractiveCodeBlock
                    key={`${activeLesson.id}-example-${idx}-${ex.title || 'code'}`}
                    title={ex.title}
                    description={ex.description}
                    code={ex.code}
                    explanation={ex.explanation}
                    onOpenInSandbox={onOpenInSandbox}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Deep Dive Callout */}
          {activeLesson.content.deepDive && (
            <div className="p-4 sm:p-5 border border-amber-500/30 bg-amber-950/15 rounded-lg flex gap-3.5">
              <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 tracking-tight">
                  {activeLesson.content.deepDive.title}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeLesson.content.deepDive.content}
                </p>
              </div>
            </div>
          )}

          {/* Hands-on Interactive Coding Exercise in Quest */}
          {lessonExercise && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-sm space-y-0">
              <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        Lesson Coding Exercise
                      </span>
                      <span className="text-[10px] text-zinc-500">•</span>
                      <span className={`text-[10px] font-semibold ${
                        lessonExercise.difficulty === 'Beginner'
                          ? 'text-emerald-400'
                          : lessonExercise.difficulty === 'Intermediate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {lessonExercise.difficulty}
                      </span>
                      {isExerciseCompleted && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                          <Check className="w-2.5 h-2.5" /> Solved
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 mt-0.5 tracking-tight">
                      {lessonExercise.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold tabular-nums">
                    +{lessonExercise.xpReward} XP
                  </span>
                  {onNavigateToExercises && (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onNavigateToExercises();
                      }}
                      className="text-xs text-zinc-400 hover:text-cyan-400 flex items-center gap-1 pl-1 transition-colors"
                    >
                      <span className="hidden sm:inline">All Exercises</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {lessonExercise.description}
                </p>

                {/* Requirements list */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                    Exercise Requirements:
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {lessonExercise.instructions.map((inst, idx) => (
                      <li key={`${lessonExercise.id}-instruction-${idx}`} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 tabular-nums">
                          {idx + 1}
                        </span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Editor with action bar */}
                <div className="rounded-lg border border-zinc-800 overflow-hidden bg-[#030712]">
                  <div className="flex flex-wrap items-center justify-between p-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>exercise_solution.cpp</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetExerciseCode}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                        title="Reset code"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onOpenInSandbox(currentExerciseCode)}
                        className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-colors border border-zinc-700"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>Sandbox</span>
                      </button>
                      <button
                        onClick={handleRunExercise}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium flex items-center gap-1 transition-colors border border-zinc-700"
                      >
                        <Play className="w-3 h-3 text-cyan-400" />
                        <span>Run</span>
                      </button>
                      <button
                        onClick={handleValidateExercise}
                        className="px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>Validate Test</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={currentExerciseCode}
                    onChange={(e) => handleExerciseCodeChange(e.target.value)}
                    spellCheck={false}
                    className="w-full h-44 p-3 bg-transparent font-mono text-xs text-emerald-300 leading-relaxed resize-none focus:outline-none selection:bg-cyan-500/30"
                  />
                </div>

                {/* Validation Status */}
                {exerciseValidation && (
                  <div
                    className={`p-3 rounded-md border text-xs font-mono ${
                      exerciseValidation.passed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {exerciseValidation.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold">
                          {exerciseValidation.passed ? 'Assertion Passed!' : 'Assertion Mismatch'}
                        </span>
                        <pre className="mt-1 whitespace-pre-wrap leading-relaxed opacity-90 text-[11px]">
                          {exerciseValidation.message}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Output console */}
                {exerciseOutput !== null && (
                  <div className="rounded-md border border-zinc-800 bg-[#030712] p-3 text-xs">
                    <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1 flex items-center justify-between">
                      <span>Standard Output:</span>
                      <button
                        onClick={() => setExerciseOutput(null)}
                        className="text-zinc-500 hover:text-zinc-300 font-normal"
                      >
                        Clear
                      </button>
                    </div>
                    <pre className="font-mono text-emerald-300 whitespace-pre-wrap text-xs">
                      {exerciseOutput}
                    </pre>
                  </div>
                )}

                {/* Hint & Solution */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowExerciseHint(!showExerciseHint);
                    }}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showExerciseHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                  <span className="text-zinc-700">•</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowExerciseSolution(!showExerciseSolution);
                    }}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showExerciseSolution ? 'Hide Solution' : 'View Solution'}</span>
                  </button>
                </div>

                {showExerciseHint && (
                  <div className="p-3 rounded-md bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                    <strong className="font-semibold block mb-0.5">Hint:</strong>
                    {lessonExercise.hint}
                  </div>
                )}

                {showExerciseSolution && lessonExercise.solutionCode && (
                  <div className="space-y-1.5 p-3 rounded-md bg-zinc-900 border border-zinc-800">
                    <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                      Reference Solution:
                    </div>
                    <pre className="p-2.5 rounded-md bg-[#030712] font-mono text-xs text-cyan-300 overflow-x-auto">
                      <code>{lessonExercise.solutionCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkpoint Quiz Callout */}
          <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border border-zinc-800 rounded-lg gap-4 bg-zinc-900/60">
            <div>
              <h4 className="text-sm font-bold text-zinc-100 tracking-tight">Technical Checkpoint Quiz</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Test your conceptual understanding to earn <span className="tabular-nums">+{activeLesson.xpReward} XP</span>.
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsQuizOpen(true);
              }}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isCurrentCompleted ? 'Retake Checkpoint Quiz' : 'Start Checkpoint Quiz'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. PREVIOUS / NEXT LECTURE NAVIGATION */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 gap-4">
            {prevLesson ? (
              <button
                onClick={() => handleSelectLesson(prevLesson.id, prevLesson.parentModuleId)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-zinc-500 uppercase">Previous</div>
                  <div className="truncate max-w-[150px]">{prevLesson.title}</div>
                </div>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <button
                onClick={() => handleSelectLesson(nextLesson.id, nextLesson.parentModuleId)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-cyan-400/70 uppercase">Next Lecture</div>
                  <div className="truncate max-w-[150px]">{nextLesson.title}</div>
                </div>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {isQuizOpen && (
        <QuizModal
          questions={activeLesson.quiz}
          lessonTitle={activeLesson.title}
          onClose={() => setIsQuizOpen(false)}
          onComplete={(xpEarned) => {
            onCompleteLesson(activeLesson.id, xpEarned);
          }}
        />
      )}
    </div>
  );
};
