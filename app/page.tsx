'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTab } from '../src/components/layout/Navbar';
import { CurriculumView } from '../src/components/curriculum/CurriculumView';
import { VisualizerView } from '../src/components/visualizer/VisualizerView';
import { BugHunterGame } from '../src/components/games/BugHunterGame';
import { ExercisesView } from '../src/components/exercises/ExercisesView';
import { LabsView } from '../src/components/labs/LabsView';
import { NustCurriculumView } from '../src/components/nust/NustCurriculumView';
import { CheatSheetModal } from '../src/components/layout/CheatSheetModal';
import { AchievementsModal } from '../src/components/layout/AchievementsModal';
import { UsernameModal } from '../src/components/layout/UsernameModal';
import { calculateLevel, loadProgress, saveProgress, loadProgressFromDB, saveProgressToDB, DEFAULT_PROGRESS } from '../src/services/storage';
import { UserProgress } from '../src/types';
import { soundManager } from '../src/services/soundEffects';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [activeTab, setActiveTab] = useState<NavTab>('nust');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [sandboxPresetCode, setSandboxPresetCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false);

  // On mount: load stored progress safely after hydration to eliminate SSR mismatches
  useEffect(() => {
    setMounted(true);
    const localProgress = loadProgress();
    setProgress(localProgress);

    const stored = localStorage.getItem('cpp_odyssey_username');
    if (stored) {
      setUsername(stored);
      // Load progress from DB and merge (DB wins)
      loadProgressFromDB(stored).then((dbProgress) => {
        if (dbProgress) {
          setProgress(dbProgress);
          saveProgress(dbProgress);
        }
      });
    } else {
      setShowUsernameModal(true);
    }
  }, []);

  // Handle username submission from modal
  const handleUsernameSet = useCallback(async (name: string) => {
    setUsername(name);
    setShowUsernameModal(false);
    // Try to load existing progress from DB; merge if found
    const dbProgress = await loadProgressFromDB(name);
    if (dbProgress) {
      setProgress(dbProgress);
      saveProgress(dbProgress);
    }
  }, []);

  // Sync sound manager with loaded setting
  useEffect(() => {
    soundManager.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  const levelInfo = calculateLevel(progress.xp);

  // Helper: save locally + fire-and-forget to DB
  const persistProgress = (updated: UserProgress) => {
    saveProgress(updated);
    if (username) {
      saveProgressToDB(username, updated); // fire-and-forget
    }
  };

  // Handle XP gain and leveling
  const handleAddXp = useCallback((amount: number, newBadgeId?: string) => {
    setProgress((prev) => {
      const oldLevel = calculateLevel(prev.xp).level;
      const newXp = prev.xp + amount;
      const newLevelInfo = calculateLevel(newXp);

      let updatedBadges = [...prev.unlockedBadges];
      if (newBadgeId && !updatedBadges.includes(newBadgeId)) {
        updatedBadges.push(newBadgeId);
      }

      if (newLevelInfo.level > oldLevel) {
        soundManager.playLevelUp();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {
          // confetti fallback
        }
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevelInfo.level,
        unlockedBadges: updatedBadges,
        lastActive: new Date().toISOString(),
      };

      persistProgress(updated);
      return updated;
    });
  }, [persistProgress]);

  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const updatedLessons = alreadyCompleted
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];
      const newXp = prev.xp + xpEarned;
      const newLevelInfo = calculateLevel(newXp);
      const oldLevel = calculateLevel(prev.xp).level;

      if (newLevelInfo.level > oldLevel) {
        soundManager.playLevelUp();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }

      const updated: UserProgress = {
        ...prev,
        completedLessons: updatedLessons,
        xp: newXp,
        level: newLevelInfo.level,
        lastActive: new Date().toISOString(),
      };
      persistProgress(updated);
      return updated;
    });
  };

  const handleSolveChallenge = (challengeId: string, xpEarned: number) => {
    setProgress((prev) => {
      const alreadySolved = prev.completedChallenges.includes(challengeId);
      const updatedChallenges = alreadySolved
        ? prev.completedChallenges
        : [...prev.completedChallenges, challengeId];
      const newXp = prev.xp + xpEarned;
      const newLevelInfo = calculateLevel(newXp);
      const oldLevel = calculateLevel(prev.xp).level;

      let updatedBadges = [...prev.unlockedBadges];
      if (!updatedBadges.includes('zero_leak')) {
        updatedBadges.push('zero_leak');
      }

      if (newLevelInfo.level > oldLevel) {
        soundManager.playLevelUp();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }

      const updated: UserProgress = {
        ...prev,
        completedChallenges: updatedChallenges,
        xp: newXp,
        level: newLevelInfo.level,
        unlockedBadges: updatedBadges,
        lastActive: new Date().toISOString(),
      };
      persistProgress(updated);
      return updated;
    });
  };

  const handleSolveExercise = (exerciseId: string, xpEarned: number) => {
    setProgress((prev) => {
      const currentCompleted = prev.completedExercises || [];
      const alreadySolved = currentCompleted.includes(exerciseId);
      const updatedExercises = alreadySolved
        ? currentCompleted
        : [...currentCompleted, exerciseId];
      const newXp = prev.xp + xpEarned;
      const newLevelInfo = calculateLevel(newXp);
      const oldLevel = calculateLevel(prev.xp).level;

      let updatedBadges = [...prev.unlockedBadges];
      if (!updatedBadges.includes('pointer_master')) {
        updatedBadges.push('pointer_master');
      }

      if (newLevelInfo.level > oldLevel) {
        soundManager.playLevelUp();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }

      const updated: UserProgress = {
        ...prev,
        completedExercises: updatedExercises,
        xp: newXp,
        level: newLevelInfo.level,
        unlockedBadges: updatedBadges,
        lastActive: new Date().toISOString(),
      };
      persistProgress(updated);
      return updated;
    });
  };

  const handleToggleSound = () => {
    setProgress((prev) => {
      const newSound = !prev.soundEnabled;
      soundManager.setMuted(!newSound);
      const updated = { ...prev, soundEnabled: newSound };
      persistProgress(updated);
      return updated;
    });
  };

  const handleOpenInSandbox = (code: string) => {
    setSandboxPresetCode(code);
    setActiveTab('sandbox');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
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
        username={mounted ? username : null}
        onOpenUsernameModal={() => setShowUsernameModal(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'nust' && (
          <NustCurriculumView onOpenInSandbox={handleOpenInSandbox} />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            completedLessonIds={progress.completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onOpenInSandbox={handleOpenInSandbox}
            completedExerciseIds={progress.completedExercises || []}
            onSolveExercise={handleSolveExercise}
            onNavigateToExercises={() => setActiveTab('exercises')}
          />
        )}

        {activeTab === 'sandbox' && (
          <VisualizerView
            onXpGain={(amt) => handleAddXp(amt)}
            initialCode={sandboxPresetCode || undefined}
          />
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
            onSolveExercise={handleSolveExercise}
            onOpenInSandbox={handleOpenInSandbox}
          />
        )}

        {activeTab === 'labs' && (
          <LabsView />
        )}
      </main>

      {/* Modals */}
      {isCheatSheetOpen && (
        <CheatSheetModal onClose={() => setIsCheatSheetOpen(false)} />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          unlockedBadgeIds={progress.unlockedBadges}
          totalXp={progress.xp}
          level={levelInfo.level}
          title={levelInfo.title}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {showUsernameModal && (
        <UsernameModal onUsernameSet={handleUsernameSet} />
      )}
    </div>
  );
}
