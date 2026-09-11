import { CodingExercise } from '../types';

export const CODING_EXERCISES: CodingExercise[] = [
  {
    id: 'ex-io-1',
    lessonId: 'm1-l1',
    title: 'Formatted Telemetry Stream & Calculations',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'Format sensor telemetry readings into standard output using C++ stream insertion operators. Compute and output the calculated average reading.',
    instructions: [
      'Include <iostream> and use namespace std.',
      'Declare two integer sensor readings: sensorA = 48 and sensorB = 72.',
      'Compute the average: int average = (sensorA + sensorB) / 2;',
      'Print "Sensor A: 48, Sensor B: 72"',
      'Print "Average Reading: 60"',
      'Return 0 from main().'
    ],
    starterCode: `// Exercise 1: Formatted Telemetry Stream
#include <iostream>
using namespace std;

int main() {
    int sensorA = 48;
    int sensorB = 72;

    // TODO: Calculate the average of sensorA and sensorB
    int average = 0;

    // TODO: Print the formatted sensor values and calculated average
    cout << "Sensor A: " << sensorA << ", Sensor B: " << sensorB << endl;
    cout << "Average Reading: " << average << endl;

    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int sensorA = 48;
    int sensorB = 72;
    int average = (sensorA + sensorB) / 2;

    cout << "Sensor A: " << sensorA << ", Sensor B: " << sensorB << endl;
    cout << "Average Reading: " << average << endl;
    return 0;
}`,
    expectedOutput: 'Sensor A: 48, Sensor B: 72\nAverage Reading: 60\n',
    hint: 'Replace `int average = 0;` with `int average = (sensorA + sensorB) / 2;` so the computed value matches 60.',
    xpReward: 100,
  },
  {
    id: 'ex-types-1',
    lessonId: 'm1-l2',
    title: 'Data Type Precision & Memory Layout',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'Configure and print variable types representing a high-performance network interface.',
    instructions: [
      'Declare `int port = 8080;`',
      'Declare `double bandwidthGbps = 10.5;`',
      'Declare `char status = \'U\';` (for UP)',
      'Print each variable labeled exactly as expected.',
    ],
    starterCode: `// Exercise 2: Network Interface Metrics
#include <iostream>
using namespace std;

int main() {
    // TODO: Define port (int), bandwidthGbps (double), and status (char)
    int port = 8080;
    double bandwidthGbps = 0.0;
    char status = 'D';

    cout << "Port: " << port << endl;
    cout << "Bandwidth: " << bandwidthGbps << " Gbps" << endl;
    cout << "Status: " << status << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int port = 8080;
    double bandwidthGbps = 10.5;
    char status = 'U';

    cout << "Port: " << port << endl;
    cout << "Bandwidth: " << bandwidthGbps << " Gbps" << endl;
    cout << "Status: " << status << endl;
    return 0;
}`,
    expectedOutput: 'Port: 8080\nBandwidth: 10.5 Gbps\nStatus: U\n',
    hint: 'Set bandwidthGbps to 10.5 and status to \'U\'.',
    xpReward: 100,
  },
  {
    id: 'ex-sizeof-1',
    lessonId: 'm1-l3',
    title: 'Physical RAM Footprint Audit',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    description: 'Use the `sizeof` operator to audit the exact memory consumption in physical RAM for primitive systems data types.',
    instructions: [
      'Measure and print the size of `int` in bytes.',
      'Measure and print the size of `double` in bytes.',
      'Compute the total memory budget in bytes for a buffer of 16 ints (16 * sizeof(int)).',
      'Print the resulting totals in the exact specified format.'
    ],
    starterCode: `// Exercise 3: Physical RAM Footprint Audit
#include <iostream>
using namespace std;

int main() {
    int intSize = sizeof(int);
    int doubleSize = sizeof(double);
    int bufferBudget = 0; // TODO: Calculate 16 * sizeof(int)

    cout << "int footprint: " << intSize << " bytes" << endl;
    cout << "double footprint: " << doubleSize << " bytes" << endl;
    cout << "16-element int buffer: " << bufferBudget << " bytes" << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int intSize = sizeof(int);
    int doubleSize = sizeof(double);
    int bufferBudget = 16 * sizeof(int);

    cout << "int footprint: " << intSize << " bytes" << endl;
    cout << "double footprint: " << doubleSize << " bytes" << endl;
    cout << "16-element int buffer: " << bufferBudget << " bytes" << endl;
    return 0;
}`,
    expectedOutput: 'int footprint: 4 bytes\ndouble footprint: 8 bytes\n16-element int buffer: 64 bytes\n',
    hint: 'An int is 4 bytes on 32/64-bit systems. 16 * 4 = 64 bytes.',
    xpReward: 120,
  },
  {
    id: 'ex-ref-1',
    lessonId: 'm1-l4',
    title: 'In-Place Value Swapper via Reference',
    category: 'References',
    difficulty: 'Intermediate',
    description: 'Implement a zero-overhead value swap function utilizing C++ reference parameters (`&`) to mutate caller storage directly without copies.',
    instructions: [
      'Implement `void swapValues(int& a, int& b)` above main.',
      'Inside swapValues, swap `a` and `b` using a temporary variable.',
      'In main(), initialize `first = 100` and `second = 200`.',
      'Call `swapValues(first, second)`.',
      'Print the swapped values.'
    ],
    starterCode: `// Exercise 4: Value Swapper via References
#include <iostream>
using namespace std;

// TODO: Implement swapValues using reference parameters (int& a, int& b)
void swapValues(int& a, int& b) {
    // Write swap logic here
}

int main() {
    int first = 100;
    int second = 200;

    swapValues(first, second);

    cout << "Swapped: first = " << first << ", second = " << second << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int first = 100;
    int second = 200;
    swapValues(first, second);
    cout << "Swapped: first = " << first << ", second = " << second << endl;
    return 0;
}`,
    expectedOutput: 'Swapped: first = 200, second = 100\n',
    hint: 'Store `a` in `temp`, set `a = b`, and set `b = temp`. Because the arguments are passed by reference, the caller variables are modified directly.',
    xpReward: 150,
  },
  {
    id: 'ex-ptr-1',
    lessonId: 'm2-l1',
    title: 'Pointer Dereference & State Transition',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    description: 'Create a pointer pointing to a network status code, inspect its initial state, and mutate the underlying memory via pointer dereference (`*ptr = ...`).',
    instructions: [
      'Initialize `int statusCode = 503;`',
      'Create a pointer `int* ptr = &statusCode;`',
      'Print "Initial Code: 503"',
      'Mutate statusCode through the pointer: `*ptr = 200;`',
      'Print "Updated Code: 200"',
    ],
    starterCode: `// Exercise 5: Pointer Dereference & Mutation
#include <iostream>
using namespace std;

int main() {
    int statusCode = 503;
    int* ptr = &statusCode;

    cout << "Initial Code: " << *ptr << endl;

    // TODO: Mutate statusCode to 200 using the dereference operator (*ptr)

    cout << "Updated Code: " << statusCode << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int statusCode = 503;
    int* ptr = &statusCode;
    cout << "Initial Code: " << *ptr << endl;
    *ptr = 200;
    cout << "Updated Code: " << statusCode << endl;
    return 0;
}`,
    expectedOutput: 'Initial Code: 503\nUpdated Code: 200\n',
    hint: 'Add `*ptr = 200;` right before the second cout statement.',
    xpReward: 150,
  },
  {
    id: 'ex-ptr-arith-1',
    lessonId: 'm2-l2',
    title: 'Pointer Arithmetic & Contiguous Traversal',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    description: 'Traverse an array using pointer offset arithmetic (`*(ptr + i)`) rather than subscript brackets (`arr[i]`), calculating the sum of elements.',
    instructions: [
      'Create an array: `int buffer[3] = {10, 20, 30};`',
      'Obtain a pointer to the first element: `int* p = buffer;`',
      'Compute the sum using pointer offset dereferences: `int sum = *(p + 0) + *(p + 1) + *(p + 2);`',
      'Print "Buffer Sum: 60"'
    ],
    starterCode: `// Exercise 6: Pointer Arithmetic Traversal
#include <iostream>
using namespace std;

int main() {
    int buffer[3] = {10, 20, 30};
    int* p = buffer;

    // TODO: Sum the three elements using pointer arithmetic *(p + i)
    int sum = 0;

    cout << "Buffer Sum: " << sum << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int buffer[3] = {10, 20, 30};
    int* p = buffer;
    int sum = *(p + 0) + *(p + 1) + *(p + 2);
    cout << "Buffer Sum: " << sum << endl;
    return 0;
}`,
    expectedOutput: 'Buffer Sum: 60\n',
    hint: '`*(p + 0)` accesses buffer[0], `*(p + 1)` accesses buffer[1], and `*(p + 2)` accesses buffer[2].',
    xpReward: 160,
  },
  {
    id: 'ex-heap-1',
    lessonId: 'm2-l3',
    title: 'Dynamic Heap Allocation & RAII Deallocation',
    category: 'Dynamic Allocation',
    difficulty: 'Advanced',
    description: 'Allocate a dynamic array on the Heap using `new[]`, populate elements, print the final element, and safely deallocate using `delete[]`.',
    instructions: [
      'Allocate an array of 4 integers on the heap: `int* heapArr = new int[4];`',
      'Initialize `heapArr[0] = 100`, `heapArr[1] = 200`, `heapArr[2] = 300`, `heapArr[3] = 400`.',
      'Print "Top Element: " << heapArr[3]',
      'Deallocate the heap array cleanly with `delete[] heapArr;` to prevent memory leaks.',
      'Set `heapArr = nullptr;`'
    ],
    starterCode: `// Exercise 7: Dynamic Heap Buffer Allocation
#include <iostream>
using namespace std;

int main() {
    // TODO: Allocate 4 ints on the heap with new[]
    int* heapArr = new int[4];

    heapArr[0] = 100;
    heapArr[1] = 200;
    heapArr[2] = 300;
    heapArr[3] = 400;

    cout << "Top Element: " << heapArr[3] << endl;

    // TODO: Deallocate heapArr with delete[] to prevent memory leaks!

    cout << "Heap memory freed successfully." << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int* heapArr = new int[4];
    heapArr[0] = 100;
    heapArr[1] = 200;
    heapArr[2] = 300;
    heapArr[3] = 400;

    cout << "Top Element: " << heapArr[3] << endl;
    delete[] heapArr;
    heapArr = nullptr;

    cout << "Heap memory freed successfully." << endl;
    return 0;
}`,
    expectedOutput: 'Top Element: 400\nHeap memory freed successfully.\n',
    hint: 'Use `delete[] heapArr;` followed by `heapArr = nullptr;` before printing the final success message.',
    xpReward: 180,
  },
  {
    id: 'ex-raii-1',
    lessonId: 'm3-l1',
    title: 'RAII Scoped Resource Guard',
    category: 'Classes & RAII',
    difficulty: 'Advanced',
    description: 'Construct a lightweight RAII class whose constructor acquires a lock/resource and whose destructor guarantees deterministic cleanup when falling out of scope.',
    instructions: [
      'Define class `ScopedBuffer` with a constructor that prints `[BUFFER ACQUIRED]`',
      'Define its destructor `~ScopedBuffer()` that prints `[BUFFER FREED]`',
      'In main(), instantiate a `ScopedBuffer buffer;` inside a scoped block `{ ... }` to observe automatic destruction.',
    ],
    starterCode: `// Exercise 8: RAII Scoped Resource Guard
#include <iostream>
using namespace std;

class ScopedBuffer {
public:
    ScopedBuffer() {
        cout << "[BUFFER ACQUIRED]" << endl;
    }
    // TODO: Implement destructor ~ScopedBuffer() that prints "[BUFFER FREED]"
};

int main() {
    cout << "Starting transaction..." << endl;
    {
        ScopedBuffer buf;
        cout << "Processing active payload..." << endl;
    } // buf destructor should run right here!
    cout << "Transaction concluded." << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

class ScopedBuffer {
public:
    ScopedBuffer() {
        cout << "[BUFFER ACQUIRED]" << endl;
    }
    ~ScopedBuffer() {
        cout << "[BUFFER FREED]" << endl;
    }
};

int main() {
    cout << "Starting transaction..." << endl;
    {
        ScopedBuffer buf;
        cout << "Processing active payload..." << endl;
    }
    cout << "Transaction concluded." << endl;
    return 0;
}`,
    expectedOutput: 'Starting transaction...\n[BUFFER ACQUIRED]\nProcessing active payload...\n[BUFFER FREED]\nTransaction concluded.\n',
    hint: 'Destructors in C++ use the tilde (`~`) character preceding the class name: `~ScopedBuffer() { cout << "[BUFFER FREED]" << endl; }`.',
    xpReward: 200,
  },
  {
    id: 'ex-smartptr-1',
    lessonId: 'm4-l1',
    title: 'Ownership Transfer via std::unique_ptr',
    category: 'Modern C++',
    difficulty: 'Advanced',
    description: 'Use modern C++ smart pointers and `std::move` to transfer exclusive heap ownership between unique_ptr instances without copying.',
    instructions: [
      'Create `unique_ptr<int> source = make_unique<int>(1024);`',
      'Transfer ownership to `unique_ptr<int> dest = std::move(source);`',
      'Print "Transferred Payload: " << *dest',
      'Demonstrate that source is now empty (`source == nullptr`).'
    ],
    starterCode: `// Exercise 9: std::unique_ptr & Ownership Transfer
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> source = make_unique<int>(1024);

    // TODO: Transfer ownership from source to dest using std::move
    unique_ptr<int> dest;

    cout << "Transferred Payload: " << *dest << endl;
    if (source == nullptr) {
        cout << "Source pointer is null (ownership safely relinquished)." << endl;
    }
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> source = make_unique<int>(1024);
    unique_ptr<int> dest = std::move(source);

    cout << "Transferred Payload: " << *dest << endl;
    if (source == nullptr) {
        cout << "Source pointer is null (ownership safely relinquished)." << endl;
    }
    return 0;
}`,
    expectedOutput: 'Transferred Payload: 1024\nSource pointer is null (ownership safely relinquished).\n',
    hint: 'Initialize `unique_ptr<int> dest = std::move(source);`. Smart pointers disallow copy assignment (`=`), enforcing `std::move`.',
    xpReward: 220,
  }
];
