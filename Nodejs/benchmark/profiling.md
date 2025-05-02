# Performance Optimization

## 🔍 **1. Chrome DevTools (`node --inspect`)**

- **Usage**: `node --inspect app.js` or `node --inspect-brk app.js`
- **Access**: Open `chrome://inspect` in Chrome → "Open dedicated DevTools for Node".
- **Features**:
  - Step debugging
  - Heap snapshot analysis
  - CPU profiling (via "Performance" tab)
- **Tip**: Use `--inspect-brk` to pause at the first line for debugging startup code.

---

## 🧪 **2. Clinic.js Suite**

Install:

```bash
npm install -g clinic
```

- **clinic doctor**: Detects performance bottlenecks and provides summaries.
  ```bash
  clinic doctor -- node app.js
  ```
- **clinic flame**: Generates **flamegraphs** for CPU usage.
  ```bash
  clinic flame -- node app.js
  ```
- **clinic bubbleprof**: Visualizes async operations over time.
  ```bash
  clinic bubbleprof -- node app.js
  ```

💡 _Great for both macro-level overview and deep async call analysis._

---

## 🔥 **3. 0x (Flamegraph Profiler)**

Install:

```bash
npm install -g 0x
```

Run:

```bash
0x app.js
```

- **Outputs**: Interactive flamegraphs (`.html`) showing function stack with time consumption.
- **Tip**: Use `--output-dir` to keep reports organized.

---

## 🧠 **4. Memory Leaks & Garbage Collection**

- Use heap snapshots via Chrome DevTools or `clinic heap`.
- Use:
  ```js
  global.gc(); // Only if Node is run with --expose-gc
  ```
- Analyze:
  - **Leaking closures**
  - **Detached DOMs (in server-side rendering)**
  - **Event emitter listeners not removed**
- **Tools**:
  - `heapdump`
  - `memwatch-next`
  - `Valgrind` for native leaks (rare in pure Node)

---

## 🚀 **5. CPU Bottlenecks**

- Use **clinic flame** or **0x**
- Signs:
  - High CPU usage
  - Poor concurrency
- Common causes:
  - Large JSON processing
  - Crypto operations
  - Loop-heavy logic
- Solution:
  - Move work to Worker Threads
  - Offload to external services

---

## 🌀 **6. Event Loop Delays**

- **perf_hooks**:
  ```js
  const { monitorEventLoopDelay } = require("perf_hooks");
  const h = monitorEventLoopDelay();
  h.enable();
  setInterval(() => console.log(h.mean), 1000);
  ```
- **blocked-at**:
  ```js
  const blocked = require("blocked-at");
  blocked((time, stack) => {
    console.log(`Blocked for ${time}ms, operation:`, stack);
  });
  ```

---

## ❌ **7. Avoid Synchronous Code**

- Avoid:
  - `fs.readFileSync`
  - `JSON.parse()` for large strings
  - CPU-heavy logic on main thread
- Replace with:
  - `fs.promises.readFile`
  - Streams for large files
  - Worker Threads for CPU-bound tasks

---

## ⚙️ **8. Efficient I/O and Buffer Management**

- Use Streams instead of buffering entire files:
  ```js
  fs.createReadStream("file.txt").pipe(res);
  ```
- Use `Buffer.allocUnsafe()` cautiously.
- Batch writes to avoid small I/O chunks.
- Minimize unnecessary buffer conversions (e.g., `.toString()` calls).
