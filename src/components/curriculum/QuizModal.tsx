import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';

interface QuizModalProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onClose: () => void;
  onComplete: (totalXp: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  questions,
  lessonTitle,
  onClose,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    soundManager.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      soundManager.playSuccess();
      setScore((s) => s + 1);
    } else {
      soundManager.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalEarnedXp = questions.reduce((acc, q) => acc + q.xpReward, 0);
      onComplete(totalEarnedXp);
      soundManager.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel border border-slate-700 w-full max-w-xl p-6 rounded-2xl relative shadow-md bg-[#0e1424]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                  Checkpoint Quiz • Question {currentIndex + 1} of {questions.length}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{lessonTitle}</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{currentQ.xpReward} XP
              </span>
            </div>

            {/* Question Prompt */}
            <div className="mb-5">
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {currentQ.prompt}
              </p>
              {currentQ.codeSnippet && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((opt, idx) => {
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
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-medium flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <span>{opt.text}</span>
                      {isAnswered && (selectedOption === idx || opt.isCorrect) && (
                        <p className="text-[11px] mt-1 text-slate-400 font-normal leading-normal">
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

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-sm"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Knowledge Verified!</h3>
            <p className="text-xs text-slate-400 mb-6">
              You scored {score} of {questions.length} questions correctly.
            </p>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 max-w-xs mx-auto mb-6 flex items-center justify-around">
              <div>
                <div className="text-xs text-slate-400">XP Earned</div>
                <div className="text-lg font-bold text-amber-400">
                  +{questions.reduce((a, b) => a + b.xpReward, 0)} XP
                </div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <div className="text-xs text-slate-400">Status</div>
                <div className="text-lg font-bold text-emerald-400">Mastered</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs transition hover:brightness-110 shadow-sm"
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
