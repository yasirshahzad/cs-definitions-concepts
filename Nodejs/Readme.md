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

## 4. 🚀 **Async Control**

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

### 🎯 **Concepts**

| Concept                  | Why It Matters                                     |
| ------------------------ | -------------------------------------------------- |
| Backpressure             | Prevent memory overflow when client is slower      |
| HighWaterMark in streams | Tuning how much data is buffered in streams        |
| Graceful Shutdown        | Stop accepting new connections but finish old ones |
| Zero-Copy Streaming      | `stream.pipe()` does not copy data manually        |

## Nodejs Internal Modules

There are **four main APIs** in `fs` you must master:

| Style                  | Example Function       | Characteristics                           |
| :--------------------- | :--------------------- | :---------------------------------------- |
| Callback-based         | `fs.readFile`          | Asynchronous but uses callbacks           |
| Promise-based          | `fs.promises.readFile` | Modern async/await style                  |
| Stream-based           | `fs.createReadStream`  | Efficient chunked reading/writing         |
| Synchronous (blocking) | `fs.readFileSync`      | Blocks entire process — **use carefully** |

### 1. **Promise-based fs (best practice)**

Instead of messy callbacks, Node provides a **promise API** via `fs.promises`.

```javascript
const fs = require("fs/promises");
const path = require("path");

async function readFileAsync() {
  try {
    const data = await fs.readFile(path.join(__dirname, "file.txt"), "utf8");
    console.log(data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

readFileAsync();
```

✅ Use `fs/promises` for **clean, awaitable** code.

---

### 2. **Important Advanced Functions**

Let's cover the most powerful ones:

#### a. `fs.promises.mkdir` — Make Directory (Recursive)

```javascript
await fs.mkdir("a/b/c", { recursive: true });
console.log("Folders created");
```

✅ If the parent folders don’t exist, **recursive** creates them.

---

#### b. `fs.promises.readdir` — Read Directory

```javascript
const files = await fs.readdir("./myFolder");
console.log("Files:", files);
```

✅ Lists all files/folders inside a directory.

---

#### c. `fs.promises.stat` — File/Folder Information

```javascript
const stat = await fs.stat("path/to/file");
console.log(stat.isFile()); // true
console.log(stat.isDirectory()); // false
console.log("Size:", stat.size, "bytes");
```

✅ Check **if it's a file or folder**, get **size**, **timestamps**.

---

#### d. `fs.promises.unlink` — Delete a File

```javascript
await fs.unlink("path/to/file.txt");
console.log("File deleted");
```

✅ Careful: `unlink` = permanently deletes the file.

---

#### e. `fs.promises.rm` — Remove Directory/File (new method)

```javascript
await fs.rm("path/to/folder", { recursive: true, force: true });
console.log("Folder deleted");
```

✅ **`rm`** replaces old `rmdir` — better, safer, stronger.

---

### 3. **Watch Files in Real Time**

Monitor when a file changes:

```javascript
const fs = require("fs");

fs.watch("./file.txt", (eventType, filename) => {
  console.log(`Event: ${eventType} on file: ${filename}`);
});
```

✅ Useful for hot reloading servers, live updates.

---

### 4. **Handling Streams** (Best for BIG Files)

```javascript
const fs = require("fs");

const readStream = fs.createReadStream("bigfile.txt", {
  highWaterMark: 16 * 1024,
}); // 16kb chunks

readStream.on("data", (chunk) => {
  console.log("Chunk:", chunk.length, "bytes");
});

readStream.on("end", () => {
  console.log("Reading done");
});
```

✅ Memory efficient: only **small chunks** loaded.

**Tip:** You can **pipe** streams to each other:

```javascript
const writeStream = fs.createWriteStream("copy.txt");
readStream.pipe(writeStream);
```

---

### 5. **Advanced Error Handling**

✅ Always check for errors — not every failure is critical.

```javascript
try {
  await fs.readFile("nonexistent.txt");
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("File does not exist");
  } else {
    throw err;
  }
}
```

| Error Code | Meaning               |
| :--------- | :-------------------- |
| `ENOENT`   | File/folder not found |
| `EACCES`   | Permission denied     |
| `EISDIR`   | Is a directory        |

