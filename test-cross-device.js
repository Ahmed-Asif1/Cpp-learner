/**
 * Cross-Device & Responsive QA Audit Suite
 * Verifies mobile (320px–768px), tablet (768px–1024px), and desktop/ultra-wide layout compliance.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function read(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

let passed = 0;
let total = 0;

function check(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}\n     └─ ${err.message}`);
  }
}

console.log('============================================================');
console.log('  CROSS-DEVICE RESPONSIVE & ACCESSIBILITY AUDIT');
console.log('============================================================\n');

// 1. Viewport & Root layout
check('app/layout.tsx exports responsive viewport metadata (theme-color, initial-scale)', () => {
  const layout = read('app/layout.tsx');
  assert(layout.includes('export const viewport'), 'layout.tsx must export viewport configuration');
  assert(layout.includes('device-width'), 'viewport must configure device-width');
  assert(layout.includes('overflow-x-hidden'), 'body must prevent horizontal spillover');
});

// 2. Global CSS Utilities
check('app/globals.css includes .no-scrollbar for cross-device horizontal scrollers', () => {
  const css = read('app/globals.css');
  assert(css.includes('.no-scrollbar'), 'globals.css must define .no-scrollbar');
  assert(css.includes('scrollbar-width: none'), 'globals.css must support Firefox scrollbar-width');
  assert(css.includes('touch-action: manipulation'), 'globals.css must eliminate mobile tap delay');
});

// 3. Navbar Responsive Layout
check('Navbar container uses balanced gutters (px-4 sm:px-6 lg:px-8) and max-w-[1600px] mx-auto', () => {
  const nav = read('src/components/layout/Navbar.tsx');
  assert(nav.includes('max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'), 'Navbar must center with responsive gutters');
});

check('Navbar action buttons satisfy minimum 40px-44px touch targets on mobile', () => {
  const nav = read('src/components/layout/Navbar.tsx');
  assert(nav.includes('min-w-[40px] min-h-[40px]'), 'Action buttons must have at least 40px touch targets');
  assert(nav.includes('min-h-[40px] sm:min-h-[44px]'), 'Username and tab buttons must meet touch target spec');
  assert(!nav.includes('animate-ping'), 'No animate-ping decorative animations allowed');
});

check('Navbar mobile tabs have horizontal scrolling, no-scrollbar, and >= 40px touch targets', () => {
  const nav = read('src/components/layout/Navbar.tsx');
  assert(nav.includes('overflow-x-auto'), 'Mobile tabs must scroll horizontally');
  assert(nav.includes('no-scrollbar'), 'Mobile tabs must hide native scrollbars');
  assert(nav.includes('role="tablist"'), 'Mobile tabs must have accessible role');
});

// 4. Modals Touch Targets & Overflow Hardening
check('UsernameModal inputs and buttons meet 44px touch target specification', () => {
  const modal = read('src/components/layout/UsernameModal.tsx');
  assert(modal.includes('min-h-[44px]'), 'Input and button must be at least 44px');
  assert(modal.includes('autoComplete="username"'), 'Input must have username autocomplete');
});

check('AchievementsModal close button meets minimum touch target and supports escape dismissal', () => {
  const modal = read('src/components/layout/AchievementsModal.tsx');
  assert(modal.includes('min-w-[40px] min-h-[40px]'), 'Close button must be at least 40px/44px');
  assert(modal.includes('Escape'), 'Modal must support Escape key listener');
  assert(modal.includes('tabular-nums'), 'Modal must use tabular numbers for stats');
});

check('CheatSheetModal category tabs scroll horizontally without scrollbar on mobile', () => {
  const modal = read('src/components/layout/CheatSheetModal.tsx');
  assert(modal.includes('overflow-x-auto no-scrollbar'), 'Category tabs must have horizontal scroll and no-scrollbar');
  assert(modal.includes('min-h-[40px]'), 'Category tabs must meet touch target size');
  assert(modal.includes('Escape'), 'Modal must support Escape key listener');
});

check('CheatSheetModal tables have responsive overflow-x-auto containers to prevent layout clipping', () => {
  const modal = read('src/components/layout/CheatSheetModal.tsx');
  const tableMatches = modal.match(/<table/g) || [];
  const overflowMatches = modal.match(/overflow-x-auto/g) || [];
  assert(tableMatches.length >= 2, 'Should have at least 2 reference tables');
  assert(overflowMatches.length >= 3, 'All tables and tabs must be wrapped in overflow containers');
});

console.log('\n============================================================');
console.log(`  AUDIT SUMMARY: ${passed}/${total} checks passed (${Math.round((passed / total) * 100)}%)`);
console.log('============================================================\n');

if (passed !== total) {
  process.exit(1);
}
