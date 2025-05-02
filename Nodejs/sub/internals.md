# Internals - NodeJs

- **V8 Engine**:
  - V8 compiles JavaScript **directly to native machine code** (via JIT - Just-In-Time compilation).
  - It optimizes code dynamically (hot functions run faster).
  - Node.js uses V8's **heap memory** (for objects) and **stack memory** (for function calls).
- **libuv**:
  - A C/C++ library that handles:
    - **Thread pool** (4 threads by default — you can change this via `UV_THREADPOOL_SIZE` env variable).
    - **Non-blocking network calls**, **file system operations**.
    - **Event loop** implementation.
- **Event Loop (Advanced Phases)**:
  The event loop goes through multiple phases in each tick:
  1. **Timers phase** (callbacks scheduled by `setTimeout`, `setInterval`)
  2. **Pending Callbacks** (system-level operations like TCP errors)
  3. **Idle, prepare** (used internally by Node.js)
  4. **Poll phase** (fetch new I/O events)
  5. **Check phase** (`setImmediate` callbacks)
  6. **Close Callbacks** (like `socket.on('close')`)

> **Important**: `process.nextTick()` **executes before** the next event loop phase — super high priority.

#### 🔥 Deep Tip

- **CPU intensive tasks** (e.g., image processing, encryption) can **block** Node.js because they stay in the main thread.
- Solutions:
  - Use **child_process** to spawn separate processes.
  - Use **worker_threads** to offload heavy computation.

### 2. Node.js — Single-threaded yet concurrent

**Concurrency** ≠ **Parallelism**

- Node.js achieves **concurrency** by offloading blocking tasks to **background workers** (thanks to libuv).
- **Example:**  
  Reading files, making HTTP requests, database queries all happen in background threads, while your main thread stays free.

🔵 **Mistake juniors make:**  
Thinking Node.js is _multi-threaded_ because of concurrency.  
❗ **Reality:** JS execution stays single-threaded. Only I/O is multi-threaded internally.

### 3. Node.js Runtime Architecture Diagram (Deep)

Here's a **conceptual deep architecture** of Node.js runtime:

```plaintext
      ┌──────────────────────────┐
      │    JavaScript Code        │
      └────────────┬──────────────┘
                   ↓
           ┌─────────────┐
           │   V8 Engine  │ (Executes JS code)
           └─────┬───────┘
                 ↓
        ┌──────────────────┐
        │    Node.js APIs   │ (fs, net, crypto, etc.)
        └────────┬──────────┘
                 ↓
      ┌─────────────────────┐
      │       libuv          │
      │ (thread pool + event │
      │  loop management)    │
      └─────────┬────────────┘
                ↓
 ┌────────────────────────────┐
 │   OS Kernel / System Calls  │ (TCP, file system access, DNS)
 └────────────────────────────┘
```

🔵 **Key points**:

- Your code → runs inside V8.
- Node.js APIs (like `fs.readFile`) → delegate work to `libuv`.
- `libuv` uses OS-level threads for background work (disk I/O, network I/O).
- Event loop → listens for work completion and executes callbacks.

#### ⚡ Quick Way to Remember:

```
Your Code → V8 → Node APIs → libuv → OS Kernel
```

⮕ The Event Loop is the **traffic controller** of all of this.

### 4. Visual: Deep Node.js Runtime Diagram

Here's the **full Node.js runtime diagram** with complete flow:

```plaintext
     Your JavaScript Code
               ↓
     ┌───────────────────┐
     │     V8 Engine      │  (compiles + executes your JS)
     └───────┬────────────┘
             ↓
 ┌───────────────────────────┐
 │   Node Core Bindings       │ (C++ bindings to V8 & libuv)
 └───────┬───────────────┬────┘
         ↓               ↓
┌────────────────┐  ┌──────────────────┐
│Node APIs (fs,   │  │libuv (event loop, │
│crypto, net, etc)│  │thread pool)       │
└────────────────┘  └──────────────────┘
         ↓                 ↓
 ┌────────────────────────────────────┐
 │      Operating System (Kernel)      │ (actual system-level IO: file, sockets, etc.)
 └────────────────────────────────────┘
```

### 5. Deep-dive Cheat Sheet: Node.js Event Loop Phases

> Imagine the Event Loop phases as **sub-stages**:

