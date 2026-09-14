# Contributing to C++ Odyssey ⚡

Thank you for your interest in contributing to **C++ Odyssey**! Whether you are fixing a typo, adding a new C++ Quest module, optimizing the physical memory simulator, or refining responsive layout components, all contributions are welcome.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Git](https://git-scm.com/)

### 2. Fork & Clone
```bash
# Clone your fork
git clone https://github.com/Ahmed-Asif1/Cpp-learner.git
cd Cpp-learner

# Install dependencies
npm install

# Start local Next.js dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Checks

Before submitting any code or opening a Pull Request, please ensure all checks pass:

```bash
# 1. Typecheck with TypeScript
npx tsc --noEmit

# 2. Run the complete automated test suite (39 E2E, Simulator, Cross-Device tests)
npm run test:all

# 3. Verify the Next.js production build succeeds
npm run build
```

---

## 📐 Design & Architectural Standards

We maintain a strict, human-engineered **Vercel and Linear design baseline**:
- **Geometry**: Use subtle, sharp corner radii (`rounded-md` [6px] or `rounded-lg` [8px] maximum). Avoid aggressive roundings (`rounded-2xl`, `rounded-3xl`, `rounded-full` except for physical status dots).
- **Colors**: Use the `zinc` color palette (`bg-zinc-900`, `border-zinc-800`, `text-zinc-400`). Avoid non-standard Tailwind shades like `zinc-750` or `zinc-850`.
- **Metrics & Numbers**: Always use `font-mono tabular-nums` for alignment of memory addresses, line numbers, and stats.
- **Responsiveness**: Ensure all views collapse gracefully on mobile viewports (<768px) with touch targets of at least 40px–44px.

---

## 📦 Project Structure

```text
├── app/                  # Next.js 14 App Router (layout, page, API routes)
│   ├── api/progress/     # Serverless progress persistence endpoint
│   ├── globals.css       # Global styles and design system variables
│   └── page.tsx          # Main client entry point & state orchestrator
├── src/
│   ├── components/       # UI components (curriculum, sandbox, games, nust, layout)
│   ├── data/             # Curriculum syllabus, coding exercises, NUST course catalog
│   ├── engine/           # In-browser C++ virtual memory simulator & interpreter
│   ├── services/         # Storage (localStorage + Upstash Redis), audio synth
│   └── types/            # TypeScript interfaces
├── test-e2e.js           # 4-Tier comprehensive E2E test runner
├── test-simulator.js     # C++ memory simulator unit tests
└── test-cross-device.js  # Responsive layout & accessibility audit
```

---

## 📝 Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add move semantics visualizer`
- `fix: correct dangling pointer memory address calculation`
- `docs: update deployment instructions in README`
- `style: refine navbar active border radius`
- `test: add assertion for vector capacity doubling`

---

## 🚀 Submitting a Pull Request

1. Create a feature branch (`git checkout -b feat/my-new-feature`).
2. Commit your changes with a descriptive message.
3. Push to your branch (`git push origin feat/my-new-feature`).
4. Open a Pull Request on GitHub against the `main` branch.
5. Our automated GitHub Actions CI will automatically test your build and type safety!
