import React, { useState } from 'react';
import { BUG_CHALLENGES } from '../../data/curriculumData';
import { BugChallenge } from '../../types';
import { ShieldAlert, CheckCircle2, XCircle, Sparkles, Bug, ArrowRight, Code2, AlertTriangle, Lightbulb, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';

interface BugHunterGameProps {
  completedChallengeIds: string[];
  onSolveChallenge: (challengeId: string, xpEarned: number) => void;
}

export const BugHunterGame: React.FC<BugHunterGameProps> = ({
  completedChallengeIds,
  onSolveChallenge,
}) => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const challenge = BUG_CHALLENGES[activeChallengeIndex];
  const isCompleted = completedChallengeIds.includes(challenge.id);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    soundManager.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = challenge.options[idx].isCorrect;
    if (isCorrect) {
      soundManager.playSuccess();
      onSolveChallenge(challenge.id, challenge.xp);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundManager.playError();
    }
  };

  const handleNext = () => {
    if (activeChallengeIndex < BUG_CHALLENGES.length - 1) {
      setActiveChallengeIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handlePrev = () => {
    if (activeChallengeIndex > 0) {
      setActiveChallengeIndex((i) => i - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Fatal':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/50';
      case 'Undefined Behavior':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/50';
      case 'Memory Leak':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/50';
      default:
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            <span>Bug Hunter Protocol: C++ Diagnostic Arena</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze real-world buggy C++ code, diagnose undefined behavior, dangling pointers, and memory leaks before they reach production.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Solved: {completedChallengeIds.length} / {BUG_CHALLENGES.length}</span>
          </div>

          <div className="flex items-center gap-1">
            {BUG_CHALLENGES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveChallengeIndex(idx);
                  setSelectedOption(null);
                  setIsAnswered(false);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center border ${
                  idx === activeChallengeIndex
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : completedChallengeIds.includes(c.id)
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The Buggy Code snippet */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
            {/* Snippet Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getSeverityBadge(challenge.severity)}`}>
                  {challenge.severity}
                </span>
                <span className="text-xs font-bold text-white">{challenge.title}</span>
              </div>
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{challenge.xp} XP
              </span>
            </div>

            {/* Code Box */}
            <div className="relative p-4 font-mono text-xs overflow-x-auto leading-6 text-slate-200">
              <pre>
                {challenge.code.split('\n').map((line, idx) => {
                  const isBugLine = idx + 1 === challenge.bugLine;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center px-2 rounded ${
                        isBugLine && isAnswered
                          ? 'bg-rose-950/50 border border-rose-500/60 text-rose-200'
                          : ''
                      }`}
                    >
                      <span className="w-8 select-none text-slate-600 text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          <div className="glass-panel p-4 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3 bg-slate-900/40">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Diagnostic Objective:</span>
              {challenge.description}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Multiple Choice & Fix */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Root Cause Diagnosis
            </h3>

            <div className="space-y-2.5">
              {challenge.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900/80 border-slate-750 hover:border-slate-600 text-slate-300';
                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-white mb-0.5">{opt.text}</div>
                      {isAnswered && (selectedOption === idx || opt.isCorrect) && (
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && selectedOption === idx && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* When Answered: Reveal Modern C++ Fix */}
            {isAnswered && (
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="glass-panel p-4 border border-emerald-500/30 bg-emerald-950/20 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Idiomatic Modern C++ Solution</span>
                  </div>
                  <pre className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-emerald-500/20">
                    <code>{challenge.fixedCode}</code>
                  </pre>
                </div>

                <div className="glass-panel p-3.5 border border-cyan-500/20 bg-cyan-950/10 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300 block mb-0.5">Architectural Insight:</span>
                    {challenge.deepDive}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handlePrev}
                    disabled={activeChallengeIndex === 0}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={activeChallengeIndex === BUG_CHALLENGES.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition disabled:opacity-30"
                  >
                    <span>Next Bug</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
