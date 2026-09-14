import React, { useState } from 'react';
import { Compass, Key, Sparkles, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Trophy, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/soundEffects';

interface MazeLevel {
  id: number;
  title: string;
  expression: string;
  startPointer: string;
  explanation: string;
  expectedValue: number | string;
  hint: string;
  memoryCells: {
    address: string;
    label?: string;
    value: string | number;
    isTarget?: boolean;
  }[];
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    title: 'Level 1: The Simple Dereference',
    expression: '*pTreasure',
    startPointer: 'pTreasure = 0x108',
    explanation: 'Dereference (*): Go to the memory address stored in pTreasure (0x108) and retrieve the value inside.',
    expectedValue: 777,
    hint: 'Look for address 0x108 and inspect what is stored inside.',
    memoryCells: [
      { address: '0x100', label: 'x', value: 42 },
      { address: '0x104', label: 'pTreasure', value: '0x108' },
      { address: '0x108', label: 'chest', value: 777, isTarget: true },
      { address: '0x10C', label: 'y', value: 12 },
    ],
  },
  {
    id: 2,
    title: 'Level 2: Pointer to Pointer (**pptr)',
    expression: '**ppKey',
    startPointer: 'ppKey = 0x204',
    explanation: 'Double Dereference (**): Dereference once to get an address (0x208), then dereference that address to reach the secret crystal!',
    expectedValue: 9999,
    hint: 'Step 1: 0x204 contains 0x208. Step 2: What is inside 0x208?',
    memoryCells: [
      { address: '0x200', label: 'counter', value: 3 },
      { address: '0x204', label: 'ppKey', value: '0x208' },
      { address: '0x208', label: 'pKey', value: '0x210' },
      { address: '0x20C', label: 'unused', value: 0 },
      { address: '0x210', label: 'crystal', value: 9999, isTarget: true },
    ],
  },
  {
    id: 3,
    title: 'Level 3: Pointer Arithmetic (*(p + 2))',
    expression: '*(pArray + 2)',
    startPointer: 'pArray = 0x300 (int*)',
    explanation: 'Pointer Arithmetic: In C++, adding 2 to an int* advances the address by 2 * sizeof(int) = 8 bytes! So 0x300 + 8 bytes = 0x308.',
    expectedValue: 88,
    hint: 'Each int is 4 bytes. Adding +2 skips 2 ints (8 bytes). Which address is 0x300 + 8?',
    memoryCells: [
      { address: '0x300', label: 'arr[0]', value: 11 },
      { address: '0x304', label: 'arr[1]', value: 44 },
      { address: '0x308', label: 'arr[2]', value: 88, isTarget: true },
      { address: '0x30C', label: 'arr[3]', value: 99 },
    ],
  },
  {
    id: 4,
    title: 'Level 4: Linked Node Hop (node->next->value)',
    expression: 'head->next->next->val',
    startPointer: 'head = 0x400',
    explanation: 'Arrow operator (->): Automatically dereferences pointer and accesses member. Follow the chain across three nodes.',
    expectedValue: 'OMEGA',
    hint: 'Hop from 0x400 -> 0x410 -> 0x420!',
    memoryCells: [
      { address: '0x400', label: 'Node A', value: 'next: 0x410' },
      { address: '0x408', label: 'A.val', value: 'ALPHA' },
      { address: '0x410', label: 'Node B', value: 'next: 0x420' },
      { address: '0x418', label: 'B.val', value: 'BETA' },
      { address: '0x420', label: 'Node C', value: 'next: nullptr' },
      { address: '0x428', label: 'C.val', value: 'OMEGA', isTarget: true },
    ],
  },
];

interface PointerMazeGameProps {
  onEarnXp: (amount: number) => void;
}

export const PointerMazeGame: React.FC<PointerMazeGameProps> = ({ onEarnXp }) => {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [hops, setHops] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const level = MAZE_LEVELS[levelIndex];

  const handleCellClick = (cell: typeof level.memoryCells[0]) => {
    soundManager.playPointerHop();
    setSelectedAddress(cell.address);
    setHops((prev) => [...prev, cell.address]);

    if (cell.isTarget) {
      soundManager.playSuccess();
      setIsSuccess(true);
      onEarnXp(150);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setAttempts((a) => a + 1);
    }
  };

  const handleReset = () => {
    setSelectedAddress(null);
    setHops([]);
    setIsSuccess(false);
  };

  const handleNextLevel = () => {
    if (levelIndex < MAZE_LEVELS.length - 1) {
      setLevelIndex((i) => i + 1);
      handleReset();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Pointer Maze: The Memory Hop Odyssey</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Follow pointer addresses, calculate memory offsets, and click the correct destination cell in physical RAM.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {MAZE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => {
                soundManager.playClick();
                setLevelIndex(idx);
                handleReset();
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-bold border transition-colors ${
                idx === levelIndex
                  ? 'bg-zinc-800 text-cyan-300 border-zinc-700 shadow-sm'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              Lvl {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Target Mission Card */}
      <div className="rounded-lg p-5 border border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            {level.title}
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
            <span>Evaluate:</span>
            <code className="bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 text-cyan-300">
              {level.expression}
            </code>
          </div>
          <div className="text-xs text-zinc-400 mt-1.5 font-mono">
            Initial pointer register: <span className="text-emerald-400 font-bold">{level.startPointer}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Trace</span>
          </button>
          <div className="text-xs font-mono bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-md text-amber-400 tabular-nums">
            Hops Taken: {hops.length}
          </div>
        </div>
      </div>

      {/* Physical RAM Memory Grid */}
      <div className="rounded-lg p-5 sm:p-6 border border-zinc-800 bg-zinc-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Physical RAM Address Space (Click a cell to dereference)
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">32-bit hex addresses</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {level.memoryCells.map((cell) => {
            const isSelected = selectedAddress === cell.address;
            const isHop = hops.includes(cell.address);

            return (
              <button
                key={cell.address}
                onClick={() => handleCellClick(cell)}
                className={`p-3 rounded-md border text-left transition-colors relative font-mono group ${
                  isSelected && cell.isTarget
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                    : isSelected && !cell.isTarget
                      ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                      : isHop
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200'
                        : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1 tabular-nums">
                  <span>{cell.address}</span>
                  {cell.label && (
                    <span className="text-[10px] text-cyan-400 font-semibold">{cell.label}</span>
                  )}
                </div>

                <div className="text-sm font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                  {String(cell.value)}
                </div>

                {isSelected && cell.isTarget && (
                  <div className="absolute top-2 right-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification & Explanation */}
      {isSuccess ? (
        <div className="rounded-lg p-5 sm:p-6 border border-emerald-500/40 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1 tracking-tight">
              <ShieldCheck className="w-5 h-5" />
              <span>Target Memory Address Reached! (+150 XP)</span>
            </div>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              {level.explanation}
            </p>
          </div>

          <button
            onClick={handleNextLevel}
            disabled={levelIndex === MAZE_LEVELS.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-30 shadow-sm"
          >
            <span>{levelIndex < MAZE_LEVELS.length - 1 ? 'Next Memory Maze' : 'All Mazes Cleared!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-md p-3 border border-zinc-800 bg-zinc-950/80 text-xs text-zinc-400 flex items-center justify-between">
          <span><strong className="text-zinc-200">Hint:</strong> {level.hint}</span>
          <span className="text-[11px] font-mono text-cyan-400">Click the cell you believe contains the final value.</span>
        </div>
      )}
    </div>
  );
};
