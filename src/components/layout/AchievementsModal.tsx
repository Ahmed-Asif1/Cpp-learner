import React from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel border border-slate-700 w-full max-w-xl max-h-[85vh] rounded-2xl relative shadow-md bg-[#0e1424] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Developer Hall of Mastery</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">Current Standing</div>
            <div className="text-base font-bold text-white">{title} (Level {level})</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Total Experience</div>
            <div className="text-base font-bold text-amber-400 font-mono">{totalXp} XP</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
            Earned Badges ({unlockedBadgeIds.length} / {BADGES.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-cyan-500/40 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-slate-800 border-cyan-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}>
                    {isUnlocked ? getBadgeIcon(badge.icon) : <Lock className="w-4 h-4 text-slate-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isUnlocked && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
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
