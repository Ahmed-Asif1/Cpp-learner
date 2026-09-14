import React, { useEffect } from 'react';
import { X, Trophy, Sparkles, ShieldCheck, Compass, Sword, Zap, TrendingUp, Lock } from 'lucide-react';
import { BADGES } from '../../data/curriculumData';

interface AchievementsModalProps {
  unlockedBadgeIds: string[];
  level: number;
  title: string;
  totalXp: number;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedBadgeIds,
  level,
  title,
  totalXp,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Sword': return <Sword className="w-5 h-5 text-purple-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
    >
      <div className="glass-panel border border-zinc-800 w-full max-w-xl max-h-[88vh] sm:max-h-[85vh] rounded-lg relative shadow-md bg-zinc-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
            <h2 id="achievements-modal-title" className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">
              Developer Hall of Mastery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors active:scale-95"
            aria-label="Close Hall of Mastery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-cyan-950/30 to-zinc-900/40 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold tracking-wider">Current Standing</div>
            <div className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight tabular-nums">{title} (Level {level})</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] font-mono text-zinc-400">Total Experience</div>
            <div className="text-sm sm:text-base font-bold text-amber-400 font-mono tabular-nums">{totalXp} XP</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-2 tabular-nums">
            Earned Badges ({unlockedBadgeIds.length} / {BADGES.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3 sm:p-3.5 rounded-md border transition-all flex items-start gap-3 ${
                    isUnlocked
                      ? 'bg-zinc-900/80 border-cyan-500/30 text-zinc-200'
                      : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 opacity-70'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-zinc-800 border-cyan-500/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}>
                    {isUnlocked ? getBadgeIcon(badge.icon) : <Lock className="w-4 h-4 text-zinc-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-zinc-100 truncate flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isUnlocked && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