```plaintext
1. timers phase
   - Executes callbacks scheduled by setTimeout() and setInterval()

2. pending callbacks phase
   - Executes I/O callbacks deferred to the next loop iteration

3. idle, prepare phase
   - Only for internal use

4. poll phase
   - Retrieves new I/O events (e.g., TCP/UDP network events)

5. check phase
   - Executes setImmediate() callbacks

6. close callbacks phase
   - Handles things like socket.on('close', callback)

-------------------
Microtasks Queue: (executed after each phase)
 - process.nextTick()
 - Promise.then() / catch() / finally()
```

✅ **Important**:

- `process.nextTick` is **even before Promise.then**.
- `setImmediate` is NOT the same as `setTimeout(fn, 0)`.

### 6. Visual: Node.js Single-threaded but Multi-tasking

```plaintext
┌──────────────────────────────────────────────────────────────┐
│                        MAIN THREAD                            │
│ (Executes your JS, Event Loop, Scheduling tasks)              │
└──────────────────────────────────────────────────────────────┘
 └─> Meanwhile, heavy I/O goes to:

 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │   Thread 1   │ │   Thread 2   │ │   Thread 3   │ │   Thread 4   │
 │(file read)   │ │(DNS lookup)  │ │(TCP socket)  │ │(crypto hash) │
 └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

(They notify main thread once done.)
```

✅ Node itself is single-threaded in terms of _your code_.  
✅ But **libuv** uses a **threadpool** behind the scenes for non-blocking magic.

## 🧠 Complex Event Loop Example (with output explained)

```js
const fs = require("fs");

console.log("🟢 Start");

process.nextTick(() => console.log("1️⃣ process.nextTick"));

Promise.resolve().then(() => console.log("2️⃣ Promise resolved"));

setTimeout(() => {
  console.log("3️⃣ setTimeout 0ms");
  process.nextTick(() => console.log("4️⃣ nextTick inside setTimeout"));
  Promise.resolve().then(() => console.log("5️⃣ Promise inside setTimeout"));
}, 0);

setImmediate(() => {
  console.log("6️⃣ setImmediate");
  process.nextTick(() => console.log("7️⃣ nextTick inside setImmediate"));
  Promise.resolve().then(() => console.log("8️⃣ Promise inside setImmediate"));
});

fs.readFile(__filename, () => {
  console.log("9️⃣ I/O: readFile callback");
  process.nextTick(() => console.log("🔟 nextTick inside readFile"));
  Promise.resolve().then(() => console.log("🔟.1 Promise inside readFile"));

  setImmediate(() => console.log("🔟.2 setImmediate inside readFile"));
  setTimeout(() => console.log("🔟.3 setTimeout inside readFile"), 0);
});

(() => {
  const start = Date.now();
  while (Date.now() - start < 20) {} // simulate blocking (e.g. CPU task)
  console.log("🟠 Blocking loop done");
})();

console.log("🟢 End of script");
```

---

## 🔢 Expected Output Order (annotated):

```text
🟢 Start
1️⃣ process.nextTick
2️⃣ Promise resolved
🟠 Blocking loop done
🟢 End of script
3️⃣ setTimeout 0ms
4️⃣ nextTick inside setTimeout
5️⃣ Promise inside setTimeout
6️⃣ setImmediate
7️⃣ nextTick inside setImmediate
8️⃣ Promise inside setImmediate
9️⃣ I/O: readFile callback
🔟 nextTick inside readFile
🔟.1 Promise inside readFile
🔟.2 setImmediate inside readFile
🔟.3 setTimeout inside readFile
```

---

## 🔍 Breakdown

| Phase              | Executed Items                                         |
| ------------------ | ------------------------------------------------------ |
| 🧱 **Main thread** | Synchronous logs, `process.nextTick`, Promises         |
| ⏲ **Timers**       | `setTimeout(..., 0)` and its nested callbacks          |
| 🧪 **Check**       | `setImmediate` and its nested microtasks               |
| 📂 **I/O Poll**    | `fs.readFile` → callback → setImmediate/setTimeout     |
| 🔄 **Microtasks**  | Run after every phase (`nextTick` first, then `.then`) |

---

## 🧠 Tip: Mental Execution Model

```text
[Synchronous]
 → nextTick
   → Promise
     → setTimeout
       → nextTick (inside timeout)
         → Promise (inside timeout)
     → setImmediate
       → nextTick (inside immediate)
         → Promise (inside immediate)
     → fs.readFile (I/O)
       → callback
         → nextTick
         → Promise
         → setImmediate
         → setTimeout
```

---

## 🧪 Want a Challenge?

Try modifying the code to:

1. Add a **long `setTimeout(100)`** and see where it lands.
2. Use **multiple nested `process.nextTick()`** calls (can you block Promises?).
3. Add a **heavy computation** inside a Promise `.then()` — does it delay other tasks?
