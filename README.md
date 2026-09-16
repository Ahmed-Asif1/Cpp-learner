# ⚡ C++ Odyssey: Interactive C++ Learning Platform

[![CI](https://github.com/Ahmed-Asif1/Cpp-learner/actions/workflows/ci.yml/badge.svg)](https://github.com/Ahmed-Asif1/Cpp-learner/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

An engaging, gamified, and deeply educational web application designed to teach C++ from the ground up to modern C++20/23 concepts in a visual, intuitive, and fun way. Built with a high-density, professional developer aesthetic inspired by Vercel and Linear.

---

## 🌟 Key Features

### 1. 🧠 Live Memory & Execution Sandbox
- **In-Browser C++ Engine**: Step-by-step simulator for C++ execution with zero external server dependencies.
- **Physical Memory Model**:
  - **The Stack**: Tracks local function stack frames, local variables, and 32-bit/64-bit addresses (`0x7ffd20`).
  - **The Heap**: Tracks dynamic allocations (`new`, `delete`), bytes allocated, and ownership.
  - **Pointers & References**: Visualizes pointer addresses, pointer dereferencing (`*p`), and reference aliases (`&ref`).
  - **Memory Leak Detector**: Flags unreleased heap memory with real-time leak alerts and explanations.
  - **Dangling Pointer & Segfault Simulator**: Demonstrates use-after-free and null pointer dereference crashes visually.
- **Standard Output Terminal**: Displays `std::cout` stream in real time.

### 2. 🚀 The Gamified Quest Curriculum (Zero to Hero)
- **Module 0: First Steps (Zero to Running)**: Line-by-line Hello World breakdown, variables, types, and building a calculator. Ideal for total beginners!
- **Module 1: The Forge (Fundamentals - CS110)**: Compilation model, streams (`cout`/`cin`), byte sizes, control flow.
- **Module 2: The Matrix of Memory (Pointers - CS212/CS214)**: Address-of `&`, dereference `*`, null pointers, stack vs heap, `new`/`delete`, dangling pointers.
- **Module 3: The Blueprint Realm (Classes & RAII)**: Structs vs classes, encapsulation, constructors/destructors, deterministic destruction, RAII.
- **Module 4: The Modern Era (C++11 to C++23)**: `std::unique_ptr`, `std::shared_ptr`, `std::move`, move semantics, lambdas.
- **Module 5: The STL Explorer**: `std::vector` capacity doubling, hash maps, red-black trees, algorithms.
- **Module 6: The Systems Forge (Production Projects)**: Production server log parser with file streams, and 2D game state engine with OOP grids.
- **Module 7: The Algorithm Arsenal (DSA Deep Dives)**: Custom dynamic array vector clone from scratch, and high-speed hash dictionary with chaining.
- **Interactive Checkpoint Quizzes**: Shuffled answer options, XP rewards, rank titles (from *Junior Systems Trainee* to *Principal Systems Architect*), and confetti celebrations.

### 3. ⚔️ Bug Hunter Protocol: Diagnostic Arena
- Real-world buggy C++ code challenges:
  - Memory leak detection
  - Dangling pointer returned from stack frame
  - Double-free crashes
  - Off-by-one array buffer overflow
- Diagnose root cause, inspect the modern C++ fix, and learn defensive programming patterns.

### 4. 🧭 Pointer Maze: The Memory Hop Odyssey
- Visual mini-game where players navigate chains of memory pointers (`*ptr`, `**pptr`, `*(arr + 2)`, `node->next->value`) in physical RAM to unlock the target address.

### 5. 📦 Interactive STL & Architecture Labs
- **`std::vector` Doubling Visualizer**: Push and pop elements, watch capacity double, see memory reallocations in real-time, and discover why amortized $O(1)$ works.
- **Smart Pointer Ownership Lab**: Move `unique_ptr` ownership and watch `shared_ptr` reference counts increment and decrement.
- **Rosetta Stone**: Compare C++ memory and performance side-by-side with Python, JavaScript, and Java.

### 6. 🔊 Audio & UX Polish
- 100% client-side Web Audio API sound synthesizer (arpeggios, memory allocation pings, dereference clicks, fanfare).
- Modern dark cyberpunk developer theme with glowing neon accents.
- C++ Engineer Cheat Sheet modal and Developer Hall of Mastery.
- `localStorage` progress persistence.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (Optional - progress falls back to localStorage if omitted)
cp .env.example .env.local

# 3. Run the development server
npm run dev

# 4. Open in your browser
# http://localhost:3000
```

### Running Verification Tests

```bash
# Run C++ simulator engine unit tests
npm test

# Run complete 4-tier E2E and cross-device test suite
npm run test:all
```
For an in-depth breakdown of the 4-tier test architecture and coverage, see [docs/TESTING.md](docs/TESTING.md).

### Building for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

C++ Odyssey is built with **Next.js 14 App Router** and deploys to Vercel with zero extra configuration.

### 1-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ahmed-Asif1/Cpp-learner)

### Manual Steps:
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository (Vercel automatically detects Next.js).
4. (Optional) In Project Settings -> **Environment Variables**, add:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   *(Get free serverless Redis credentials at [Upstash](https://console.upstash.com))*
5. Click **"Deploy"**. Your application will be live in under 60 seconds!

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS (Clean Dark Developer Theme, Vercel/Linear aesthetic)
- **Database / Sync**: Upstash Serverless Redis via `@upstash/redis` with automatic `localStorage` offline fallback
- **Curriculum & Roadmap**: Comprehensive **NUST SEECS BSCS** 8-semester course breakdown (CS110, CS212, CS214, CS250, CS330, etc.)
- **Execution Engine**: Custom in-browser C++ memory simulator (Stack, Heap, Pointers, Leaks)
- **Icons**: Lucide React
- **Audio**: Web Audio API Procedural Synthesizer
- **Visuals**: Canvas Confetti, SVG connectors, dynamic CSS execution line highlighting
