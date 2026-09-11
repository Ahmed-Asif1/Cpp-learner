# TEST INFRASTRUCTURE & SUITE SPECIFICATION
# C++ Odyssey Finishing Work

**Document Version**: 1.0.0  
**Target Environment**: Node.js v20+ / Next.js 14 App Router  
**Runner Command**: `node test-e2e.js`  
**Test Suite Path**: `test-e2e.js`  
**Author**: E2E Test Writer Agent (`teamwork_preview_test_writer_1`)  
**Date**: 2026-09-11  

---

## 1. Overview & Testing Philosophy

The test infrastructure for **C++ Odyssey** provides end-to-end, opaque-box validation of all finishing requirements defined in `ORIGINAL_REQUEST.md` and `PROJECT.md`:
1. **Design Polish (M1)**: Elimination of flashy/tacky UI elements (neon glows, `animate-ping`, pulse animations on non-critical elements, garish gradients, and jumping card transforms).
2. **Username-Based Progress Tracking (M2)**: Serverless database persistence (`app/api/progress/route.ts`), dual-persistence client service (`src/services/storage.ts`), first-load username prompt modal (`UsernameModal.tsx`), and atomic state transitions.
3. **Vercel Deployment Readiness (M3)**: Zero-config deployment assets (`vercel.json`, `.env.example`, `.gitignore`, modernized `package.json` scripts, and Vercel documentation in `README.md`).
4. **C++ Simulation Engine (Core)**: Correct execution of pointer mutation, memory allocation/leak detection, clean heap deallocation, and `unique_ptr` move semantics.

The test suite follows the **4-Tier Test Case Design Methodology**, ensuring coverage from unit-level interface contracts to end-to-end user journeys.

---

## 2. 4-Tier Test Architecture

