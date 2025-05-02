# 🔧 What are Worker Threads?

By default, **Node.js is single-threaded** — it's great for I/O-bound tasks, but struggles with **CPU-intensive** work (e.g., image processing, data crunching).

**`worker_threads`** lets you run **JavaScript in parallel on multiple threads** — perfect for offloading heavy computations **without blocking** the main thread.

---

## 📦 Step 1: Getting Started

### ✅ Enabling Worker Threads

Available from **Node.js v10.5.0+** (stable in v12+).

Create two files:

### 🧠 `main.js`

```js
const { Worker } = require("worker_threads");

const worker = new Worker("./worker.js", {
  workerData: { num: 5 },
});

worker.on("message", (result) => {
  console.log(`Main thread received: ${result}`);
});

worker.on("error", (err) => console.error("Worker error:", err));
worker.on("exit", (code) => console.log(`Worker exited with code ${code}`));
```

### ⚙️ `worker.js`

```js
const { workerData, parentPort } = require("worker_threads");

const number = workerData.num;

// Simulate heavy computation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(number);
parentPort.postMessage(`Fibonacci(${number}) = ${result}`);
```

Run it:

```bash
node main.js
```

---

## 🧵 Step 2: Core Concepts

### `workerData`

Used to **pass data into the worker** at creation.

### `parentPort`

Used to **communicate with the parent thread** (send/receive messages).

---

## 🪄 Step 3: Bi-directional Communication

### Update `worker.js` to:

```js
parentPort.on("message", (msg) => {
  console.log(`Worker got: ${msg}`);
  parentPort.postMessage(`ACK: ${msg}`);
});
```

And in `main.js`, send another message:

```js
worker.postMessage("Hello from main thread");
```

---

## 🧠 Step 4: Create a Worker Pool (for parallelism)

To handle many CPU tasks, create a **pool of workers**:

```js
const { Worker } = require("worker_threads");

function runWorker(num) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", { workerData: { num } });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

(async () => {
  const results = await Promise.all([
    runWorker(10),
    runWorker(20),
    runWorker(30),
  ]);
  console.log("Results:", results);
})();
```

---

## 🧠 Step 5: Sharing Memory (Advanced)

```js
// main.js
const { Worker } = require("worker_threads");

const shared = new SharedArrayBuffer(4); // 4 bytes = 1 Int32
const arr = new Int32Array(shared);
arr[0] = 42;

const worker = new Worker("./worker.js", {
  workerData: shared,
});
```

```js
// worker.js
const { workerData, parentPort } = require("worker_threads");

const arr = new Int32Array(workerData);
arr[0] += 1;

parentPort.postMessage(`Value after increment: ${arr[0]}`);
```

---

## 🛠️ Best Practices

- Use worker threads for **CPU-bound** work — not for I/O.
- Keep workers **isolated** (no shared state unless using `SharedArrayBuffer`).
- Don’t create too many — use a **worker pool**.
- Monitor worker crashes with `.on('error')` and `.on('exit')`.

---

## ✅ Checklist for Mastery

| Task                                                 | Status |
| ---------------------------------------------------- | ------ |
| Understand how to create and terminate workers       | ✅     |
| Pass data in/out using `workerData` and `parentPort` | ✅     |
| Handle worker errors and exits                       | ✅     |
| Implement a worker pool to parallelize tasks         | ✅     |
| Use `SharedArrayBuffer` for memory sharing           | ✅     |
| Use structured cloning and message ports             | ✅     |
| Debug and monitor performance                        | ✅     |

Perfect! Let’s walk through a **real-world example** of using **Worker Threads in Node.js** to **offload image processing** — specifically resizing images using `sharp`, a popular Node.js image manipulation library.

---

## 📸 Real-World Example: Offload Image Resizing to a Worker Thread

### 🧩 Project Structure

```
image-resizer/
├── main.js
├── resizeWorker.js
├── input.jpg
└── output/ (this will contain resized images)
```

---

### 🧱 Step 1: Install dependencies

```bash
npm init -y
npm install sharp
```

---

### 🧠 `main.js` – Main thread (controller)

```js
const { Worker } = require("worker_threads");
const path = require("path");

function resizeImage(width, height, input, output) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "resizeWorker.js"), {
      workerData: { width, height, input, output },
    });

    worker.on("message", (msg) => {
      console.log("✅", msg);
      resolve(msg);
    });

    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

// 👇 Example usage
(async () => {
  await resizeImage(300, 300, "input.jpg", "output/resized-300x300.jpg");
  await resizeImage(600, 600, "input.jpg", "output/resized-600x600.jpg");
})();
```

---

### 🧵 `resizeWorker.js` – Worker thread

```js
const { workerData, parentPort } = require("worker_threads");
const sharp = require("sharp");

(async () => {
  const { width, height, input, output } = workerData;

  try {
    await sharp(input).resize(width, height).toFile(output);

    parentPort.postMessage(`Image resized to ${width}x${height} -> ${output}`);
  } catch (err) {
    parentPort.postMessage(`❌ Failed to resize image: ${err.message}`);
  }
})();
```

---

### ✅ What You Learned Here

- Offload a **CPU-heavy image transformation** to a worker.
- **Non-blocking** — main thread stays responsive.
- Clean structure using `Promise` to await results.
- Modular and scalable — easy to build a **worker pool** if needed for large batches.

## 🎯 Goal

Resize **many images concurrently**, but control concurrency (e.g., limit to 4 workers at once).

---

## 🧩 Updated Project Structure

```
image-resizer/
├── main.js
├── resizeWorker.js
├── input/
│   ├── img1.jpg
│   ├── img2.jpg
│   └── img3.jpg
└── output/
```

---

## 📦 Step 1: Update `main.js` to Use a Worker Pool

```js
const { Worker } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const os = require("os");

const maxWorkers = os.cpus().length; // Or limit to 4, etc.
const imageDir = path.resolve(__dirname, "input");
const outputDir = path.resolve(__dirname, "output");
const files = fs
  .readdirSync(imageDir)
  .filter((file) => /\.(jpe?g|png)$/i.test(file));

function resizeImage({ input, output, width, height }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "resizeWorker.js"), {
      workerData: { input, output, width, height },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

async function runWorkerPool(tasks, concurrency = maxWorkers) {
  const results = [];
  const queue = [...tasks];

  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length) {
      const task = queue.shift();
      try {
        const result = await resizeImage(task);
        results.push(result);
      } catch (err) {
        console.error("Worker error:", err);
      }
    }
  });

  await Promise.all(workers);
  return results;
}

const resizeTasks = files.map((file) => ({
  input: path.join(imageDir, file),
  output: path.join(outputDir, `resized-${file}`),
  width: 400,
  height: 400,
}));

(async () => {
  const results = await runWorkerPool(resizeTasks, 4); // Up to 4 workers
  console.log("All done:\n", results.join("\n"));
})();
```

---

## 🔧 `resizeWorker.js` (unchanged)

```js
const { workerData, parentPort } = require("worker_threads");
const sharp = require("sharp");

(async () => {
  const { width, height, input, output } = workerData;

  try {
    await sharp(input).resize(width, height).toFile(output);

    parentPort.postMessage(`✅ Resized: ${input} -> ${output}`);
  } catch (err) {
    parentPort.postMessage(`❌ Error resizing ${input}: ${err.message}`);
  }
})();
```

---

## 🔥 Highlights

- Runs up to **4 image resizes in parallel**, scaling with your CPU.
- Easy to adapt for thousands of images or other CPU-heavy tasks.
- Pattern works well for **video encoding**, **JSON parsing**, **hashing**, etc.
