# Original User Request

## Initial Request — 2026-09-11T15:29:15Z

A fully working **C++ Odyssey** educational web app (Next.js 14, React, TypeScript, Tailwind CSS) at `c:\Users\ANC\Documents\Me\programming\hashtag` needs three categories of finishing work that should be divided among agents: (1) design polish to remove tacky/flashy UI elements, (2) username-based progress tracking via a serverless database (no auth), and (3) Vercel deployment readiness.

Working directory: `c:\Users\ANC\Documents\Me\programming\hashtag`
Integrity mode: development

---

## Requirements

### R1. Design Polish — Remove Flashy / Tacky Elements
Remove over-engineered visual effects that make the UI feel cheap or distracting. The app should feel professional, clean, and focused. Specifically:
- Remove or tone down: excessive neon glows (`shadow-cyan-500/20`, `glow-rose`, `glow-emerald`), repetitive `animate-pulse` / `animate-ping` effects on non-critical elements, overly garish gradient backgrounds in card components.
- Replace with: subtle shadows, clean borders, restrained color use that still feels modern and dark-themed for a developer tool — but NOT flat or boring. Think Vercel dashboard or Linear app aesthetic.
- Keep the overall dark theme and cyan/slate color palette; just reduce visual noise.

### R2. Username-Based Progress Tracking (Serverless Database)
Replace the current `localStorage`-only persistence (`src/services/storage.ts`) with a serverless database so that a user can enter a **username** (no password, no auth) and their progress (XP, completed lessons, completed challenges, unlocked badges) is saved and retrieved from a shared cloud store.
- Add a simple username prompt / login screen (or a modal on first load) where the user types a username to "sign in".
- Persist progress to **Vercel KV** (Redis via `@vercel/kv`) or **Upstash Redis** — whichever works in Next.js App Router API routes without requiring any external sign-up pages inline.
- Create Next.js API routes (`app/api/progress/route.ts`) that handle GET (load progress by username) and POST (save progress by username).
- Fall back to `localStorage` if the API is unavailable (offline mode).
- The username entry should be minimal and non-intrusive — a single text input with a "Start Learning" button, shown only on first visit or when no username is stored.

### R3. Vercel Deployment Readiness
Ensure the project can be deployed to Vercel with zero configuration changes:
- Add a `vercel.json` if any rewrites or environment variable declarations are needed.
- Add a `.env.example` file listing all required environment variables (e.g., `KV_REST_API_URL`, `KV_REST_API_TOKEN`).
- Ensure `next build` passes with zero errors and zero warnings about missing env vars in the CI/CD context (use optional chaining / conditional checks for env vars).
- Remove `"type": "module"` from `package.json` if it conflicts with Next.js or Vercel's build system.
- Add a `README.md` section on how to deploy to Vercel (one-click deploy badge or step-by-step).

---

## Acceptance Criteria

### Design
- [ ] No `animate-ping` on non-critical decorative elements
- [ ] Card hover states use a subtle `shadow-md` or border brightening, NOT multi-layer neon glow
- [ ] `npm run build` still passes after all UI changes

### Database & Progress
- [ ] A username prompt appears on first load with no stored username
- [ ] After entering a username, XP and lesson progress are saved to the database on every update
- [ ] Refreshing the page and re-entering the same username restores full progress state
- [ ] `npm run build` still passes with the new API routes

### Vercel Deployment
- [ ] `next build` exits with code 0 and no errors
- [ ] `.env.example` lists all required environment variables
- [ ] `vercel.json` or `next.config.mjs` contains any necessary configuration for Vercel
- [ ] README contains Vercel deployment instructions
