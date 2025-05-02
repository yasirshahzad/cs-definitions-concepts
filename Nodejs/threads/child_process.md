# Child Processes

## 1. What is a child process in Node.js?

- Node.js is **single-threaded**, but sometimes you need to do something **heavy** (like CPU work) or **run external commands** (like `git`, `python`, etc).
- A **child process** is a separate process spawned by your main Node.js application.
- Node provides the **`child_process`** module to work with them.

### 2. How to create a child process

Node offers **4 main methods**:

| Method     | Purpose                                                                    |
| :--------- | :------------------------------------------------------------------------- |
| `exec`     | Runs a command in a shell, buffers output (good for small outputs)         |
| `execFile` | Runs a file directly, faster than `exec` (no shell)                        |
| `spawn`    | Starts a process and streams output (good for large outputs)               |
| `fork`     | Special case of `spawn` to run another Node.js script with IPC (messaging) |

## 3. Basic Examples

### 3.1 `exec` - Run shell command

```js
const { exec } = require("child_process");

exec("ls -la", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout:\n${stdout}`);
});
```

✅ Use when **small output** is expected (because it buffers in memory).

### 3.2 `spawn` - Stream output (real-time)

```js
const { spawn } = require("child_process");

const ls = spawn("ls", ["-la"]);

ls.stdout.on("data", (data) => {
  console.log(`Stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`Stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`Child process exited with code ${code}`);
});
```

✅ Use **for large outputs** or **real-time data** streaming.

---

### 3.3 `execFile` - Directly execute a file

```js
const { execFile } = require("child_process");

execFile("node", ["-v"], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(`Node version: ${stdout}`);
});
```

✅ Slightly faster than `exec` (no shell).

#### 3.4 `fork` - Spawn Node.js scripts and send messages (IPC)

```js
const { fork } = require("child_process");

const child = fork("childScript.js"); // Assume this file exists

child.on("message", (msg) => {
  console.log("Message from child:", msg);
});

child.send({ hello: "world" });
```

Inside `childScript.js`:

```js
process.on("message", (msg) => {
  console.log("Message from parent:", msg);
  process.send({ received: true });
});
```

✅ Best for **Node-to-Node communication**!

## 4. Choosing between them

| Situation                                     | Method     |
| :-------------------------------------------- | :--------- |
| Run simple shell command                      | `exec`     |
| Run command with huge output                  | `spawn`    |
| Run a binary or file directly                 | `execFile` |
| Spawn another Node.js process and communicate | `fork`     |

---

## 5. Pro tips

- Always **handle errors** carefully.
- **Streams** (`stdout`, `stderr`) in `spawn` are real Node.js Streams.
- **Forked** processes can communicate **using `child.send()`** and `process.on('message')`.
- Be careful of **memory usage** if using `exec` for large outputs.
- You can **kill** a child process using `.kill()` method.
- Set **options** like `cwd`, `env`, `shell` in any method.

Example for killing a process:

```js
const child = spawn("node", ["someScript.js"]);

setTimeout(() => {
  child.kill("SIGTERM"); // Terminates the process
}, 5000);
```

---

## 6. Real-world use cases

- Running **Git** commands from Node.
- Converting **images/videos** using **FFmpeg**.
- **Spawning multiple child processes** to handle **CPU-heavy tasks**.
- Managing **multiple Node servers** from a master script.
- Implementing **worker pools** with `fork()`.

---

## 📋 Child Processes in Node.js — Full Summary Table

| Topic                                       | Method            | Purpose                                                | Pros                                 | Cons                                       | Example                          |
| :------------------------------------------ | :---------------- | :----------------------------------------------------- | :----------------------------------- | :----------------------------------------- | :------------------------------- |
| **Run shell command (buffer output)**       | `exec`            | Runs command in a shell, output buffered into memory   | Simple to use                        | Risk of memory overflow if output is large | `exec('ls -la')`                 |
| **Run file directly (no shell)**            | `execFile`        | Executes a file (e.g., binary, Node script)            | More secure & faster (no shell)      | No shell features (like piping)            | `execFile('node', ['-v'])`       |
| **Stream output in real-time**              | `spawn`           | Launches a new process with streams for stdout/stderr  | Handles large outputs efficiently    | More setup needed (event listeners)        | `spawn('ls', ['-la'])`           |
| **Communicate with another Node.js script** | `fork`            | Like `spawn`, but with built-in communication (IPC)    | Easy message passing                 | Only for Node.js scripts                   | `fork('childScript.js')`         |
| **Listen to output**                        | All (spawn, fork) | Listen to `stdout.on('data')`, `stderr.on('data')`     | Real-time feedback                   | Must handle streams                        | `.on('data', handler)`           |
| **Send messages**                           | `fork`            | `parent.send()` → `child.on('message')` and vice versa | Structured communication             | Only forked Node.js processes              | `child.send({ hello: 'world' })` |
| **Terminate child**                         | All               | `child.kill('SIGTERM')`                                | Control over child process lifecycle | Must handle safe shutdown                  | `child.kill()`                   |
| **Handle errors**                           | All               | Listen to `error` event                                | Robustness                           | Must implement carefully                   | `child.on('error', handler)`     |

---

## 🚀 Quick Visual Overview

| Method     | Output | Communication | Shell?   | Use Case              |
| :--------- | :----- | :------------ | :------- | :-------------------- |
| `exec`     | Buffer | No            | Yes      | Quick shell commands  |
| `execFile` | Buffer | No            | No       | Direct file execution |
| `spawn`    | Stream | No            | Optional | Stream huge outputs   |
| `fork`     | Stream | Yes (IPC)     | No       | Node.js child process |
