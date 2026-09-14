export type VariableType = 
  | 'int'
  | 'double'
  | 'float'
  | 'char'
  | 'bool'
  | 'string'
  | 'pointer'
  | 'reference'
  | 'array'
  | 'struct'
  | 'unique_ptr'
  | 'shared_ptr';

export interface MemoryVariable {
  id: string;
  name: string;
  type: string;
  value: any;
  address: string;
  sizeBytes: number;
  isPointer?: boolean;
  pointsToAddress?: string | null;
  isReference?: boolean;
  refTargetName?: string;
  isFreed?: boolean;
  isDangling?: boolean;
  highlight?: boolean;
  arrayElements?: { index: number; value: any; address: string }[];
}

export interface StackFrame {
  id: string;
  functionName: string;
  variables: MemoryVariable[];
  returnAddress?: string;
}

export interface HeapBlock {
  id: string;
  address: string;
  sizeBytes: number;
  type: string;
  value: any;
  status: 'allocated' | 'freed' | 'leaked';
  ownerVariable?: string;
  refCount?: number; // for shared_ptr
  arrayLength?: number;
}

export interface ExecutionSnapshot {
  lineIndex: number;
  sourceLine: string;
  explanation: string;
  stack: StackFrame[];
  heap: HeapBlock[];
  stdout: string[];
  isError?: boolean;
  errorMessage?: string;
  hasLeak?: boolean;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: QuizOption[];
  xpReward: number;
  category: string;
}

export interface CodeExampleItem {
  title: string;
  description: string;
  code: string;
  expectedOutput?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  xpReward: number;
  badgeId?: string;
  content: {
    hook: string;
    mentalModel: string;
    explanation: string[];
    codeExample: string;
    examples?: CodeExampleItem[];
    deepDive?: {
      title: string;
      content: string;
      warning?: string;
    };
    interactivePrompt?: {
      task: string;
      hint: string;
      starterCode: string;
      expectedOutputRegex?: string;
    };
  };
  quiz: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  accentColor: string;
  description: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'basics' | 'memory' | 'oop' | 'modern' | 'expert';
  unlockedAt?: string;
}

export interface BugChallenge {
  id: string;
  title: string;
  severity: 'Fatal' | 'Undefined Behavior' | 'Memory Leak' | 'Logic Bug';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  code: string;
  bugLine: number;
  options: {
    text: string;
    explanation: string;
    isCorrect: boolean;
  }[];
  fixedCode: string;
  deepDive: string;
  xp: number;
}

export interface CodingExercise {
  id: string;
  lessonId?: string;
  title: string;
  category: 'Fundamentals' | 'Pointers & Memory' | 'Dynamic Allocation' | 'References' | 'Classes & RAII' | 'Modern C++';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  starterCode: string;
  solutionCode?: string;
  expectedOutput: string;
  hint: string;
  xpReward: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedLessons: string[];
  completedChallenges: string[];
  completedExercises?: string[];
  completedQuests?: string[];
  totalLabLaunches?: number;
  unlockedBadges: string[];
  soundEnabled: boolean;
  streak: number;
  lastActive: string;
}

