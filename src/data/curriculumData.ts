import { Badge, BugChallenge, Module } from '../types';

export const CURRICULUM_MODULES: Module[] = [
  {
    id: 'm0',
    title: 'First Steps: Zero to Running',
    tagline: 'Never written C++ before? Start here. Write and run your first programs in minutes.',
    iconName: 'Rocket',
    accentColor: '#22d3ee',
    description: 'Absolute beginner friendly. Write your first C++ program from scratch, understand every single line of code, and build a working calculator — no prior experience required.',
    lessons: [
      {
        id: 'm0-l1',
        moduleId: 'm0',
        title: 'Your First C++ Program — Line by Line',
        subtitle: 'Anatomy of Hello World: what every single character means',
        durationMinutes: 5,
        xpReward: 50,
        content: {
          hook: 'Every C++ developer in the world started by writing the same 6 lines of code. Let\'s write yours — and understand exactly what each piece does.',
          mentalModel: 'A C++ program is like a recipe. You list your ingredients at the top (#include), name the dish (main), and write the cooking steps inside curly braces {}. The computer follows your steps from top to bottom.',
          explanation: [
            '`#include <iostream>` tells the compiler to load the input/output tools (like cout for printing).',
            '`int main()` is the entry point — every C++ program MUST have a main function. This is where execution begins.',
            '`std::cout << "text"` prints text to the screen. Think of `<<` as a pipe pushing text toward the screen.',
            '`return 0;` at the end of main tells the operating system "the program finished successfully".',
          ],
          codeExample: `#include <iostream>

int main() {
    // This prints a message to the screen
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
          examples: [
            {
              title: 'Example 1: Printing Multiple Lines',
              description: 'You can print as many lines as you like by repeating std::cout.',
              code: `#include <iostream>

int main() {
    std::cout << "Line 1: I am learning C++." << std::endl;
    std::cout << "Line 2: This is my second line." << std::endl;
    std::cout << "Line 3: C++ is powerful!" << std::endl;
    return 0;
}`,
              expectedOutput: 'Line 1: I am learning C++.\nLine 2: This is my second line.\nLine 3: C++ is powerful!\n',
              explanation: 'Each std::cout statement prints one line. std::endl moves to the next line — just like pressing Enter.',
            },
            {
              title: 'Example 2: Printing Numbers',
              description: 'cout can print numbers too, not just text!',
              code: `#include <iostream>

int main() {
    std::cout << "My age is: " << 20 << std::endl;
    std::cout << "The year is: " << 2026 << std::endl;
    std::cout << "Two plus two equals: " << 2 + 2 << std::endl;
    return 0;
}`,
              expectedOutput: 'My age is: 20\nThe year is: 2026\nTwo plus two equals: 4\n',
              explanation: 'You can mix text (in quotes) and numbers in a single cout line using << between each piece.',
            },
          ],
          deepDive: {
            title: 'What does #include do?',
            content: '`#include <iostream>` is a preprocessor directive. Before the compiler sees your code, the preprocessor runs and literally copies the entire contents of the iostream file into your program. That\'s how std::cout becomes available — it\'s defined in that file.',
          },
          interactivePrompt: {
            task: 'Modify the program to print your name and university. Run it and see your output!',
            hint: 'Replace the text inside the quote marks "..." with your own message.',
            starterCode: `#include <iostream>

int main() {
    std::cout << "Hello! My name is ____" << std::endl;
    std::cout << "I study at ____" << std::endl;
    return 0;
}`,
          },
        },
        quiz: [
          {
            id: 'q0-1',
            category: 'basics',
            prompt: 'What does `std::cout` do in a C++ program?',
            xpReward: 20,
            options: [
              {
                text: 'It reads input from the keyboard.',
                isCorrect: false,
                explanation: 'That\'s std::cin! std::cout is for output, not input.',
              },
              {
                text: 'It deletes memory from the heap.',
                isCorrect: false,
                explanation: 'Memory deletion is done with the delete keyword.',
              },
              {
                text: 'It prints text or values to the screen.',
                isCorrect: true,
                explanation: 'Correct! std::cout stands for "character output" — it sends text to the terminal/screen.',
              },
              {
                text: 'It compiles your C++ code.',
                isCorrect: false,
                explanation: 'Compilation is done by the compiler (g++, clang++), not by cout.',
              },
            ],
          },
          {
            id: 'q0-2',
            category: 'basics',
            prompt: 'Which function must every C++ program have as its starting point?',
            xpReward: 20,
            options: [
              {
                text: 'start()',
                isCorrect: false,
                explanation: 'There is no start() function in standard C++.',
              },
              {
                text: 'main()',
                isCorrect: true,
                explanation: 'Correct! Every C++ program must have a main() function — it\'s where the OS begins execution.',
              },
              {
                text: 'begin()',
                isCorrect: false,
                explanation: 'begin() is used for iterators/containers, not as a program entry point.',
              },
              {
                text: 'run()',
                isCorrect: false,
                explanation: 'There is no run() entry point in standard C++.',
              },
            ],
          },
        ],
      },
      {
        id: 'm0-l2',
        moduleId: 'm0',
        title: 'Variables & Your First Calculator',
        subtitle: 'Storing numbers in memory and doing arithmetic',
        durationMinutes: 7,
        xpReward: 75,
        content: {
          hook: 'Programs become useful when they can remember information. A variable is simply a named box in your computer\'s memory that holds a value. Let\'s store some numbers and build a working calculator.',
          mentalModel: 'Imagine variables as labeled sticky notes on your desk. You write a label (the name) and a value (the data). Whenever you need that number, you just refer to its label — the computer finds it for you.',
          explanation: [
            'A variable declaration in C++ has three parts: the TYPE, the NAME, and the VALUE. Example: `int score = 100;` — type is int (whole number), name is score, value is 100.',
            'Common types for beginners: `int` (whole numbers like 5, -3, 100), `double` (decimal numbers like 3.14, 2.5), `std::string` (text like "hello").',
            'You can do math directly: `+` for addition, `-` for subtraction, `*` for multiplication, `/` for division.',
            'Variables must be declared before you use them. Once declared, you can change their value at any time: `score = 200;`',
          ],
          codeExample: `#include <iostream>

int main() {
    // Declare two integer variables
    int firstNumber = 15;
    int secondNumber = 7;

    // Perform calculations
    int sum = firstNumber + secondNumber;
    int product = firstNumber * secondNumber;

    // Print the results
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Product: " << product << std::endl;
    return 0;
}`,
          examples: [
            {
              title: 'Example 1: Temperature Converter',
              description: 'Convert Celsius to Fahrenheit using a formula with variables.',
              code: `#include <iostream>

int main() {
    double celsius = 100.0;
    double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;

    std::cout << celsius << " Celsius = ";
    std::cout << fahrenheit << " Fahrenheit" << std::endl;
    return 0;
}`,
              expectedOutput: '100 Celsius = 212 Fahrenheit\n',
              explanation: 'We use double (decimal type) for temperature since it needs fractional precision. The formula is applied in one expression.',
            },
            {
              title: 'Example 2: Circle Area Calculator',
              description: 'Calculate the area of a circle given its radius.',
              code: `#include <iostream>

int main() {
    double radius = 5.0;
    double pi = 3.14159;
    double area = pi * radius * radius;

    std::cout << "Radius: " << radius << std::endl;
    std::cout << "Area: " << area << std::endl;
    return 0;
}`,
              expectedOutput: 'Radius: 5\nArea: 78.5397\n',
              explanation: 'pi * r * r computes the area. We store the intermediate value in an area variable for clarity.',
            },
          ],
          deepDive: {
            title: 'int vs double — when to use which?',
            content: 'Use `int` when you know the value will always be a whole number (counts, indices, ages). Use `double` when you need decimals (prices, measurements, percentages). Mixing them can cause truncation: `int x = 7 / 2;` gives 3, not 3.5 — integer division drops the remainder!',
          },
          interactivePrompt: {
            task: 'Extend the calculator to also compute the difference (firstNumber - secondNumber) and the quotient (firstNumber / secondNumber). Print both results.',
            hint: 'Declare two new variables: int diff and int quotient. Then subtract and divide.',
            starterCode: `#include <iostream>

int main() {
    int firstNumber = 20;
    int secondNumber = 4;

    int sum = firstNumber + secondNumber;
    // Add difference and quotient here...

    std::cout << "Sum: " << sum << std::endl;
    // Print your new results here...
    return 0;
}`,
          },
        },
        quiz: [
          {
            id: 'q0-3',
            category: 'basics',
            prompt: 'Which C++ type would you use to store the value 3.14?',
            xpReward: 20,
            options: [
              {
                text: 'int',
                isCorrect: false,
                explanation: 'int only stores whole numbers. 3.14 would be truncated to 3.',
              },
              {
                text: 'double',
                isCorrect: true,
                explanation: 'Correct! double stores 64-bit floating point numbers with decimal precision — perfect for 3.14.',
              },
              {
                text: 'char',
                isCorrect: false,
                explanation: 'char stores a single character like \'A\' or \'3\', not a decimal number.',
              },
              {
                text: 'bool',
                isCorrect: false,
                explanation: 'bool only stores true or false — not a numeric value.',
              },
            ],
          },
          {
            id: 'q0-4',
            category: 'basics',
            prompt: 'What does this code print?\n`int x = 7 / 2; std::cout << x;`',
            xpReward: 25,
            options: [
              {
                text: '3.5',
                isCorrect: false,
                explanation: 'int variables can\'t store decimals. Integer division drops the remainder.',
              },
              {
                text: '4',
                isCorrect: false,
                explanation: 'C++ does not round up integer division. The remainder is discarded.',
              },
              {
                text: '3',
                isCorrect: true,
                explanation: 'Correct! 7 / 2 with two ints gives integer division: 3 remainder 1. The remainder is discarded, so x = 3.',
              },
              {
                text: 'Compile error',
                isCorrect: false,
                explanation: 'This is perfectly valid C++ — it compiles and runs fine.',
              },
            ],
          },
        ],
      },
    ],
  },
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
  },
  {
    id: 'm6',
    title: 'The Systems Forge: Production C++ Projects',
    tagline: 'Build real-world systems. File I/O, game engines, and production C++.',
    iconName: 'Wrench',
    accentColor: '#f97316',
    description: 'Apply your C++ knowledge to production-grade projects: parse server logs with file streams, and architect a 2D game state engine with OOP grid containers.',
    lessons: [
      {
        id: 'm6-l1',
        moduleId: 'm6',
        title: 'The Production Log Parser',
        subtitle: 'Parsing server logs with std::ifstream and string tokenization',
        durationMinutes: 12,
        xpReward: 200,
        content: {
          hook: 'Parsing real server and application logs is the bread and butter of production C++ work. Discover how to extract meaningful data from text files.',
          mentalModel: 'Think of log parsing like a mail sorting machine. It reads a continuous stream of letters (lines), splits them by commas or pipes, and routes only the ERROR envelopes to a special bin.',
          explanation: [
            '`std::ifstream` (input file stream) is used to read data from files just like `std::cin` reads from the console.',
            '`std::getline(stream, string, delimiter)` extracts characters until it hits a specific delimiter character.',
            'String tokenization involves finding delimiters (like `|`) with `std::string::find` and extracting pieces using `std::string::substr`.',
            'Always check stream states! `failbit` or `eofbit` tell you when something went wrong or if you hit the end of the file.'
          ],
          codeExample: `#include <iostream>
#include <sstream>
#include <string>

int main() {
    // We use stringstream here to simulate an open std::ifstream file
    std::stringstream logFile(
        "INFO|Server started\\n"
        "ERROR|Database connection timeout\\n"
        "WARNING|High memory usage\\n"
        "ERROR|Failed to write to disk\\n"
    );

    std::string line;
    int errorCount = 0;

    while (std::getline(logFile, line)) {
        size_t pipePos = line.find('|');
        if (pipePos != std::string::npos) {
            std::string level = line.substr(0, pipePos);
            std::string message = line.substr(pipePos + 1);

            if (level == "ERROR") {
                errorCount++;
                std::cout << "CRITICAL: " << message << "\\n";
            }
        }
    }

    std::cout << "Total errors found: " << errorCount << std::endl;
    return 0;
}`,
          examples: [
            {
              title: 'Basic File Reading',
              description: 'Opening a file and reading it line by line.',
              code: `#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream file("config.txt");
    if (!file.is_open()) {
        std::cerr << "Failed to open file.\\n";
        return 1;
    }
    
    std::string line;
    while (std::getline(file, line)) {
        std::cout << "Read: " << line << "\\n";
    }
    return 0;
}`,
              expectedOutput: 'Read: MaxConnections=100\nRead: Timeout=30\n'
            },
            {
              title: 'Error Flag Handling',
              description: 'Checking for EOF and IO errors.',
              code: `#include <iostream>
#include <fstream>

int main() {
    std::ifstream file("missing.txt");
    if (file.fail()) {
        std::cout << "File failed to open. failbit is set.\\n";
    }
    return 0;
}`,
              expectedOutput: 'File failed to open. failbit is set.\n'
            }
          ],
          deepDive: {
            title: 'std::ios State Flags',
            content: 'Streams maintain state flags like `goodbit`, `eofbit`, `failbit`, and `badbit`. A `failbit` means a format error occurred (like reading a char into an int), while `badbit` means a hard physical I/O error.'
          },
          interactivePrompt: {
            task: 'Modify the parser to also count WARNING entries and print their messages.',
            hint: 'Add another else if block checking for "WARNING".',
            starterCode: `#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::stringstream logFile("INFO|OK\\nWARNING|Disk almost full\\nERROR|Crash\\nWARNING|CPU hot\\n");
    std::string line;
    int warningCount = 0;

    // Add your parsing logic here

    std::cout << "Warnings: " << warningCount << std::endl;
    return 0;
}`
          }
        },
        quiz: [
          {
            id: 'q6-1-1',
            category: 'File I/O',
            prompt: 'Which stream state flag indicates that an end-of-file was reached?',
            xpReward: 25,
            options: [
              { text: 'eofbit', isCorrect: true, explanation: 'eofbit is set when the stream has attempted to read past the end of the file.' },
              { text: 'failbit', isCorrect: false, explanation: 'failbit indicates a formatting or logical read error.' },
              { text: 'badbit', isCorrect: false, explanation: 'badbit indicates a fatal stream error.' },
              { text: 'goodbit', isCorrect: false, explanation: 'goodbit means no error flags are set.' }
            ]
          },
          {
            id: 'q6-1-2',
            category: 'File I/O',
            prompt: 'How does `std::getline` determine when to stop reading a string if a delimiter is provided?',
            xpReward: 25,
            options: [
              { text: 'It reads until it encounters the specified delimiter character.', isCorrect: true, explanation: 'Yes, like std::getline(stream, str, \',\') reads until a comma.' },
              { text: 'It always reads exactly 256 bytes.', isCorrect: false, explanation: 'It reads dynamically until the delimiter.' },
              { text: 'It reads until any whitespace is found.', isCorrect: false, explanation: 'That is what the >> operator does by default.' },
              { text: 'It stops only at newline characters.', isCorrect: false, explanation: 'By default it does, but if a custom delimiter is given, it stops there.' }
            ]
          },
          {
            id: 'q6-1-3',
            category: 'File I/O',
            prompt: 'What value does `std::string::find` return if the substring or character is not found?',
            xpReward: 25,
            options: [
              { text: 'std::string::npos', isCorrect: true, explanation: 'npos is a special constant representing the maximum value for size_t, used as an error/not-found code.' },
              { text: '-1', isCorrect: false, explanation: 'Technically true in two\'s complement cast to signed, but npos is the correct constant for size_t.' },
              { text: '0', isCorrect: false, explanation: '0 would mean the character was found at index 0.' },
              { text: 'nullptr', isCorrect: false, explanation: 'find returns a position index (size_t), not a pointer.' }
            ]
          }
        ]
      },
      {
        id: 'm6-l2',
        moduleId: 'm6',
        title: 'The Game State Engine',
        subtitle: 'OOP grid container with multi-dimensional vectors for 2D spatial positioning',
        durationMinutes: 15,
        xpReward: 250,
        content: {
          hook: 'Building a 2D game means mapping entities to spatial coordinates. You need a fast, reliable grid system to handle physics, collisions, and movement.',
          mentalModel: 'Think of a 2D game grid as a chess board. It is a coordinate system with rows and columns, where each square can be empty or contain a piece. We implement this using a vector of vectors.',
          explanation: [
            '`std::vector<std::vector<int>>` is a dynamic multi-dimensional array perfect for grids.',
            'Encapsulating the grid in a class ensures that coordinates are always validated against boundaries before access.',
            'Coordinate mapping generally uses row-major order: `grid[row][col]`.',
            'Boundary validation (checking if row >= 0 && row < height) prevents segmentation faults when entities move off-screen.'
          ],
          codeExample: `#include <iostream>
#include <vector>

class GameGrid {
private:
    int rows, cols;
    std::vector<std::vector<int>> grid;

public:
    GameGrid(int r, int c) : rows(r), cols(c) {
        // Initialize 2D vector with 0s (empty spaces)
        grid.resize(rows, std::vector<int>(cols, 0));
    }

    bool placeEntity(int r, int c, int entityId) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        grid[r][c] = entityId;
        return true;
    }

    int getEntity(int r, int c) const {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return -1; // -1 for Out of bounds
        return grid[r][c];
    }

    void printGrid() const {
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                std::cout << (grid[r][c] == 0 ? "." : std::to_string(grid[r][c])) << " ";
            }
            std::cout << "\\n";
        }
    }
};

int main() {
    GameGrid map(5, 5);
    map.placeEntity(2, 2, 9); // Player at center
    map.placeEntity(0, 4, 1); // Enemy at top right
    map.printGrid();
    return 0;
}`,
          examples: [
            {
              title: '2D Vector Initialization',
              description: 'Creating a 3x3 grid filled with a default value.',
              code: `#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> matrix(3, std::vector<int>(3, 7));
    std::cout << matrix[1][1] << std::endl;
    return 0;
}`,
              expectedOutput: '7\n'
            },
            {
              title: 'Bounds Checking',
              description: 'Safely accessing a grid element.',
              code: `#include <iostream>
#include <vector>

bool isSafe(const std::vector<std::vector<int>>& g, int r, int c) {
    return (r >= 0 && r < g.size() && c >= 0 && c < g[0].size());
}

int main() {
    std::vector<std::vector<int>> grid(2, std::vector<int>(2, 0));
    std::cout << (isSafe(grid, 2, 2) ? "Safe" : "OOB") << std::endl;
    return 0;
}`,
              expectedOutput: 'OOB\n'
            }
          ],
          deepDive: {
            title: 'Row-Major vs Column-Major Layout',
            content: 'C++ `std::vector<std::vector<T>>` is technically an array of pointers to other arrays. In true row-major layout (like a flat 1D array mapped to 2D using `index = row * cols + col`), all data is contiguous in memory, which is much faster for CPU caches than nested vectors!'
          },
          interactivePrompt: {
            task: 'Add a moveEntity(int startR, int startC, int endR, int endC) method that moves an entity if the destination is valid.',
            hint: 'Read the entity at start, set start to 0, and place the entity at end. Remember bounds checking!',
            starterCode: `// Implement moveEntity inside the GameGrid class
bool moveEntity(int startR, int startC, int endR, int endC) {
    // Your code here
}`
          }
        },
        quiz: [
          {
            id: 'q6-2-1',
            category: 'OOP & Containers',
            prompt: 'What is the correct way to initialize a 10x10 2D vector with zeros in C++?',
            xpReward: 30,
            options: [
              { text: 'std::vector<std::vector<int>> grid(10, std::vector<int>(10, 0));', isCorrect: true, explanation: 'This creates 10 elements, each being a vector of 10 zeros.' },
              { text: 'std::vector<int, 10, 10> grid;', isCorrect: false, explanation: 'Invalid syntax for std::vector.' },
              { text: 'std::vector<int>[10][10] grid;', isCorrect: false, explanation: 'This mixes C-style array syntax with vector.' },
              { text: 'std::vector<std::vector<int>> grid(100, 0);', isCorrect: false, explanation: 'This creates a 1D vector of 100 elements.' }
            ]
          },
          {
            id: 'q6-2-2',
            category: 'OOP & Containers',
            prompt: 'Why is bounds checking necessary before accessing grid[r][c]?',
            xpReward: 30,
            options: [
              { text: 'To prevent out-of-bounds memory access which leads to undefined behavior or crashes.', isCorrect: true, explanation: 'Accessing invalid indices is undefined behavior and often causes a segmentation fault.' },
              { text: 'Because C++ vectors automatically throw a nice exception otherwise.', isCorrect: false, explanation: 'The [] operator does not check bounds or throw exceptions (unlike .at()).' },
              { text: 'To ensure the integers are positive.', isCorrect: false, explanation: 'Bounds checking is for coordinates, not data values.' },
              { text: 'To trigger the garbage collector.', isCorrect: false, explanation: 'C++ has no garbage collector.' }
            ]
          },
          {
            id: 'q6-2-3',
            category: 'OOP & Containers',
            prompt: 'When passing a large `std::vector<std::vector<int>>` to a function just to read it, how should it be passed?',
            xpReward: 30,
            options: [
              { text: 'By const reference: `const std::vector<std::vector<int>>&`', isCorrect: true, explanation: 'Const reference avoids copying the massive nested structure while ensuring it is read-only.' },
              { text: 'By value: `std::vector<std::vector<int>>`', isCorrect: false, explanation: 'This makes an expensive deep copy of the entire grid.' },
              { text: 'As an rvalue: `std::vector<std::vector<int>>&&`', isCorrect: false, explanation: 'Only used for move semantics.' },
              { text: 'As an int pointer: `int**`', isCorrect: false, explanation: 'A vector of vectors is not equivalent to an int**.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'm7',
    title: 'The Algorithm Arsenal: DSA Deep Dives',
    tagline: 'Implement classic data structures from scratch in raw C++.',
    iconName: 'Binary',
    accentColor: '#a855f7',
    description: 'Build fundamental data structures from the ground up: a custom dynamic array mimicking std::vector, and a high-performance hash map with collision handling.',
    lessons: [
      {
        id: 'm7-l1',
        moduleId: 'm7',
        title: 'Custom Dynamic Array (Vector Clone)',
        subtitle: 'Building std::vector from scratch with RAII and capacity doubling',
        durationMinutes: 15,
        xpReward: 250,
        content: {
          hook: 'You use std::vector every day. But do you truly understand what it does under the hood? It is time to build it from scratch.',
          mentalModel: 'Imagine a stretchy rubber container. When it gets full, you buy a new container twice the size, move all your items to the new one, and throw away the old one. This is capacity doubling.',
          explanation: [
            'A dynamic array manually manages a heap-allocated `new[]` array.',
            '`size` tracks active elements, `capacity` tracks allocated space.',
            'When size == capacity, you allocate a new buffer of 2x size, copy elements, and `delete[]` the old buffer. This gives amortized O(1) push_back complexity.',
            'The Rule of Three: If you manage a raw pointer, you MUST implement a custom destructor, copy constructor, and copy assignment operator to prevent double-free crashes!'
          ],
          codeExample: `#include <iostream>
#include <stdexcept>

class DynArray {
private:
    int* data;
    int size;
    int capacity;

public:
    DynArray() : size(0), capacity(2) {
        data = new int[capacity];
    }

    ~DynArray() {
        delete[] data;
    }

    void push_back(int val) {
        if (size == capacity) {
            capacity *= 2;
            int* newData = new int[capacity];
            for (int i = 0; i < size; ++i) {
                newData[i] = data[i];
            }
            delete[] data;
            data = newData;
            std::cout << "Reallocated to capacity " << capacity << "\\n";
        }
        data[size++] = val;
    }

    int& operator[](int index) {
        if (index < 0 || index >= size) throw std::out_of_range("Index out of bounds");
        return data[index];
    }

    int getSize() const { return size; }
    int getCapacity() const { return capacity; }
};

int main() {
    DynArray arr;
    for(int i = 0; i < 5; i++) {
        arr.push_back(i * 10);
    }
    std::cout << "Element at 3: " << arr[3] << std::endl;
    return 0;
}`,
          examples: [
            {
              title: 'Dynamic Growth Output',
              description: 'Tracing how capacity increases over time.',
              code: `#include <iostream>
// (Assume DynArray class from above)
int main() {
    DynArray arr;
    arr.push_back(1); // cap: 2
    arr.push_back(2); // cap: 2
    arr.push_back(3); // triggers realloc -> cap: 4
    std::cout << arr.getCapacity() << std::endl;
    return 0;
}`,
              expectedOutput: 'Reallocated to capacity 4\n4\n'
            },
            {
              title: 'Memory Leak Prevention',
              description: 'The destructor is automatically called.',
              code: `void testArray() {
    DynArray arr;
    arr.push_back(99);
} // arr goes out of scope, ~DynArray() calls delete[] data!`,
              expectedOutput: ''
            }
          ],
          deepDive: {
            title: 'Amortized Analysis of Capacity Doubling',
            content: 'Copying an entire array sounds slow (O(N)). But because we DOUBLE the size each time, we rarely have to copy. Mathematically, the average cost of an insertion over a long period averages out to exactly O(1) constant time!'
          },
          interactivePrompt: {
            task: 'Add a pop_back() method to DynArray that removes the last element and returns it.',
            hint: 'Just decrease the size! But throw an exception if size is 0.',
            starterCode: `int pop_back() {
    // Add logic here
}`
          }
        },
        quiz: [
          {
            id: 'q7-1-1',
            category: 'DSA',
            prompt: 'What is the time complexity of `push_back` in a dynamically doubling array?',
            xpReward: 30,
            options: [
              { text: 'Amortized O(1)', isCorrect: true, explanation: 'Most operations are O(1), and the rare O(N) reallocations average out, making it amortized O(1).' },
              { text: 'Always O(N)', isCorrect: false, explanation: 'Only reallocation steps are O(N).' },
              { text: 'Always O(1)', isCorrect: false, explanation: 'Reallocations take O(N) time.' },
              { text: 'O(log N)', isCorrect: false, explanation: 'Pushing back has no logarithmic property here.' }
            ]
          },
          {
            id: 'q7-1-2',
            category: 'DSA',
            prompt: 'Why do we need a custom destructor for `DynArray`?',
            xpReward: 30,
            options: [
              { text: 'To call `delete[]` on the dynamically allocated data buffer to prevent memory leaks.', isCorrect: true, explanation: 'Heap allocations are never automatically freed in C++.' },
              { text: 'To reset the size to zero.', isCorrect: false, explanation: 'Setting size to 0 does not free the memory.' },
              { text: 'To print a goodbye message.', isCorrect: false, explanation: 'Logging is not the main reason for a destructor.' },
              { text: 'To compile successfully.', isCorrect: false, explanation: 'The compiler will generate a default destructor that leaks memory, but it will compile.' }
            ]
          },
          {
            id: 'q7-1-3',
            category: 'DSA',
            prompt: 'What is the "Rule of Three" in C++?',
            xpReward: 30,
            options: [
              { text: 'If a class needs a custom destructor, copy constructor, or copy assignment operator, it almost certainly needs all three.', isCorrect: true, explanation: 'This prevents shallow copy issues leading to double-frees or dangling pointers.' },
              { text: 'Every class must have three public methods.', isCorrect: false, explanation: 'There is no such rule.' },
              { text: 'Variables should be initialized three times.', isCorrect: false, explanation: 'Nonsense.' },
              { text: 'Functions can have a maximum of three parameters.', isCorrect: false, explanation: 'Functions can have many parameters.' }
            ]
          }
        ]
      },
      {
        id: 'm7-l2',
        moduleId: 'm7',
        title: 'High-Speed C++ Hash Dictionary',
        subtitle: 'Custom HashMap with chaining, rehashing, and O(1) average lookup',
        durationMinutes: 18,
        xpReward: 300,
        content: {
          hook: 'Hash maps (or unordered_maps) are arguably the most critical data structure in production software. They offer magical O(1) lookups. How do they work?',
          mentalModel: 'Think of a hash map as a library with many numbered shelves (buckets). A hash function takes a book title, scrambles it into a number, and says "Go to shelf 14". If shelf 14 already has a book, you just chain them together in a list (collision handling).',
          explanation: [
            'A hash function maps keys (like strings) to integer indices in an array.',
            'A bucket array (like `std::vector`) stores the items.',
            'Hash collisions happen when two different keys hash to the same bucket. We resolve this via Separate Chaining (storing a `std::list` in each bucket).',
            'Load Factor is `size / buckets`. When the load factor exceeds 1.0, the map must be rehashed to a larger array to maintain O(1) speed.'
          ],
          codeExample: `#include <iostream>
#include <vector>
#include <list>
#include <string>
#include <functional> // For std::hash

class HashMap {
private:
    int numBuckets;
    int size;
    // Vector of linked lists holding Key-Value pairs
    std::vector<std::list<std::pair<std::string, int>>> buckets;

    int hash(const std::string& key) const {
        return std::hash<std::string>{}(key) % numBuckets;
    }

public:
    HashMap(int b = 10) : numBuckets(b), size(0) {
        buckets.resize(numBuckets);
    }

    void insert(const std::string& key, int value) {
        int index = hash(key);
        for (auto& pair : buckets[index]) {
            if (pair.first == key) {
                pair.second = value; // Update existing
                return;
            }
        }
        buckets[index].push_back({key, value});
        size++;
    }

    int find(const std::string& key) const {
        int index = hash(key);
        for (const auto& pair : buckets[index]) {
            if (pair.first == key) return pair.second;
        }
        return -1; // Not found
    }
};

int main() {
    HashMap dictionary;
    dictionary.insert("C++", 1985);
    dictionary.insert("Rust", 2010);
    
    std::cout << "Rust created in: " << dictionary.find("Rust") << std::endl;
    std::cout << "Java created in: " << dictionary.find("Java") << std::endl;
    return 0;
}`,
          examples: [
            {
              title: 'Handling Collisions',
              description: 'Two keys that hash to the same bucket are both stored in the list.',
              code: `// Assuming bucket size is small and "A" and "B" hash to same index:
HashMap map(2);
map.insert("A", 100);
map.insert("B", 200);
std::cout << map.find("A") << " and " << map.find("B") << "\\n";`,
              expectedOutput: '100 and 200\n'
            },
            {
              title: 'Updating Values',
              description: 'Inserting an existing key updates its value.',
              code: `HashMap map;
map.insert("Score", 10);
map.insert("Score", 50); // Overwrites
std::cout << map.find("Score") << "\\n";`,
              expectedOutput: '50\n'
            }
          ],
          deepDive: {
            title: 'Open Addressing vs Separate Chaining',
            content: 'We used Separate Chaining (a list per bucket). Another strategy is Open Addressing: if a bucket is full, you simply look at the next adjacent bucket (Linear Probing). Open addressing is often much faster in modern C++ due to CPU cache locality!'
          },
          interactivePrompt: {
            task: 'Implement a contains(string key) method that returns true if the key exists, and false otherwise.',
            hint: 'It is very similar to find(), but returns a boolean instead of the value.',
            starterCode: `bool contains(const std::string& key) const {
    // Return true if found, false otherwise
}`
          }
        },
        quiz: [
          {
            id: 'q7-2-1',
            category: 'DSA',
            prompt: 'What happens when two different keys produce the same hash code index in our implementation?',
            xpReward: 35,
            options: [
              { text: 'They are both stored in the linked list at that bucket index (Separate Chaining).', isCorrect: true, explanation: 'This is the standard chaining resolution strategy.' },
              { text: 'The program crashes.', isCorrect: false, explanation: 'Collisions are normal and must be handled.' },
              { text: 'The old value is deleted.', isCorrect: false, explanation: 'Both pairs are kept, unless the keys are identical.' },
              { text: 'The array instantly doubles in size.', isCorrect: false, explanation: 'Rehashing happens based on load factor, not a single collision.' }
            ]
          },
          {
            id: 'q7-2-2',
            category: 'DSA',
            prompt: 'What is the "Load Factor" of a hash map?',
            xpReward: 35,
            options: [
              { text: 'The ratio of stored elements to the number of available buckets (size / numBuckets).', isCorrect: true, explanation: 'A high load factor means more collisions and slower lookups.' },
              { text: 'The time it takes to hash a key.', isCorrect: false, explanation: 'That is the hash computation time.' },
              { text: 'The maximum size of the key string.', isCorrect: false, explanation: 'Irrelevant.' },
              { text: 'The CPU utilization during insertion.', isCorrect: false, explanation: 'Irrelevant.' }
            ]
          },
          {
            id: 'q7-2-3',
            category: 'DSA',
            prompt: 'What is the average-case and worst-case time complexity of hash map lookups?',
            xpReward: 35,
            options: [
              { text: 'Average: O(1), Worst: O(N)', isCorrect: true, explanation: 'On average, lookups are instant. In the worst case (all keys hash to the same bucket), it degenerates to an O(N) linked list.' },
              { text: 'Average: O(log N), Worst: O(N)', isCorrect: false, explanation: 'Tree maps (std::map) are O(log N), but hash maps are O(1) average.' },
              { text: 'Average: O(1), Worst: O(1)', isCorrect: false, explanation: 'Worst case is O(N) due to collisions.' },
              { text: 'Average: O(N), Worst: O(N^2)', isCorrect: false, explanation: 'Way too slow.' }
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