```
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
|  Design Polish (Glow/Ping/Pulse/Gradients) | Serverless API Contracts   |
|     Storage Contracts | Vercel Deployment Files | Simulator Engine      |
+-------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage
Validates the happy path and structural contracts for all features across Milestones M1, M2, M3, and the C++ engine.
- Every function, API route, configuration file, and UI style requirement has an explicit test case.

### Tier 2: Boundary & Corner Cases
Tests system behavior under edge conditions, invalid inputs, missing configurations, and corrupted data.
- Exercises empty strings, boundary lengths, malformed payloads, unconfigured cloud credentials, and offline modes.

### Tier 3: Cross-Feature Combinations
Tests the interaction between multiple subsystems:
- Client state transitions ↔ Remote API synchronization.
- Conflict resolution when local progress diverges from cloud progress.
- Anonymous guest data migration to authenticated username.
- React atomic state updates preventing race condition data loss.

### Tier 4: Real-World Scenarios
Tests complete multi-step user workflows simulating real human usage:
- Onboarding on first visit -> completing lessons -> saving state -> reloading in a fresh session -> verifying complete state retention.

---

## 3. Test Catalog

### Tier 1: Feature Coverage (20 Test Cases)

| ID | Category | Milestone | Description | Expected Output / Contract |
|---|---|---|---|---|
| **TC1.1** | Design | M1 | Navbar Trophy ping removal | `src/components/layout/Navbar.tsx` contains no `animate-ping` |
| **TC1.2** | Design | M1 | Memory Visualizer pulse removal | `src/components/visualizer/MemoryVisualizer.tsx` contains no `animate-pulse` |
| **TC1.3** | Design | M1 | CSS execution line animation cleanup | `app/globals.css` contains no `activeLinePulse` keyframes |
| **TC1.4** | Design | M1 | Neon glow CSS utility elimination | `app/globals.css` contains no `.glow-cyan`, `.glow-emerald`, `.glow-rose` |
| **TC1.5** | Design | M1 | Card hover elevation stabilization | `app/globals.css` `.glass-card:hover` has no `translateY(-2px)` or neon shadow |
| **TC1.6** | Design | M1 | Component glow class elimination | Zero occurrences of `.glow-*` across `QuizModal`, `BugHunterGame`, `PointerMazeGame`, `LabsView` |
| **TC1.7** | DB/API | M2 | Serverless API route presence | `app/api/progress/route.ts` exists |
| **TC1.8** | DB/API | M2 | Serverless API method exports | `app/api/progress/route.ts` exports `GET` and `POST` handlers |
| **TC1.9** | DB/API | M2 | Serverless API safe env handling | `route.ts` conditionally checks `KV_REST_API_URL` without throwing |
| **TC1.10** | Storage | M2 | Storage Service contract | `src/services/storage.ts` exports `loadProgress`, `saveProgress`, and username helpers |
| **TC1.11** | UI/Modal | M2 | Username Modal component presence | `src/components/layout/UsernameModal.tsx` exists and exports component |
| **TC1.12** | Vercel | M3 | Environment template presence | `.env.example` exists and includes `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL` |
| **TC1.13** | Vercel | M3 | Vercel configuration file | `vercel.json` exists, valid JSON, defines `{"framework": "nextjs"}` |
| **TC1.14** | Vercel | M3 | Git ignore configuration | `.gitignore` exists and excludes `node_modules`, `.next`, `.env*.local` |
| **TC1.15** | Vercel | M3 | Package.json scripts alignment | `package.json` contains `build`, `dev`, `start`, `preview`, `test` |
| **TC1.16** | Vercel | M3 | Deployment documentation | `README.md` contains Vercel deployment guide and references Next.js 14 |
| **TC1.17** | Engine | Core | C++ Pointer dereference | `*ptr = 250` outputs stdout containing `250` |
| **TC1.18** | Engine | Core | C++ Memory leak detection | `new int(99)` without delete results in `hasLeak === true` |
| **TC1.19** | Engine | Core | C++ Clean heap deallocation | `new` + `delete` results in `hasLeak === false` |
| **TC1.20** | Engine | Core | C++ unique_ptr move semantics | `std::move(u1)` transfers ownership, `u1` is `nullptr`, `u2` owns address |

---

### Tier 2: Boundary & Corner Cases (9 Test Cases)

| ID | Category | Milestone | Description | Expected Output / Contract |
|---|---|---|---|---|
| **TC2.1** | DB/API | M2 | GET missing/empty username | HTTP 400 Bad Request with `{ success: false, error: ... }` |
| **TC2.2** | DB/API | M2 | GET invalid username characters | Traversal or injection characters (`bad/user;DROP`) rejected or sanitized |
| **TC2.3** | DB/API | M2 | POST invalid/missing payload | HTTP 400 Bad Request when username or progress object missing |
| **TC2.4** | DB/API | M2 | API offline mode (no KV env vars) | Returns `{ success: true, offline: true }` without throwing unhandled error |
| **TC2.5** | Storage | M2 | Empty localStorage fallback | `loadProgress()` returns default progress with `completedLessons: ['m1-l1']` and `xp: 120` |
| **TC2.6** | Storage | M2 | Corrupted JSON in localStorage | Recovers gracefully, returning valid default progress without crashing |
| **TC2.7** | Validation | M2 | Username length boundary limits | Min 2 chars, Max 24 chars (1 char fails, 2 chars passes, 24 passes, 25 fails) |
| **TC2.8** | Engine | Core | Simulator empty/whitespace input | Handles empty string without process crash; returns empty snapshot list |
| **TC2.9** | Engine | Core | Simulator partial heap leak | 2 allocations with only 1 deleted flags `hasLeak === true` with leaked count |

---

### Tier 3: Cross-Feature Combinations (6 Test Cases)

| ID | Category | Milestone | Description | Expected Output / Contract |
|---|---|---|---|---|
| **TC3.1** | Sync | M2 | Progress Sync Lifecycle | Local progress update -> POST sync payload -> GET fetch -> State integrity |
| **TC3.2** | Sync | M2 | Conflict merging logic | Merges local `[m1-l1, m1-l2]` and remote `[m1-l1, m2-l1]`, XP = `Math.max(local, remote)` |
| **TC3.3** | Identity | M2 | Guest-to-username migration | Upgrades anonymous guest progress to a newly entered username seamlessly |
| **TC3.4** | State | M2 | Atomic state transition verification | Completing lesson + XP gain in same tick retains both new lesson and new XP |
| **TC3.5** | Storage | M2 | Dual persistence network outage | Storage operates reliably via localStorage when remote API throws network error |
| **TC3.6** | Integration | Core/M2 | Simulator execution & XP progression | Running code simulator triggers XP award and level calculation updates |

---

### Tier 4: Real-World Scenarios (4 Test Cases)

| ID | Category | Milestone | Description | Expected Output / Contract |
|---|---|---|---|---|
| **TC4.1** | Journey | M2 | First-visit user onboarding | First load -> modal prompt -> username input -> storage initialized with default lesson |
| **TC4.2** | Journey | M1/M2 | Lesson completion & level up | User earns XP -> levels up to Level 2 -> unlocks badge -> persists full state |
| **TC4.3** | Journey | M2/M3 | Multi-device session restoration | Entering existing username on fresh device restores exact progress state from remote |
| **TC4.4** | Journey | Core | Interactive C++ lab workflow | User allocates dynamic array, writes elements, deallocates -> clean heap (0 leaks) |

---

## 4. Test Execution Guide

### Running the Full E2E Suite
```bash
node test-e2e.js
```
- Executes all 39 tests across Tiers 1–4.
- Exits with code `0` when all tests pass.
- Exits with code `1` if any test fails, with detailed failure diagnostics.

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

### Running Specific Milestones
```bash
# Run Milestone 1 (Design Polish) checks only
node test-e2e.js --milestone=m1

# Run Milestone 2 (Serverless DB & Storage) checks only
node test-e2e.js --milestone=m2

# Run Milestone 3 (Vercel Readiness) checks only
node test-e2e.js --milestone=m3

# Run C++ Simulator Engine checks only
node test-e2e.js --milestone=simulator
```

### Additional Flags
```bash
# Output test results in JSON format
node test-e2e.js --json

# Run in reporting mode (does not exit with code 1 on pending milestones)
node test-e2e.js --allow-pending
```

---

## 5. Verification & Invalidation Conditions

1. **Build Compatibility**:
   - `npm run build` must succeed without errors.
   - `test-e2e.js` must require no external test runners (e.g., Jest, Cypress) to execute.
2. **Deterministic Outputs**:
   - All tests use deterministic inputs and explicit assertions.
   - Dynamic timestamps in user profiles are handled via structural matching.
3. **Progressive Testability**:
   - As workers complete M1, M2, and M3, their corresponding test suites transition from FAIL/PENDING to PASS.
   - In Milestone 4, all 39 tests must PASS simultaneously with exit code 0.
