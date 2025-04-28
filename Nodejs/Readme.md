# 🚀 Advance Nodejs

## 1. Node.js — Advanced Internals

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

### 🔥 Deep Tip

- **CPU intensive tasks** (e.g., image processing, encryption) can **block** Node.js because they stay in the main thread.
- Solutions:
  - Use **child_process** to spawn separate processes.
  - Use **worker_threads** to offload heavy computation.

## 2. Node.js — Single-threaded yet concurrent

**Concurrency** ≠ **Parallelism**

- Node.js achieves **concurrency** by offloading blocking tasks to **background workers** (thanks to libuv).
- **Example:**  
  Reading files, making HTTP requests, database queries all happen in background threads, while your main thread stays free.

🔵 **Mistake juniors make:**  
Thinking Node.js is _multi-threaded_ because of concurrency.  
❗ **Reality:** JS execution stays single-threaded. Only I/O is multi-threaded internally.

## 3. npm — Advanced Topics

- **Semantic Versioning (SemVer)**:

  - `"^1.2.3"` — update minor/patch versions automatically.
  - `"~1.2.3"` — update only patch versions automatically.
  - `"1.2.3"` — exact version, no automatic updates.

- **Installing Dev Dependencies**:

```bash
npm install nodemon --save-dev
```

(`--save-dev` saves it in `devDependencies`, not `dependencies`.)

- **Global vs Local packages**:

  - **Global (`-g`)**: installed once, available everywhere (e.g., `npm install -g typescript`).
  - **Local**: installed in project `node_modules/` (recommended for projects).

- **npx**: Runs a package without globally installing it.

```bash
npx create-react-app my-app
```

- **npm scripts** (powerful automation!):

```json
"scripts": {
  "dev": "nodemon index.js",
  "build": "webpack --config webpack.config.js",
  "test": "jest"
}
```

Run them:

```bash
npm run dev
```

## 4. require, module.exports — Advanced Behavior

### Module Caching

- When you `require()` a module, it's **cached**.
- Second time you `require()` the same module, Node **does NOT reload** it — it just returns the cached version.

**Example:**

```javascript
// counter.js
let count = 0;
module.exports = {
  increment: () => ++count,
  getCount: () => count,
};

// app.js
const counter = require("./counter");
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2

const counter2 = require("./counter");
console.log(counter2.getCount()); // 2 (uses same cached object)
```

### Module Resolution Algorithm

When you write `require('foo')`, Node tries in this order:

1. Check if `'foo'` is a core module (like `fs`, `path`).
2. Check if there's a `node_modules/foo` directory with `package.json` main entry.
3. Look for `foo.js`, `foo.json`, `foo.node` files.
4. Move **up the directory tree** if not found (parent folders).

## 5. package.json and package-lock.json — Advanced control

- **package.json**:

  - Can define **scripts**, **dependencies**, **engines** (specify Node.js version).
  - Custom fields can be added too (`"author"`, `"repository"`, `"license"`, etc).

- **package-lock.json**:
  - Ensures **deterministic installs** — no surprises when teammates install your app.
  - Records **exact versions** and **dependency tree**.

**Example:**

```json
"dependencies": {
  "express": "^4.18.2"
},
"lockfileVersion": 2,
"packages": {
  "": {},
  "node_modules/express": {
    "version": "4.18.2"
  }
}
```

## 6. Publishing Your Own npm Package

Steps:

1. Create your code (e.g., a library).
2. `npm init` to generate package.json
3. Add a unique name.
4. `npm login` (create an npmjs.com account if needed).
5. `npm publish`

> Pro Tip:  
> If name already exists, npm will throw an error. Use `@scope/package-name` for personal namespacing.

Example:

```bash
npm publish --access public
```

### 1. Event Loop Race

**Challenge**:  
Predict the exact output order of this code:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

setImmediate(() => {
  console.log("Immediate 1");
});

process.nextTick(() => {
  console.log("Next Tick 1");
});

console.log("End");
```

▶️ **Task**:  
Write down the output order **before** you run it. Explain _why_ it's that order based on Event Loop phases.

### 2. Heavy CPU Blocking Simulation

**Challenge**:  
Simulate heavy CPU blocking in Node.js and show how it blocks the event loop.

Example hint:

```javascript
const start = Date.now();
while (Date.now() - start < 5000) {
  // Block for 5 seconds
}
console.log("Done!");
```

▶️ **Task**:  
Now try putting `setTimeout(() => console.log('Hello'), 1000);` **before** the loop.

Explain why it **doesn't** print "Hello" after 1 second.

### 3. Create your own Event Loop simulation (Tiny Version)

**Challenge**:  
Fake a mini event loop using JavaScript arrays.

Example:

```javascript
const microTasks = [];
const macroTasks = [];

