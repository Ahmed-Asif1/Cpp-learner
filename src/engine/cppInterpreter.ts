import type { ExecutionSnapshot, HeapBlock, MemoryVariable, StackFrame } from '../types/index.ts';

export class CppSimulator {
  private static addressCounter = 0x7ffd20;
  private static heapCounter = 0x00b480;

  private static nextStackAddress(): string {
    const addr = `0x${(CppSimulator.addressCounter).toString(16)}`;
    CppSimulator.addressCounter += 4;
    return addr;
  }

  private static nextHeapAddress(): string {
    const addr = `0x${(CppSimulator.heapCounter).toString(16)}`;
    CppSimulator.heapCounter += 8;
    return addr;
  }

  public static resetAddresses() {
    CppSimulator.addressCounter = 0x7ffd20;
    CppSimulator.heapCounter = 0x00b480;
  }

  /**
   * Parses and simulates C++ code into step-by-step snapshots.
   */
  public static simulate(code: string): ExecutionSnapshot[] {
    CppSimulator.resetAddresses();
    const snapshots: ExecutionSnapshot[] = [];
    const lines = code.split('\n');

    let currentStack: StackFrame[] = [
      {
        id: 'frame-main',
        functionName: 'main()',
        variables: [],
      },
    ];
    let currentHeap: HeapBlock[] = [];
    let currentStdout: string[] = [];

    // Helper to clone stack
    const cloneStack = (stack: StackFrame[]): StackFrame[] => {
      return stack.map((frame) => ({
        ...frame,
        variables: frame.variables.map((v) => ({
          ...v,
          arrayElements: v.arrayElements ? [...v.arrayElements] : undefined,
        })),
      }));
    };

    // Helper to clone heap
    const cloneHeap = (heap: HeapBlock[]): HeapBlock[] => {
      return heap.map((block) => ({ ...block }));
    };

    // Push initial entry snapshot
    snapshots.push({
      lineIndex: 0,
      sourceLine: lines[0] || '// Program entry',
      explanation: 'Program execution initialized. Calling main() stack frame.',
      stack: cloneStack(currentStack),
      heap: cloneHeap(currentHeap),
      stdout: [...currentStdout],
    });

    let insideMain = false;
    const activeFrame = () => currentStack[currentStack.length - 1];

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Skip empty or comment lines
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        continue;
      }

      if (trimmed.includes('int main')) {
        insideMain = true;
        snapshots.push({
          lineIndex: i,
          sourceLine: rawLine,
          explanation: 'Entered main() function. The call stack allocates a stack frame for local variables.',
          stack: cloneStack(currentStack),
          heap: cloneHeap(currentHeap),
          stdout: [...currentStdout],
        });
        continue;
      }

      if (!insideMain) {
        if (trimmed.startsWith('#include') || trimmed.startsWith('using namespace')) {
          snapshots.push({
            lineIndex: i,
            sourceLine: rawLine,
            explanation: trimmed.startsWith('#include') 
              ? 'Preprocessor directive: Includes library headers into the compilation unit.'
              : 'Namespace directive: Allows symbols like cout and endl without std:: prefix.',
            stack: cloneStack(currentStack),
            heap: cloneHeap(currentHeap),
            stdout: [...currentStdout],
          });
        }
        continue;
      }

      if (trimmed === '}' || trimmed === 'return 0;') {
        // Check for memory leaks before exiting main!
        const unreleasedBlocks = currentHeap.filter((b) => b.status === 'allocated' || b.status === 'leaked');
        const hasLeak = unreleasedBlocks.length > 0;

        if (hasLeak) {
          unreleasedBlocks.forEach((b) => {
            b.status = 'leaked';
          });
        }

        snapshots.push({
          lineIndex: i,
          sourceLine: rawLine,
          explanation: hasLeak
            ? `⚠️ MEMORY LEAK DETECTED! ${unreleasedBlocks.length} heap block(s) were never deallocated with 'delete' before main() returned!`
            : 'main() returned 0. Stack frame collapsed. Clean exit with no leaks.',
          stack: cloneStack(currentStack),
          heap: cloneHeap(currentHeap),
          stdout: [...currentStdout],
          hasLeak,
        });
        continue;
      }

