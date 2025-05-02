# Clustering

## 📚 What is Clustering in Node.js?

- Node.js by default is **single-threaded** (one CPU core).
- But modern machines have **multiple CPU cores**.
- **Clustering** lets you **create multiple Node.js processes** (workers) **to share the same server port** and use **all CPU cores**!
- Each worker handles **incoming requests** independently.

✅ More workers = More concurrency = Better performance for CPU-bound or high-traffic apps.

## 🧩 How Clustering Works

| Role                                  | Description                                               |
| :------------------------------------ | :-------------------------------------------------------- |
| **Master Process**                    | Creates worker processes and manages them.                |
| **Worker Process**                    | Actual server (e.g., Express app) that handles requests.  |
| **IPC (Inter-Process Communication)** | Workers and master talk to each other (messages, events). |

## 📦 Node.js provides `cluster` module

Basic structure:

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  // Master Process
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork(); // create a worker
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart a new worker
  });
} else {
  // Worker Process (your server code)
  require("./server"); // e.g., your Express app
}
```

## 🚀 Clustering with ExpressJS (Full Example)

Create a file `clusteredServer.js`

```js
const cluster = require("cluster");
const os = require("os");
const express = require("express");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  // Worker processes have a HTTP server
  const app = express();

  app.get("/", (req, res) => {
    res.send(`Hello from Worker ${process.pid}`);
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

**Now:**

- Run `node clusteredServer.js`
- Open `localhost:3000` multiple times (or do heavy load testing)
- Different worker processes will serve different requests!

You will notice **different `process.pid`** in logs or response — that's proof multiple workers are running! 🔥

## ⚙️ Key Concepts in Clustering

| Term                 | Meaning                                 |
| :------------------- | :-------------------------------------- |
| `cluster.isPrimary`  | Checks if the current process is master |
| `cluster.isWorker`   | Checks if current process is worker     |
| `cluster.fork()`     | Creates a new worker                    |
| `worker.process.pid` | PID (process ID) of worker              |
| `worker.on('exit')`  | Event when worker exits                 |
| `os.cpus().length`   | Get number of CPU cores                 |

---

## 🎯 Why Cluster ExpressJS?

| Reason            | Benefit                                    |
| :---------------- | :----------------------------------------- |
| Multi-core usage  | Uses all CPU cores                         |
| Better throughput | Handles more concurrent requests           |
| Resilience        | If a worker crashes, master can respawn    |
| Scalability       | Your app can handle heavy production loads |