---

### 6. **Atomic Writes (safe writes)**

If you want **safe saving** (prevent half-written files):

```javascript
const fs = require("fs/promises");

async function safeWrite(filePath, data) {
  const tmpPath = filePath + ".tmp";
  await fs.writeFile(tmpPath, data);
  await fs.rename(tmpPath, filePath); // Atomic
}

safeWrite("data.json", '{"name": "Hero"}');
```

✅ Guarantees either **old** or **new** data — never broken file.

---

### 7. **Bonus: Copy files easily**

From Node.js 16+, use `fs.promises.cp()`:

```javascript
await fs.cp("source.txt", "destination.txt");
```

✅ Fast, clean file copying!

---

### 8. Real World Example

**Serve static files manually** using only `fs`:

```javascript
const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const server = http.createServer(async (req, res) => {
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200);
    res.end(content);
  } catch (err) {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
```

✅ No Express, fully manual server!

---

Perfect — let's **go advanced** into the `path` module.  
This is **super important** if you want to build servers, file systems, CLIs, etc.

---

## 📂 Node.js `path` Module

✅ The `path` module gives you **cross-platform** (Windows, Linux, Mac) ways to handle file/directory paths properly.

```javascript
const path = require("path");
```

---

### 1. **Basic but Critical Functions**

| Function          | Purpose                    |
| :---------------- | :------------------------- |
| `path.join()`     | Join path segments safely  |
| `path.resolve()`  | Resolve full absolute path |
| `path.basename()` | Get filename               |
| `path.dirname()`  | Get directory name         |
| `path.extname()`  | Get file extension         |

---

### 2. **path.join() — Safely Build Paths**

**Example:**

```javascript
const fullPath = path.join("folder", "subfolder", "file.txt");
console.log(fullPath);
// On Linux/Mac ➔ folder/subfolder/file.txt
// On Windows ➔ folder\subfolder\file.txt
```

