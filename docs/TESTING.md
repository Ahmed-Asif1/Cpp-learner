# 🧪 Testing & Verification Guide

This document outlines the testing architecture, methodology, and execution instructions for **C++ Odyssey**.

---

## 1. Overview & Testing Philosophy

The test infrastructure for **C++ Odyssey** provides end-to-end, opaque-box validation across all core subsystems:
1. **Design System & Styling**: Verification of clean developer aesthetics, elimination of non-critical animations, and consistent slate/zinc UI boundaries.
2. **Persistence & Sync**: Serverless database endpoints (`app/api/progress/route.ts`), dual-persistence client service (`src/services/storage.ts`), and offline `localStorage` fallback.
3. **Deployment Readiness**: Next.js 14 App Router configuration (`vercel.json`, `.env.example`, `.gitignore`, and package scripts).
4. **C++ Simulation Engine**: Accurate virtual memory execution (pointer dereferencing, stack/heap boundaries, memory leak detection, and `unique_ptr` move semantics).

The test suite adheres to a **4-Tier Test Case Design Methodology**, ensuring coverage from unit-level contracts up to full user journeys.

---

## 2. 4-Tier Test Architecture

```text
+-------------------------------------------------------------------------+
|                      TIER 4: REAL-WORLD SCENARIOS                       |
|   First-Visit Journey | Course Progress Journey | Multi-Device Recovery |
|                        Interactive C++ Lab Flow                         |
+-------------------------------------------------------------------------+
|                  TIER 3: CROSS-FEATURE COMBINATIONS                     |
|  Sync Lifecycle | Conflict Merging | Guest-to-User | Atomic State Update |
|               Dual Persistence Fallback | Simulator XP Loop             |
+-------------------------------------------------------------------------+
|                  TIER 2: BOUNDARY & CORNER CASES                        |
|  Empty/Missing Username | Malformed Payloads | Missing KV Offline Mode   |
|   Corrupted LocalStorage | Name Length Bounds | Simulator Error Safety  |
+-------------------------------------------------------------------------+
|                    TIER 1: FEATURE COVERAGE                             |
|    Design System Checks | Serverless API Contracts | Storage Contracts   |
|         Vercel Deployment Files | Virtual C++ Simulator Engine          |
+-------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage
Validates the happy path and structural contracts for all features, configuration files, and API endpoints.

### Tier 2: Boundary & Corner Cases
Tests system behavior under edge conditions, invalid inputs, missing configurations, and corrupted data (e.g., username length boundaries, empty inputs, network offline fallbacks).

### Tier 3: Cross-Feature Combinations
Tests interaction between multiple subsystems:
- Client state transitions ↔ Remote API synchronization.
- Conflict resolution when local progress diverges from cloud progress.
- Anonymous guest data migration upon entering a username.
- Atomic state updates preventing race-condition data loss.

### Tier 4: Real-World Scenarios
Simulates complete multi-step user workflows:
- First-time onboarding &rarr; completing lessons &rarr; gaining XP &rarr; restoring session on another device.

---

## 3. Test Execution Guide

### Running All Test Suites
```bash
# Run the complete test suite (E2E, C++ Simulator, Cross-Device Audit)
npm run test:all
```

### Running the Core Simulator Engine
```bash
npm test
```

### Running Specific Tiers
```bash
# Run Tier 1 (Feature Coverage) only
node test-e2e.js --tier=1

# Run Tier 2 (Boundary & Corner Cases) only
node test-e2e.js --tier=2

# Run Tier 3 (Cross-Feature Combinations) only
node test-e2e.js --tier=3

# Run Tier 4 (Real-World Scenarios) only
node test-e2e.js --tier=4
```

### Running Cross-Device Responsive Audits
```bash
node test-cross-device.js
```

---

## 4. Continuous Integration (CI)

All pull requests and commits to `main` run through automated GitHub Actions (`.github/workflows/ci.yml`):
- `npx tsc --noEmit` (TypeScript strict check)
- `node test-e2e.js` (39 E2E test cases)
- `node --experimental-strip-types test-simulator.js` (C++ simulator engine validation)
- `node test-cross-device.js` (responsive & accessibility audit)
- `npm run build` (Next.js 14 production build)
