import React from 'react';
import {
  Code2,
  Cpu,
  Compass,
  Bug,
  Layers,
  Trophy,
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Zap,
  GraduationCap,
  User,
} from 'lucide-react';
import { soundManager } from '../../services/soundEffects';

export type NavTab = 'curriculum' | 'sandbox' | 'bughunter' | 'exercises' | 'labs' | 'nust';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  totalXp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
  onOpenCheatSheet: () => void;
  username?: string | null;
  onOpenUsernameModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  level,
  levelTitle,
  currentXp,
  nextLevelXp,
  totalXp,
  soundEnabled,
  onToggleSound,
  onOpenAchievements,
  onOpenCheatSheet,
  username,
  onOpenUsernameModal,
}) => {
  const xpPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  const navItems = [
    { id: 'curriculum', label: 'Quests', icon: Flame },
    { id: 'sandbox', label: 'Memory Sandbox', icon: Cpu },
    { id: 'bughunter', label: 'Bug Hunter', icon: Bug },
    { id: 'exercises', label: 'Exercises', icon: Code2 },
    { id: 'labs', label: 'STL & Labs', icon: Layers },
    { id: 'nust', label: 'SEECS NUST Degree', icon: GraduationCap },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onTabChange('curriculum')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-mono text-sm tracking-tighter">C++</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                C++ Odyssey
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Interactive Silicon Mastery</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action & Progression Bar */}
        <div className="flex items-center gap-3">
          {/* Level & XP progression indicator */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-white">Lvl {level}</span>
              <span className="text-slate-400 text-[11px] truncate max-w-[130px] font-sans">
                {levelTitle}
              </span>
              <span className="text-amber-400 font-bold">
                {currentXp} / {nextLevelXp} XP
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-36 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Cheat Sheet Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCheatSheet();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
            title="C++ Cheat Sheet"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Trophy / Hall of Fame */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition relative"
            title="Achievements & Rank"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Username Indicator */}
          {onOpenUsernameModal && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenUsernameModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 hover:border-slate-700 transition font-mono"
              title={username ? `Signed in as ${username}. Click to change.` : 'Enter username to sync progress'}
            >
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px] font-sans">
                {username || 'Sign In'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950/80 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                onTabChange(item.id);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
