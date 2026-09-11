import { Badge, BugChallenge, Module } from '../types';

export const CURRICULUM_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'The Forge: C++ Fundamentals (CS110)',
    tagline: 'Step close to the metal. Maps directly to NUST SEECS CS110: Fundamentals of Programming.',
    iconName: 'Flame',
    accentColor: '#38bdf8',
    description: 'Master the compilation model, streams, byte-level primitive types, and control flow. Perfect prep for your first SEECS coding labs.',
    lessons: [
      {
        id: 'm1-l1',
        moduleId: 'm1',
        title: 'The C++ Mental Model',
        subtitle: 'Why C++? Zero-cost abstractions and closeness to silicon',
        durationMinutes: 6,
        xpReward: 100,
        content: {
          hook: 'Most modern languages put an interpreter or garbage collector between you and the CPU. C++ does not. When you write C++, you are commanding the hardware directly.',
          mentalModel: 'Think of Python or JavaScript as riding a self-driving luxury taxi with automatic climate control and a speed limiter. C++ is a Formula 1 car: you have manual gear shifting, direct throttle response, no traction control by default, and blistering speed.',
          explanation: [
            'C++ was created by Bjarne Stroustrup in 1979 at Bell Labs as an extension of C ("C with Classes").',
            'Its founding philosophy is "Zero-Overhead Principle": What you don\'t use, you don\'t pay for. And what you do use, you could not have written better by hand.',
            'C++ compiles directly to native CPU machine instructions (x86_64, ARM) through a multi-stage pipeline: Preprocessor ➔ Compiler ➔ Assembler ➔ Linker.'
          ],
          codeExample: `// Welcome to C++!
#include <iostream>
using namespace std;

int main() {
    cout << "System initialized: C++ memory runtime active." << endl;
    return 0; // 0 signals successful execution to the OS
} `,
          examples: [
            {
              title: 'Example 1: Standard Output Stream (cout)',
              description: 'The canonical starting point for all C++ software development.',
              code: `// Canonical C++ Program Structure
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    cout << "Systems Programming with C++." << endl;
    return 0;
}`,
              expectedOutput: 'Hello World!\nSystems Programming with C++.\n',
              explanation: 'Line 1 is a comment. Line 2 includes the iostream header library. Line 3 brings std symbols into global scope. Line 5 is main(), where every C++ program begins execution.'
            },
            {
              title: 'Example 2: Arithmetic Evaluation & Stream Output',
              description: 'Printing calculations directly through the output stream.',
              code: `// Calculations with cout
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int y = 25;
    cout << "x = " << x << ", y = " << y << endl;
    cout << "Sum: " << x + y << endl;
    cout << "Product: " << x * y << endl;
    return 0;
}`,
              expectedOutput: 'x = 10, y = 25\nSum: 35\nProduct: 250\n',
              explanation: 'Stream insertion (<<) can take expressions directly. The compiler evaluates x + y before passing the result to cout.'
            }
          ],
          deepDive: {
            title: 'Under The Hood: Compilation Pipeline',
            content: 'The preprocessor replaces #include with raw header contents. The compiler turns C++ into assembly. The assembler produces object files (.o/.obj). The linker glues standard libraries and produces the final executable binary.'
          },
          interactivePrompt: {
            task: 'Run the program and observe the main() stack frame initialize and stream output to the console.',
            hint: 'Click the "Run Code" button in the interactive sandbox.',
            starterCode: `#include <iostream>

int main() {
    std::cout << "Hello from C++ Odyssey!" << std::endl;
    return 0;
}`
          }
        },
        quiz: [
          {
            id: 'q1-1',
            category: 'basics',
            prompt: 'What is the core idea behind the C++ "Zero-Overhead Principle"?',
            xpReward: 50,
            options: [
              {
                text: 'All variables consume 0 bytes of memory.',
                isCorrect: false,
                explanation: 'Variables must occupy memory space!'
              },
              {
                text: 'What you do not use, you do not pay for, and abstractions have no runtime penalty over hand-tuned assembly.',
                isCorrect: true,
                explanation: 'Exactly! C++ gives high-level abstractions without runtime bloat.'
              },
              {
                text: 'C++ programs do not require an operating system to run.',
                isCorrect: false,
                explanation: 'While C++ can run bare-metal in kernels, standard programs run on an OS.'
              }
            ]
          }
        ]
      },
      {
        id: 'm1-l2',
        moduleId: 'm1',
        title: 'Streams & I/O: cout & cin',
        subtitle: 'Pumping data in and out using bitshift stream operators',
        durationMinutes: 8,
        xpReward: 120,
        content: {
          hook: 'Why does C++ use << and >> for printing and reading? Because data is envisioned as a continuous river of bytes flowing into or out of streams!',
          mentalModel: 'Think of std::cout as a conveyor belt leading to your monitor screen. The << operator pushes objects onto that belt. Think of std::cin as a chute from your keyboard into your variables.',
          explanation: [
            '`#include <iostream>` provides input/output stream capabilities.',
            '`std::cout` stands for "Character Output". `std::cin` stands for "Character Input".',
            '`std::endl` writes a newline character AND flushes the stream buffer so output appears immediately.'
          ],
          codeExample: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int bufferId = 21;
    double throughputMb = 3.92;
    string subsystem = "TelemetryEngine";

    cout << "Subsystem: " << subsystem << " | Buffer: " << bufferId << " | Rate: " << throughputMb << " MB/s" << endl;
    return 0;
} `,
          examples: [
            {
              title: 'Example: Multi-Variable Formatting',
              description: 'Combining strings and variable values in a single cout pipeline.',
              code: `// Printing Multiple Variables
#include <iostream>
using namespace std;

int main() {
    int minutesPerHour = 60;
    float pi = 3.14;
    cout << "Minutes per hour: " << minutesPerHour << endl;
    cout << "Value of PI: " << pi << endl;
    return 0;
}`,
              expectedOutput: 'Minutes per hour: 60\nValue of PI: 3.14\n',
              explanation: 'You can chain multiple insertion operators (<<) in sequence to format and output data cleanly.'
            }
          ],
          deepDive: {
            title: '\\n vs std::endl',
            content: 'Prefer "\\n" over std::endl in performance-critical loops! std::endl forces an OS buffer flush, which can be thousands of times slower in tight printing loops.'
          }
        },
        quiz: [
          {
            id: 'q1-2',
            category: 'basics',
            prompt: 'What does std::endl do besides inserting a newline?',
            xpReward: 50,
            options: [
              {
                text: 'It flushes the output stream buffer.',
                isCorrect: true,
                explanation: 'Correct! It writes a newline and calls flush(), forcing buffered text to output immediately.'
              },
              {
                text: 'It clears all variables in main.',
                isCorrect: false,
                explanation: 'Variables remain intact.'
              },
              {
                text: 'It pauses the program for 100 milliseconds.',
                isCorrect: false,
                explanation: 'No pause occurs.'
              }
            ]
          }
        ]
      },
      {
        id: 'm1-l3',
        moduleId: 'm1',
        title: 'Types, Sizes & Memory Budget',
        subtitle: 'Understanding 1, 2, 4, and 8-byte primitives in physical RAM',
        durationMinutes: 10,
        xpReward: 150,
        content: {
          hook: 'In higher-level languages, an integer is just "a number". In C++, an integer is a precise hardware slot: 4 bytes (32 bits) of high-speed silicon cache.',
          mentalModel: 'Imagine memory as an infinite row of numbered locker boxes. A `char` takes 1 locker. An `int` takes 4 consecutive lockers. A `double` takes 8 lockers.',
          explanation: [
            'Fundamental types have fixed sizes: `char` (1 byte), `short` (2 bytes), `int` (usually 4 bytes), `long long` (8 bytes), `float` (4 bytes), `double` (8 bytes), `bool` (1 byte).',
            '`sizeof(type)` operator returns the exact memory footprint in bytes at compile time.',
            'Unsigned types (`unsigned int`) represent only non-negative numbers, doubling the positive range.'
          ],
          codeExample: `#include <iostream>
using namespace std;

int main() {
    int score = 9500;
    double pi = 3.14159265;
    char grade = 'S';
    bool isChampion = true;

    cout << "int size: " << sizeof(score) << " bytes" << endl;
    cout << "double size: " << sizeof(pi) << " bytes" << endl;
    cout << "char size: " << sizeof(grade) << " byte" << endl;
    return 0;
}`,
          examples: [
            {
              title: 'Example: Primitive Type Memory Footprint (sizeof)',
              description: 'Using the sizeof operator to measure data types in physical RAM.',
              code: `// Data Type Sizes
#include <iostream>
using namespace std;

int main() {
    cout << "Size of char: " << sizeof(char) << " byte" << endl;
    cout << "Size of int: " << sizeof(int) << " bytes" << endl;
    cout << "Size of float: " << sizeof(float) << " bytes" << endl;
    cout << "Size of double: " << sizeof(double) << " bytes" << endl;
    return 0;
}`,
              expectedOutput: 'Size of char: 1 byte\nSize of int: 4 bytes\nSize of float: 4 bytes\nSize of double: 8 bytes\n',
              explanation: 'Understanding byte budgets is essential in systems programming, embedded firmware, and SEECS CS110/CS250 exams.'
            }
          ],
          deepDive: {
            title: 'Integer Overflow Trap',
            content: 'Signed integer overflow is UNDEFINED BEHAVIOR in C++. If a 32-bit signed int exceeds 2,147,483,647, the compiler is legally permitted to optimize assuming it never happens, leading to bizarre bugs!'
          }
        },
        quiz: [
          {
            id: 'q1-3',
            category: 'basics',
            prompt: 'On typical modern 64-bit systems, how many bytes does a standard `int` and `double` occupy?',
            xpReward: 50,
            options: [
              {
                text: 'int = 4 bytes, double = 8 bytes',
                isCorrect: true,
                explanation: 'Right! Standard IEEE-754 double is 64 bits (8 bytes), and 32-bit int is 4 bytes.'
              },
              {
                text: 'int = 8 bytes, double = 4 bytes',
                isCorrect: false,
                explanation: 'A double is twice as large as an int.'
              },
              {
                text: 'Both occupy 16 bytes.',
                isCorrect: false,
                explanation: 'Way too large for primitives.'
              }
            ]
          }
        ]
      },
      {
        id: 'm1-l4',
        moduleId: 'm1',
        title: 'Pass-by-Value vs Pass-by-Reference',
        subtitle: 'Why copying a 10MB struct is a crime, and how `&` saves the day',
        durationMinutes: 10,
        xpReward: 160,
        content: {
          hook: 'If you ask your friend to look at your passport, you don\'t photocopy every page and give them the copy—you just hand them the original. That is pass-by-reference!',
          mentalModel: 'Pass-by-value makes a duplicate photocopy. If they draw a mustache on the copy, your original is untouched. Pass-by-reference gives them direct access to your original notebook.',
          explanation: [
            'By default, C++ functions pass arguments **by value** (creating a full bitwise copy).',
            'Pass by reference (`type& name`) avoids copying and allows the function to mutate the caller\'s variable directly.',
            'Pass by const reference (`const type& name`) gives you zero-copy performance while guaranteeing the function cannot accidentally modify your data.'
          ],
          codeExample: `#include <iostream>
using namespace std;

// Pass by reference using &
void incrementPacketCounter(int& counter) {
    counter += 1; // Modifies caller's variable directly!
}

int main() {
    int packetCount = 100;
    incrementPacketCounter(packetCount);
    cout << "Updated packet count: " << packetCount << endl; // Prints 101
    return 0;
}`,
          examples: [
            {
              title: 'Example: Value Swapping via Reference Parameters',
              description: 'Classic swap function using C++ reference parameters.',
              code: `// Swap Values by Reference
#include <iostream>
using namespace std;

int main() {
    int first = 10;
    int second = 20;
    cout << "Before swap: first = " << first << ", second = " << second << endl;

    int temp = first;
    first = second;
    second = temp;

    cout << "After swap: first = " << first << ", second = " << second << endl;
    return 0;
}`,
              expectedOutput: 'Before swap: first = 10, second = 20\nAfter swap: first = 20, second = 10\n',
              explanation: 'Passing references gives the function direct access to caller memory without copying values.'
            }
          ],
          deepDive: {
            title: 'Const Reference: The Golden Standard',
            content: 'In modern C++, passing large objects (like std::vector or std::string) as `const std::string&` is the industry standard for read-only arguments. Zero copy, zero mutation risk.'
          }
        },
        quiz: [
          {
            id: 'q1-4',
            category: 'basics',
            prompt: 'Why should you pass large objects by `const Type&` instead of `Type`?',
            xpReward: 60,
            options: [
              {
                text: 'It prevents expensive copying of data while guaranteeing read-only safety.',
                isCorrect: true,
                explanation: 'Spot on! Const reference avoids memory duplication and enforces immutability.'
              },
              {
                text: 'It automatically encrypts the data during transmission.',
                isCorrect: false,
                explanation: 'C++ references do not encrypt data.'
              },
              {
                text: 'It stores the object in the CPU registers forever.',
                isCorrect: false,
                explanation: 'Registers are temporary hardware slots.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'The Matrix of Memory: Pointers (CS214 Prep)',
    tagline: 'Demystify C++ pointers, addresses, and dynamic memory. Essential foundation for SEECS CS214: Data Structures & Algorithms.',
    iconName: 'Cpu',
    accentColor: '#10b981',
    description: 'Master the address-of operator &, dereference operator *, dynamic allocation with new/delete, and avoid memory leaks before you build linked lists.',
    lessons: [
      {
        id: 'm2-l1',
        moduleId: 'm2',
        title: 'Addresses & The Address-of Operator (&)',
        subtitle: 'Every byte in physical RAM has a unique postal code',
        durationMinutes: 9,
        xpReward: 160,
        content: {
          hook: 'Your computer has gigabytes of RAM. How does the CPU find your variable `x`? Every single byte has a numerical address, usually written in hexadecimal!',
          mentalModel: 'Think of memory as a massive hotel with millions of rooms. Variable `x` is in room #0x7ffd20. The `&` operator tells you the room number.',
          explanation: [
            'The address-of operator `&` retrieves the hexadecimal memory address of any variable in RAM.',
            'Addresses look like `0x7ffd20` (in hexadecimal notation, base 16).',
            'Variables placed close to each other in local scope often have adjacent memory addresses.'
          ],
          codeExample: `#include <iostream>

int main() {
    int health = 100;
    int armor = 50;

    std::cout << "Value of health: " << health << std::endl;
    std::cout << "Memory address of health (&health): " << &health << std::endl;
    std::cout << "Memory address of armor (&armor): " << &armor << std::endl;
    return 0;
}`,
          deepDive: {
            title: 'Hexadecimal Notation',
            content: 'Hex uses digits 0-9 and letters A-F. 0x prefix denotes hex. 0x10 in hex is 16 in decimal. 0xFF is 255.'
          }
        },
        quiz: [
          {
            id: 'q2-1',
            category: 'memory',
            prompt: 'Given `int gold = 500;`, what does `&gold` evaluate to?',
            xpReward: 60,
            options: [
              {
                text: 'The memory address where `gold` is stored in RAM.',
                isCorrect: true,
                explanation: 'Yes! The & operator returns the memory address.'
              },
              {
                text: 'The value 500.',
                isCorrect: false,
                explanation: 'That is `gold`, not `&gold`.'
              },
              {
                text: 'A bitwise AND operation with zero.',
                isCorrect: false,
                explanation: 'When unary, & is the address-of operator.'
              }
            ]
          }
        ]
      },
      {
        id: 'm2-l2',
        moduleId: 'm2',
        title: 'Pointers Demystified (*)',
        subtitle: 'Variables whose sole purpose in life is to store memory addresses',
        durationMinutes: 12,
        xpReward: 200,
        content: {
          hook: 'Pointers terrify beginners because people explain them with confusing arrows. But a pointer is simply a variable that holds a house address instead of a number!',
          mentalModel: 'If variable `treasure` is the gold chest, then pointer `ptr` is a piece of paper with the map coordinates written on it. The asterisk `*ptr` means: "Go to that location and open the chest!"',
          explanation: [
            'Declaration: `int* ptr = &x;` creates a pointer pointing to `x`.',
            'Dereference: `*ptr` accesses or modifies the value stored at the address `ptr` is pointing to.',
            'If you change `*ptr = 99;`, you are changing `x` itself!',
            'Always initialize pointers! An uninitialized pointer holds garbage random addresses (wild pointer).'
          ],
          codeExample: `#include <iostream>
using namespace std;

int main() {
    int power = 42;
    int* ptr = &power; // ptr stores address of power

    cout << "Original power: " << power << endl;
    cout << "Pointer value (address): " << ptr << endl;
    cout << "Dereferenced value (*ptr): " << *ptr << endl;

    *ptr = 100; // Mutate power via pointer!
    cout << "New power: " << power << endl; // Prints 100!
    return 0;
}`,
          examples: [
            {
              title: 'Example 1: Address Resolution & Pointer Dereferencing',
              description: 'Storing an address and accessing the underlying variable value.',
              code: `// Address Reference and Pointer Dereference
#include <iostream>
using namespace std;

int main() {
    string deviceName = "Router-01";
    string* ptr = &deviceName; // Pointer storing the address of deviceName

    cout << "Device name: " << deviceName << endl;
    cout << "Memory address: " << &deviceName << endl;
    cout << "Value in ptr: " << ptr << endl;
    cout << "Dereferenced *ptr: " << *ptr << endl;
    return 0;
}`,
              expectedOutput: 'Device name: Router-01\nMemory address: 0x7ffd20\nValue in ptr: 0x7ffd20\nDereferenced *ptr: Router-01\n',
              explanation: 'A pointer variable points to a specific data type and is declared with the * operator. Storing &deviceName captures its memory address.'
            },
            {
              title: 'Example 2: Value Mutation via Pointer Dereference',
              description: 'Changing a variable value indirectly through its pointer.',
              code: `// Modify Values via Pointers
#include <iostream>
using namespace std;

int main() {
    string networkStatus = "IDLE";
    string* ptr = &networkStatus;

    cout << "Initial status: " << networkStatus << endl;
    *ptr = "CONNECTED"; // Change the value through pointer
    cout << "Updated status: " << networkStatus << endl;
    return 0;
}`,
              expectedOutput: 'Initial status: IDLE\nUpdated status: CONNECTED\n',
              explanation: 'Mutating *ptr changes the value stored in the original variable because ptr holds its direct memory address.'
            }
          ],
          deepDive: {
            title: 'nullptr: The Safe Zero Address',
            content: 'In modern C++, always use `nullptr` rather than `NULL` or `0`. `nullptr` is type-safe and avoids ambiguous function overload matches.'
          }
        },
        quiz: [
          {
            id: 'q2-2',
            category: 'memory',
            prompt: 'If `int* p = &val;` and we execute `*p = 77;`, what happens to `val`?',
            xpReward: 70,
            options: [
              {
                text: '`val` changes to 77.',
                isCorrect: true,
                explanation: 'Correct! Dereferencing the pointer directly modifies the target variable.'
              },
              {
                text: '`p` now points to address 77.',
                isCorrect: false,
                explanation: 'To change what p points to, you would write `p = ...`, not `*p = ...`.'
              },
              {
                text: 'A compile error occurs.',
                isCorrect: false,
                explanation: 'This is completely valid C++ syntax.'
              }
            ]
          }
        ]
      },
      {
        id: 'm2-l3',
        moduleId: 'm2',
        title: 'Stack vs Heap: Dynamic Memory',
        subtitle: 'The automatic speed of the Stack vs the boundless freedom of the Heap',
        durationMinutes: 14,
        xpReward: 220,
        content: {
          hook: 'Where does your program\'s memory come from? The operating system gives your program two distinct memory playgrounds: The Stack and The Heap.',
          mentalModel: 'The Stack is like a stack of cafeteria trays: ultra fast, automatically added and removed when functions return, but limited in size (typically 1MB - 8MB). The Heap is like a giant warehouse: vast and persistent, but you must manually request space (`new`) and clean it up (`delete`).',
          explanation: [
            'Stack memory is managed automatically via scope `{ ... }`. When a function returns, all local variables are destroyed instantly.',
            'Heap memory persists until you explicitly free it. You allocate with `new` and must deallocate with `delete`.',
            'If you allocate on the heap and lose the pointer without calling `delete`, that memory is lost until the program exits: A MEMORY LEAK!'
          ],
          codeExample: `#include <iostream>

int main() {
    // Stack allocation (automatic cleanup)
    int stackVar = 10;

    // Heap allocation (manual cleanup required!)
    int* heapVar = new int(42);

    std::cout << "Heap variable value: " << *heapVar << std::endl;

    // Must deallocate heap memory!
    delete heapVar;
    heapVar = nullptr; // Good practice: prevent dangling pointer!

    return 0;
}`,
          deepDive: {
            title: 'Dangling Pointers & Double Free',
            content: 'Calling delete frees the memory, but the pointer still holds the old address! Dereferencing it is a "Use-After-Free" bug. Calling delete twice on the same pointer is a "Double Free" crash.'
          }
        },
        quiz: [
          {
            id: 'q2-3',
            category: 'memory',
            prompt: 'What happens if a program repeatedly allocates heap memory with `new` without calling `delete`?',
            xpReward: 70,
            options: [
              {
                text: 'A memory leak occurs, gradually consuming system RAM until the OS terminates the process.',
                isCorrect: true,
                explanation: 'Exactly! C++ does not have a garbage collector, so unreleased heap memory leaks.'
              },
              {
                text: 'The compiler automatically inserts delete statements at runtime.',
                isCorrect: false,
                explanation: 'The compiler does not do garbage collection for raw pointers.'
              },
              {
                text: 'The stack will overflow.',
                isCorrect: false,
                explanation: 'Heap allocations consume heap space, not stack space.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'The Blueprint Realm: OOP & RAII (CS212)',
    tagline: 'Unlock Object-Oriented Programming and RAII. Aligns with SEECS CS212: Object Oriented Programming.',
    iconName: 'Shield',
    accentColor: '#a855f7',
    description: 'Learn Classes, Structs, Encapsulation, Constructors, Destructors, and the magic of RAII for secure resource management.',
    lessons: [
      {
        id: 'm3-l1',
        moduleId: 'm3',
        title: 'Classes, Structs & Encapsulation',
        subtitle: 'Building custom data fortresses with public and private access',
        durationMinutes: 10,
        xpReward: 180,
        content: {
          hook: 'In C, structs only held passive data. In C++, structs and classes can have behavior, private invariants, constructors, and destructors!',
          mentalModel: 'Think of a bank account class. You don\'t want anyone to directly write `account.balance = 999999`. You make `balance` private and provide a public `deposit()` method that verifies rules.',
          explanation: [
            'Difference between `struct` and `class` in C++: In a `struct`, members are `public` by default. In a `class`, members are `private` by default.',
            'Encapsulation bundles data and the functions that manipulate that data, hiding internal state from accidental tampering.',
            '`public:` marks members accessible anywhere. `private:` marks members only accessible from within the class.'
          ],
          codeExample: `#include <iostream>
#include <string>

class NetworkSocket {
private:
    int bufferRemaining = 1024;
    std::string socketId;

public:
    NetworkSocket(std::string id) : socketId(id) {}

    void consumeBytes(int bytes) {
        bufferRemaining -= bytes;
        if (bufferRemaining < 0) bufferRemaining = 0;
    }

    int getBufferRemaining() const { return bufferRemaining; }
    std::string getId() const { return socketId; }
};

int main() {
    NetworkSocket sock("TCP:8080");
    sock.consumeBytes(256);
    std::cout << sock.getId() << " Remaining Buffer: " << sock.getBufferRemaining() << " bytes" << std::endl;
    return 0;
}`,
          deepDive: {
            title: 'Const Member Functions',
            content: 'Notice `int getHealth() const`. The trailing `const` promises the compiler that this method will NOT modify any member variables of the object.'
          }
        },
        quiz: [
          {
            id: 'q3-1',
            category: 'oop',
            prompt: 'What is the ONLY difference between `class` and `struct` in C++?',
            xpReward: 60,
            options: [
              {
                text: 'Default member visibility: `class` is private by default, `struct` is public by default.',
                isCorrect: true,
                explanation: 'Spot on! Otherwise, they are functionally identical in C++.'
              },
              {
                text: 'Classes support methods, while structs cannot have methods.',
                isCorrect: false,
                explanation: 'In C++, structs can have methods, constructors, and destructors just like classes.'
              },
              {
                text: 'Structs are allocated on the stack; classes are allocated on the heap.',
                isCorrect: false,
                explanation: 'Both can be allocated on stack or heap depending on how you create them.'
              }
            ]
          }
        ]
      },
      {
        id: 'm3-l2',
        moduleId: 'm3',
        title: 'RAII & Destructors: The Superpower',
        subtitle: 'Resource Acquisition Is Initialization: Never leak resources again',
        durationMinutes: 12,
        xpReward: 220,
        content: {
          hook: 'What if you could guarantee that files close, sockets disconnect, locks release, and memory frees automatically even if an exception is thrown? That is RAII!',
          mentalModel: 'Imagine a personal assistant who opens an umbrella when you step into the rain, and who is physically tethered to you so that the instant you step inside a building (go out of scope), the umbrella automatically collapses.',
          explanation: [
            'RAII binds the lifecycle of a resource (heap memory, file handle, GPU buffer) to the lifetime of a stack object.',
            'Constructor acquires the resource: `FileHandle file("data.txt");`',
            'Destructor (`~ClassName()`) automatically releases the resource when the object falls out of scope `{ ... }`.',
            'Because C++ guarantees that stack objects are destroyed in reverse order of creation, cleanup is 100% deterministic.'
          ],
          codeExample: `#include <iostream>

class ScopedBuffer {
private:
    int* data;
public:
    ScopedBuffer(int size) {
        data = new int[size];
        std::cout << "Acquired buffer of size " << size << " on heap!\\n";
    }

    ~ScopedBuffer() {
        delete[] data;
        std::cout << "Destructor ran! Cleaned up heap buffer automatically.\\n";
    }
};

int main() {
    {
        ScopedBuffer buf(1024); // Constructor acquires
        std::cout << "Doing work inside scope...\\n";
    } // buf goes out of scope here -> Destructor runs automatically!

    std::cout << "Scope ended cleanly with zero leaks!\\n";
    return 0;
}`,
          deepDive: {
            title: 'Deterministic Destruction vs Garbage Collection',
            content: 'In Java or C#, garbage collection runs at an unpredictable future time. In C++, destruction happens the microsecond the closing bracket `}` is reached!'
          }
        },
        quiz: [
          {
            id: 'q3-2',
            category: 'oop',
            prompt: 'When does an object\'s destructor (`~MyClass()`) execute in C++?',
            xpReward: 70,
            options: [
              {
                text: 'The exact moment the object goes out of scope or is deleted.',
                isCorrect: true,
                explanation: 'Deterministic destruction! As soon as scope exits, destructors run.'
              },
              {
                text: 'Whenever the garbage collector decides to run.',
                isCorrect: false,
                explanation: 'C++ has no garbage collector; destruction is immediate.'
              },
              {
                text: 'Only when the computer restarts.',
                isCorrect: false,
                explanation: 'Definitely not!'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm4',
    title: 'The Modern Era: Smart Pointers & Move Semantics',
    tagline: 'Say goodbye to raw pointers and manual delete. Modern C++ is safe, expressive, and blazing fast.',
    iconName: 'Zap',
    accentColor: '#f59e0b',
    description: 'Master unique_ptr, shared_ptr, auto, lambdas, and move semantics (std::move).',
    lessons: [
      {
        id: 'm4-l1',
        moduleId: 'm4',
        title: 'Smart Pointers: unique_ptr & shared_ptr',
        subtitle: 'Never type raw `delete` in modern C++ code again',
        durationMinutes: 12,
        xpReward: 240,
        content: {
          hook: 'In Modern C++ (C++11 and beyond), writing raw `new` and `delete` in application code is considered an anti-pattern. Smart pointers do the memory management for you!',
          mentalModel: '`std::unique_ptr` is exclusive ownership: only one key to the house exists. `std::shared_ptr` is shared ownership: a reference counter tracks how many keys exist. When the last key is dropped, the house is automatically demolished.',
          explanation: [
            '`std::unique_ptr`: Sole owner of a heap object. Cannot be copied, only moved (`std::move`). Overhead: exactly zero bytes compared to a raw pointer!',
            '`std::make_unique<T>(args...)` (C++14) is the safest way to create a unique_ptr.',
            '`std::shared_ptr`: Multiple pointers share ownership. Keeps a reference count on the heap. When refcount hits 0, deletes the object automatically.'
          ],
          codeExample: `#include <iostream>
#include <memory>

int main() {
    // Unique ownership: Zero overhead, impossible to leak!
    auto u1 = std::make_unique<int>(1337);
    std::cout << "u1 value: " << *u1 << std::endl;

    // Transfer ownership to u2:
    auto u2 = std::move(u1); 
    // u1 is now nullptr! u2 owns the heap resource.

    if (!u1) {
        std::cout << "u1 is safely empty now." << std::endl;
    }
    std::cout << "u2 value: " << *u2 << std::endl;

    return 0; // u2 destructor automatically frees heap memory!
}`,
          deepDive: {
            title: 'Circular Reference Trap with shared_ptr',
            content: 'If Object A holds a shared_ptr to Object B, and Object B holds a shared_ptr to Object A, their ref count will never drop to 0! To break cycles, use `std::weak_ptr`.'
          }
        },
        quiz: [
          {
            id: 'q4-1',
            category: 'modern',
            prompt: 'Can you copy a `std::unique_ptr` with assignment operator `=`?',
            xpReward: 70,
            options: [
              {
                text: 'No, copy is deleted; you can only transfer ownership using `std::move`.',
                isCorrect: true,
                explanation: 'Yes! It represents UNIQUE ownership, so copying is strictly forbidden.'
              },
              {
                text: 'Yes, it makes a deep copy of the heap object.',
                isCorrect: false,
                explanation: 'unique_ptr does not copy.'
              },
              {
                text: 'Yes, it converts it into a shared_ptr automatically.',
                isCorrect: false,
                explanation: 'Conversion requires explicit std::shared_ptr construction.'
              }
            ]
          }
        ]
      },
      {
        id: 'm4-l2',
        moduleId: 'm4',
        title: 'Move Semantics: Zero-Cost Stealing',
        subtitle: 'Why copy a massive array when you can just steal the pointer?',
        durationMinutes: 14,
        xpReward: 250,
        content: {
          hook: 'If you move to a new apartment, do you rebuild all your furniture from sawdust? No! You just move the existing furniture into the new room. Move semantics does this for C++ objects.',
          mentalModel: 'Copying a 1GB vector copies 1 billion numbers. Moving a 1GB vector simply swaps three 8-byte internal pointers: data, size, capacity. It takes 2 nanoseconds regardless of whether the vector has 10 elements or 10 million elements!',
          explanation: [
            'Lvalue: An object with a name and persistent memory address (e.g. `int x = 5`).',
            'Rvalue: A temporary value that is about to expire (e.g. `5 + 3`, or returned temporary).',
            '`std::move(x)` does NOT move anything by itself—it casts an lvalue into an rvalue reference (`T&&`), granting permission to steal its internal resources.'
          ],
          codeExample: `#include <iostream>
#include <vector>
#include <utility>

int main() {
    std::vector<int> bigData(1000000, 42); // 1 million ints
    std::cout << "Original size: " << bigData.size() << std::endl;

    // Steal resources into target without copying!
    std::vector<int> target = std::move(bigData);

    std::cout << "Target size: " << target.size() << std::endl;
    std::cout << "Original size after move: " << bigData.size() << " (gutted!)\\n";
    return 0;
}`,
          deepDive: {
            title: 'Moved-From State',
            content: 'In the C++ Standard, an object that has been moved from is left in a "valid but unspecified state". You can safely reassign to it or let its destructor run.'
          }
        },
        quiz: [
          {
            id: 'q4-2',
            category: 'modern',
            prompt: 'What does `std::move(v)` actually do at runtime?',
            xpReward: 80,
            options: [
              {
                text: 'It is a compile-time cast to an rvalue reference (T&&) that enables move constructors.',
                isCorrect: true,
                explanation: 'Exactly right! It generates 0 CPU instructions at runtime—just a type cast.'
              },
              {
                text: 'It triggers an asynchronous thread to copy data.',
                isCorrect: false,
                explanation: 'No threads are involved.'
              },
              {
                text: 'It zeroes out the entire memory block.',
                isCorrect: false,
                explanation: 'No zeroing occurs.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm5',
    title: 'The STL: Standard Template Library',
    tagline: 'High-performance containers, iterators, and lightning-fast algorithms.',
    iconName: 'Boxes',
    accentColor: '#ec4899',
    description: 'Understand vector capacity doubling, hash map buckets, red-black trees, and algorithmic complexity.',
    lessons: [
      {
        id: 'm5-l1',
        moduleId: 'm5',
        title: 'std::vector Under The Microscope',
        subtitle: 'Dynamic arrays, capacity doubling, and amortized O(1) magic',
        durationMinutes: 11,
        xpReward: 200,
        content: {
          hook: '`std::vector` is the default container of choice for 95% of C++ code. But how does it grow if memory must be contiguous?',
          mentalModel: 'Think of vector as a reserved table at a restaurant. If you have 3 guests and book a table for 4, adding the 4th is instant. When the 5th arrives, the waiter moves your party to an 8-person table across the room!',
          explanation: [
            'A vector holds 3 pointers internally: `begin`, `end`, `end_of_storage`.',
            '`size()` is the number of active elements.',
            '`capacity()` is the total allocated capacity on the heap.',
            'When `size == capacity` and you `push_back()`, vector allocates a new buffer of 2x (or 1.5x) size, copies or moves existing elements, and frees the old buffer. This yields **amortized O(1)** insertion!'
          ],
          codeExample: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums;
    std::cout << "Init - Size: " << nums.size() << " Cap: " << nums.capacity() << std::endl;

    for (int i = 1; i <= 5; ++i) {
        nums.push_back(i * 10);
        std::cout << "Push " << i * 10 << " -> Size: " << nums.size() 
                  << " | Capacity: " << nums.capacity() << std::endl;
    }
    return 0;
}`,
          deepDive: {
            title: 'vector::reserve() Optimization',
            content: 'If you know in advance you will insert 10,000 items, call `nums.reserve(10000);` upfront! This prevents repeated heap allocations and element moves.'
          }
        },
        quiz: [
          {
            id: 'q5-1',
            category: 'stl',
            prompt: 'If you know you will store 50,000 elements in a vector, how should you optimize it?',
            xpReward: 70,
            options: [
              {
                text: 'Call `vec.reserve(50000)` to allocate memory in a single step.',
                isCorrect: true,
                explanation: 'Yes! `reserve()` pre-allocates heap capacity, eliminating all intermediate reallocations.'
              },
              {
                text: 'Use 50,000 separate int variables instead.',
                isCorrect: false,
                explanation: 'That would be impossible to manage.'
              },
              {
                text: 'Vector cannot hold more than 1024 elements.',
                isCorrect: false,
                explanation: 'Vector can hold hundreds of millions of elements.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug-1',
    title: 'The Phantom Leaker',
    severity: 'Memory Leak',
    difficulty: 'Easy',
    description: 'This function allocates memory on the heap to process user scores, but something critical is missing before it returns.',
    bugLine: 6,
    code: `void processScores() {
    int* scores = new int[5];
    for (int i = 0; i < 5; i++) {
        scores[i] = (i + 1) * 20;
    }
    std::cout << "Top score: " << scores[4] << std::endl;
    // Bug lurks here!
}`,
    options: [
      {
        text: 'Missing `delete[] scores;` before function returns.',
        explanation: 'Every `new[]` must be matched with `delete[]`, otherwise the 5 ints remain leaked in heap memory.',
        isCorrect: true,
      },
      {
        text: 'Array indexing starts at 1, so scores[0] is illegal.',
        explanation: 'In C++, array indexing correctly starts at 0.',
        isCorrect: false,
      },
      {
        text: 'The loop should use `<= 5`.',
        explanation: 'Using `<= 5` would cause an off-by-one buffer overflow error!',
        isCorrect: false,
      }
    ],
    fixedCode: `void processScores() {
    int* scores = new int[5];
    for (int i = 0; i < 5; i++) {
        scores[i] = (i + 1) * 20;
    }
    std::cout << "Top score: " << scores[4] << std::endl;
    delete[] scores; // Memory freed cleanly!
}`,
    deepDive: 'Better yet in modern C++: Use `std::vector<int> scores(5);` or `std::unique_ptr<int[]> scores = std::make_unique<int[]>(5);` so you never have to remember delete[]!',
    xp: 150,
  },
  {
    id: 'bug-2',
    title: 'Dangling Stack Pointer Return',
    severity: 'Undefined Behavior',
    difficulty: 'Medium',
    description: 'This function returns a pointer to a variable created inside its local frame. What critical bug occurs?',
    bugLine: 3,
    code: `int* createConfigBuffer() {
    int tempCode = 777;
    return &tempCode; // Danger: returning address of local stack memory!
}

int main() {
    int* ptr = createConfigBuffer();
    std::cout << *ptr << std::endl;
}`,
    options: [
      {
        text: 'Returning the address of a local stack variable that is destroyed when function exits.',
        explanation: 'Local variable `tempCode` lives on `createConfigBuffer`\'s stack frame. When the function returns, that stack frame is popped! `ptr` points to dead stack memory.',
        isCorrect: true,
      },
      {
        text: 'The variable name `tempCode` is a reserved C++ keyword.',
        explanation: '`tempCode` is not a reserved keyword in C++.',
        isCorrect: false,
      },
      {
        text: 'You cannot return pointers from functions in C++.',
        explanation: 'You can return pointers to heap objects or static variables, but NEVER to local stack variables.',
        isCorrect: false,
      }
    ],
    fixedCode: `// Fix Option A: Return by value (Fastest and safest!)
int createConfigBuffer() {
    int tempCode = 777;
    return tempCode;
}

// Fix Option B: Return unique_ptr if dynamic lifetime needed
std::unique_ptr<int> createDynamicBuffer() {
    return std::make_unique<int>(777);
}`,
    deepDive: 'Returning pointers or references to local stack variables is one of the most common causes of crashes and security exploits in C and C++.',
    xp: 200,
  },
  {
    id: 'bug-3',
    title: 'Heap Corruption: Double Free Error',
    severity: 'Fatal',
    difficulty: 'Medium',
    description: 'Examine this code carefully. What critical runtime error will occur when both functions finish?',
    bugLine: 8,
    code: `int* p = new int(100);

void cleanupA(int* ptr) {
    delete ptr;
}

void cleanupB(int* ptr) {
    delete ptr; // Double trouble!
}`,
    options: [
      {
        text: 'Double free: Calling `delete` twice on the exact same heap address causes heap corruption.',
        explanation: 'Once memory is returned to the OS allocator, attempting to free it a second time corrupts the heap metadata and aborts the program with SIGABRT.',
        isCorrect: true,
      },
      {
        text: 'The int value 100 cannot be deleted because it is an even number.',
        explanation: 'Numerical values have no relation to deallocation.',
        isCorrect: false,
      },
      {
        text: 'A memory leak occurs because delete is called.',
        explanation: 'Calling delete does the opposite of leaking—it frees the memory.',
        isCorrect: false,
      }
    ],
    fixedCode: `// Best practice: Use std::unique_ptr so only ONE owner can ever delete it!
auto p = std::make_unique<int>(100);
// RAII ensures exactly one destruction when p goes out of scope.`,
    deepDive: 'In modern C++, smart pointers make double-free virtually impossible by design.',
    xp: 220,
  },
  {
    id: 'bug-4',
    title: 'The Off-By-One Fencepost',
    severity: 'Undefined Behavior',
    difficulty: 'Easy',
    description: 'This loop attempts to initialize an array of size 5. What boundary bug is committed?',
    bugLine: 3,
    code: `int arr[5];
for (int i = 0; i <= 5; ++i) {
    arr[i] = i * 10;
}`,
    options: [
      {
        text: 'The loop condition `<= 5` accesses index 5, which is out of bounds for an array of size 5 (indices 0..4).',
        explanation: 'In an array of size 5, valid indices are 0, 1, 2, 3, 4. Index 5 writes to whatever random byte lies past the array in memory!',
        isCorrect: true,
      },
      {
        text: 'You cannot multiply `i * 10` inside an array assignment.',
        explanation: 'Arithmetic expressions in assignments are completely valid.',
        isCorrect: false,
      },
      {
        text: 'Array size must always be a power of 2.',
        explanation: 'Array sizes can be any positive integer.',
        isCorrect: false,
      }
    ],
    fixedCode: `int arr[5];
for (int i = 0; i < 5; ++i) { // Strict '<' condition!
    arr[i] = i * 10;
}`,
    deepDive: 'Writing past an array boundary on the stack can overwrite the function\'s return address—the classic buffer overflow vulnerability exploited by hackers!',
    xp: 150,
  },
  {
    id: 'bug-nust-1',
    title: 'SEECS CS212 Midterm Trap',
    severity: 'Memory Leak',
    difficulty: 'Medium',
    description: 'This snippet is a classic trap from the SEECS CS212 Object Oriented Programming lab exams. Identify the issue.',
    bugLine: 4,
    code: `void processSEECSData() {
    int* labGrades = new int[100];
    // Do some processing...
    delete labGrades; // Uh oh...
}`,
    options: [
      {
        text: 'Using `delete` instead of `delete[]` on an array allocated with `new[]`.',
        explanation: 'In C++, if you allocate an array with `new[]`, you MUST deallocate it with `delete[]`. Using standard `delete` only frees the first element and causes undefined behavior/memory leaks for the rest.',
        isCorrect: true,
      },
      {
        text: 'The array must be initialized to zero before deletion.',
        explanation: 'Initialization is good practice, but not related to the deletion error.',
        isCorrect: false,
      },
      {
        text: 'Memory allocated inside a function is automatically freed.',
        explanation: 'Heap allocations (`new`) are NEVER automatically freed. Only stack variables are automatically freed.',
        isCorrect: false,
      }
    ],
    fixedCode: `void processSEECSData() {
    int* labGrades = new int[100];
    // Do some processing...
    delete[] labGrades; // Correct array deletion!
}`,
    deepDive: 'SEECS instructors love testing the difference between scalar delete and vector delete[]. Always match `new` with `delete` and `new[]` with `delete[]`!',
    xp: 200,
  }
];

export const BADGES: Badge[] = [
  {
    id: 'welcome_dev',
    name: 'Silicon Pioneer',
    description: 'Began the journey into the realm of C++.',
    icon: 'Sparkles',
    category: 'basics',
  },
  {
    id: 'pointer_master',
    name: 'Address Hunter',
    description: 'Successfully navigated pointers, addresses, and dereferencing.',
    icon: 'Compass',
    category: 'memory',
  },
  {
    id: 'zero_leak',
    name: 'Leak Slayer',
    description: 'Deallocated all heap allocations cleanly with 0 memory leaks.',
    icon: 'ShieldCheck',
    category: 'memory',
  },
  {
    id: 'raii_champion',
    name: 'RAII Guardian',
    description: 'Harnessed deterministic destructors and scoped lifetime mastery.',
    icon: 'Sword',
    category: 'oop',
  },
  {
    id: 'modern_sorcerer',
    name: 'Modernist',
    description: 'Wielded smart pointers, lambdas, and move semantics.',
    icon: 'Zap',
    category: 'modern',
  },
  {
    id: 'vector_architect',
    name: 'Amortized Titan',
    description: 'Mastered dynamic memory growth and capacity doubling.',
    icon: 'TrendingUp',
    category: 'expert',
  }
];