      // 1. cout statement
      if (trimmed.startsWith('cout') || trimmed.startsWith('std::cout')) {
        const parts = trimmed.split('<<').map((p) => p.trim());
        let outputPieces: string[] = [];

        for (let pIdx = 1; pIdx < parts.length; pIdx++) {
          let part = parts[pIdx].replace(/;$/, '').trim();
          if (part === 'endl' || part === 'std::endl') {
            outputPieces.push('\n');
          } else if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
            outputPieces.push(part.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t'));
          } else if (part.startsWith('sizeof(') && part.endsWith(')')) {
            const inner = part.slice(7, -1).trim();
            if (inner === 'char' || inner === 'bool') outputPieces.push('1');
            else if (inner === 'short') outputPieces.push('2');
            else if (inner === 'int' || inner === 'float') outputPieces.push('4');
            else if (inner === 'double' || inner === 'long long' || inner.includes('*')) outputPieces.push('8');
            else {
              const v = activeFrame().variables.find((x) => x.name === inner);
              outputPieces.push(v ? String(v.sizeBytes) : '4');
            }
          } else {
            // Check variable or pointer dereference
            if (part.startsWith('*')) {
              const ptrName = part.substring(1).trim();
              const foundPtr = activeFrame().variables.find((v) => v.name === ptrName);
              if (foundPtr && foundPtr.pointsToAddress) {
                // Find in stack or heap
                const targetVar = activeFrame().variables.find((v) => v.address === foundPtr.pointsToAddress);
                const targetHeap = currentHeap.find((h) => h.address === foundPtr.pointsToAddress);
                outputPieces.push(String(targetVar ? targetVar.value : targetHeap ? targetHeap.value : 'undefined'));
              } else {
                outputPieces.push('nullptr');
              }
            } else if (part.startsWith('&')) {
              const varName = part.substring(1).trim();
              const foundVar = activeFrame().variables.find((v) => v.name === varName);
              outputPieces.push(foundVar ? foundVar.address : '0x0');
            } else {
              // Check array indexing: e.g. scores[0] or arr[2]
              const arrIndexMatch = part.match(/^(\w+)\[(\d+)\]$/);
              if (arrIndexMatch) {
                const [, arrName, idxStr] = arrIndexMatch;
                const arrVar = activeFrame().variables.find((v) => v.name === arrName);
                if (arrVar && arrVar.arrayElements) {
                  const elem = arrVar.arrayElements[parseInt(idxStr, 10)];
                  outputPieces.push(elem !== undefined ? String(elem.value) : 'undefined');
                } else {
                  outputPieces.push(part);
                }
              } else {
                const foundVar = activeFrame().variables.find((v) => v.name === part);
                if (foundVar) {
                  outputPieces.push(String(foundVar.value));
                } else {
                  // Try evaluating simple arithmetic if contains + - * /
                  try {
                    let expr = part;
                    activeFrame().variables.forEach((v) => {
                      if (typeof v.value === 'number') {
                        expr = expr.replace(new RegExp(`\\b${v.name}\\b`, 'g'), String(v.value));
                      }
                    });
                    if (/^[\d\s+\-*/().]+$/.test(expr)) {
                      // eslint-disable-next-line no-eval
                      const evaluated = Function(`"use strict"; return (${expr});`)();
                      outputPieces.push(String(evaluated));
                    } else {
                      outputPieces.push(part);
                    }
                  } catch {
                    outputPieces.push(part);
                  }
                }
              }
            }
          }
        }

        const outText = outputPieces.join('');
        const lastStdout = currentStdout.length > 0 ? currentStdout[currentStdout.length - 1] : '';
        if (lastStdout && !lastStdout.endsWith('\n')) {
          currentStdout[currentStdout.length - 1] += outText;
        } else {
          currentStdout.push(outText);
        }

        snapshots.push({
          lineIndex: i,
          sourceLine: rawLine,
          explanation: `std::cout streamed output to standard output: "${outText.trim()}"`,
          stack: cloneStack(currentStack),
          heap: cloneHeap(currentHeap),
          stdout: [...currentStdout],
        });
        continue;
      }

