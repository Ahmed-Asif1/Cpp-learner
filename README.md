# ⚡ C++ Odyssey: Interactive C++ Learning Platform

An engaging, gamified, and deeply educational web application designed to teach C++ from the ground up to modern C++20/23 concepts in a visual, intuitive, and fun way.

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
- **Module 1: The Forge (Fundamentals)**: Closeness to silicon, compilation model, streams (`cout`/`cin`), byte sizes, pass-by-value vs pass-by-reference.
- **Module 2: The Matrix of Memory (Pointers & Dynamic Memory)**: Address-of `&`, dereference `*`, null pointers, stack vs heap, `new`/`delete`, dangling pointers.
- **Module 3: The Blueprint Realm (Classes & RAII)**: Structs vs classes, encapsulation, constructors/destructors, deterministic destruction, RAII.
- **Module 4: The Modern Era (C++11 to C++23)**: `std::unique_ptr`, `std::shared_ptr`, `std::move`, move semantics, lambdas.
- **Module 5: The STL Explorer**: `std::vector` capacity doubling, hash maps, red-black trees, algorithms.
- **Interactive Checkpoint Quizzes**: Earn XP, level up titles (from *Unallocated Byte* to *C++ Archmage*), and unlock badges with celebratory sound & confetti.

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
npm test
```

### Building for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

C++ Odyssey is built with **Next.js 14 App Router** and deploys to Vercel with zero extra configuration.

### 1-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

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
