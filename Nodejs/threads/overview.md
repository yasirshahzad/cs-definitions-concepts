# Overview - Threads

To master **Worker Threads** in Node.js and understand **when to use Worker Threads, Child Processes, or Cluster**, it's important to grasp how each one works and where it's best suited.

## 🔧 1. **Worker Threads** (`worker_threads` module)

### 📌 Use when

- You need **CPU-intensive tasks** (e.g. parsing large JSON, image processing, crypto, ML inference).
- You want to share **memory** (via `SharedArrayBuffer`) between threads.
- You want **low-overhead, lightweight communication** (via `MessagePort`).

### ✅ Pros

- **Low memory overhead** (lighter than a full process).
- Can **share memory** between threads.
- Communication is **faster** (structured cloning or shared memory).

### ❌ Cons

- Not good for code that's not thread-safe.
- Limited API compatibility (not everything works in a worker).
- Debugging can be harder than with separate processes.

### 🔥 Use Case Example

```js
// image-processing.js (in main thread)
const { Worker } = require("worker_threads");
const worker = new Worker("./processImage.js", {
  workerData: { path: "img.png" },
});

worker.on("message", (result) => console.log("Processed:", result));
```

## 🔧 2. **Child Processes** (`child_process` module)

### 📌 Use when

- You need to **run a separate Node.js app or external program**.
- You want **true process isolation** (crash-safe).
- You’re spawning a process that does not need tight communication.

### ✅ Pros

- Completely separate memory (safer isolation).
- Can execute **non-JS** scripts (Python, Bash, etc.).
- Easy to handle with **streams** (`stdin`, `stdout`, `stderr`).

### ❌ Cons

- **Slower communication** (uses `IPC`).
- **More memory-heavy** (new V8 + Node instance).
- Cannot share memory.

### 🔥 Use Case Example:

```js
const { fork } = require("child_process");
const child = fork("heavyComputation.js");

child.send({ num: 42 });
child.on("message", (result) => console.log("Result:", result));
```

## 🔧 3. **Cluster** (`cluster` module)

### 📌 Use when

- You want to **scale Node.js server across CPU cores**.
- You’re building a **network server** (like HTTP).

### ✅ Pros

- Easy to scale via `cluster.fork()`.
- Workers can share the **same port**.
- Built-in **load balancing** support (via `cluster` or external reverse proxy like NGINX).

### ❌ Cons:

- More boilerplate.
- Not ideal for anything other than servers.
- Each worker is a full Node process.

### 🔥 Use Case Example

```js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  http
    .createServer((req, res) => res.end(`Handled by PID ${process.pid}`))
    .listen(8000);
}
```

## ✅ Summary: Which One to Use?

| Use Case                                | Best Choice      |
| --------------------------------------- | ---------------- |
| CPU-bound task in JS                    | `worker_threads` |
| Separate Node.js script                 | `child_process`  |
| Running external scripts (e.g., Python) | `child_process`  |
| Scaling HTTP server                     | `cluster`        |
| Shared memory between tasks             | `worker_threads` |
| Crash isolation                         | `child_process`  |
| Realtime web server on all cores        | `cluster`        |
