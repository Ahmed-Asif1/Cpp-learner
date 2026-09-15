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
  HelpCircle,
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
  onOpenTutorial?: () => void;
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
  onOpenTutorial,
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0 min-w-0">
          <div
            onClick={() => onTabChange('curriculum')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onTabChange('curriculum');
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0 min-h-[44px] py-1"
          >
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400 font-bold shadow-sm transition-colors group-hover:border-zinc-600 shrink-0">
              <span className="font-mono text-xs tracking-tighter">C++</span>
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-sm tracking-tight text-zinc-100 hidden min-[380px]:block leading-none">
                C++ Odyssey
              </span>
              <span className="text-[10px] font-mono text-zinc-400 hidden min-[540px]:block">Systems Mastery</span>
            </div>
          </div>

          {/* Navigation Links — flat text, bottom-accent active */}
          <nav className="hidden lg:flex items-center gap-0.5" role="tablist">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isNust = item.id === 'nust';
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  className={`relative flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                    isActive
                      ? isNust
                        ? 'text-emerald-400 font-semibold'
                        : 'text-zinc-100 font-semibold'
                      : isNust
                        ? 'text-emerald-400/70 hover:text-emerald-300'
                        : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? (isNust ? 'text-emerald-400' : 'text-zinc-100') : (isNust ? 'text-emerald-500' : 'text-zinc-400')}`} />
                  <span>{item.label}</span>
                  {isNust && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  {isActive && (
                    <span className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${isNust ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section — Cohesive Utility Actions & User Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Utility Actions Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Platform Guide / Tutorial Button */}
            {onOpenTutorial && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenTutorial();
                }}
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 transition-colors active:scale-95 text-xs font-medium cursor-pointer shrink-0"
                title="Platform Guide & Roadmap"
                aria-label="Platform Guide & Roadmap"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="hidden md:inline font-sans">Guide</span>
              </button>
            )}

            {/* Utility Buttons */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenCheatSheet();
              }}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors active:scale-95 cursor-pointer shrink-0"
              title="C++ Cheat Sheet"
              aria-label="C++ Cheat Sheet & Reference"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAchievements();
              }}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors relative active:scale-95 cursor-pointer shrink-0"
              title="Achievements & Rank"
              aria-label="Achievements & Hall of Mastery"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors active:scale-95 cursor-pointer shrink-0"
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              aria-label={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-6 bg-zinc-800 shrink-0" />

          {/* User Cluster: XP Track + Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono tabular-nums text-zinc-300 min-h-[40px] sm:min-h-[44px] rounded-md bg-zinc-900/50 border border-zinc-800/60 shrink-0">
              <span className="font-semibold text-zinc-100">Lvl {level}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-cyan-400 font-semibold">
                {currentXp}{' '}
                <span className="text-zinc-400 font-sans text-[10px] hidden md:inline">
                  / {nextLevelXp} XP
                </span>
                <span className="text-zinc-400 font-sans text-[10px] md:hidden">
                  XP
                </span>
              </span>
              <div className="w-10 md:w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden ml-1">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Username Indicator */}
            {onOpenUsernameModal && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenUsernameModal();
                }}
                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-colors font-mono active:scale-95 shrink-0 cursor-pointer"
                title={username ? `Signed in as ${username}. Click to change.` : 'Enter username to sync progress'}
                aria-label={username ? `User profile: ${username}` : 'Sign In with Username'}
              >
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="hidden min-[480px]:inline truncate max-w-[80px] sm:max-w-[110px] font-sans font-medium text-zinc-200">
                  {username || 'Sign In'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div
        className="flex lg:hidden overflow-x-auto px-4 sm:px-6 py-2 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur gap-1.5 no-scrollbar scroll-smooth"
        role="tablist"
        aria-label="Navigation Tabs"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isNust = item.id === 'nust';
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                soundManager.playClick();
                onTabChange(item.id);
              }}
              className={`min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-md text-xs whitespace-nowrap font-medium transition-colors shrink-0 ${
                isActive
                  ? isNust
                    ? 'bg-zinc-800 text-emerald-400 font-semibold'
                    : 'bg-zinc-800 text-zinc-100 font-semibold'
                  : isNust
                    ? 'text-emerald-400/90 hover:text-emerald-300 hover:bg-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {isNust && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
