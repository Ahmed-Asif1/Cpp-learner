export interface NUSTCourse {
  code: string;
  name: string;
  creditHours: string; // e.g. "3+1"
  semester: number;
  category: 'Computing Core' | 'CS Core' | 'CS Elective' | 'Mathematics' | 'General Education' | 'Final Year Project';
  usesCpp: boolean;
  cppTopics?: string[];
  description: string;
  prerequisites?: string[];
  labHighlights?: string[];
}

export interface NUSTSemester {
  semesterNumber: number;
  year: string;
  totalCredits: number;
  summary: string;
  courses: NUSTCourse[];
}

export const NUST_BSCS_CURRICULUM: NUSTSemester[] = [
  {
    semesterNumber: 1,
    year: 'Freshman Year - Fall',
    totalCredits: 17,
    summary: 'Building the mathematical foundation and learning the very first lines of native C++ instructions.',
    courses: [
      {
        code: 'CS110',
        name: 'Fundamentals of Programming',
        creditHours: '3+1',
        semester: 1,
        category: 'Computing Core',
        usesCpp: true,
        cppTopics: ['C++ Syntax & Compilation', 'Control Structures (if/else, switch, loops)', 'Functions & Parameter Passing (Pass-by-value vs Reference)', '1D & 2D Stack Arrays', 'Pointers & Address Arithmetic', 'Structs', 'File I/O (fstream)'],
        description: 'The premier gateway course at SEECS. Teaches algorithmic thinking and rigorous structured programming using C++ as the primary medium.',
        prerequisites: ['None'],
        labHighlights: ['Matrix manipulation algorithms in C++', 'Array-based student records system', 'File serialization and parsing engine']
      },
      {
        code: 'CS100',
        name: 'Introduction to ICT',
        creditHours: '2+1',
        semester: 1,
        category: 'General Education',
        usesCpp: false,
        description: 'Covers the anatomy of computing systems, computer networks, internet technologies, and basic digital literacy.',
        prerequisites: ['None']
      },
      {
        code: 'MATH101',
        name: 'Calculus & Analytical Geometry',
        creditHours: '3+0',
        semester: 1,
        category: 'Mathematics',
        usesCpp: false,
        description: 'Limits, continuity, differentiation, mean value theorems, Riemann integration, and geometric applications.',
        prerequisites: ['None']
      },
      {
        code: 'PHY101',
        name: 'Applied Physics',
        creditHours: '2+1',
        semester: 1,
        category: 'General Education',
        usesCpp: false,
        description: 'Electrostatics, semiconductor physics, circuit theorems, and wave mechanics foundational for hardware comprehension.',
        prerequisites: ['None']
      },
      {
        code: 'HU100',
        name: 'English Comprehension & Composition',
        creditHours: '3+0',
        semester: 1,
        category: 'General Education',
        usesCpp: false,
        description: 'Reading comprehension, structured technical essays, grammar precision, and professional oral communication.',
        prerequisites: ['None']
      }
    ]
  },
  {
    semesterNumber: 2,
    year: 'Freshman Year - Spring',
    totalCredits: 17,
    summary: 'Transitioning from procedural code to enterprise Object-Oriented C++ paradigms, hardware logic, and linear algebra.',
    courses: [
      {
        code: 'CS212',
        name: 'Object Oriented Programming',
        creditHours: '3+1',
        semester: 2,
        category: 'Computing Core',
        usesCpp: true,
        cppTopics: ['Classes & Data Encapsulation', 'Constructors & Destructors (RAII)', 'Operator Overloading', 'Deep vs Shallow Copying', 'Inheritance & Virtual Tables (vptr/vtable)', 'Pure Virtual Functions & Abstract Classes', 'C++ Templates & Generic Programming', 'Exception Handling'],
        description: 'SEECS benchmark course. Master object models, dynamic polymorphism, memory ownership paradigms, and modular software architecture in C++.',
        prerequisites: ['CS110 (Fundamentals of Programming)'],
        labHighlights: ['Custom String and Dynamic Vector implementation', 'Polymorphic RPG game engine with virtual dispatch', 'Banking transactions simulator with safe operator overloading']
      },
      {
        code: 'MATH102',
        name: 'Linear Algebra',
        creditHours: '3+0',
        semester: 2,
        category: 'Mathematics',
        usesCpp: false,
        description: 'Matrices, Gaussian elimination, vector spaces, linear transformations, eigenvalues, and eigenvectors essential for graphics and AI.',
        prerequisites: ['None']
      },
      {
        code: 'CS220',
        name: 'Digital Logic Design',
        creditHours: '3+1',
        semester: 2,
        category: 'CS Core',
        usesCpp: false,
        description: 'Boolean algebra, logic gates, combinational circuits, sequential circuits (flip-flops, counters), and Verilog HDL design.',
        prerequisites: ['None']
      },
      {
        code: 'HU101',
        name: 'Islamic Studies / Ethics',
        creditHours: '2+0',
        semester: 2,
        category: 'General Education',
        usesCpp: false,
        description: 'Moral philosophies, Islamic teachings, social cohesion, and ethical considerations in scientific advancement.',
        prerequisites: ['None']
      },
      {
        code: 'HU107',
        name: 'Pakistan Studies',
        creditHours: '2+0',
        semester: 2,
        category: 'General Education',
        usesCpp: false,
        description: 'Historical milestones, constitutional evolution, socio-economic trajectory, and strategic international relations of Pakistan.',
        prerequisites: ['None']
      }
    ]
  },
  {
    semesterNumber: 3,
    year: 'Sophomore Year - Fall',
    totalCredits: 18,
    summary: 'The crucible semester: Data Structures in C++, low-level Assembly architecture, and Discrete Mathematics.',
    courses: [
      {
        code: 'CS214',
        name: 'Data Structures & Algorithms',
        creditHours: '3+1',
        semester: 3,
        category: 'Computing Core',
        usesCpp: true,
        cppTopics: ['Pointers to Pointers (**ptr)', 'Dynamic Arrays & Capacity Growth', 'Singly, Doubly, & Circular Linked Lists', 'Stacks & Queues (Array and Linked implementations)', 'Binary Trees & Binary Search Trees (BST)', 'Self-Balancing AVL Trees (Rotations)', 'Binary Heaps & Priority Queues', 'Graph Traversals (BFS, DFS)', 'Hash Tables with Separate Chaining'],
        description: 'The crown jewel of Computer Science. In-depth algorithmic complexity analysis, physical memory structures, and custom container implementations in C++.',
        prerequisites: ['CS212 (Object Oriented Programming)'],
        labHighlights: ['Building an STL-compatible Linked List from scratch', 'AVL Tree balancing engine with height invariants', 'Dijkstra shortest-path routing algorithm on custom graph nodes']
      },
      {
        code: 'CS250',
        name: 'Computer Organization & Assembly Language',
        creditHours: '3+1',
        semester: 3,
        category: 'CS Core',
        usesCpp: true,
        cppTopics: ['Translating C++ code to x86 Assembly', 'Call Stack Frames (ESP/EBP and RSP/RBP)', 'Memory Segments (.text, .data, .bss, heap, stack)', 'Inline Assembly in C++', 'Calling Conventions (cdecl, stdcall, fastcall)'],
        description: 'Bridge software and silicon. Understand processor registers, memory buses, instruction set architecture (ISA), and stack frame mechanics.',
        prerequisites: ['CS220 (Digital Logic Design)']
      },
      {
        code: 'MATH201',
        name: 'Discrete Mathematics',
        creditHours: '3+0',
        semester: 3,
        category: 'Mathematics',
        usesCpp: false,
        description: 'Propositional logic, predicate calculus, proof techniques, set theory, relations, combinatorics, and graph theory.',
        prerequisites: ['None']
      },
      {
        code: 'MATH230',
        name: 'Probability & Statistics',
        creditHours: '3+0',
        semester: 3,
        category: 'Mathematics',
        usesCpp: false,
        description: 'Sample spaces, Bayes theorem, random variables, probability distributions (Binomial, Poisson, Normal), hypothesis testing.',
        prerequisites: ['MATH101 (Calculus)']
      },
      {
        code: 'HU200',
        name: 'Technical & Business Writing',
        creditHours: '3+0',
        semester: 3,
        category: 'General Education',
        usesCpp: false,
        description: 'Research proposals, design documents, software specifications, formal executive briefings, and citation ethics.',
        prerequisites: ['HU100']
      }
    ]
  },
  {
    semesterNumber: 4,
    year: 'Sophomore Year - Spring',
    totalCredits: 17,
    summary: 'Low-level systems programming: Kernel architectures, relational databases, and rigorous algorithm design.',
    courses: [
      {
        code: 'CS330',
        name: 'Operating Systems',
        creditHours: '3+1',
        semester: 4,
        category: 'Computing Core',
        usesCpp: true,
        cppTopics: ['POSIX System Calls in C/C++', 'Process Lifecycle & fork() / exec()', 'Multi-threading (pthreads and std::jthread)', 'Mutexes, Spinlocks, & Semaphores', 'Deadlock Detection Algorithms', 'Virtual Memory Paging & Replacement (LRU, FIFO)', 'Custom Memory Allocators'],
        description: 'Operating system kernel internals. Understand CPU scheduling, concurrency synchronization, virtual memory paging, and file system layouts.',
        prerequisites: ['CS214 (Data Structures & Algorithms)', 'CS250 (COAL)'],
        labHighlights: ['Multi-threaded web server using C++ socket APIs', 'Readers-Writers synchronization problem with semaphores', 'Simulated virtual memory page table walker']
      },
      {
        code: 'CS311',
        name: 'Design & Analysis of Algorithms',
        creditHours: '3+0',
        semester: 4,
        category: 'CS Core',
        usesCpp: true,
        cppTopics: ['Divide and Conquer', 'Greedy Paradigms', 'Dynamic Programming in C++', 'Graph Algorithms (Kruskal, Prim, Bellman-Ford)', 'NP-Completeness and Reduction Proofs'],
        description: 'Rigorous asymptotic complexity analysis, recurrence relations, dynamic programming, and complexity class taxonomy (P vs NP).',
        prerequisites: ['CS214 (Data Structures)']
      },
      {
        code: 'CS340',
        name: 'Database Systems',
        creditHours: '3+1',
        semester: 4,
        category: 'Computing Core',
        usesCpp: false,
        description: 'Relational algebra, SQL, normalization (1NF up to BCNF), transaction concurrency (ACID), and indexing (B+ Trees).',
        prerequisites: ['CS214']
      },
      {
        code: 'MATH301',
        name: 'Multivariable Calculus & Differential Equations',
        creditHours: '3+0',
        semester: 4,
        category: 'Mathematics',
        usesCpp: false,
        description: 'Partial derivatives, multiple integrals, vector calculus (Green, Stokes theorems), and first/second-order ODEs.',
        prerequisites: ['MATH101']
      },
      {
        code: 'HU212',
        name: 'Social Sciences / University Elective',
        creditHours: '3+0',
        semester: 4,
        category: 'General Education',
        usesCpp: false,
        description: 'Sociology, psychology, or international affairs broaden humanistic perspective.',
        prerequisites: ['None']
      }
    ]
  },
  {
    semesterNumber: 5,
    year: 'Junior Year - Fall',
    totalCredits: 16,
    summary: 'Networking, formal language theory, software architecture, and specialized domain electives.',
    courses: [
      {
        code: 'CS360',
        name: 'Computer Networks',
        creditHours: '3+1',
        semester: 5,
        category: 'Computing Core',
        usesCpp: true,
        cppTopics: ['BSD Sockets API in C++', 'TCP vs UDP Protocols', 'Packet Serialization & Byte Ordering (htons/ntohs)', 'Raw Socket Inspection', 'Congestion Control Simulation'],
        description: 'OSI 7-layer and TCP/IP protocol stack, routing algorithms, media access control, packet headers, and network programming.',
        prerequisites: ['CS330 (Operating Systems)'],
        labHighlights: ['Client-Server Chat Engine using C++ TCP sockets', 'Packet sniffer and protocol analyzer in C++']
      },
      {
        code: 'CS320',
        name: 'Theory of Automata & Formal Languages',
        creditHours: '3+0',
        semester: 5,
        category: 'CS Core',
        usesCpp: false,
        description: 'Deterministic and Nondeterministic Finite Automata (DFA/NFA), Regular Expressions, Context-Free Grammars (CFG), Pushdown Automata, and Turing Machines.',
        prerequisites: ['MATH201 (Discrete Mathematics)']
      },
      {
        code: 'SE300',
        name: 'Software Engineering',
        creditHours: '3+0',
        semester: 5,
        category: 'Computing Core',
        usesCpp: false,
        description: 'SDLC methodologies (Agile, Scrum), requirement engineering, UML design diagrams, design patterns, testing strategies, and CI/CD.',
        prerequisites: ['CS212 (Object Oriented Programming)']
      },
      {
        code: 'CS370',
        name: 'Computer Graphics (Domain Elective)',
        creditHours: '3+1',
        semester: 5,
        category: 'CS Elective',
        usesCpp: true,
        cppTopics: ['Modern OpenGL / Vulkan with C++', 'Shader Programming (GLSL)', '3D Matrix Transformations (Model, View, Projection)', 'Ray Tracing Algorithms in C++'],
        description: 'Rendering pipelines, rasterization, lighting models (Phong/PBR), textures, framebuffers, and 3D graphics math.',
        prerequisites: ['CS214', 'MATH102']
      },
      {
        code: 'MATH350',
        name: 'Numerical Computing',
        creditHours: '3+0',
        semester: 5,
        category: 'Mathematics',
        usesCpp: true,
        cppTopics: ['Newton-Raphson method in C++', 'Numerical Integration (Trapezoidal, Simpson)', 'Gaussian Elimination Solver in C++'],
        description: 'Floating point precision errors, root finding, interpolation, numerical differentiation, and solving differential equations.',
        prerequisites: ['MATH101', 'MATH102']
      }
    ]
  },
  {
    semesterNumber: 6,
    year: 'Junior Year - Spring',
    totalCredits: 17,
    summary: 'Artificial Intelligence, high-performance Compiler Construction, and scalable systems.',
    courses: [
      {
        code: 'CS410',
        name: 'Artificial Intelligence',
        creditHours: '3+1',
        semester: 6,
        category: 'CS Core',
        usesCpp: true,
        cppTopics: ['Search Algorithms (A*, Minimax with Alpha-Beta pruning)', 'Constraint Satisfaction Problems', 'Inference Engines', 'C++ Neural Network Matrix Kernels'],
        description: 'Intelligent agents, heuristic search, game playing, knowledge representation, probabilistic reasoning, and introduction to machine learning.',
        prerequisites: ['CS214 (Data Structures & Algorithms)']
      },
      {
        code: 'CS430',
        name: 'Compiler Construction',
        creditHours: '3+1',
        semester: 6,
        category: 'CS Core',
        usesCpp: true,
        cppTopics: ['Lexical Analysis & Tokenizers in C++', 'Recursive Descent Parsers', 'Abstract Syntax Tree (AST) node hierarchies', 'Symbol Table Implementations using std::unordered_map', 'Intermediate Representation (IR) Generation', 'x86 Code Emission'],
        description: 'Deconstruct language engineering. Build a complete compiler from raw source strings to runnable machine instructions.',
        prerequisites: ['CS320 (Theory of Automata)', 'CS250 (COAL)'],
        labHighlights: ['Building an end-to-end toy language compiler in C++ compiling down to x86 assembly!']
      },
      {
        code: 'CS472',
        name: 'Distributed Systems (Domain Elective)',
        creditHours: '3+0',
        semester: 6,
        category: 'CS Elective',
        usesCpp: true,
        cppTopics: ['RPC Frameworks (gRPC with C++)', 'Consensus Algorithms (Raft, Paxos)', 'Distributed Key-Value Stores in C++'],
        description: 'Clock synchronization, distributed mutual exclusion, fault tolerance, replication, and distributed consensus.',
        prerequisites: ['CS330', 'CS360']
      },
      {
        code: 'CS442',
        name: 'Web Technologies & Frameworks',
        creditHours: '3+1',
        semester: 6,
        category: 'CS Elective',
        usesCpp: false,
        description: 'Modern front-end frameworks (React, Next.js), backend REST/GraphQL APIs, authentication, and web security.',
        prerequisites: ['CS340']
      },
      {
        code: 'MGT201',
        name: 'Entrepreneurship & Tech Management',
        creditHours: '2+0',
        semester: 6,
        category: 'General Education',
        usesCpp: false,
        description: 'Tech startup ideation, venture capital pitching, business models, intellectual property (patents), and scaling strategies.',
        prerequisites: ['None']
      }
    ]
  },
  {
    semesterNumber: 7,
    year: 'Senior Year - Fall',
    totalCredits: 16,
    summary: 'Senior capstone project kickoff, cybersecurity protocols, and cutting-edge specialized computing domains.',
    courses: [
      {
        code: 'CS499A',
        name: 'Senior Design Project / FYP - Part I',
        creditHours: '0+3',
        semester: 7,
        category: 'Final Year Project',
        usesCpp: false,
        description: 'Project proposal, comprehensive literature review, architecture blueprint, feasibility study, and preliminary proof of concept under SEECS faculty supervision.',
        prerequisites: ['Senior Standing']
      },
      {
        code: 'CS450',
        name: 'Information Security',
        creditHours: '3+0',
        semester: 7,
        category: 'CS Core',
        usesCpp: true,
        cppTopics: ['Buffer Overflow Exploits & Shellcode Injection', 'Cryptographic Primitives (AES, RSA) implementations in C++', 'Memory Sanitizers & Secure Coding in C++'],
        description: 'Symmetric and asymmetric encryption, public key infrastructure (PKI), software vulnerabilities, buffer exploits, network security, and defense in depth.',
        prerequisites: ['CS330', 'CS360']
      },
      {
        code: 'CS480',
        name: 'Machine Learning (Domain Elective)',
        creditHours: '3+0',
        semester: 7,
        category: 'CS Elective',
        usesCpp: false,
        description: 'Supervised learning (Linear/Logistic regression, SVMs, Decision Trees), Unsupervised learning (K-means, PCA), and introduction to Deep Learning.',
        prerequisites: ['MATH102', 'MATH230']
      },
      {
        code: 'CS482',
        name: 'Cloud Computing (Domain Elective)',
        creditHours: '3+0',
        semester: 7,
        category: 'CS Elective',
        usesCpp: false,
        description: 'Virtualization, hypervisors, containerization (Docker, Kubernetes), serverless computing, microservices, and AWS/GCP architecture.',
        prerequisites: ['CS330', 'CS360']
      },
      {
        code: 'SS100',
        name: 'Professional Ethics & Social Responsibility',
        creditHours: '2+0',
        semester: 7,
        category: 'General Education',
        usesCpp: false,
        description: 'ACM/IEEE code of ethics, digital privacy laws, AI ethics, whistleblower dilemmas, and software accountability.',
        prerequisites: ['None']
      }
    ]
  },
  {
    semesterNumber: 8,
    year: 'Senior Year - Spring',
    totalCredits: 14,
    summary: 'Senior project defense, industry deployment, and graduation readiness.',
    courses: [
      {
        code: 'CS499B',
        name: 'Senior Design Project / FYP - Part II',
        creditHours: '0+3',
        semester: 8,
        category: 'Final Year Project',
        usesCpp: false,
        description: 'Full system implementation, industrial deployment, rigorous empirical validation, comprehensive technical report, and public defense before the SEECS examination board.',
        prerequisites: ['CS499A']
      },
      {
        code: 'CS485',
        name: 'High Performance Computing (Domain Elective)',
        creditHours: '3+0',
        semester: 8,
        category: 'CS Elective',
        usesCpp: true,
        cppTopics: ['OpenMP Multi-core Parallelism', 'MPI Distributed Memory Clusters in C++', 'CUDA GPU Acceleration with C++', 'SIMD Vectorization'],
        description: 'Parallel architectures, shared memory parallelism, message passing interface, and GPU programming for petascale computational workloads.',
        prerequisites: ['CS330 (Operating Systems)']
      },
      {
        code: 'CS465',
        name: 'Mobile Application Development',
        creditHours: '3+0',
        semester: 8,
        category: 'CS Elective',
        usesCpp: false,
        description: 'Native and hybrid mobile engineering, reactive state lifecycles, background services, local caching, and app store deployment.',
        prerequisites: ['CS212']
      },
      {
        code: 'MGT301',
        name: 'Project Management & Leadership',
        creditHours: '3+0',
        semester: 8,
        category: 'General Education',
        usesCpp: false,
        description: 'Work breakdown structures, Gantt planning, risk management matrices, agile sprint velocity, and engineering leadership.',
        prerequisites: ['None']
      }
    ]
  }
];

export const NUST_ACADEMIC_STATS = {
  institution: 'School of Electrical Engineering & Computer Science (SEECS), NUST',
  degree: 'Bachelor of Science in Computer Science (BSCS)',
  durationYears: 4,
  semesters: 8,
  totalCreditHours: 134,
  cppCoreCoursesCount: 8,
  accreditation: 'NCEAC Level-II (Highest Washington Accord equivalent)',
  location: 'H-12 Campus, Islamabad, Pakistan',
};