      // 2. unique_ptr / shared_ptr
      if (trimmed.includes('unique_ptr') || trimmed.includes('shared_ptr')) {
        const isUnique = trimmed.includes('unique_ptr');
        const isShared = trimmed.includes('shared_ptr');
        const varMatch = trimmed.match(/(?:unique_ptr|shared_ptr)<(\w+)>\s+(\w+)\s*=\s*(.+);/);

        if (varMatch) {
          const [, innerType, varName, rhs] = varMatch;
          const stackAddr = CppSimulator.nextStackAddress();

          if (rhs.includes('make_unique') || rhs.includes('make_shared')) {
            const valMatch = rhs.match(/\((.*)\)/);
            const val = valMatch && valMatch[1] ? valMatch[1].trim() : 0;
            const heapAddr = CppSimulator.nextHeapAddress();

            currentHeap.push({
              id: `heap-${Date.now()}-${Math.random()}`,
              address: heapAddr,
              sizeBytes: innerType === 'int' ? 4 : 8,
              type: innerType,
              value: isNaN(Number(val)) ? val : Number(val),
              status: 'allocated',
              ownerVariable: varName,
              refCount: isShared ? 1 : undefined,
            });

            activeFrame().variables.push({
              id: `var-${varName}`,
              name: varName,
              type: isUnique ? `unique_ptr<${innerType}>` : `shared_ptr<${innerType}>`,
              value: heapAddr,
              address: stackAddr,
              sizeBytes: 8,
              isPointer: true,
              pointsToAddress: heapAddr,
            });

            snapshots.push({
              lineIndex: i,
              sourceLine: rawLine,
              explanation: isUnique
                ? `Created std::unique_ptr '${varName}' owning heap object at ${heapAddr}. RAII ensures automatic cleanup.`
                : `Created std::shared_ptr '${varName}' (reference count = 1) pointing to heap address ${heapAddr}.`,
              stack: cloneStack(currentStack),
              heap: cloneHeap(currentHeap),
              stdout: [...currentStdout],
            });
            continue;
          } else if (rhs.includes('std::move')) {
            // Ownership transfer
            const srcMatch = rhs.match(/std::move\((\w+)\)/);
            const srcName = srcMatch ? srcMatch[1] : '';
            const srcVar = activeFrame().variables.find((v) => v.name === srcName);

            const heapAddr = srcVar ? srcVar.pointsToAddress : null;

            if (srcVar) {
              srcVar.pointsToAddress = null;
              srcVar.value = 'nullptr';
            }

            activeFrame().variables.push({
              id: `var-${varName}`,
              name: varName,
              type: `unique_ptr<${innerType}>`,
              value: heapAddr || 'nullptr',
              address: stackAddr,
              sizeBytes: 8,
              isPointer: true,
              pointsToAddress: heapAddr,
            });

            const heapObj = currentHeap.find((h) => h.address === heapAddr);
            if (heapObj) {
              heapObj.ownerVariable = varName;
            }

            snapshots.push({
              lineIndex: i,
              sourceLine: rawLine,
              explanation: `Transferred exclusive ownership of heap block ${heapAddr} from '${srcName}' to '${varName}'. '${srcName}' is now nullptr!`,
              stack: cloneStack(currentStack),
              heap: cloneHeap(currentHeap),
              stdout: [...currentStdout],
            });
            continue;
          }
        }
      }

