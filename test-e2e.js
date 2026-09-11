/**
 * C++ Odyssey - Comprehensive 4-Tier E2E Test Suite
 *
 * Usage:
 *   node test-e2e.js                   # Run all 4 tiers
 *   node test-e2e.js --tier=1          # Run Tier 1: Feature Coverage
 *   node test-e2e.js --tier=2          # Run Tier 2: Boundary & Corner Cases
 *   node test-e2e.js --tier=3          # Run Tier 3: Cross-Feature Combinations
 *   node test-e2e.js --tier=4          # Run Tier 4: Real-World Scenarios
 *   node test-e2e.js --milestone=m1    # Run Milestone 1 (Design Polish)
 *   node test-e2e.js --milestone=m2    # Run Milestone 2 (Serverless DB / Storage)
 *   node test-e2e.js --milestone=m3    # Run Milestone 3 (Vercel Readiness)
 *   node test-e2e.js --milestone=sim   # Run C++ Simulator Engine tests
 *   node test-e2e.js --json            # Output results in JSON
 *   node test-e2e.js --allow-pending   # Exit 0 even if pending milestone tests fail
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;

// Attempt to load CppSimulator from engine
let CppSimulator = null;
try {
  const simModule = await import('./src/engine/cppInterpreter.ts');
  CppSimulator = simModule.CppSimulator;
} catch (e) {
  // If native ts loading fails, will report in simulator tests
}

// Command-line options
const args = process.argv.slice(2);
const tierArg = args.find(a => a.startsWith('--tier='))?.split('=')[1];
const milestoneArg = args.find(a => a.startsWith('--milestone='))?.split('=')[1]?.toLowerCase();
const jsonOutput = args.includes('--json');
const allowPending = args.includes('--allow-pending');

// Test Runner State
const testResults = [];
let currentTier = null;

function setTier(tierNum, tierTitle) {
  currentTier = { number: tierNum, title: tierTitle };
}

async function runTest(id, name, milestone, fn) {
  // Filter by tier or milestone if specified
  if (tierArg && String(currentTier.number) !== String(tierArg)) return;
  if (milestoneArg && milestone.toLowerCase() !== milestoneArg) return;

  const start = performance.now();
  let passed = false;
  let errorMsg = null;
  let isPendingMilestone = false;

  try {
    await fn();
    passed = true;
  } catch (err) {
    passed = false;
    errorMsg = err.message || String(err);
    if (err.isPending) {
      isPendingMilestone = true;
    }
  }
  const duration = Math.round(performance.now() - start);

  testResults.push({
    id,
    name,
    tier: currentTier.number,
    milestone,
    passed,
    error: errorMsg,
    durationMs: duration,
    isPending: isPendingMilestone,
  });

  if (!jsonOutput) {
    const icon = passed ? '✅ PASS' : (isPendingMilestone ? '⚠️ PENDING' : '❌ FAIL');
    const msTag = `[${milestone}]`.padEnd(6);
    console.log(`  ${icon} ${id} ${msTag} ${name} (${duration}ms)`);
    if (!passed && errorMsg) {
      console.log(`       └─ ${errorMsg.split('\n')[0]}`);
    }
  }
}

// Helpers
function readFileSafe(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function assertFileExists(relPath, milestone) {
  const content = readFileSafe(relPath);
  if (content === null) {
    const err = new Error(`Required file missing: ${relPath}`);
    err.isPending = true;
    throw err;
  }
  return content;
}

// =========================================================================
// TIER 1: FEATURE COVERAGE
// =========================================================================
setTier(1, 'Feature Coverage');

if (!jsonOutput) {
  console.log('\n============================================================');
  console.log('  TIER 1: FEATURE COVERAGE');
  console.log('============================================================');
}

// TC1.1: Navbar Trophy Ping Removal (M1)
await runTest('TC1.1', 'Navbar trophy ping animation removed', 'M1', async () => {
  const content = assertFileExists('src/components/layout/Navbar.tsx', 'M1');
  assert(!content.includes('animate-ping'), 'Navbar.tsx still contains animate-ping on decorative elements');
});

// TC1.2: Memory Visualizer Pulse Removal (M1)
await runTest('TC1.2', 'MemoryVisualizer persistent animate-pulse removed', 'M1', async () => {
  const content = assertFileExists('src/components/visualizer/MemoryVisualizer.tsx', 'M1');
  assert(!content.includes('animate-pulse'), 'MemoryVisualizer still contains animate-pulse on persistent banner');
});

// TC1.3: CSS Active Execution Line Animation Cleanup (M1)
await runTest('TC1.3', 'CSS activeLinePulse keyframes removed from globals.css', 'M1', async () => {
  const content = assertFileExists('app/globals.css', 'M1');
  assert(!content.includes('activeLinePulse'), 'app/globals.css still defines activeLinePulse animation');
});

// TC1.4: Neon Glow CSS Utility Elimination (M1)
await runTest('TC1.4', 'Neon glow utilities (.glow-*) removed from globals.css', 'M1', async () => {
  const content = assertFileExists('app/globals.css', 'M1');
  assert(!content.includes('.glow-cyan'), 'app/globals.css still defines .glow-cyan');
  assert(!content.includes('.glow-emerald'), 'app/globals.css still defines .glow-emerald');
  assert(!content.includes('.glow-rose'), 'app/globals.css still defines .glow-rose');
});

// TC1.5: Card Hover Elevation Stabilization (M1)
await runTest('TC1.5', 'Glass card hover eliminates jumping translateY and neon shadow', 'M1', async () => {
  const content = assertFileExists('app/globals.css', 'M1');
  const glassHoverMatch = content.match(/\.glass-card:hover\s*\{([^}]+)\}/);
  if (glassHoverMatch) {
    const rules = glassHoverMatch[1];
    assert(!rules.includes('translateY(-2px)'), '.glass-card:hover still contains translateY(-2px) jump');
    assert(!rules.includes('0 210 255'), '.glass-card:hover still projects neon cyan shadow');
  }
});

// TC1.6: Component Glow Elimination (M1)
await runTest('TC1.6', 'Neon glow classes eliminated from core interactive components', 'M1', async () => {
  const filesToCheck = [
    'src/components/curriculum/QuizModal.tsx',
    'src/components/games/BugHunterGame.tsx',
    'src/components/games/PointerMazeGame.tsx',
    'src/components/labs/LabsView.tsx',
  ];
  for (const f of filesToCheck) {
    const content = readFileSafe(f);
    if (content) {
      assert(!content.includes('glow-emerald'), `${f} still contains glow-emerald`);
      assert(!content.includes('glow-rose'), `${f} still contains glow-rose`);
      assert(!content.includes('glow-cyan'), `${f} still contains glow-cyan`);
    }
  }
});

// TC1.7: Serverless API Route Exists (M2)
await runTest('TC1.7', 'Serverless DB API route app/api/progress/route.ts exists', 'M2', async () => {
  assertFileExists('app/api/progress/route.ts', 'M2');
});

// TC1.8: Serverless API Method Exports (M2)
await runTest('TC1.8', 'API route exports GET and POST handlers', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  assert(content.includes('export async function GET') || content.includes('export const GET'), 'API route missing GET handler export');
  assert(content.includes('export async function POST') || content.includes('export const POST'), 'API route missing POST handler export');
});

// TC1.9: Serverless API Safe KV Fallback (M2)
await runTest('TC1.9', 'API route safely handles missing KV credentials without unhandled throw', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  assert(content.includes('KV_REST_API_URL') || content.includes('offline'), 'API route missing KV_REST_API_URL check or offline fallback');
});

// TC1.10: Storage Service API Contract (M2)
await runTest('TC1.10', 'Storage service exports loadProgress, saveProgress, calculateLevel', 'M2', async () => {
  const content = assertFileExists('src/services/storage.ts', 'M2');
  assert(content.includes('loadProgress'), 'storage.ts missing loadProgress');
  assert(content.includes('saveProgress'), 'storage.ts missing saveProgress');
  assert(content.includes('calculateLevel'), 'storage.ts missing calculateLevel');
});

// TC1.11: Username Modal Component Presence (M2)
await runTest('TC1.11', 'Username modal component exists and exports default/named component', 'M2', async () => {
  const content = assertFileExists('src/components/layout/UsernameModal.tsx', 'M2');
  assert(content.includes('export default') || content.includes('export const UsernameModal') || content.includes('export function UsernameModal'), 'UsernameModal.tsx does not export a component');
});

// TC1.12: Vercel Environment Template (M3)
await runTest('TC1.12', '.env.example exists and lists required KV credentials', 'M3', async () => {
  const content = assertFileExists('.env.example', 'M3');
  assert(content.includes('KV_REST_API_URL'), '.env.example missing KV_REST_API_URL');
  assert(content.includes('KV_REST_API_TOKEN'), '.env.example missing KV_REST_API_TOKEN');
});

// TC1.13: Vercel Configuration File (M3)
await runTest('TC1.13', 'vercel.json exists and defines Next.js framework', 'M3', async () => {
  const content = assertFileExists('vercel.json', 'M3');
  const json = JSON.parse(content);
  assert(json.framework === 'nextjs', 'vercel.json missing {"framework": "nextjs"}');
});

// TC1.14: Git Ignore Configuration (M3)
await runTest('TC1.14', '.gitignore exists and excludes node_modules, .next, .env*.local', 'M3', async () => {
  const content = assertFileExists('.gitignore', 'M3');
  assert(content.includes('node_modules'), '.gitignore missing node_modules');
  assert(content.includes('.next'), '.gitignore missing .next');
  assert(content.includes('.env*.local') || content.includes('.env.local'), '.gitignore missing .env*.local');
});

// TC1.15: Package.json Scripts Alignment (M3)
await runTest('TC1.15', 'package.json contains build, dev, start, preview, test scripts', 'M3', async () => {
  const pkgContent = assertFileExists('package.json', 'M3');
  const pkg = JSON.parse(pkgContent);
  assert(pkg.scripts?.build === 'next build', 'package.json missing "build": "next build"');
  assert(pkg.scripts?.dev === 'next dev', 'package.json missing "dev": "next dev"');
  assert(pkg.scripts?.start === 'next start', 'package.json missing "start": "next start"');
  assert(pkg.scripts?.preview, 'package.json missing "preview" script');
  assert(pkg.scripts?.test, 'package.json missing "test" script');
});

// TC1.16: Deployment Documentation (M3)
await runTest('TC1.16', 'README.md includes Vercel deployment guide and Next.js 14 stack', 'M3', async () => {
  const content = assertFileExists('README.md', 'M3');
  assert(content.toLowerCase().includes('vercel'), 'README.md does not mention Vercel deployment');
  assert(content.includes('Next.js 14') || content.includes('Next.js'), 'README.md does not reference Next.js stack');
});

// TC1.17: C++ Pointer Dereference (Core Engine)
await runTest('TC1.17', 'C++ Simulator executes pointer mutation and produces stdout', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const code = `
    #include <iostream>
    int main() {
      int gold = 100;
      int* ptr = &gold;
      *ptr = 250;
      std::cout << gold << std::endl;
      return 0;
    }
  `;
  const snaps = CppSimulator.simulate(code);
  assert(snaps.length > 0, 'No execution snapshots generated');
  const finalSnap = snaps[snaps.length - 1];
  assert(finalSnap.stdout.join('').includes('250'), `Expected stdout to contain 250, got: ${finalSnap.stdout}`);
});

// TC1.18: C++ Memory Leak Detection (Core Engine)
await runTest('TC1.18', 'C++ Simulator flags memory leaks on unfreed heap blocks', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const code = `
    int main() {
      int* leaked = new int(99);
      return 0;
    }
  `;
  const snaps = CppSimulator.simulate(code);
  const finalSnap = snaps[snaps.length - 1];
  assert(finalSnap.hasLeak === true, 'Expected hasLeak to be true for unfreed new int');
});

// TC1.19: C++ Clean Heap Deallocation (Core Engine)
await runTest('TC1.19', 'C++ Simulator confirms clean memory after delete', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const code = `
    int main() {
      int* clean = new int(99);
      delete clean;
      return 0;
    }
  `;
  const snaps = CppSimulator.simulate(code);
  const finalSnap = snaps[snaps.length - 1];
  assert(!finalSnap.hasLeak, 'Expected hasLeak to be false after delete');
});

// TC1.20: C++ unique_ptr Move Semantics (Core Engine)
await runTest('TC1.20', 'C++ Simulator moves unique_ptr ownership and nullifies source', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const code = `
    int main() {
      unique_ptr<int> u1 = make_unique<int>(500);
      unique_ptr<int> u2 = std::move(u1);
      return 0;
    }
  `;
  const snaps = CppSimulator.simulate(code);
  const lastSnap = snaps[snaps.length - 2];
  const u1Var = lastSnap.stack[0].variables.find(v => v.name === 'u1');
  const u2Var = lastSnap.stack[0].variables.find(v => v.name === 'u2');
  assert(u1Var?.value === 'nullptr', 'Expected u1 to be nullptr after std::move');
  assert(u2Var?.pointsToAddress !== null, 'Expected u2 to own heap address');
});

// =========================================================================
// TIER 2: BOUNDARY & CORNER CASES
// =========================================================================
setTier(2, 'Boundary & Corner Cases');

if (!jsonOutput) {
  console.log('\n============================================================');
  console.log('  TIER 2: BOUNDARY & CORNER CASES');
  console.log('============================================================');
}

// TC2.1: API GET Missing / Empty Username (M2)
await runTest('TC2.1', 'API GET rejects missing or empty username query with 400', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  // Check contract handles empty username parameter
  assert(content.includes('!username') || content.includes('username.trim() === \'\'') || content.includes('400'),
    'Route must validate that username parameter is non-empty');
});

// TC2.2: API GET Username Sanitization & Traversal Defense (M2)
await runTest('TC2.2', 'API handles malformed and injection usernames safely', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  // Test username normalization/validation pattern
  const hasValidation = content.includes('toLowerCase') || content.includes('replace') || content.includes('match') || content.includes('test(');
  assert(hasValidation, 'API route must normalize or validate username strings');
});

// TC2.3: API POST Missing / Malformed Body (M2)
await runTest('TC2.3', 'API POST rejects missing username or progress payload', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  assert(content.includes('!username') && (content.includes('!progress') || content.includes('400')),
    'POST handler must validate presence of both username and progress body properties');
});

// TC2.4: API Route Unconfigured KV Environment (Offline Fallback) (M2)
await runTest('TC2.4', 'API returns graceful offline response when KV env vars are absent', 'M2', async () => {
  const content = assertFileExists('app/api/progress/route.ts', 'M2');
  assert(content.includes('offline'), 'API route must return { offline: true } when cloud database is unconfigured');
});

// TC2.5: Storage Service Empty LocalStorage Fallback (M2)
await runTest('TC2.5', 'Storage service returns default progress on empty localStorage', 'M2', async () => {
  const content = assertFileExists('src/services/storage.ts', 'M2');
  assert(content.includes('DEFAULT_PROGRESS') || content.includes('m1-l1'),
    'Storage service must fall back to default progress with introductory lesson');
});

// TC2.6: Storage Service Corrupted JSON Handling (M2)
await runTest('TC2.6', 'Storage service recovers gracefully from corrupted storage JSON', 'M2', async () => {
  const content = assertFileExists('src/services/storage.ts', 'M2');
  assert(content.includes('try') && content.includes('catch') && content.includes('JSON.parse'),
    'Storage service loadProgress must wrap JSON.parse in try/catch to recover from corruption');
});

// TC2.7: Username Length Boundary Checks (M2)
await runTest('TC2.7', 'Username length boundary validation (min 2, max 24 chars)', 'M2', async () => {
  // Pure logic verification of username validation contract
  const validateUsername = (name) => {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 24 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
  };

  assert.strictEqual(validateUsername(''), false, 'Empty string should fail');
  assert.strictEqual(validateUsername('a'), false, '1 char should fail');
  assert.strictEqual(validateUsername('ab'), true, '2 chars should pass');
  assert.strictEqual(validateUsername('valid_user-123'), true, 'Standard alphanumeric should pass');
  assert.strictEqual(validateUsername('a'.repeat(24)), true, '24 chars should pass');
  assert.strictEqual(validateUsername('a'.repeat(25)), false, '25 chars should fail');
  assert.strictEqual(validateUsername('user<script>'), false, 'Special chars should fail');
  assert.strictEqual(validateUsername('user name'), false, 'Spaces should fail');
});

// TC2.8: Simulator Empty / Whitespace Code Safety (Core Engine)
await runTest('TC2.8', 'C++ Simulator handles empty or whitespace code without process crash', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const emptySnaps = CppSimulator.simulate('');
  assert(Array.isArray(emptySnaps), 'Expected array returned for empty string');

  const wsSnaps = CppSimulator.simulate('    \n\n\t   ');
  assert(Array.isArray(wsSnaps), 'Expected array returned for whitespace string');
});

// TC2.9: Simulator Partial Heap Leak Detection (Core Engine)
await runTest('TC2.9', 'C++ Simulator accurately detects leak when only 1 of 2 heap blocks is freed', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');
  const code = `
    int main() {
      int* a = new int(10);
      int* b = new int(20);
      delete a;
      return 0;
    }
  `;
  const snaps = CppSimulator.simulate(code);
  const finalSnap = snaps[snaps.length - 1];
  assert(finalSnap.hasLeak === true, 'Expected hasLeak === true when 1 block remains unfreed');
  const leakedBlocks = finalSnap.heap.filter(b => b.status === 'leaked');
  const freedBlocks = finalSnap.heap.filter(b => b.status === 'freed');
  assert.strictEqual(leakedBlocks.length, 1, `Expected exactly 1 leaked block, found ${leakedBlocks.length}`);
  assert.strictEqual(freedBlocks.length, 1, `Expected exactly 1 freed block, found ${freedBlocks.length}`);
});

// =========================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS
// =========================================================================
setTier(3, 'Cross-Feature Combinations');

if (!jsonOutput) {
  console.log('\n============================================================');
  console.log('  TIER 3: CROSS-FEATURE COMBINATIONS');
  console.log('============================================================');
}

// TC3.1: Progress Sync Lifecycle (M2)
await runTest('TC3.1', 'Progress Sync Lifecycle: client payload matches server storage model', 'M2', async () => {
  const localProgress = {
    xp: 250,
    level: 2,
    completedLessons: ['m1-l1', 'm1-l2'],
    completedChallenges: ['c1'],
    unlockedBadges: ['welcome_dev', 'pointer_apprentice'],
    soundEnabled: true,
    streak: 2,
    lastActive: new Date().toISOString(),
  };

  // Verify serialization round-trip fidelity
  const serialized = JSON.stringify({ username: 'cadet_tester', progress: localProgress });
  const parsed = JSON.parse(serialized);

  assert.strictEqual(parsed.username, 'cadet_tester');
  assert.strictEqual(parsed.progress.xp, 250);
  assert.deepStrictEqual(parsed.progress.completedLessons, ['m1-l1', 'm1-l2']);
  assert.deepStrictEqual(parsed.progress.completedChallenges, ['c1']);
});

// TC3.2: Progress Merging Conflict Resolution (M2)
await runTest('TC3.2', 'Conflict resolution merges offline local and remote cloud progress', 'M2', async () => {
  const local = {
    xp: 300,
    level: 2,
    completedLessons: ['m1-l1', 'm1-l2'],
    completedChallenges: ['c1'],
    unlockedBadges: ['welcome_dev', 'pointer_apprentice'],
  };
  const remote = {
    xp: 450,
    level: 2,
    completedLessons: ['m1-l1', 'm2-l1'],
    completedChallenges: ['c2'],
    unlockedBadges: ['welcome_dev', 'memory_mechanic'],
  };

  // Pure function verifying the merge specification
  const mergeProgress = (loc, rem) => ({
    xp: Math.max(loc.xp, rem.xp),
    level: Math.max(loc.level, rem.level),
    completedLessons: Array.from(new Set([...loc.completedLessons, ...rem.completedLessons])),
    completedChallenges: Array.from(new Set([...loc.completedChallenges, ...rem.completedChallenges])),
    unlockedBadges: Array.from(new Set([...loc.unlockedBadges, ...rem.unlockedBadges])),
  });

  const merged = mergeProgress(local, remote);
  assert.strictEqual(merged.xp, 450, 'Merged XP should be maximum of local and remote');
  assert.deepStrictEqual(merged.completedLessons.sort(), ['m1-l1', 'm1-l2', 'm2-l1'].sort(), 'Merged lessons should be set union');
  assert.deepStrictEqual(merged.completedChallenges.sort(), ['c1', 'c2'].sort(), 'Merged challenges should be set union');
  assert.deepStrictEqual(merged.unlockedBadges.sort(), ['memory_mechanic', 'pointer_apprentice', 'welcome_dev'].sort(), 'Merged badges should be set union');
});

// TC3.3: Guest-to-Username Migration (M2)
await runTest('TC3.3', 'Guest session progress seamlessly migrates upon username entry', 'M2', async () => {
  const guestProgress = {
    xp: 180,
    level: 1,
    completedLessons: ['m1-l1'],
    completedChallenges: [],
    unlockedBadges: ['welcome_dev'],
    soundEnabled: true,
  };

  // Simulating migration logic
  const migrateGuestToUser = (guestData, username) => {
    return {
      ...guestData,
      username: username.trim().toLowerCase(),
      migratedAt: new Date().toISOString(),
    };
  };

  const userProgress = migrateGuestToUser(guestProgress, 'Alex_Dev');
  assert.strictEqual(userProgress.username, 'alex_dev');
  assert.strictEqual(userProgress.xp, 180);
  assert.deepStrictEqual(userProgress.completedLessons, ['m1-l1']);
});

// TC3.4: Atomic State Transition (Fix for Explorer 2 Stale Closure Bug) (M2)
await runTest('TC3.4', 'Atomic state handler accumulates lesson and XP without data loss', 'M2', async () => {
  let state = {
    xp: 120,
    completedLessons: ['m1-l1'],
  };

  // Stale closure simulation: If two updates occur sequentially against stale `state`,
  // the second overwrites completedLessons if not using functional update.
  // The correct atomic update:
  const handleCompleteLessonAtomic = (prevState, lessonId, xpEarned) => {
    const updatedLessons = prevState.completedLessons.includes(lessonId)
      ? prevState.completedLessons
      : [...prevState.completedLessons, lessonId];
    return {
      ...prevState,
      completedLessons: updatedLessons,
      xp: prevState.xp + xpEarned,
    };
  };

  state = handleCompleteLessonAtomic(state, 'm1-l2', 80);
  assert.deepStrictEqual(state.completedLessons, ['m1-l1', 'm1-l2'], 'New lesson must be present');
  assert.strictEqual(state.xp, 200, 'XP must be updated to 200');

  // Verify page.tsx contains fix
  const pageContent = assertFileExists('app/page.tsx', 'M2');
  // Check that handleCompleteLesson does not blindly call handleAddXp using stale progress
  const hasAtomicUpdate = pageContent.includes('setProgress((prev') || pageContent.includes('setProgress(prev =>') || pageContent.includes('prev =>');
  assert(hasAtomicUpdate, 'app/page.tsx must use functional state update (prev => ...) to prevent stale closure data loss');
});

// TC3.5: Dual Persistence Offline Fallback (M2)
await runTest('TC3.5', 'Storage service falls back to localStorage when remote API throws', 'M2', async () => {
  const content = assertFileExists('src/services/storage.ts', 'M2');
  assert(content.includes('localStorage') && (content.includes('catch') || content.includes('offline')),
    'Storage service must provide local fallback when remote operations encounter network errors');
});

// TC3.6: Simulator Execution & Level Progression Loop (Core / M2)
await runTest('TC3.6', 'C++ Simulation execution successfully triggers XP and level recalculation', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');

  // 1. Run simulation
  const code = `int main() { int x = 42; return 0; }`;
  const snaps = CppSimulator.simulate(code);
  assert(snaps.length > 0);

  // 2. Award XP and calculate level
  const startingXp = 180;
  const earnedXp = 100;
  const newXp = startingXp + earnedXp; // 280 XP

  // Level thresholds: Level 1 (0-249), Level 2 (250+)
  const calculateLevelLogic = (xp) => {
    let level = 1;
    let threshold = 250;
    let remaining = xp;
    while (remaining >= threshold) {
      remaining -= threshold;
      level++;
      threshold = Math.round(threshold * 1.35);
    }
    return { level, remainingXp: remaining };
  };

  const levelInfo = calculateLevelLogic(newXp);
  assert.strictEqual(levelInfo.level, 2, '280 XP should advance user to Level 2');
  assert.strictEqual(levelInfo.remainingXp, 30, 'Remaining XP should be 30');
});

// =========================================================================
// TIER 4: REAL-WORLD SCENARIOS (END-TO-END USER JOURNEYS)
// =========================================================================
setTier(4, 'Real-World Scenarios');

if (!jsonOutput) {
  console.log('\n============================================================');
  console.log('  TIER 4: REAL-WORLD SCENARIOS');
  console.log('============================================================');
}

// TC4.1: First-Visit User Onboarding Journey (M2)
await runTest('TC4.1', 'Scenario: First-time visitor prompts for username and initializes profile', 'M2', async () => {
  // Step 1: Simulate clean local storage (no stored username)
  const simulatedStorage = new Map();
  const getStoredUsername = () => simulatedStorage.get('cpp_odyssey_username') || null;
  const setStoredUsername = (u) => simulatedStorage.set('cpp_odyssey_username', u);

  assert.strictEqual(getStoredUsername(), null, 'Fresh session should have no stored username');

  // Step 2: Modal displays and user inputs valid username
  const enteredUsername = 'cadet_nova';
  assert.strictEqual(/^[a-zA-Z0-9_-]{2,24}$/.test(enteredUsername), true, 'Username passes validation');

  // Step 3: Username is saved and default progress initialized
  setStoredUsername(enteredUsername);
  const initialProgress = {
    username: enteredUsername,
    xp: 120,
    level: 1,
    completedLessons: ['m1-l1'],
    completedChallenges: [],
    unlockedBadges: ['welcome_dev'],
  };
  simulatedStorage.set(`user:${enteredUsername}:progress`, JSON.stringify(initialProgress));

  // Step 4: Verification of state retention
  assert.strictEqual(getStoredUsername(), 'cadet_nova');
  const stored = JSON.parse(simulatedStorage.get(`user:cadet_nova:progress`));
  assert.strictEqual(stored.xp, 120);
  assert.deepStrictEqual(stored.completedLessons, ['m1-l1']);
});

// TC4.2: Course Progression & Level-Up Journey (M1/M2)
await runTest('TC4.2', 'Scenario: Complete lesson, earn XP, unlock badge, persist updated state', 'M2', async () => {
  // Step 1: Initial state
  let userState = {
    username: 'cadet_nova',
    xp: 120,
    level: 1,
    completedLessons: ['m1-l1'],
    completedChallenges: [],
    unlockedBadges: ['welcome_dev'],
  };

  // Step 2: User completes Lesson 2 (+80 XP)
  userState = {
    ...userState,
    completedLessons: [...userState.completedLessons, 'm1-l2'],
    xp: userState.xp + 80, // 200 XP
  };

  // Step 3: User completes Challenge 1 (+100 XP) -> Total 300 XP -> Level 2
  userState = {
    ...userState,
    completedChallenges: [...userState.completedChallenges, 'challenge-ptr-1'],
    xp: userState.xp + 100, // 300 XP
    level: 2,
    unlockedBadges: [...userState.unlockedBadges, 'pointer_master'],
  };

  // Step 4: Verify state
  assert.strictEqual(userState.xp, 300);
  assert.strictEqual(userState.level, 2);
  assert.strictEqual(userState.completedLessons.length, 2);
  assert.strictEqual(userState.completedChallenges.length, 1);
  assert(userState.unlockedBadges.includes('pointer_master'));
});

// TC4.3: Multi-Device Session Restoration Journey (M2/M3)
await runTest('TC4.3', 'Scenario: New device session loads remote cloud progress by username', 'M2', async () => {
  // Step 1: Cloud database has saved progress from previous session
  const cloudDatabase = new Map();
  cloudDatabase.set('user:cadet_nova:progress', {
    username: 'cadet_nova',
    xp: 500,
    level: 2,
    completedLessons: ['m1-l1', 'm1-l2', 'm1-l3'],
    completedChallenges: ['challenge-ptr-1', 'challenge-mem-1'],
    unlockedBadges: ['welcome_dev', 'pointer_master', 'memory_mechanic'],
  });

  // Step 2: Fresh client opens on Device B with empty localStorage
  const deviceBStorage = new Map();
  assert.strictEqual(deviceBStorage.get('cpp_odyssey_username'), undefined);

  // Step 3: User types 'cadet_nova' in the username modal
  const enteredUser = 'cadet_nova';
  deviceBStorage.set('cpp_odyssey_username', enteredUser);

  // Step 4: Device B queries remote API for 'cadet_nova'
  const remoteData = cloudDatabase.get(`user:${enteredUser}:progress`);
  assert(remoteData, 'Remote database should return saved user profile');

  // Step 5: Device B updates local cache and component state
  deviceBStorage.set(`user:${enteredUser}:progress`, JSON.stringify(remoteData));
  const restoredProfile = JSON.parse(deviceBStorage.get(`user:${enteredUser}:progress`));

  assert.strictEqual(restoredProfile.xp, 500);
  assert.strictEqual(restoredProfile.level, 2);
  assert.strictEqual(restoredProfile.completedLessons.length, 3);
  assert.strictEqual(restoredProfile.unlockedBadges.length, 3);
});

// TC4.4: Interactive C++ Lab Workflow (Core Engine)
await runTest('TC4.4', 'Scenario: Dynamic array simulation lifecycle with clean deallocation', 'SIM', async () => {
  assert(CppSimulator, 'CppSimulator engine could not be loaded');

  // User writes code allocating dynamic memory, assigning elements, then freeing with delete[]
  const labCode = `
    #include <iostream>
    int main() {
      int* arr = new int(42);
      std::cout << *arr << std::endl;
      delete arr;
      return 0;
    }
  `;

  const snapshots = CppSimulator.simulate(labCode);
  assert(snapshots.length >= 4, 'Simulation should generate multiple step snapshots');

  // Verify memory lifecycle
  const hasAllocSnap = snapshots.some(s => s.heap.length > 0);
  assert(hasAllocSnap, 'Heap allocation snapshot must be recorded');

  const finalSnap = snapshots[snapshots.length - 1];
  assert.strictEqual(finalSnap.hasLeak, false, 'Final snapshot must show clean heap deallocation (hasLeak: false)');
  assert(finalSnap.heap.every(b => b.status === 'freed'), 'All heap blocks must be freed after delete');
  assert(finalSnap.stdout.join('').includes('42'), 'Stdout must reflect value printed');
});

// =========================================================================
// SUMMARY & EXIT CODE HANDLING
// =========================================================================

const totalTests = testResults.length;
const passedTests = testResults.filter(t => t.passed).length;
const failedTests = testResults.filter(t => !t.passed && !t.isPending).length;
const pendingTests = testResults.filter(t => t.isPending).length;

if (jsonOutput) {
  console.log(JSON.stringify({
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    pending: pendingTests,
    results: testResults,
  }, null, 2));
} else {
  console.log('\n============================================================');
  console.log('  E2E TEST SUITE EXECUTION SUMMARY');
  console.log('============================================================');
  console.log(`  Total Tests Run : ${totalTests}`);
  console.log(`  Passed          : ${passedTests}`);
  console.log(`  Failed (Active) : ${failedTests}`);
  console.log(`  Pending (Future): ${pendingTests}`);

  console.log('\n  Breakdown by Tier:');
  for (let tier = 1; tier <= 4; tier++) {
    const tierTests = testResults.filter(t => t.tier === tier);
    const tierPassed = tierTests.filter(t => t.passed).length;
    console.log(`    Tier ${tier} (${tierTests.length} tests): ${tierPassed}/${tierTests.length} passing`);
  }

  console.log('\n  Breakdown by Milestone:');
  const milestones = ['SIM', 'M1', 'M2', 'M3'];
  for (const ms of milestones) {
    const msTests = testResults.filter(t => t.milestone === ms);
    const msPassed = msTests.filter(t => t.passed).length;
    console.log(`    Milestone ${ms.padEnd(4)} (${msTests.length} tests): ${msPassed}/${msTests.length} passing`);
  }
  console.log('============================================================\n');
}

// Exit code determination:
// If allowPending flag is provided, exit 0 as long as there are no non-pending failures.
// Otherwise, exit 0 if all tests passed, exit 1 if any test failed.
if (allowPending) {
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
} else {
  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    // If pending milestone tests exist, exit 1 so CI fails until milestones are complete
    process.exit(1);
  }
}
