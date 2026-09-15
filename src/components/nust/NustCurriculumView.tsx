import React, { useState, useMemo, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  Code2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Cpu,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Award,
  BookMarked,
  Terminal,
  HelpCircle,
  Compass,
} from 'lucide-react';
import {
  NUST_BSCS_CURRICULUM,
  NUST_ACADEMIC_STATS,
  NUSTCourse,
} from '../../data/nustCurriculumData';
import { soundManager } from '../../services/soundEffects';

interface NustCurriculumViewProps {
  onOpenInSandbox?: (starterCode: string) => void;
  onOpenTutorial?: () => void;
}

const COURSE_SAMPLE_CODE: Record<string, string> = {
  CS110: `// SEECS CS110: Fundamentals of Programming
// Matrix Multiplication & Dynamic Array Allocation
#include <iostream>

int main() {
    int rows = 3;
    int cols = 3;
    
    // Allocate contiguous buffer on heap
    int* matrix = new int[rows * cols];
    
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            matrix[i * cols + j] = (i + 1) * (j + 1);
        }
    }
    
    std::cout << "Center Element [1][1]: " << matrix[1 * cols + 1] << std::endl;
    
    delete[] matrix; // Clean up SEECS lab array
    matrix = nullptr;
    return 0;
} `,
  CS212: `// SEECS CS212: Object Oriented Programming
// RAII & Dynamic Memory Fortress
#include <iostream>
#include <string>

class StudentRecord {
private:
    std::string name;
    int* grades;
    int count;

public:
    StudentRecord(std::string sName, int n) : name(sName), count(n) {
        grades = new int[count];
        for (int i = 0; i < count; ++i) grades[i] = 85 + i * 2;
        std::cout << "Allocated grades for " << name << std::endl;
    }

    ~StudentRecord() {
        delete[] grades; // Deterministic RAII destruction
        std::cout << "Cleaned up grades for " << name << std::endl;
    }

    void display() const {
        std::cout << name << " top grade: " << grades[count - 1] << std::endl;
    }
};

int main() {
    {
        StudentRecord s1("NUSTian", 4);
        s1.display();
    } // Out of scope -> Destructor runs automatically!
    return 0;
} `,
  CS214: `// SEECS CS214: Data Structures & Algorithms
// Singly Linked List Node Traversal
#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);

    Node* curr = head;
    std::cout << "Traversing Linked List:" << std::endl;
    while (curr != nullptr) {
        std::cout << "Node at " << curr << " = " << curr->data << std::endl;
        curr = curr->next;
    }

    // Clean up heap allocations to avoid memory leaks
    Node* temp;
    while (head != nullptr) {
        temp = head;
        head = head->next;
        delete temp;
    }

    return 0;
} `,
  CS250: `// SEECS CS250: Computer Organization & Assembly Language
// Examining Physical Stack Frames & Addresses
#include <iostream>

void inspectStackFrame(int a, int b) {
    int localDiff = a - b;
    std::cout << "Param a address: " << &a << std::endl;
    std::cout << "Param b address: " << &b << std::endl;
    std::cout << "LocalDiff addr:  " << &localDiff << std::endl;
}

int main() {
    int x = 42;
    int y = 17;
    std::cout << "Main stack frame x: " << &x << " y: " << &y << std::endl;
    inspectStackFrame(x, y);
    return 0;
} `,
  CS330: `// SEECS CS330: Operating Systems
// Heap Block Virtual Memory Allocation Simulator
#include <iostream>

int main() {
    int pageSize = 4096; // 4KB Page
    int* virtualPage = new int(pageSize);
    
    std::cout << "Simulated Page Base Address: " << virtualPage << std::endl;
    std::cout << "Simulated Page Size: " << *virtualPage << " bytes" << std::endl;
    
    delete virtualPage;
    virtualPage = nullptr;
    return 0;
} `
};

