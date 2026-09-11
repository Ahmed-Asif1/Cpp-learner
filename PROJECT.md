# Project: C++ Odyssey Finishing Work

## Architecture
- Next.js 14 App Router (`app/`)
- React 18, TypeScript, Tailwind CSS
- Serverless API routes: `app/api/progress/route.ts` with `@vercel/kv`
- State & Persistence: `src/services/storage.ts` (dual cloud / offline localStorage fallback)
- UI: Clean, professional Linear/Vercel developer aesthetic

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Remove Non-Critical Animations | Remove `animate-ping` on Navbar trophy, `animate-pulse` on memory leak banner, `activeLinePulse` keyframes | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Eliminate Neon Glow Effects | Replace `.glow-*`, `shadow-cyan-500/20`, etc. with subtle slate borders and clean elevation | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Clean Card Gradients & Hover | Eliminate multi-color radial body gradients, garish card gradients, translateY hover jumps | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Linear/Vercel Styling Consistency | Refactor buttons, panels, badges to restrained dark theme cyan/slate palette | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Install `@vercel/kv` | Add `@vercel/kv` dependency to package.json | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Serverless DB API Route | Implement `app/api/progress/route.ts` (GET & POST) with safe fallback when credentials absent | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Dual Persistence Service | Update `src/services/storage.ts` for username-keyed progress sync with offline localStorage fallback | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Username Modal & Flow | Add minimal `src/components/layout/UsernameModal.tsx` on first visit and username badge in Navbar | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Atomic State Fix | Fix React stale closure bug in `app/page.tsx` (`handleCompleteLesson` & `handleAddXp`) | M2 | Explorer 2 Finding |
| 10 | Environment Variable Template | Add `.env.example` listing `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL` | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Vercel Deployment Configuration | Add `vercel.json` with framework definition | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Git Ignore Configuration | Add `.gitignore` for Next.js, node_modules, .env*.local, dist | M3 | Explorer 3 Finding |
| 13 | Module & Config Modernization | Modernize `tailwind.config.js` to ESM export, add `"preview": "next start"` | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Deployment Documentation | Update `README.md` with Next.js 14 stack and Vercel zero-config deploy instructions | M3 | ORIGINAL_REQUEST §R3 |
| 15 | Vite Artifact Cleanup | Remove stale `dist/`, `src/App.tsx`, `src/main.tsx`, `src/index.css` | M3 | Explorer 3 Finding |
| 16 | E2E Acceptance Verification | Verify all acceptance criteria from ORIGINAL_REQUEST.md via automated test suite | M4 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Design Polish | Remove flashy UI, neon glows, animate-pings, garish gradients across components and CSS | none | PLANNED |
| 2 | M2: Serverless DB Progress | Install `@vercel/kv`, build API routes, dual persistence, username modal, fix stale state | none | PLANNED |
| 3 | M3: Vercel Deployment Readiness | .env.example, vercel.json, .gitignore, package.json scripts, README deployment guide | none | PLANNED |
| 4 | M4: E2E Integration & Verification | Pass 100% E2E test suite, full build & verification | M1, M2, M3 | PLANNED |

## Interface Contracts
### Client ↔ Serverless DB API (`app/api/progress/route.ts`)
- `GET /api/progress?username=<string>`
  - Response: `{ success: boolean, progress: UserProgress | null, offline?: boolean, error?: string }`
- `POST /api/progress`
  - Body: `{ username: string, progress: UserProgress }`
  - Response: `{ success: boolean, saved: boolean, offline?: boolean, error?: string }`

### Storage Service Contract (`src/services/storage.ts`)
- `loadProgress(username?: string): Promise<UserProgress>`
- `saveProgress(progress: UserProgress, username?: string): Promise<void>`
- `getUsername(): string | null`
- `setUsername(username: string): void`

## Code Layout
- `app/` - Next.js App Router (layout.tsx, page.tsx, globals.css, api/progress/route.ts)
- `src/components/` - React components (curriculum, visualizer, games, labs, layout, nust)
- `src/services/` - Services (storage.ts, sound.ts)
- `src/engine/` - C++ simulation engine
- `src/types/` - TypeScript interface definitions
