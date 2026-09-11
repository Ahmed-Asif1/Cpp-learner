import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { VisualizerView } from './components/visualizer/VisualizerView';
import { BugHunterGame } from './components/games/BugHunterGame';
import { ExercisesView } from './components/exercises/ExercisesView';
import { LabsView } from './components/labs/LabsView';
import { CheatSheetModal } from './components/layout/CheatSheetModal';
import { AchievementsModal } from './components/layout/AchievementsModal';
import { calculateLevel, loadProgress, saveProgress } from './services/storage';
import { UserProgress } from './types';
import { soundManager } from './services/soundEffects';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [activeTab, setActiveTab] = useState<NavTab>('curriculum');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [sandboxPresetCode, setSandboxPresetCode] = useState<string | null>(null);

  // Sync sound manager with loaded setting
  useEffect(() => {
    soundManager.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  const levelInfo = calculateLevel(progress.xp);

  // Handle XP gain and leveling
  const handleAddXp = (amount: number, newBadgeId?: string) => {
    const oldLevel = levelInfo.level;
    const newXp = progress.xp + amount;
    const newLevelInfo = calculateLevel(newXp);

    let updatedBadges = [...progress.unlockedBadges];
    if (newBadgeId && !updatedBadges.includes(newBadgeId)) {
      updatedBadges.push(newBadgeId);
    }

    if (newLevelInfo.level > oldLevel) {
      soundManager.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }

    const updated: UserProgress = {
      ...progress,
      xp: newXp,
      level: newLevelInfo.level,
      unlockedBadges: updatedBadges,
      lastActive: new Date().toISOString(),
    };

    setProgress(updated);
    saveProgress(updated);
  };

  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const updatedLessons = [...progress.completedLessons, lessonId];
      const updated: UserProgress = {
        ...progress,
        completedLessons: updatedLessons,
      };
      setProgress(updated);
      saveProgress(updated);
    }
    handleAddXp(xpEarned);
  };

  const handleSolveChallenge = (challengeId: string, xpEarned: number) => {
    if (!progress.completedChallenges.includes(challengeId)) {
      const updated = {
        ...progress,
        completedChallenges: [...progress.completedChallenges, challengeId],
      };
      setProgress(updated);
      saveProgress(updated);
    }
    handleAddXp(xpEarned, 'zero_leak');
  };

  const handleToggleSound = () => {
    const newSound = !progress.soundEnabled;
    soundManager.setMuted(!newSound);
    const updated = { ...progress, soundEnabled: newSound };
    setProgress(updated);
    saveProgress(updated);
  };

  const handleOpenInSandbox = (code: string) => {
    setSandboxPresetCode(code);
    setActiveTab('sandbox');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        level={levelInfo.level}
        levelTitle={levelInfo.title}
        currentXp={levelInfo.currentXp}
        nextLevelXp={levelInfo.nextLevelXp}
        totalXp={progress.xp}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'curriculum' && (
          <CurriculumView
            completedLessonIds={progress.completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onOpenInSandbox={handleOpenInSandbox}
          />
        )}

        {activeTab === 'sandbox' && (
          <VisualizerView onXpGain={(amt) => handleAddXp(amt)} />
        )}

        {activeTab === 'bughunter' && (
          <BugHunterGame
            completedChallengeIds={progress.completedChallenges}
            onSolveChallenge={handleSolveChallenge}
          />
        )}

        {activeTab === 'exercises' && (
          <ExercisesView
            completedExerciseIds={progress.completedExercises || []}
            onSolveExercise={(id, xp) => handleAddXp(xp, 'pointer_master')}
            onOpenInSandbox={(code) => {
              setSandboxPresetCode(code);
              setActiveTab('sandbox');
            }}
          />
        )}

        {activeTab === 'labs' && <LabsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>C++ Odyssey • The Interactive Silicon Journey</span>
          </div>
          <div>
            ISO C++20 Standard • Zero-Cost Abstractions • Client-Side Simulation
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isCheatSheetOpen && (
        <CheatSheetModal onClose={() => setIsCheatSheetOpen(false)} />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          unlockedBadgeIds={progress.unlockedBadges}
          level={levelInfo.level}
          title={levelInfo.title}
          totalXp={progress.xp}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}
    </div>
  );
};