export const NustCurriculumView: React.FC<NustCurriculumViewProps> = ({
  onOpenInSandbox,
  onOpenTutorial,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [filterCppOnly, setFilterCppOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseCode, setExpandedCourseCode] = useState<string | null>(null);

  const toggleCourseExpand = useCallback((code: string) => {
    soundManager.playClick();
    setExpandedCourseCode((prev) => (prev === code ? null : code));
  }, []);

  const filteredSemesters = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const cleanQuery = trimmedQuery.replace(/[\s\-_]+/g, '');

    return NUST_BSCS_CURRICULUM.filter((sem) => {
      if (selectedSemester !== 'all' && sem.semesterNumber !== selectedSemester) {
        return false;
      }
      return true;
    }).map((sem) => {
      const courses = sem.courses.filter((course) => {
        if (filterCppOnly && !course.usesCpp) return false;
        if (trimmedQuery) {
          const codeClean = course.code.toLowerCase().replace(/[\s\-_]+/g, '');
          const matchesCode = course.code.toLowerCase().includes(trimmedQuery) || codeClean.includes(cleanQuery);
          const matchesName = course.name.toLowerCase().includes(trimmedQuery);
          const matchesDesc = course.description.toLowerCase().includes(trimmedQuery);
          const matchesTopic = course.cppTopics?.some((t) => t.toLowerCase().includes(trimmedQuery));
          const matchesLab = course.labHighlights?.some((l) => l.toLowerCase().includes(trimmedQuery));
          const matchesCategory = course.category.toLowerCase().includes(trimmedQuery);
          const matchesPrereq = course.prerequisites?.some((p) => p.toLowerCase().includes(trimmedQuery));
          return matchesCode || matchesName || matchesDesc || matchesTopic || matchesLab || matchesCategory || matchesPrereq;
        }
        return true;
      });

      return { ...sem, courses };
    }).filter((sem) => sem.courses.length > 0);
  }, [selectedSemester, filterCppOnly, searchQuery]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-5 space-y-6">
      {/* Banner / Hero Section - Tightened Vercel/Linear Style */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>National University of Sciences & Technology (NUST)</span>
              </div>
              {onOpenTutorial && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenTutorial();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-medium transition-colors cursor-pointer"
                  title="Open Platform Guide & Roadmap"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Start Tutorial & Guide</span>
                </button>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              SEECS BSCS Academic Hub & Degree Pathway
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Official scheme of studies for the Bachelor of Science in Computer Science at the{' '}
              <strong className="text-zinc-200">School of Electrical Engineering & Computer Science (SEECS)</strong>. Explore all 8 semesters, discover core C++ programming courses, and launch real lab exercises into our interactive memory sandbox.
            </p>
          </div>

          {/* Quick Metrics — Inline Text Row */}
          <div className="flex items-center gap-0 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
            <div className="px-3 py-1.5 text-center">
              <div className="text-lg font-bold text-zinc-100 font-mono tabular-nums">134</div>
              <div className="text-[10px] text-zinc-500 font-medium">Total Credits</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-zinc-800" />
            <div className="px-3 py-1.5 text-center">
              <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">8</div>
              <div className="text-[10px] text-zinc-500 font-medium">Semesters (4 Yrs)</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-zinc-800" />
            <div className="px-3 py-1.5 text-center">
              <div className="text-lg font-bold text-amber-400 font-mono tabular-nums">8+</div>
              <div className="text-[10px] text-zinc-500 font-medium">C++ Courses</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-zinc-800" />
            <div className="px-3 py-1.5 text-center">
              <div className="text-lg font-bold text-purple-400 font-mono tabular-nums">Level-II</div>
              <div className="text-[10px] text-zinc-500 font-medium">NCEAC OBE Accr.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Flat 1px borders with dedicated flex spacing */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-zinc-900/60 p-3 sm:p-4 rounded-lg border border-zinc-800">
        {/* Search input with proportional flexing and minimum width guarantee */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course code (e.g. CS110, CS212), name, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[40px] bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                soundManager.playClick();
                setSearchQuery('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors p-1 cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter controls - uncompressed interactive cluster */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* C++ Filter Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setFilterCppOnly(!filterCppOnly);
            }}
            className={`min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors border cursor-pointer select-none ${
              filterCppOnly
                ? 'bg-zinc-800 border-zinc-700 text-cyan-300 font-semibold shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span>C++ Courses Only</span>
          </button>

          {/* Semester Selector */}
          <select
            value={selectedSemester}
            onChange={(e) => {
              soundManager.playClick();
              const val = e.target.value;
              setSelectedSemester(val === 'all' ? 'all' : Number(val));
            }}
            className="min-h-[40px] bg-zinc-950 border border-zinc-800 text-xs rounded-md px-3.5 py-2 text-zinc-300 focus:outline-none focus:border-zinc-700 shrink-0 cursor-pointer transition-colors"
          >
            <option value="all">All 8 Semesters</option>
            {NUST_BSCS_CURRICULUM.map((s) => (
              <option key={s.semesterNumber} value={s.semesterNumber}>
                Semester {s.semesterNumber} ({s.year.split(' - ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Semesters & Courses Grid */}
      <div className="space-y-6">
        {filteredSemesters.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 rounded-lg border border-zinc-800">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-2.5" />
            <h3 className="text-sm font-semibold text-zinc-300">No courses match your criteria</h3>
            <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or switching filters.</p>
          </div>
        ) : (
          filteredSemesters.map((sem) => (
            <section key={sem.semesterNumber} className="space-y-4">
              {/* Semester Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm tabular-nums">
                    {sem.semesterNumber}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                      <span>Semester {sem.semesterNumber}</span>
                      <span className="text-xs font-normal text-zinc-400 font-sans">({sem.year})</span>
                    </h2>
                    <p className="text-xs text-zinc-400">{sem.summary}</p>
                  </div>
                </div>

                <div className="text-xs font-mono bg-zinc-900/80 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-400 tabular-nums">
                  <span className="text-emerald-400 font-bold">{sem.totalCredits}</span> Credit Hours
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sem.courses.map((course) => {
                  const isExpanded = expandedCourseCode === course.code;
                  const hasSandboxCode = !!COURSE_SAMPLE_CODE[course.code];

                  return (
                    <div
                      key={course.code}
                      className="rounded-lg p-4 border border-zinc-800/90 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700/70 transition-colors"
                    >
                      {/* Course Header - Single Line with 1px Dividers */}
                      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-zinc-800/60 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-100">
                            {course.code}
                          </span>
                          <span className="text-zinc-700">|</span>
                          <span className="text-zinc-400 tabular-nums">
                            {course.creditHours} CH
                          </span>
                          <span className="text-zinc-700">|</span>
                          <span className="text-zinc-400 font-sans">
                            Sem {sem.semesterNumber}
                          </span>
                        </div>

                        {course.usesCpp && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-zinc-800 text-emerald-400 border border-zinc-700/60 shrink-0">
                            <Code2 className="w-3 h-3" /> C++ Core
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-zinc-100 text-sm leading-snug">
                        {course.name}
                      </h3>

                      {/* Course Category & Description */}
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed my-2.5">
                        {course.description}
                      </p>

                      {/* Prerequisites Pill */}
                      {course.prerequisites && course.prerequisites[0] !== 'None' && (
                        <div className="mb-3 text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                          <span className="text-amber-400 font-semibold">Prereq:</span>
                          <span className="truncate">{course.prerequisites.join(', ')}</span>
                        </div>
                      )}

                      {/* Expandable Syllabus & Lab Highlights */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-3">
                          {course.cppTopics && (
                            <div>
                              <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> C++ Syllabus Breakdown:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {course.cppTopics.map((topic, idx) => (
                                  <span
                                    key={`${course.code}-topic-${idx}-${topic}`}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/60"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.labHighlights && (
                            <div>
                              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Terminal className="w-3 h-3" /> SEECS Lab Milestones:
                              </div>
                              <ul className="space-y-1 text-xs text-zinc-300">
                                {course.labHighlights.map((lab, idx) => (
                                  <li key={`${course.code}-lab-${idx}-${lab.slice(0, 15)}`} className="flex items-start gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>{lab}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => toggleCourseExpand(course.code)}
                          className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <span>{isExpanded ? 'Less details' : 'Course details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {hasSandboxCode && onOpenInSandbox && (
                          <button
                            onClick={() => {
                              soundManager.playPointerHop();
                              onOpenInSandbox(COURSE_SAMPLE_CODE[course.code]);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors"
                            title={`Run ${course.code} lab code in the memory visualizer`}
                          >
                            <Terminal className="w-3 h-3 text-cyan-400" />
                            <span>Launch Lab</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* SEECS C++ Integration Guide Callout */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-5 sm:p-6 space-y-2.5">
        <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-cyan-400" />
          <span>Why NUST SEECS Prioritizes C++ Across the Curriculum</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          At SEECS, C++ is not just taught as a syntax exercise—it is the pedagogical backbone connecting abstract algorithmic theory directly to physical silicon. From calculating memory alignment and byte offsets in <strong className="text-zinc-200">CS110</strong>, to constructing deterministic RAII resource fortresses in <strong className="text-zinc-200">CS212</strong>, implementing pointers to pointers in <strong className="text-zinc-200">CS214</strong>, observing CPU calling conventions in <strong className="text-zinc-200">CS250</strong>, and writing POSIX threads and page tables in <strong className="text-zinc-200">CS330</strong>, mastering C++ equips SEECS graduates with the systems-engineering intuition demanded by top global tech leaders.
        </p>
      </div>
    </div>
  );
};