function eventLoop() {
  while (microTasks.length || macroTasks.length) {
    while (microTasks.length) {
      const task = microTasks.shift();
      task();
    }

    if (macroTasks.length) {
      const task = macroTasks.shift();
      task();
    }
  }
}

// Add tasks
microTasks.push(() => console.log("Microtask 1"));
macroTasks.push(() => console.log("Macrotask 1"));
microTasks.push(() => console.log("Microtask 2"));

// Run our fake event loop
eventLoop();
```

▶️ **Task**:  
Add some `setTimeout` and `Promise.then` to simulate how Node handles real event loop.

### 4. Module Caching Bug Challenge

▶️ **Task**:
Create two files:

- `counter.js`:

```javascript
let count = 0;

module.exports = {
  increment: () => ++count,
  reset: () => {
    count = 0;
  },
  getCount: () => count,
};
```

- `app.js`:

```javascript
const counter1 = require("./counter");
counter1.increment();
counter1.increment();

const counter2 = require("./counter");
console.log(counter2.getCount()); // Predict output
counter2.reset();
console.log(counter1.getCount()); // Predict output
```

> **Question**:

- What will be printed?
- Why is module caching important here?

---

## 7. Node.js Runtime Architecture Diagram (Deep)

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

### ⚡ Quick Way to Remember:

```
Your Code → V8 → Node APIs → libuv → OS Kernel
```

⮕ The Event Loop is the **traffic controller** of all of this.

## 8. Visual: Deep Node.js Runtime Diagram

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

## 9. Deep-dive Cheat Sheet: Node.js Event Loop Phases

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

## 10. Visual: Node.js Single-threaded but Multi-tasking

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

---

## 1. 🔥 **Creating a Server using `http`**

When you create a server, behind the scenes:

- `http.Server` is an **EventEmitter**.
- Events like `'request'`, `'connection'`, `'close'`, `'checkContinue'` are fired.

👉 Let's create a server that **handles different events manually**:

```javascript
const http = require("http");

const server = http.createServer();

// Listen manually
server.on("request", (req, res) => {
  console.log(`Request event triggered for ${req.url}`);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Advanced Server Response");
});

server.on("connection", (socket) => {
  console.log("New connection established.");
});

server.on("close", () => {
  console.log("Server shutting down...");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Shutdown server after 10 seconds
setTimeout(() => {
  server.close();
}, 10000);
```

**Key Points**:

- `server.on('request', handler)` is what `createServer(handler)` **internally does**.
- You can manually handle **connections** and **shutdown gracefully**.

## 2. 📂 **Reading/Writing Files — STREAMS Instead of readFile**

At advanced level, we **do not load full file in memory**.  
We use **Streams**.

```javascript
const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream("./bigfile.txt");

  stream.pipe(res); // Auto-handles backpressure
});

server.listen(3000, () => console.log("Streaming server running"));
```

✅ **Streams** solve:

- **Memory Efficiency** (big files)
- **Backpressure** (client slower than server)

🔵 `fs.createReadStream` returns a readable **stream**, and `res` is a writable stream.

## 3. 📡 **Handling Events — Custom EventEmitters Advanced**

Create **your own event-driven classes**:

```javascript
const EventEmitter = require("events");

class Auth extends EventEmitter {
  register(username) {
    console.log("Registering user...");
    this.emit("registered", username);
  }
}

const auth = new Auth();

// Observer Pattern
auth.on("registered", (username) => {
  console.log(`Sending welcome email to ${username}`);
});

auth.register("hero");
```

✅ You are now building **Observable systems** — like what large apps (Discord, Slack) do.

## 4. 🚀 **Advanced Async Control**

In real projects, you'll **combine**:

- Promises
- Async/await
- Streams (which are EventEmitters)
- Timeouts
- Manual Promise wrappers

Example: **Manually Promisify fs**

```javascript
const fs = require("fs");

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function read() {
  try {
    const content = await readFileAsync("data.txt");
    console.log(content);
  } catch (err) {
    console.error("Error:", err);
  }
}

read();
```

✅ Manually **promisifying** gives you **more control** than relying on libraries.

## 🎯 **Concepts (you must master)**

| Concept                  | Why It Matters                                     |
| ------------------------ | -------------------------------------------------- |
| Backpressure             | Prevent memory overflow when client is slower      |
| HighWaterMark in streams | Tuning how much data is buffered in streams        |
| Graceful Shutdown        | Stop accepting new connections but finish old ones |
| Zero-Copy Streaming      | `stream.pipe()` does not copy data manually        |
| Cluster Module           | Run multiple Node.js instances for multicore usage |
| Event Loop + Microtasks  | Full understanding of callback queue, nextTick etc |
