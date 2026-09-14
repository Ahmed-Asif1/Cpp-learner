import React, { useEffect } from 'react';
import {
  X,
  Compass,
  Flame,
  Cpu,
  Bug,
  Code2,
  Layers,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { soundManager } from '../../services/soundEffects';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabsGuide: {
    id: NavTab;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge: string;
  }[] = [
    {
      id: 'curriculum',
      title: 'Quests',
      subtitle: 'Structured Curriculum & Checkpoints',
      description: 'The main learning path. Starts from "Module 0: First Steps" (Zero to Running) all the way to advanced memory management, RAII, and custom DSA data structures. Includes runnable code and quizzes.',
      icon: Flame,
      accentColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
      badge: 'Start Here',
    },
    {
      id: 'sandbox',
      title: 'Memory Sandbox',
      subtitle: 'Visual Virtual Machine',
      description: 'Step-by-step visual execution simulator. Inspect Stack frames, Heap allocations, raw hexadecimal addresses, and pointer references as code executes line-by-line.',
      icon: Cpu,
      accentColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60',
      badge: 'Interactive',
    },
    {
      id: 'bughunter',
      title: 'Bug Hunter',
      subtitle: 'Debugging & Memory Defense',
      description: 'Hands-on bug triage challenges. Identify and fix undefined behaviors, buffer overflows, dangling pointers, and memory leaks before they reach production.',
      icon: Bug,
      accentColor: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
      badge: 'Game Mode',
    },
    {
      id: 'exercises',
      title: 'Exercises',
      subtitle: 'Coding Challenges & Kata',
      description: 'Hands-on practice exercises sorted by difficulty. Write C++ implementations directly in the editor and pass automated test assertions.',
      icon: Code2,
      accentColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
      badge: 'Practice',
    },
    {
      id: 'labs',
      title: 'STL & Labs',
      subtitle: 'Deep Dives & Standard Library',
      description: 'In-depth interactive labs on std::vector, smart pointers, RAII patterns, move semantics, and template metaprogramming.',
      icon: Layers,
      accentColor: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
      badge: 'Advanced',
    },
    {
      id: 'nust',
      title: 'SEECS NUST Degree',
      subtitle: 'Academic Scheme of Studies',
      description: 'Official 8-semester BSCS curriculum pathway from NUST SEECS. Discover core C++ courses (CS110, CS212, CS214), prerequisites, and launch lab code directly into the sandbox.',
      icon: GraduationCap,
      accentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
      badge: 'Degree Hub',
    },
  ];

  const handleJump = (tab: NavTab) => {
    soundManager.playClick();
    onSelectTab(tab);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
    >
      <div className="glass-panel border border-zinc-800 w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] rounded-lg relative shadow-2xl bg-zinc-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 id="tutorial-modal-title" className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                Platform Guide & Getting Started
              </h2>
              <p className="text-xs text-zinc-400">
                A quick roadmap to mastering C++ systems programming
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Recommendation Banner */}
          <div className="bg-gradient-to-r from-cyan-950/30 to-zinc-900/60 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-zinc-100 text-sm">Where should you begin?</div>
                <p className="text-zinc-300 leading-relaxed">
                  <strong className="text-cyan-400">Absolute Beginner:</strong> Jump straight to{' '}
                  <button
                    onClick={() => handleJump('curriculum')}
                    className="underline text-cyan-300 hover:text-cyan-200 font-medium cursor-pointer"
                  >
                    Quests &rarr; Module 0 (First Steps)
                  </button>{' '}
                  for line-by-line breakdowns and your first calculator.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  <strong className="text-emerald-400">SEECS NUST Student:</strong> Explore the{' '}
                  <button
                    onClick={() => handleJump('nust')}
                    className="underline text-emerald-300 hover:text-emerald-200 font-medium cursor-pointer"
                  >
                    SEECS NUST Degree tab
                  </button>{' '}
                  to browse course codes (CS110, CS212, CS214) and launch lab starter code into the sandbox.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  <strong className="text-indigo-400">Practicing Pointer Mechanics:</strong> Head to the{' '}
                  <button
                    onClick={() => handleJump('sandbox')}
                    className="underline text-indigo-300 hover:text-indigo-200 font-medium cursor-pointer"
                  >
                    Memory Sandbox
                  </button>{' '}
                  to watch heap allocation and pointer dereferencing live.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Directory Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Navigation Directory
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tabsGuide.map((tab) => {
                const Icon = tab.icon;
                return (
                  <div
                    key={tab.id}
                    className="border border-zinc-800 bg-zinc-900/40 rounded-lg p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md border ${tab.accentColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-zinc-100 block group-hover:text-cyan-300 transition-colors">
                              {tab.title}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono block">
                              {tab.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 bg-zinc-950">
                          {tab.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        {tab.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleJump(tab.id)}
                      className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors pt-1 cursor-pointer"
                    >
                      <span>Open {tab.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Progress automatically saves to your local profile & cloud</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