      // 3. Dynamic allocation: type* ptr = new type(...) or new type[n];
      if (trimmed.includes('new ')) {
        const match = trimmed.match(/(\w+)\s*\*\s*(\w+)\s*=\s*new\s+(\w+)(?:\[(\d+)\]|\((.*)\))?;/);
        if (match) {
          const [, ptrType, varName, allocatedType, arraySize, ctorArg] = match;
          const heapAddr = CppSimulator.nextHeapAddress();
          const stackAddr = CppSimulator.nextStackAddress();

          const isArray = Boolean(arraySize);
          const val = ctorArg !== undefined ? (isNaN(Number(ctorArg)) ? ctorArg : Number(ctorArg)) : (isArray ? `[size ${arraySize}]` : 0);

          currentHeap.push({
            id: `heap-${Date.now()}-${Math.random()}`,
            address: heapAddr,
            sizeBytes: isArray ? Number(arraySize) * 4 : 4,
            type: allocatedType,
            value: val,
            status: 'allocated',
            ownerVariable: varName,
            arrayLength: isArray ? Number(arraySize) : undefined,
          });

          activeFrame().variables.push({
            id: `var-${varName}`,
            name: varName,
            type: `${ptrType}*`,
            value: heapAddr,
            address: stackAddr,
            sizeBytes: 8,
            isPointer: true,
            pointsToAddress: heapAddr,
          });

          snapshots.push({
            lineIndex: i,
            sourceLine: rawLine,
            explanation: isArray 
              ? `Allocated contiguous array of ${arraySize} ${allocatedType}s on the HEAP at ${heapAddr}. Pointer '${varName}' stores the address.`
              : `Allocated ${allocatedType} on the HEAP at ${heapAddr}. Pointer '${varName}' holds address ${heapAddr}.`,
            stack: cloneStack(currentStack),
            heap: cloneHeap(currentHeap),
            stdout: [...currentStdout],
          });
          continue;
        }
      }

      // 4. delete or delete[]
      if (trimmed.startsWith('delete ') || trimmed.startsWith('delete[] ')) {
        const isArrayDelete = trimmed.startsWith('delete[]');
        const ptrName = trimmed.replace(/^delete(?:\[\])?\s+/, '').replace(/;$/, '').trim();
        const ptrVar = activeFrame().variables.find((v) => v.name === ptrName);

        if (ptrVar && ptrVar.pointsToAddress) {
          const heapBlock = currentHeap.find((b) => b.address === ptrVar.pointsToAddress);
          if (heapBlock) {
            if (heapBlock.status === 'freed') {
              // DOUBLE FREE ERROR!
              snapshots.push({
                lineIndex: i,
                sourceLine: rawLine,
                explanation: `💥 CRITICAL UNDEFINED BEHAVIOR: Double free detected! Address ${ptrVar.pointsToAddress} was already freed.`,
                stack: cloneStack(currentStack),
                heap: cloneHeap(currentHeap),
                stdout: [...currentStdout],
                isError: true,
                errorMessage: 'Double free corruption!',
              });
              continue;
            }

            heapBlock.status = 'freed';
            ptrVar.isDangling = true; // Pointer is now dangling!

            snapshots.push({
              lineIndex: i,
              sourceLine: rawLine,
              explanation: `Heap block at ${heapBlock.address} freed! Note: '${ptrName}' still holds address ${ptrVar.pointsToAddress}, becoming a DANGLING POINTER unless set to nullptr!`,
              stack: cloneStack(currentStack),
              heap: cloneHeap(currentHeap),
              stdout: [...currentStdout],
            });
            continue;
          }
        }
      }

      // 5. Reference declaration: int& ref = x;
      if (trimmed.includes('&') && !trimmed.includes('&&') && trimmed.includes('=')) {
        const refMatch = trimmed.match(/(\w+)\s*&\s*(\w+)\s*=\s*(\w+);/);
        if (refMatch) {
          const [, refType, refName, targetName] = refMatch;
          const targetVar = activeFrame().variables.find((v) => v.name === targetName);

          if (targetVar) {
            activeFrame().variables.push({
              id: `var-${refName}`,
              name: refName,
              type: `${refType}&`,
              value: targetVar.value,
              address: targetVar.address, // References share identical address!
              sizeBytes: 0, // References do not occupy independent storage
              isReference: true,
              refTargetName: targetName,
            });

            snapshots.push({
              lineIndex: i,
              sourceLine: rawLine,
              explanation: `Created reference '${refName}' bound to '${targetName}'. In C++, a reference is an immutable alias sharing address ${targetVar.address}.`,
              stack: cloneStack(currentStack),
              heap: cloneHeap(currentHeap),
              stdout: [...currentStdout],
            });
            continue;
          }
        }
      }