✅ Automatically inserts the correct `/` or `\` depending on the OS.

---

### 3. **path.resolve() — Build Absolute Paths**

```javascript
const fullPath = path.resolve("folder", "file.txt");
console.log(fullPath);
// Outputs: /Users/yourname/project/folder/file.txt
```

- `resolve()` **starts from current working directory (cwd)**.
- `resolve()` is **smarter**: it handles `..` (parent folders).

Example:

```javascript
const x = path.resolve("a", "..", "b", "file.txt");
console.log(x);
// Means: from a's parent ➔ go into b ➔ file.txt
```

---

### 4. **path.basename() — Get the filename only**

```javascript
const fileName = path.basename("/folder/subfolder/file.txt");
console.log(fileName);
// file.txt
```

You can also **remove the extension**:

```javascript
const name = path.basename("/folder/subfolder/file.txt", ".txt");
console.log(name);
// file
```

---

### 5. **path.dirname() — Get the directory name**

```javascript
const dirName = path.dirname("/folder/subfolder/file.txt");
console.log(dirName);
// /folder/subfolder
```

---

### 6. **path.extname() — Get file extension**

```javascript
const ext = path.extname("/folder/subfolder/file.txt");
console.log(ext);
// .txt
```

✅ Useful to filter files: `.jpg`, `.png`, `.pdf`, etc.

---

### 7. **path.parse() and path.format() — Full Object Control**

#### a. parse()

```javascript
const parsed = path.parse("/folder/subfolder/file.txt");
console.log(parsed);
/*
{
  root: '/',
  dir: '/folder/subfolder',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/
```

✅ Breaks a full path into parts!

---

#### b. format()

```javascript
const formatted = path.format({
  dir: "/folder/subfolder",
  name: "file",
  ext: ".txt",
});
console.log(formatted);
// /folder/subfolder/file.txt
```

✅ Build a path from an object.

---

### 8. **Cross-Platform Differences (Important)**

| Path                     | Windows Example | Linux Example |
| :----------------------- | :-------------- | :------------ |
| separator                | `\`             | `/`           |
| delimiter (PATH env var) | `;`             | `:`           |

```javascript
console.log(path.sep); // \ (Windows) OR / (Linux)
console.log(path.delimiter); // ; (Windows) OR : (Linux)
```

✅ Good when handling environment variables like `PATH`.

---

### 9. **Relative vs Absolute Paths**

| Path Type | Example                      |
| :-------- | :--------------------------- |
| Absolute  | `/Users/you/folder/file.txt` |
| Relative  | `./folder/file.txt`          |

**Check if path is absolute:**

```javascript
console.log(path.isAbsolute("/folder/file.txt")); // true
console.log(path.isAbsolute("folder/file.txt")); // false
```

✅ Important for building server-side file loaders.

---

### 10. **Best Practice: Always Use path.join() or path.resolve()**

❌ Bad:

```javascript
const filePath = __dirname + "/folder/file.txt";
// Breaks on Windows
```

✅ Good:

```javascript
const filePath = path.join(__dirname, "folder", "file.txt");
```

✅ 100% portable between Linux, Mac, and Windows!

---

Of course!  
Now I’ll **restructure** the `stream` guide in **pipeline** style — smaller headings, more real-world feel — and **include**:

✅ Build a Mini **Streaming Video Server** 🎬  
✅ Build a Mini **CLI Tool** for GB-sized file processing 📁

---

## Streams

- **Streams** handle **data chunks** — not entire files.
- Super useful for **big files**, **networks**, and **memory** efficiency.

### 🧵 4 Types of Streams

- **Readable**: Read data (file, HTTP request)
- **Writable**: Write data (file, HTTP response)
- **Duplex**: Both (like TCP socket)
- **Transform**: Modify while passing (gzip compression)

### 🛠️ Basic Stream Usage

#### Read a file (Readable)

```javascript
const fs = require("fs");

const readable = fs.createReadStream("./bigfile.txt", { encoding: "utf8" });

readable.on("data", (chunk) => {
  console.log("Chunk:", chunk.length);
});

readable.on("end", () => {
  console.log("Done reading.");
});
```

---

#### Write to a file (Writable)

```javascript
const writable = fs.createWriteStream("./output.txt");

writable.write("Hello World!\n");
writable.end();

writable.on("finish", () => {
  console.log("Done writing.");
});
```

---

#### Pipe (Connect streams)

```javascript
const read = fs.createReadStream("./bigfile.txt");
const write = fs.createWriteStream("./copy.txt");

read.pipe(write);
```

✅ Reads + Writes efficiently — no manual handling!

---

## 🚰 Pipeline Pattern

Instead of manually managing `.on('data')`, use **pipeline**:

```javascript
const { pipeline } = require("stream");
const fs = require("fs");

pipeline(
  fs.createReadStream("./bigfile.txt"),
  fs.createWriteStream("./copy.txt"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("Pipeline succeeded.");
  }
);
```

✅ Automatic error handling.  
✅ Cleaner than `.pipe()` chain.

---

## 📈 Handle Backpressure Manually

```javascript
const read = fs.createReadStream("./bigfile.txt");
const write = fs.createWriteStream("./copy.txt");

read.on("data", (chunk) => {
  const ok = write.write(chunk);
  if (!ok) {
    read.pause();
    write.once("drain", () => {
      read.resume();
    });
  }
});
```

✅ If writable is **full**, pause reading temporarily.

---

## 🧪 Create a Transform Stream (Modify Data)

Example: Convert text to **uppercase** while streaming.

```javascript
const { Transform } = require("stream");

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

pipeline(
  fs.createReadStream("./input.txt"),
  upper,
  fs.createWriteStream("./output.txt"),
  (err) => {
    if (err) console.error("Transform failed:", err);
    else console.log("Transform done.");
  }
);
```

✅ Modify while moving data! (No memory hit)

---

## ⚙️ Stream Options

- `highWaterMark`: Buffer size (default 64KB)
- `encoding`: auto decode (e.g., `'utf8'`)

```javascript
fs.createReadStream("./file.txt", { highWaterMark: 128 * 1024 });
```

✅ Tune buffer size for optimization.

---

## 🎬 Build a Mini Streaming Video Server

**Stream a video file** chunk-by-chunk via HTTP:

```javascript
const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((req, res) => {
    const videoPath = path.join(__dirname, "video.mp4");
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  })
  .listen(8000);

console.log("Streaming server running on http://localhost:8000");
```

✅ Handles **partial content** for smooth seeking!  
✅ Supports **large videos** without memory crash.

---

## 📁 Build a CLI Tool for GB-Sized File Processing

**Replace text in a huge file** without loading all.

```javascript
const fs = require("fs");
const { Transform, pipeline } = require("stream");

const replaceTransform = new Transform({
  transform(chunk, encoding, callback) {
    const data = chunk.toString().replace(/oldword/g, "newword");
    callback(null, data);
  },
});

pipeline(
  fs.createReadStream(process.argv[2]), // input file
  replaceTransform,
  fs.createWriteStream("output.txt"), // output file
  (err) => {
    if (err) console.error("CLI processing failed:", err);
    else console.log("File processed successfully.");
  }
);
```

Run from CLI:

```bash
node cli-tool.js input.txt
```

✅ Can handle **GB+ files** easily.  
✅ Memory-safe.

---

### 🧠 Quick Summary

| You Mastered                | Means                          |
| :-------------------------- | :----------------------------- |
| Readable / Writable streams | Chunk-by-chunk processing      |
| Pipe and pipeline           | Stream chaining + error safety |
| Transform streams           | Modify data during flow        |
| Backpressure handling       | Avoid overload                 |
| Custom stream apps          | Server + CLI tools             |

---

## 💾 What is a Buffer?

- A **Buffer** is like a **raw chunk of memory**.
- It stores **binary data** directly (without string encoding).

✅ Useful for files, TCP streams, image processing, video streaming, etc.

### 📦 Create a Buffer

#### From a String

```javascript
const buf = Buffer.from("Hello World");
console.log(buf);
// Output: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
```

- Each character → binary.

---

#### From an Array

```javascript
const buf = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf.toString());
// Output: Hello
```

- Array of bytes.

---

#### Allocate Empty Buffer

```javascript
const buf = Buffer.alloc(10);
console.log(buf);
// Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

- 10 bytes, initialized to `0`.

---

### 🔎 Read/Write Buffer

### Write to Buffer

```javascript
const buf = Buffer.alloc(5);
buf.write("abc");
console.log(buf.toString());
// Output: abc
```

- Overwrites buffer memory.

---

### Read from Buffer

```javascript
const buf = Buffer.from("Hello");
console.log(buf[0]);
// Output: 72
console.log(String.fromCharCode(buf[0]));
// Output: H
```

- Buffers are **indexed** like arrays!

---

### 🧠 Important Buffer Methods

| Method                                                    | What it does                      |
| :-------------------------------------------------------- | :-------------------------------- |
| `toString([encoding])`                                    | Convert buffer to readable string |
| `toJSON()`                                                | Get JSON representation           |
| `slice(start, end)`                                       | Create a sub-buffer (no copy!)    |
| `copy(targetBuffer, targetStart, sourceStart, sourceEnd)` | Copy parts of buffer              |
| `concat([buf1, buf2])`                                    | Merge multiple buffers            |
| `length`                                                  | Size of buffer in bytes           |

---

### ⚡ Encoding Types

- `'utf8'` (default)
- `'ascii'`
- `'base64'`
- `'hex'`
- `'binary'`
- `'latin1'`

```javascript
const buf = Buffer.from("Hello", "utf8");
console.log(buf.toString("hex"));
// Output: 48656c6c6f
```

---

### Os Module

| Function                 | What it Gives (Detailed)                                                                                                                                |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `os.platform()`          | Operating System platform (`win32`, `linux`, `darwin` for macOS). Useful for OS-specific behavior.                                                      |
| `os.arch()`              | CPU architecture (`x64`, `arm`, `arm64`). Important for compiling binaries or optimizing code.                                                          |
| `os.cpus()`              | Detailed info about each CPU core (model, speed in MHz, times spent in user/system/idle). Helps in load balancing, threading decisions.                 |
| `os.totalmem()`          | Total system memory (RAM) in **bytes**. Must convert to MB/GB manually for readable formats.                                                            |
| `os.freemem()`           | Free/available system memory (RAM) in **bytes**. Helps monitor memory usage in real-time.                                                               |
| `os.uptime()`            | System uptime in **seconds**. Useful for monitoring server stability, scheduling restarts.                                                              |
| `os.hostname()`          | Machine's hostname (network identity). Often used for logging, networking, or configuration purposes.                                                   |
| `os.homedir()`           | Absolute path of the current user's home directory. Useful for storing user-specific files or config.                                                   |
| `os.networkInterfaces()` | Details about all network interfaces — IP addresses (IPv4/IPv6), MAC addresses, etc. Important for networking apps and discovering public/internal IPs. |

## HTTP & Web Servers

### 1. HTTP Protocol Fundamentals

**Key Concepts:**

- **Client-Server Model**: HTTP is a request-response protocol between a client (browser) and server
- **Stateless**: Each request is independent (sessions are maintained via cookies/tokens)
- **Text-Based**: Human-readable format (though can transmit binary data)
- **Methods**:
  - `GET` - Retrieve data
  - `POST` - Create data
  - `PUT`/`PATCH` - Update data
  - `DELETE` - Remove data
  - `HEAD`/`OPTIONS` - Metadata/visibility

**Request/Response Structure:**

```text
GET /index.html HTTP/1.1       |       HTTP/1.1 200 OK
Host: example.com              |       Content-Type: text/html
User-Agent: Chrome             |       <html>...
```

### 2. HTTP Status Codes & Headers

**Important Status Codes:**

- **2xx Success**:
  - `200 OK` - Standard success
  - `201 Created` - Resource created (POST)
  - `204 No Content` - Success but no body (DELETE)
- **3xx Redirection**:
  - `301 Moved Permanently`
  - `304 Not Modified` (caching)
- **4xx Client Errors**:
  - `400 Bad Request` - Malformed request
  - `401 Unauthorized` - Needs authentication
  - `403 Forbidden` - No permission
  - `404 Not Found`
  - `429 Too Many Requests`
- **5xx Server Errors**:
  - `500 Internal Server Error`
  - `502 Bad Gateway`
  - `503 Service Unavailable`

**Key Headers:**

- **Request Headers**:
  - `Authorization`: Bearer tokens
  - `Content-Type`: application/json, multipart/form-data
  - `Accept`: What client can handle
  - `Cookie`, `User-Agent`
- **Response Headers**:
  - `Set-Cookie`
  - `Cache-Control`
  - `Location` (for redirects)
  - `Access-Control-Allow-Origin` (CORS)

### 3. Express.js Framework

**Core Concepts:**

```javascript
const express = require("express");
const app = express();
```

**Middleware:**

```javascript
// Application-level middleware
app.use(express.json()); // Body parser
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next(); // Critical for chaining
});

// Router-level middleware
const router = express.Router();
router.use(myMiddleware);

// Error-handling middleware (4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

**Routing:**

```javascript
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route parameters
app.get('/users/:userId', (req, res) => {
  res.send(req.params.userId);
});

// Route chaining
app.route('/book')
  .get((req, res) => { ... })
  .post((req, res) => { ... });

// Modular routes
const userRouter = require('./routes/users');
app.use('/users', userRouter);
```

### 4. REST API Design Principles

**Key Constraints:**

1. **Client-Server Separation**
2. **Statelessness** - Each request contains all needed context
3. **Cacheability** - Responses should define cacheability
4. **Uniform Interface**:
   - Resource identification in URIs (`/users/123`)
   - Resource manipulation through representations (JSON/XML)
   - Self-descriptive messages
   - HATEOAS (Hypermedia as the Engine of Application State) - Include links to related resources

**Best Practices:**

- Use nouns (not verbs) in endpoints:
  - ✅ `/users`
  - ❌ `/getUsers`
- Plural resource names: `/products` instead of `/product`
- Nest resources for hierarchy: `/users/5/orders`
- Filter/sort/paginate via query params:
  - `/users?role=admin&sort=-createdAt&limit=10`
- Version your API: `/v1/users`
- Use proper status codes
- Standardize error responses:
  ```json
  {
    "error": {
      "code": "invalid_email",
      "message": "The provided email is invalid"
    }
  }
  ```
- Security:
  - Always use HTTPS
  - Validate input
  - Rate limiting
  - CORS configuration

**Example RESTful Routes:**

```text
GET    /articles          - List all articles
POST   /articles          - Create new article
GET    /articles/:id      - Get specific article
PUT    /articles/:id      - Replace entire article
PATCH  /articles/:id      - Partial update
DELETE /articles/:id      - Delete article
```

Here are practical code examples for each scenario you requested:

---

### 1. Basic Express Server with Routes

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

// Basic route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Route with parameters
app.get("/greet/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

// Route with query parameters
app.get("/search", (req, res) => {
  res.json({
    query: req.query.q,
    page: req.query.page || 1,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### 2. Middleware for Logging & Auth

```javascript
// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date()}`);
  next();
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === "secret-token") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Protected route
app.get("/admin", authMiddleware, (req, res) => {
  res.send("Admin Dashboard");
});
```

---

### 3. REST API for Blog Posts

```javascript
let posts = [{ id: 1, title: "First Post", content: "Hello World" }];

app.use(express.json());

// GET all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// GET single post
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// POST create new post
app.post("/api/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    ...req.body,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT update post
app.put("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });

  Object.assign(post, req.body);
  res.json(post);
});

// DELETE post
app.delete("/api/posts/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  res.status(204).end();
});
```

---

### 4. Testing with Postman/cURL

**cURL Examples:**

```bash
# GET all posts
curl http://localhost:3000/api/posts

# GET single post
curl http://localhost:3000/api/posts/1

# POST new post
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Some content"}' \
  http://localhost:3000/api/posts

# Authenticated request
curl -H "Authorization: secret-token" \
  http://localhost:3000/admin
```

**Postman Tips:**

1. Set `Content-Type: application/json` header
2. For POST/PUT requests, send raw JSON body
3. Save requests in collections
4. Use environment variables for base URLs

---

### 5. Error Handling & Status Codes

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Route with error
app.get("/error", (req, res) => {
  throw new AppError("Something went wrong", 500);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});
```

---

### 6. Advanced Features: Pagination

```javascript
// Mock database with 100 posts
let allPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  content: `Content for post ${i + 1}`,
}));

// Paginated GET endpoint
app.get("/api/v2/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const results = {
    data: allPosts.slice(startIndex, startIndex + limit),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(allPosts.length / limit),
      totalItems: allPosts.length,
    },
    links: {
      next:
        page < Math.ceil(allPosts.length / limit)
          ? `/api/v2/posts?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/v2/posts?page=${page - 1}&limit=${limit}` : null,
    },
  };

  res.json(results);
});
```

**Sample Response:**

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 100
  },
  "links": {
    "next": "/api/v2/posts?page=3&limit=10",
    "prev": "/api/v2/posts?page=1&limit=10"
  }
}
```

### Bonus: Complete Project Structure

```text
project/
├── src/
│   ├── app.js          # Main app setup
│   ├── routes/         # Route definitions
│   ├── middleware/     # Custom middleware
│   ├── controllers/    # Route handlers
│   ├── models/         # Data models
│   └── utils/          # Helpers & utilities
├── package.json
└── .env                # Environment variables
```

## Authentication Methods

### JWT (JSON Web Tokens)

- **What it is**: A stateless authentication mechanism that uses digitally signed tokens
- **Structure**: Header.Payload.Signature
- **Key features**:
  - Self-contained (contains all needed info)
  - Typically expires (short-lived access tokens + refresh tokens)
  - Signed (JWS) or encrypted (JWE)
- **Implementation**:

  ```javascript
  const jwt = require("jsonwebtoken");

  // Create token
  const token = jwt.sign({ userId: 123 }, "secret", { expiresIn: "1h" });

  // Verify token
  jwt.verify(token, "secret", (err, decoded) => {
    console.log(decoded.userId); // 123
  });
  ```

### OAuth 2.0 / OpenID Connect

- **OAuth 2.0**: Authorization framework (not authentication)
- **OpenID Connect**: Authentication layer on top of OAuth 2.0
- **Flows**:
  - Authorization Code (web apps)
  - Implicit (legacy)
  - Client Credentials (machine-to-machine)
  - Device Code (TVs, IoT)
  - Refresh Token
- **Implementation**:
  ```javascript
  // Using Passport.js with OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Handle user authentication
      }
    )
  );
  ```

### Session-based Authentication

- **What it is**: Stateful authentication using server-side sessions
- **How it works**:
  1. Server creates session ID on login
  2. Session ID stored in cookie
  3. Server validates session on each request
- **Implementation**:

  ```javascript
  const express = require("express");
  const session = require("express-session");

  app.use(
    session({
      secret: "your secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true },
    })
  );

  app.post("/login", (req, res) => {
    req.session.userId = 123; // Store user ID in session
  });
  ```

## Security Best Practices

### Helmet.js

- **What it does**: Sets various HTTP headers for security
- **Implementation**:
  ```javascript
  const helmet = require("helmet");
  app.use(helmet());
  ```
- **Headers it sets**:
  - Content Security Policy (CSP)
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME sniffing prevention)
  - Strict-Transport-Security (HSTS)

### CSRF Protection

- **What it is**: Prevents Cross-Site Request Forgery attacks
- **Implementation**:

  ```javascript
  const csrf = require("csurf");
  app.use(csrf({ cookie: true }));

  // Include CSRF token in forms
  app.get("/form", (req, res) => {
    res.render("send", { csrfToken: req.csrfToken() });
  });
  ```

  ```html
  <!-- In your form -->
  <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
  ```

### Rate Limiting

- **Why it's important**: Prevents brute force and DDoS attacks
- **In-memory implementation**:

  ```javascript
  const rateLimit = require("express-rate-limit");

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  app.use("/api/", limiter);
  ```

- **Redis-based implementation**:

  ```javascript
  const RedisStore = require("rate-limit-redis");

  const limiter = rateLimit({
    store: new RedisStore({
      expiry: 60 * 60, // 1 hour
    }),
    max: 100,
    delayMs: 0, // disable delaying
  });
  ```

### Input Validation/Sanitization

- **Why it's important**: Prevents XSS, SQL injection, etc.
- **Implementation**:

  ```javascript
  const { body, validationResult } = require("express-validator");

  app.post(
    "/user",
    body("username").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }).trim().escape(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Process data
    }
  );
  ```

### Password Hashing

- **Best practices**:
  - Never store plaintext passwords
  - Use slow hashing algorithms (bcrypt, Argon2, PBKDF2)
  - Include salt
- **bcrypt implementation**:

  ```javascript
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  // Hashing
  bcrypt.hash("myPassword", saltRounds, (err, hash) => {
    // Store hash in DB
  });

  // Verification
  bcrypt.compare("myPassword", hash, (err, result) => {
    // result == true if match
  });
  ```

- **Argon2 implementation**:

  ```javascript
  const argon2 = require("argon2");

  // Hashing
  try {
    const hash = await argon2.hash("password");
  } catch (err) {
    /* handle error */
  }

  // Verification
  try {
    if (await argon2.verify("<big long hash>", "password")) {
      // password match
    }
  } catch (err) {
    /* handle error */
  }
  ```

You're serious about becoming a **true Node.js backend engineer**.  
Perfect. Now we go **ADVANCED**, deep where 90% developers **never** go.  
This is _professional backend-level Node.js_.

---

## 🧠 Node.js Advanced (Profiling, Benchmarking, Load Testing, Memory Management)

I'll organize this properly:

### 📈 1. Profiling and Benchmarking Node.js Applications

🔹 **Goal**: Find performance bottlenecks in Node.js code (CPU profiling, memory leaks, slow operations).

#### ✅ What you will master:

| Concept           | Tools/Techniques                  | What you'll do                     |
| :---------------- | :-------------------------------- | :--------------------------------- |
| CPU Profiling     | Node Inspector, Chrome DevTools   | Analyze CPU usage, hotspots        |
| Performance Hooks | `perf_hooks` module               | Measure timing between sections    |
| Flamegraphs       | `0x`, `clinic flame`              | Visualize expensive function calls |
| Benchmarking      | `Benchmark.js`, `autocannon`      | Compare two versions of code       |
| Profiling Scripts | Manual profiling with `--inspect` | Attach debugger to running app     |

---

### 🛠 Tools you will use:

- `node --inspect app.js` (for Chrome DevTools debugging)
- [`clinic`](https://clinicjs.org/) (`clinic doctor`, `clinic flame`)
- `0x` (generate flamegraphs)
- `benchmark.js` (microbenchmarks)

---

### ✍ How you will practice:

### Example Task 1: Profile slow code

```javascript
const crypto = require("crypto");

