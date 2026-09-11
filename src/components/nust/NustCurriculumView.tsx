import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  NUST_BSCS_CURRICULUM,
  NUST_ACADEMIC_STATS,
  NUSTCourse,
} from '../../data/nustCurriculumData';
import { soundManager } from '../../services/soundEffects';

interface NustCurriculumViewProps {
  onOpenInSandbox?: (starterCode: string) => void;
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
}`,
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
}`,
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
}`,
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
}`,
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
}`
};

export const NustCurriculumView: React.FC<NustCurriculumViewProps> = ({
  onOpenInSandbox,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [filterCppOnly, setFilterCppOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseCode, setExpandedCourseCode] = useState<string | null>(null);

  const toggleCourseExpand = (code: string) => {
    soundManager.playClick();
    setExpandedCourseCode(expandedCourseCode === code ? null : code);
  };

  const filteredSemesters = NUST_BSCS_CURRICULUM.filter((sem) => {
    if (selectedSemester !== 'all' && sem.semesterNumber !== selectedSemester) {
      return false;
    }
    return true;
  }).map((sem) => {
    const courses = sem.courses.filter((course) => {
      if (filterCppOnly && !course.usesCpp) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = course.code.toLowerCase().includes(q);
        const matchesName = course.name.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesTopic = course.cppTopics?.some((t) => t.toLowerCase().includes(q));
        return matchesCode || matchesName || matchesDesc || matchesTopic;
      }
      return true;
    });

    return { ...sem, courses };
  }).filter((sem) => sem.courses.length > 0);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8 space-y-8">
      {/* Banner / Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-cyan-950/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>National University of Sciences & Technology (NUST)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SEECS BSCS Academic Hub & Degree Pathway
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Official scheme of studies for the Bachelor of Science in Computer Science at the{' '}
              <strong className="text-cyan-300">School of Electrical Engineering & Computer Science (SEECS)</strong>. Explore all 8 semesters, discover core C++ programming courses, and launch real lab exercises into our interactive memory sandbox!
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-cyan-400 font-mono">134</div>
              <div className="text-[11px] text-slate-400 font-medium">Total Credits</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-emerald-400 font-mono">8</div>
              <div className="text-[11px] text-slate-400 font-medium">Semesters (4 Yrs)</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-amber-400 font-mono">8+</div>
              <div className="text-[11px] text-slate-400 font-medium">C++ Courses</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-purple-400 font-mono">Level-II</div>
              <div className="text-[11px] text-slate-400 font-medium">NCEAC OBE Accr.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course code (e.g. CS110, CS212), name, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* C++ Filter Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setFilterCppOnly(!filterCppOnly);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              filterCppOnly
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
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
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
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
      <div className="space-y-8">
        {filteredSemesters.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No courses match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching filters.</p>
          </div>
        ) : (
          filteredSemesters.map((sem) => (
            <section key={sem.semesterNumber} className="space-y-4">
              {/* Semester Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                    {sem.semesterNumber}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Semester {sem.semesterNumber}</span>
                      <span className="text-xs font-normal text-slate-400 font-sans">({sem.year})</span>
                    </h2>
                    <p className="text-xs text-slate-400">{sem.summary}</p>
                  </div>
                </div>

                <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-400">
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
                      className={`glass-card rounded-2xl p-5 border transition-all ${
                        course.usesCpp
                          ? 'border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-transparent'
                          : 'border-slate-800/80 bg-slate-900/40'
                      }`}
                    >
                      {/* Course Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-cyan-400">
                              {course.code}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              {course.creditHours} CH
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-sm mt-1 leading-snug">
                            {course.name}
                          </h3>
                        </div>

                        {course.usesCpp && (
                          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shrink-0">
                            <Code2 className="w-3 h-3" /> C++ Core
                          </span>
                        )}
                      </div>

                      {/* Course Category & Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {course.description}
                      </p>

                      {/* Prerequisites Pill */}
                      {course.prerequisites && course.prerequisites[0] !== 'None' && (
                        <div className="mb-3 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <span className="text-amber-400 font-semibold">Prereq:</span>
                          <span className="truncate">{course.prerequisites.join(', ')}</span>
                        </div>
                      )}

                      {/* Expandable Syllabus & Lab Highlights */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
                          {course.cppTopics && (
                            <div>
                              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> C++ Syllabus Breakdown:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {course.cppTopics.map((topic, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono border border-slate-700/60"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.labHighlights && (
                            <div>
                              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Terminal className="w-3 h-3" /> SEECS Lab Milestones:
                              </div>
                              <ul className="space-y-1 text-xs text-slate-300">
                                {course.labHighlights.map((lab, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
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
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => toggleCourseExpand(course.code)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-cyan-300 transition"
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
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-md shadow-cyan-500/20"
                            title={`Run ${course.code} lab code in the memory visualizer`}
                          >
                            <Terminal className="w-3.5 h-3.5" />
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-cyan-400" />
          <span>Why NUST SEECS Prioritizes C++ Across the Curriculum</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          At SEECS, C++ is not just taught as a syntax exercise—it is the pedagogical backbone connecting abstract algorithmic theory directly to physical silicon. From calculating memory alignment and byte offsets in <strong>CS110</strong>, to constructing deterministic RAII resource fortresses in <strong>CS212</strong>, implementing pointers to pointers in <strong>CS214</strong>, observing CPU calling conventions in <strong>CS250</strong>, and writing POSIX threads and page tables in <strong>CS330</strong>, mastering C++ equips SEECS graduates with the systems-engineering intuition demanded by top global tech leaders.
        </p>
      </div>
    </div>
  );
};