      // 6. Pointer declaration: int* p = &x; or int* p = nullptr;
      if (trimmed.includes('*') && trimmed.includes('=')) {
        const ptrMatch = trimmed.match(/(\w+)\s*\*\s*(\w+)\s*=\s*(&?[\w]+);/);
        if (ptrMatch) {
          const [, ptrType, varName, rhs] = ptrMatch;
          const stackAddr = CppSimulator.nextStackAddress();

          let targetAddr: string | null = null;
          let valDisp = 'nullptr';

          if (rhs.startsWith('&')) {
            const targetName = rhs.substring(1);
            const targetVar = activeFrame().variables.find((v) => v.name === targetName);
            if (targetVar) {
              targetAddr = targetVar.address;
              valDisp = targetAddr;
            }
          } else if (rhs === 'nullptr' || rhs === 'NULL' || rhs === '0') {
            targetAddr = null;
            valDisp = 'nullptr';
          } else {
            // Assigned from another pointer: int* q = p;
            const otherPtr = activeFrame().variables.find((v) => v.name === rhs);
            if (otherPtr) {
              targetAddr = otherPtr.pointsToAddress || null;
              valDisp = otherPtr.value;
            }
          }

          activeFrame().variables.push({
            id: `var-${varName}`,
            name: varName,
            type: `${ptrType}*`,
            value: valDisp,
            address: stackAddr,
            sizeBytes: 8,
            isPointer: true,
            pointsToAddress: targetAddr,
          });

          snapshots.push({
            lineIndex: i,
            sourceLine: rawLine,
            explanation: targetAddr 
              ? `Pointer '${varName}' allocated on stack at ${stackAddr}. Holds memory address ${targetAddr}.`
              : `Pointer '${varName}' initialized to null (safe state pointing to nothing).`,
            stack: cloneStack(currentStack),
            heap: cloneHeap(currentHeap),
            stdout: [...currentStdout],
          });
          continue;
        }
      }

      // 7. Pointer dereference assignment: *p = 42;
      if (trimmed.startsWith('*')) {
        const derefMatch = trimmed.match(/\*(\w+)\s*=\s*(.+);/);
        if (derefMatch) {
          const [, ptrName, newValStr] = derefMatch;
          const ptrVar = activeFrame().variables.find((v) => v.name === ptrName);

          if (ptrVar) {
            if (!ptrVar.pointsToAddress || ptrVar.value === 'nullptr') {
              // SEGMENTATION FAULT!
              snapshots.push({
                lineIndex: i,
                sourceLine: rawLine,
                explanation: `💥 SEGMENTATION FAULT (SIGSEGV)! Attempted to dereference null pointer '${ptrName}'.`,
                stack: cloneStack(currentStack),
                heap: cloneHeap(currentHeap),
                stdout: [...currentStdout],
                isError: true,
                errorMessage: 'Null pointer dereference',
              });
              continue;
            }

            if (ptrVar.isDangling) {
              snapshots.push({
                lineIndex: i,
                sourceLine: rawLine,
                explanation: `💥 USE-AFTER-FREE ERROR: Dereferencing dangling pointer '${ptrName}' targeting freed memory ${ptrVar.pointsToAddress}!`,
                stack: cloneStack(currentStack),
                heap: cloneHeap(currentHeap),
                stdout: [...currentStdout],
                isError: true,
                errorMessage: 'Use-after-free error',
              });
              continue;
            }

            const numVal = isNaN(Number(newValStr)) ? newValStr : Number(newValStr);

            // Find in stack or heap
            const targetVar = activeFrame().variables.find((v) => v.address === ptrVar.pointsToAddress);
            if (targetVar) {
              const oldVal = targetVar.value;
              targetVar.value = numVal;

              // Also update any references bound to this variable
              activeFrame().variables.forEach((v) => {
                if (v.isReference && v.refTargetName === targetVar.name) {
                  v.value = numVal;
                }
              });

              snapshots.push({
                lineIndex: i,
                sourceLine: rawLine,
                explanation: `Dereferenced '*${ptrName}': accessed address ${ptrVar.pointsToAddress} and mutated variable '${targetVar.name}' from ${oldVal} to ${numVal}.`,
                stack: cloneStack(currentStack),
                heap: cloneHeap(currentHeap),
                stdout: [...currentStdout],
              });
              continue;
            }

            const targetHeap = currentHeap.find((h) => h.address === ptrVar.pointsToAddress);
            if (targetHeap) {
              const oldVal = targetHeap.value;
              targetHeap.value = numVal;
              snapshots.push({
                lineIndex: i,
                sourceLine: rawLine,
                explanation: `Dereferenced '*${ptrName}': mutated heap object at ${targetHeap.address} from ${oldVal} to ${numVal}.`,
                stack: cloneStack(currentStack),
                heap: cloneHeap(currentHeap),
                stdout: [...currentStdout],
              });
              continue;
            }
          }
        }
      }

