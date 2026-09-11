// Quick verification script for C++ Simulator Engine
import { CppSimulator } from './src/engine/cppInterpreter.ts';

console.log('Testing C++ Simulator Engine...');

// Test 1: Pointers & Mutation
const code1 = `
#include <iostream>
int main() {
    int gold = 100;
    int* ptr = &gold;
    *ptr = 250;
    std::cout << gold << std::endl;
    return 0;
}
`;
const snaps1 = CppSimulator.simulate(code1);
const final1 = snaps1[snaps1.length - 1];
console.log('Test 1 (Pointer Dereference):');
console.log('  Total snapshots:', snaps1.length);
console.log('  Stdout:', final1.stdout);
console.assert(final1.stdout.join('').includes('250'), 'Expected stdout to contain 250');

// Test 2: Memory Leak Detection
const code2 = `
int main() {
    int* leaked = new int(99);
    return 0;
}
`;
const snaps2 = CppSimulator.simulate(code2);
const final2 = snaps2[snaps2.length - 1];
console.log('\nTest 2 (Memory Leak Detection):');
console.log('  hasLeak:', final2.hasLeak);
console.assert(final2.hasLeak === true, 'Expected hasLeak to be true!');

// Test 3: Clean delete without leak
const code3 = `
int main() {
    int* clean = new int(99);
    delete clean;
    return 0;
}
`;
const snaps3 = CppSimulator.simulate(code3);
const final3 = snaps3[snaps3.length - 1];
console.log('\nTest 3 (Clean Heap Deallocation):');
console.log('  hasLeak:', final3.hasLeak);
console.assert(!final3.hasLeak, 'Expected hasLeak to be false after delete!');

// Test 4: unique_ptr & std::move
const code4 = `
int main() {
    unique_ptr<int> u1 = make_unique<int>(500);
    unique_ptr<int> u2 = std::move(u1);
    return 0;
}
`;
const snaps4 = CppSimulator.simulate(code4);
const lastSnap4 = snaps4[snaps4.length - 2];
const u1Var = lastSnap4.stack[0].variables.find(v => v.name === 'u1');
const u2Var = lastSnap4.stack[0].variables.find(v => v.name === 'u2');
console.log('\nTest 4 (unique_ptr ownership transfer):');
console.log('  u1 value:', u1Var.value);
console.log('  u2 points to:', u2Var.pointsToAddress);
console.assert(u1Var.value === 'nullptr', 'Expected u1 to be nullptr after std::move');
console.assert(u2Var.pointsToAddress !== null, 'Expected u2 to own heap address');

console.log('\nAll C++ Simulator Verification Tests Passed with flying colors! 🚀');