function slowFunction() {
  for (let i = 0; i < 1e6; i++) {
    crypto.pbkdf2Sync("password", "salt", 1000, 64, "sha512");
  }
}

slowFunction();
```

- Run `node --inspect-brk app.js`
- Open `chrome://inspect`
- Start CPU profiling
- Analyze where time is spent.

### Example Task 2: Benchmark two methods

```javascript
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

suite
  .add("for loop", function () {
    let arr = [];
    for (let i = 0; i < 1000; i++) arr.push(i);
  })
  .add("Array.from", function () {
    Array.from({ length: 1000 }, (_, i) => i);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run();
```

Result tells you which method is faster 🔥.

---

## 📊 2. Load Testing using Artillery

🔹 **Goal**: Test if your Node.js server can handle heavy real-world traffic.

### ✅ What you will master:

| Concept        | Tools/Techniques                 | What you'll do                  |
| :------------- | :------------------------------- | :------------------------------ |
| Load Testing   | Artillery                        | Simulate 100s/1000s of users    |
| Stress Testing | Artillery + custom scenarios     | Push server until it breaks     |
| Reporting      | Artillery reports                | Analyze p50, p90, p99 latencies |
| Spike Testing  | Sudden traffic burst simulations |

---

### 🛠 Tools:

- [`artillery`](https://artillery.io/)
  - `artillery quick`
  - `artillery run`
  - `artillery report`

### ✍ How you will practice

### Example Task 1: Install and run basic Artillery load test

```bash
npm install -g artillery
```

Basic load test:

```bash
artillery quick --count 50 -n 20 http://localhost:3000/
```

- 50 users
- 20 requests each
- Boom! You’ll see latency stats.

---

### Example Task 2: Create a full load test script (`loadtest.yml`)

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: "/api/data"
```

Run it:

```bash
artillery run loadtest.yml
```

You will see:

- Requests/sec
- Response Times (p50, p90, p99)
- Errors
- Latency

### 🧹 3. Memory Management and Garbage Collection

🔹 **Goal**: Prevent memory leaks, manage app memory usage like a pro.

#### ✅ What you will master

| Concept                    | Tools/Techniques                                     | What you'll do |
| :------------------------- | :--------------------------------------------------- | :------------- |
| How Node.js manages memory | V8 heap, garbage collection types                    |
| Memory Leaks               | Identify and fix leaks                               |
| Garbage Collection         | Understand `Scavenge`, `Mark-Sweep`, `Mark-Compact`  |
| Manual Garbage Collection  | `global.gc()` (only when started with `--expose-gc`) |
| Heap Snapshots             | Chrome DevTools, heapdump module                     |
| Memory profiling           | `clinic heapprofile`, `node --inspect`               |

#### 🛠 Tools

- `--inspect` and Chrome DevTools
- `heapdump` npm package
- `clinic heapprofile`
- Visual heap snapshot analysis

#### Example Task 1: Memory Leak Example

```javascript
let leaks = [];

function leakMemory() {
  leaks.push(new Array(1000000).join("leak"));
}

setInterval(leakMemory, 1000);
```

- Run with `node --inspect app.js`
- Open `chrome://inspect`
- Take **Heap Snapshots** over time.
- See how memory keeps growing 🔥.

---

#### Example Task 2: Monitor memory usage

```javascript
setInterval(() => {
  const used = process.memoryUsage();
  console.log(`Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 2000);
```

You'll see how much memory your app uses live.

#### 📜 Summary of your Advanced Node.js Roadmap:

| Step | Focus                        | Tools                                   |
| :--- | :--------------------------- | :-------------------------------------- |
| 1    | CPU + Memory Profiling       | Node Inspector, Chrome DevTools, Clinic |
| 2    | Micro and Macro Benchmarking | Benchmark.js, autocannon                |
| 3    | Load Testing                 | Artillery scripts                       |
| 4    | Memory Management            | Heap snapshots, GC understanding        |
| 5    | Leak Detection               | heapdump, memory reports                |

---