      // 8. Array declaration: int arr[3] = {10, 20, 30};
      if (trimmed.includes('[') && trimmed.includes(']') && trimmed.includes('=')) {
        const arrMatch = trimmed.match(/(\w+)\s+(\w+)\[(\d+)\]\s*=\s*\{([^}]+)\};/);
        if (arrMatch) {
          const [, elemType, arrName, sizeStr, elemsStr] = arrMatch;
          const size = parseInt(sizeStr, 10);
          const rawElems = elemsStr.split(',').map((e) => e.trim());
          const stackAddr = CppSimulator.nextStackAddress();

          const elements = rawElems.map((val, idx) => ({
            index: idx,
            value: isNaN(Number(val)) ? val : Number(val),
            address: `0x${(parseInt(stackAddr, 16) + idx * 4).toString(16)}`,
          }));

          activeFrame().variables.push({
            id: `var-${arrName}`,
            name: arrName,
            type: `${elemType}[${size}]`,
            value: `[${rawElems.join(', ')}]`,
            address: stackAddr,
            sizeBytes: size * 4,
            arrayElements: elements,
          });

          snapshots.push({
            lineIndex: i,
            sourceLine: rawLine,
            explanation: `Declared array '${arrName}' of ${size} elements on the stack. Stored contiguously in memory starting at ${stackAddr}.`,
            stack: cloneStack(currentStack),
            heap: cloneHeap(currentHeap),
            stdout: [...currentStdout],
          });
          continue;
        }
      }

      // 9. Standard variable declaration: int x = 42; or string s = "C++";
      const varDeclMatch = trimmed.match(/^(int|double|float|char|bool|string|auto)\s+(\w+)\s*(?:=\s*(.+))?;/);
      if (varDeclMatch) {
        let [, varType, varName, initVal] = varDeclMatch;
        const stackAddr = CppSimulator.nextStackAddress();

        let val: any = 0;
        if (initVal !== undefined) {
          initVal = initVal.trim();
          if ((initVal.startsWith('"') && initVal.endsWith('"')) || (initVal.startsWith("'") && initVal.endsWith("'"))) {
            val = initVal.slice(1, -1);
          } else if (initVal === 'true') {
            val = true;
          } else if (initVal === 'false') {
            val = false;
          } else if (!isNaN(Number(initVal))) {
            val = Number(initVal);
          } else {
            // Might be another variable: int y = x;
            const other = activeFrame().variables.find((v) => v.name === initVal);
            val = other ? other.value : initVal;
          }
        }

        if (varType === 'auto') {
          if (typeof val === 'number') varType = Number.isInteger(val) ? 'int' : 'double';
          else if (typeof val === 'string') varType = 'string';
          else if (typeof val === 'boolean') varType = 'bool';
        }

        const sizeBytes = varType === 'char' || varType === 'bool' ? 1 : varType === 'int' || varType === 'float' ? 4 : 8;

        activeFrame().variables.push({
          id: `var-${varName}`,
          name: varName,
          type: varType,
          value: val,
          address: stackAddr,
          sizeBytes,
        });

        snapshots.push({
          lineIndex: i,
          sourceLine: rawLine,
          explanation: `Allocated ${sizeBytes} bytes on stack at ${stackAddr} for '${varType} ${varName} = ${val}'.`,
          stack: cloneStack(currentStack),
          heap: cloneHeap(currentHeap),
          stdout: [...currentStdout],
        });
        continue;
      }

      // 10. Assignment to existing variable: x = 100; or ref = 50; or x++;
      const assignMatch = trimmed.match(/^(\w+)\s*(?:([+\-*/]=|=)\s*(.+);|(\+\+|--);)/);
      if (assignMatch) {
        const [, varName, op, expr, incDec] = assignMatch;
        const targetVar = activeFrame().variables.find((v) => v.name === varName);

        if (targetVar) {
          const oldVal = targetVar.value;
          if (incDec === '++') {
            targetVar.value = Number(targetVar.value) + 1;
          } else if (incDec === '--') {
            targetVar.value = Number(targetVar.value) - 1;
          } else if (op === '=') {
            const num = Number(expr);
            targetVar.value = isNaN(num) ? expr : num;
          } else if (op === '+=') {
            targetVar.value = Number(targetVar.value) + Number(expr);
          }

          // If this was a reference or referenced by one, sync
          if (targetVar.isReference && targetVar.refTargetName) {
            const origin = activeFrame().variables.find((v) => v.name === targetVar.refTargetName);
            if (origin) origin.value = targetVar.value;
          } else {
            activeFrame().variables.forEach((v) => {
              if (v.isReference && v.refTargetName === targetVar.name) {
                v.value = targetVar.value;
              }
            });
          }

          snapshots.push({
            lineIndex: i,
            sourceLine: rawLine,
            explanation: targetVar.isReference
              ? `Modified reference '${varName}'. The underlying target '${targetVar.refTargetName}' is updated to ${targetVar.value}.`
              : `Updated '${varName}' at ${targetVar.address}: ${oldVal} ➔ ${targetVar.value}.`,
            stack: cloneStack(currentStack),
            heap: cloneHeap(currentHeap),
            stdout: [...currentStdout],
          });
          continue;
        }
      }

      // Generic statement fallback
      snapshots.push({
        lineIndex: i,
        sourceLine: rawLine,
        explanation: `Executed line: ${trimmed}`,
        stack: cloneStack(currentStack),
        heap: cloneHeap(currentHeap),
        stdout: [...currentStdout],
      });
    }

    if (snapshots.length === 1) {
      snapshots.push({
        lineIndex: 0,
        sourceLine: '// Done',
        explanation: 'Finished execution.',
        stack: cloneStack(currentStack),
        heap: cloneHeap(currentHeap),
        stdout: [...currentStdout],
      });
    }

    return snapshots;
  }

  /**
   * Runs the complete program to completion.
   * Returns stdout, exit code, memory diagnostics, and execution duration.
   */
  public static runProgram(code: string): {
    stdout: string;
    stdoutLines: string[];
    exitCode: number;
    hasLeak: boolean;
    isError: boolean;
    errorMessage?: string;
    finalSnapshot: ExecutionSnapshot;
    allSnapshots: ExecutionSnapshot[];
    totalSteps: number;
    memorySummary: {
      stackVarCount: number;
      heapBlockCount: number;
      leakedBlockCount: number;
    };
  } {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const snapshots = CppSimulator.simulate(code);
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const finalSnapshot = snapshots[snapshots.length - 1];
    const stdoutLines = finalSnapshot ? finalSnapshot.stdout : [];
    const stdout = stdoutLines.join('');
    const hasLeak = Boolean(finalSnapshot?.hasLeak);
    const isError = Boolean(finalSnapshot?.isError);
    const exitCode = isError ? 139 : 0; // 139 for segfault / error

    const stackVarCount = finalSnapshot?.stack[0]?.variables.length || 0;
    const heapBlockCount = finalSnapshot?.heap.length || 0;
    const leakedBlockCount = finalSnapshot?.heap.filter((b) => b.status === 'leaked').length || 0;

    return {
      stdout,
      stdoutLines,
      exitCode,
      hasLeak,
      isError,
      errorMessage: finalSnapshot?.errorMessage,
      finalSnapshot,
      allSnapshots: snapshots,
      totalSteps: snapshots.length,
      memorySummary: {
        stackVarCount,
        heapBlockCount,
        leakedBlockCount,
      },
    };
  }
}

