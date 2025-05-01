# 🚀 Nodejs

## 1. Introduction

1. **What is Node.js?**  
   Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to run JavaScript code on the server side. It uses Google's V8 engine (also used by Chrome) to execute code, enabling JavaScript to be used for backend development, not just for client-side scripts in the browser.

2. **Why use Node.js?**  
   Node.js is widely used because it is fast, efficient, and scalable. It uses a non-blocking, event-driven architecture, making it ideal for real-time applications like chat apps, streaming services, and APIs. Developers also like it because it allows using JavaScript on both the frontend and backend, promoting code reuse and consistency.

3. **History of Node.js**  
   Node.js was created by Ryan Dahl in 2009. He was frustrated with the limitations of traditional web servers like Apache, particularly their blocking I/O. Node.js was designed to handle many simultaneous connections using a single thread and asynchronous I/O. Over time, it gained massive popularity, especially with the rise of JavaScript frameworks and full-stack development.

4. **Node.js vs Browser**  
   While both Node.js and browsers execute JavaScript, they serve different purposes. Browsers are designed for rendering HTML, CSS, and running JavaScript in the client (user's) environment, with limited access to system resources. Node.js, on the other hand, runs JavaScript on the server and has access to the file system, network, and other low-level APIs. Node.js doesn't have built-in DOM or window objects like browsers do.

5. **Running Node Code**  
   To run Node.js code, you need to install Node.js from [https://nodejs.org](https://nodejs.org). Once installed, create a file (e.g., `app.js`) with JavaScript code. Then open your terminal or command prompt and run:

   ```bash
   node app.js
   ```

   This executes the JavaScript code in the file using the Node.js runtime.

## 2. Modules

### **1. CommonJS Modules (CJS)**

**What it is:**  
CommonJS is the original module system in Node.js. It uses `require()` to import and `module.exports` to export.

**Used in:**

- Traditional Node.js projects
- Files with `.cjs` extension or `.js` in `type: "commonjs"`

**Example:**

**math.js**

```js
// Exporting using CommonJS
function add(a, b) {
  return a + b;
}
module.exports = { add };
```

**app.js**

```js
// Importing using CommonJS
const math = require("./math");
console.log(math.add(2, 3)); // Output: 5
```

#### Module Caching

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

#### Module Resolution Algorithm

When you write `require('foo')`, Node tries in this order:

1. Check if `'foo'` is a core module (like `fs`, `path`).
2. Check if there's a `node_modules/foo` directory with `package.json` main entry.
3. Look for `foo.js`, `foo.json`, `foo.node` files.
4. Move **up the directory tree** if not found (parent folders).

### **2. ECMAScript Modules (ESM)**

**What it is:**  
ESM is the modern JavaScript module system. It uses `import`/`export` syntax. Supported natively in modern Node.js (v12+ with some flags, v14+ fully).

**Used in:**

- `.mjs` files
- Or `.js` files with `"type": "module"` in `package.json`

**Example:**

**math.mjs**

```js
// Exporting using ESM
export function add(a, b) {
  return a + b;
}
```

**app.mjs**

```js
// Importing using ESM
import { add } from "./math.mjs";
console.log(add(2, 3)); // Output: 5
```

**Or in `package.json`:**

```json
{
  "type": "module"
}
```

Then you can use `.js` extensions for ESM files.

### **Key Differences**

| Feature            | CommonJS (`require`)        | ESM (`import`)                    |
| ------------------ | --------------------------- | --------------------------------- |
| Syntax             | `require`, `module.exports` | `import`, `export`                |
| Loading            | Synchronous                 | Asynchronous                      |
| Default in Node.js | Yes (without config)        | With `.mjs` or `"type": "module"` |
| Browser Support    | No (requires bundler)       | Yes (modern browsers)             |

## 3. npm

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

### **1. Updating npm Packages**

**Update a specific package:**

```bash
npm install <package-name>@latest
```

**Update all dependencies in `package.json`:**

```bash
npm update
```

**Upgrade across major versions (e.g., lodash v3 → v4):**
Use [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates):

```bash
npx npm-check-updates -u
npm install
```

### **2. Running Scripts**

You can define scripts in the `package.json` file under the `"scripts"` section:

**Example `package.json`:**

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  }
}
```

**Run a script:**

```bash
npm run start
npm run dev
npm test      # Special case, can be shortened
```

### **3. npm Workspaces**

**What it is:**  
npm Workspaces allow managing multiple packages (like a monorepo) in a single repository.

**Example `package.json`:**

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*"]
}
```

**Directory Structure:**

```
my-monorepo/
├── package.json  (root with workspaces)
└── packages/
    ├── app/
    │   └── package.json
    └── utils/
        └── package.json
```

**Install all workspace packages:**

```bash
npm install
```

**Run script in specific workspace:**

```bash
npm run build --workspace=utils
```

---

### **4. Creating npm Packages**

**Steps to create and publish a package:**

1. **Initialize a new package:**

   ```bash
   npm init
   ```

2. **Write your module code:**

   ```js
   // index.js
   module.exports = function greet(name) {
     return `Hello, ${name}!`;
   };
   ```

3. **Add entry in `package.json`:**

   ```json
   {
     "main": "index.js"
   }
   ```

4. **Login and publish:**

   ```bash
   npm login
   npm publish
   ```

   > Your package must have a **unique name** on npm and the project must **not be private**.

## 4. Error Handling

### 🔴 1. System Errors

> **Definition:** Errors caused by system-level operations (like file system, network, etc.)

✅ Best Practices

- Check `err.code` to determine the error type.
- Use meaningful messages and fail gracefully.

📦 Example

```js
const fs = require("fs");

fs.readFile("/invalid/path.txt", (err, data) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.error("File not found.");
    } else {
      console.error("System Error:", err);
    }
    return;
  }
  console.log(data.toString());
});
```

### 🟡 2. User-Specified Errors

> **Definition:** Custom errors thrown in your business logic.

✅ Best Practices

- Create custom error classes.
- Include status codes and flags to mark operational errors.

📦 Example

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
function validateUserAge(age) {
  if (age < 18) {
    throw new AppError("User must be 18 or older.", 400);
  }
}
```

---

### 🔵 3. Assertion Errors

> **Definition:** Errors thrown using Node's `assert` module.

✅ Best Practices

- Use for development checks only, not in production logic.

📦 Example

```js
const assert = require("assert");

function divide(a, b) {
  assert(b !== 0, "Cannot divide by zero");
  return a / b;
}

console.log(divide(10, 2)); // 5
console.log(divide(10, 0)); // AssertionError
```

---

### 🟠 4. JavaScript Errors

> **Definition:** Standard JS errors like `TypeError`, `ReferenceError`, etc.

✅ Best Practices:

- Use `try/catch` blocks where failure is expected.
- Avoid accessing undefined properties or calling undefined functions.

📦 Example

```js
try {
  let result = undefinedVar + 1;
} catch (err) {
  console.error("JavaScript Error:", err.name, "-", err.message);
}
```

---

### 🔥 5. Uncaught Exceptions

> **Definition:** Errors not caught anywhere in the app that crash the process.

✅ Best Practices:

- Use `process.on()` to catch and log them, but **exit immediately**.

📦 Example:

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Always exit on uncaught exceptions
});

setTimeout(() => {
  throw new Error("Oops!"); // Will trigger above handler
}, 100);
```

---

### 🌀 6. Handling Async Errors

> **Definition:** Errors in Promises or async/await code.

✅ Best Practices

- Always use `.catch()` for Promises.
- Use `try/catch` with async/await.
- In Express, wrap async functions.

📦 Examples

**Promises:**

```js
someAsyncOperation()
  .then((data) => console.log(data))
  .catch((err) => console.error("Promise Error:", err));
```

**Async/Await:**

```js
async function getUser() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error("Async/Await Error:", err);
  }
}
```

**Express Async Handler:**

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get(
  "/user",
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.params.id);
    res.json(user);
  })
);
```

---

### 🧠 7. Call Stack / Stack Trace

> **Definition:** Shows the function call path where the error occurred.

✅ Best Practices

- Log the stack in development.
- Avoid leaking stack traces in production.

📦 Example

```js
function first() {
  second();
}

function second() {
  throw new Error("Something went wrong");
}

try {
  first();
} catch (err) {
  console.error("Error:", err.stack);
}
```

---

### 🧰 8. Using Debugger

> **Definition:** Tool to step through code and inspect variables.

✅ Best Practices

- Use `debugger;` in code to pause execution.
- Use `node --inspect-brk file.js` and Chrome DevTools.

📦 Example

```js
function calculate(a, b) {
  debugger; // Execution will pause here
  return a + b;
}

console.log(calculate(5, 3));
```

---

### 🧩 Additional Tips

#### ✅ Use a Logger (instead of console.log)

```js
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});
logger.error("Something went wrong");
```

---

#### ✅ Handle Unhandled Promise Rejections

```js
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
```

---

#### ✅ Differentiate Errors

| Type              | Should Crash App | Example                       |
| ----------------- | ---------------- | ----------------------------- |
| Programmer Error  | ✅ Yes           | `TypeError`, `ReferenceError` |
| Operational Error | ❌ No            | `AppError`, invalid input     |

---

#### ✅ Use Monitoring in Production

- Tools: **Sentry**, **LogRocket**, **New Relic**

#### ✅ Use Linting + TypeScript

- Catch bugs before they reach runtime.
- Strict type checks + null safety.

### 🧠 Final Advice

> "**Don't let your app die silently.** Log what happened, act on what you can, and recover gracefully if possible — otherwise fail fast."

## 5. Async Programming

**Asynchronous programming** is a way to write non-blocking code — meaning your program can continue doing other work **while waiting** for time-consuming operations (like API calls, file reading, or database queries) to finish.

### Deep Dive

#### 🔍 The Problem It Solves

In **synchronous programming**, code executes **line-by-line**, waiting for each operation to finish before moving on. This causes blocking:

```js
const data = readFileSync("big-file.txt"); // blocks entire thread
console.log("This waits for the file read to finish");
```

In **asynchronous programming**, time-consuming tasks **run in the background**, and the main thread is **free to do other things**:

```js
readFile("big-file.txt", (err, data) => {
  console.log("Done reading file!");
});
console.log("This runs immediately!");
```

#### 🧠 Why is This Important?

JavaScript is **single-threaded** (in the browser and Node.js). If you block the thread with slow operations, you freeze the app. Async programming helps you:

- Keep the **UI responsive**
- Handle **concurrent tasks**
- Improve **performance** and **user experience**
- Write **non-blocking server code** (Node.js excels at this)

---

#### 🧰 Common Async Use Cases

- API calls (`fetch`, `axios`)
- Timers (`setTimeout`, `setInterval`)
- File I/O (`fs.readFile`)
- Database queries
- User input events

---

#### 🧱 Main Building Blocks of Async in JS

| Concept         | Description                            | Example                          |
| --------------- | -------------------------------------- | -------------------------------- |
| **Callbacks**   | Function passed and called later       | `setTimeout(() => {}, 1000)`     |
| **Promises**    | Represent future completion            | `fetch().then(...).catch(...)`   |
| **async/await** | Sugar syntax over Promises             | `const data = await fetchData()` |
| **Event loop**  | JS runtime that handles async behavior | Enables non-blocking execution   |

#### 💬 Analogy

Imagine you order food at a restaurant:

- In **sync programming**, you stand at the counter and wait until the food is ready before doing anything else.
- In **async programming**, you place your order, sit down, and continue reading a book. When the food is ready, a waiter (callback/promise) brings it to you.

### 🔁 1. CALLBACKS & CALLBACK HELL

#### ✅ What is a Callback?

A **callback** is a function passed as an argument to another function and is executed later.

```js
function fetchData(callback) {
  setTimeout(() => {
    callback(null, "Data loaded!");
  }, 1000);
}

fetchData((err, result) => {
  if (err) return console.error(err);
  console.log(result);
});
```

#### ⚠️ Callback Hell

Callback Hell occurs when callbacks are nested within callbacks—creating deeply nested and hard-to-read code.

```js
loginUser("user", "pass", (err, user) => {
  if (err) return handleError(err);
  getUserProfile(user.id, (err, profile) => {
    if (err) return handleError(err);
    getProfilePosts(profile.id, (err, posts) => {
      if (err) return handleError(err);
      console.log("User Posts", posts);
    });
  });
});
```

**Problems:**

- Hard to read
- Error handling is messy
- Difficult to debug/maintain

#### 💡 Best Practice: Use Promises or Async/Await instead (see next sections)

#### 🧠 BONUS: Error-First Callbacks

A Node.js convention:

```js
function myAsyncOperation(callback) {
  setTimeout(() => {
    const err = null;
    const result = "Done!";
    callback(err, result);
  }, 1000);
}
```

### 🔗 2. PROMISES

#### ✅ What is a Promise?

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.

```js
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      success ? resolve("Data") : reject("Error!");
    }, 1000);
  });
};

fetchData()
  .then((data) => console.log("Success:", data))
  .catch((err) => console.error("Failed:", err));
```

#### ⚙️ Chaining Promises

```js
fetchUser()
  .then((user) => fetchProfile(user.id))
  .then((profile) => fetchPosts(profile.id))
  .then((posts) => console.log(posts))
  .catch(console.error);
```

---

#### ✅ `Promise.all`, `Promise.allSettled`, `Promise.race`

##### `Promise.all`

Waits for all promises to resolve or **rejects early** if any fail.

```js
Promise.all([fetchUser(), fetchSettings()])
  .then(([user, settings]) => console.log(user, settings))
  .catch(console.error);
```

##### `Promise.allSettled`

Waits for **all** to complete, regardless of rejection.

```js
Promise.allSettled([fetchUser(), fetchSettings()]).then((results) => {
  results.forEach((res) => console.log(res.status, res.value || res.reason));
});
```

##### `Promise.race`

Returns the result of the **first** settled promise.

```js
Promise.race([slowPromise(), fastPromise()])
  .then(console.log)
  .catch(console.error);
```

---

#### 🧠 Best Practices for Promises

- Always return promises inside `.then()` chains.
- Always `.catch()` errors.
- Use `finally()` to clean up.
- Prefer `Promise.allSettled` when you want full results without short-circuiting.

### 🔮 3. `async/await`

#### ✅ Cleaner Syntax for Promises

```js
async function loadData() {
  try {
    const user = await fetchUser();
    const profile = await fetchProfile(user.id);
    const posts = await fetchPosts(profile.id);
    console.log(posts);
  } catch (err) {
    console.error("Error:", err);
  }
}
```

#### ⚠️ Parallel vs Sequential

##### ❌ Sequential (Slow)

```js
const one = await doOne();
const two = await doTwo(); // Waits for one
```

##### ✅ Parallel (Faster)

```js
const [one, two] = await Promise.all([doOne(), doTwo()]);
```

#### 💡 Advanced `async/await`

##### Retry Logic

```js
async function fetchWithRetry(fn, retries = 3) {
  while (retries--) {
    try {
      return await fn();
    } catch (e) {
      if (retries === 0) throw e;
      await new Promise((res) => setTimeout(res, 1000)); // wait before retry
    }
  }
}
```

#### 🧠 Best Practices for `async/await`

- Wrap top-level awaits in try/catch.
- Use `Promise.all` for independent promises.
- Avoid mixing `await` with `.then()`.

### 🔁 4. CONVERTING CALLBACKS TO PROMISES (Promisify)

#### ✅ Manual Promisify

```js
function fetchData(cb) {
  setTimeout(() => cb(null, "Data!"), 1000);
}

function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    fetchData((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
```

#### ✅ Node.js `util.promisify`

```js
const { promisify } = require("util");
const fs = require("fs");

const readFile = promisify(fs.readFile);
readFile("data.txt", "utf8").then(console.log);
```

### 🔁 5. `setTimeout(callback, delay)`

#### ✅ What It Does

Schedules a callback to run **once after** a minimum delay.

```js
setTimeout(() => {
  console.log("Executed after 1 second");
}, 1000);
```

#### 🧠 Notes

- The delay is **not guaranteed** — it's a _minimum wait time_.
- Timer accuracy depends on system load and event loop state.

#### 🧪 Advanced: Zero-delay trap

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");

// Output:
// A
// C
// B
```

Even with `0` delay, the callback is pushed to the **task queue**, so it runs **after** the current call stack.

---

#### ✅ Best Practices

- Use for **delays**, **deferring work**, or **debouncing**.
- Always clear with `clearTimeout(timerId)` if needed.

```js
const id = setTimeout(() => {
  console.log("This will not run");
}, 500);
clearTimeout(id);
```

---

### 🔁 6. `setInterval(callback, interval)`

#### ✅ What It Does

Schedules a callback to run **repeatedly every X ms**.

```js
let count = 0;
const intervalId = setInterval(() => {
  console.log("Tick", ++count);
  if (count === 3) clearInterval(intervalId);
}, 1000);
```

#### ⚠️ Issues:

- Execution **drift** can happen if the callback takes too long:

```js
setInterval(() => {
  const start = Date.now();
  while (Date.now() - start < 600) {} // simulates heavy task
  console.log("Interval fired");
}, 500);
```

- Above, the callback takes longer than the interval.

---

#### ✅ Best Practices:

- Prefer `setTimeout` loop for **precise intervals**:

```js
function loop() {
  console.log("Tick");
  setTimeout(loop, 1000);
}
loop();
```

- Use `clearInterval(id)` to stop.
- Use for **polling** or **heartbeats**, but consider `requestAnimationFrame` or Observables for better performance/reactivity.

### 🆕 7. `setImmediate(callback)` (Node.js only)

#### ✅ What It Does

Executes a callback **after the current poll phase**, **before** any `setTimeout(…, 0)` callbacks.

```js
console.log("Start");
setImmediate(() => console.log("setImmediate"));
setTimeout(() => console.log("setTimeout 0"), 0);
console.log("End");

// Output order:
// Start
// End
// setImmediate
// setTimeout 0
```

#### 📊 Comparison:

| Function            | When it executes                    |
| ------------------- | ----------------------------------- |
| `setTimeout(fn, 0)` | After timer phase                   |
| `setImmediate(fn)`  | Immediately after current I/O event |

---

#### ✅ Best Practices:

- Use when you want to **execute after I/O events** but before timers.
- Often used in libraries or native modules for scheduling low-priority work.

---

### ⚡ 8. `process.nextTick(callback)` (Node.js only)

#### ✅ What It Does

Adds the callback to the **next microtask queue**, **before any I/O or timer** events.

```js
console.log("A");
process.nextTick(() => console.log("B"));
console.log("C");

// Output:
// A
// C
// B
```

---

#### 🧠 Deep Understanding

`process.nextTick` callbacks are executed **before** the event loop continues — even before `Promise.resolve().then(...)` in some versions.

```js
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));

// Output:
// nextTick
// promise
```

#### ⚠️ Danger: Starvation

```js
function recursiveTick() {
  process.nextTick(recursiveTick);
}
recursiveTick(); // Freezes everything
```

This **blocks the event loop** forever — never letting I/O or timers run.

#### ✅ Best Practices

- Use for:
  - Cleanup after sync code
  - Ensuring predictable async behavior
  - Error throwing from async context

#### 🧠 Summary Table

| Function             | Type       | Executes when                 | Use Case                                      |
| -------------------- | ---------- | ----------------------------- | --------------------------------------------- |
| `setTimeout(fn, 0)`  | Macro task | After min delay / timer phase | Run after delay, debouncing                   |
| `setInterval(fn, x)` | Macro task | Repeatedly every x ms         | Polling, repeating events                     |
| `setImmediate(fn)`   | Macro task | After current I/O completes   | Post I/O work (Node.js only)                  |
| `process.nextTick()` | Microtask  | Before any I/O/timer phase    | Async cleanup, fix sync/async ordering issues |

### 🔥9. What is `EventEmitter`?

`EventEmitter` is a class in Node.js that provides a way to **emit named events** and **register listeners** (callbacks) for those events — enabling **decoupled**, **asynchronous**, and **reactive** design.

> Think of it like a pub/sub system:
>
> - **Publisher** emits an event
> - **Subscribers** respond to it

#### 🛠️ Basic Usage

```js
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("greet", (name) => {
  console.log(`Hello, ${name}`);
});

myEmitter.emit("greet", "Alice"); // Hello, Alice
```

---

#### 📚 Core Methods

| Method                      | Description                          |
| --------------------------- | ------------------------------------ |
| `on(event, listener)`       | Registers a listener                 |
| `emit(event, [...args])`    | Emits an event                       |
| `once(event, listener)`     | Listener runs only once              |
| `off` / `removeListener`    | Removes a specific listener          |
| `removeAllListeners(event)` | Removes all listeners for that event |
| `listenerCount(event)`      | Gets count of listeners              |
| `eventNames()`              | Lists all registered event names     |

---

#### 🚀 Advanced Usage

#### 🔁 `once()`

```js
myEmitter.once("boot", () => {
  console.log("Booting system...");
});

myEmitter.emit("boot"); // logs
myEmitter.emit("boot"); // ignored
```

---

#### 🛑 Removing Listeners

```js
function ping() {
  console.log("Pinged");
}

myEmitter.on("ping", ping);
myEmitter.off("ping", ping); // or .removeListener('ping', ping)
myEmitter.emit("ping"); // nothing happens
```

#### 📦 Multiple Listeners

```js
myEmitter.on("data", (msg) => console.log(`1st: ${msg}`));
myEmitter.on("data", (msg) => console.log(`2nd: ${msg}`));

myEmitter.emit("data", "Hello");

// Output:
// 1st: Hello
// 2nd: Hello
```

Listeners run in the **order** they are registered.

---

#### 📦 Practical Use Case, _Chat App Simulation_

```js
class Chat extends EventEmitter {
  sendMessage(user, message) {
    this.emit("message", { user, message });
  }
}

const chat = new Chat();

chat.on("message", ({ user, message }) => {
  console.log(`[${user}] says: ${message}`);
});

chat.sendMessage("John", "Hello!");
```

#### ⚠️ Warning: Max Listeners Limit

To prevent memory leaks, Node sets a **default max listener limit of 10**.

```js
myEmitter.setMaxListeners(20); // Customize it
```

Or increase globally:

```js
require("events").defaultMaxListeners = 20;
```

If exceeded, you'll see a warning:

```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected
```

Best Practices

#### ✅ 1. **Always Handle Errors**

```js
myEmitter.on("error", (err) => {
  console.error("Error caught:", err);
});

myEmitter.emit("error", new Error("Oops"));
```

❗Uncaught `'error'` event = process crash.

---

#### ✅ 2. **Use `once()` for Init Events**

Good for bootstrapping logic, initial config, or self-destructing handlers.

---

#### ✅ 3. **Avoid Listener Leaks**

Clean up with `.off()` or `.removeAllListeners()` where needed:

```js
myEmitter.removeAllListeners("eventName");
```

#### ✅ 4. **Use Custom Emitters (OOP)**

```js
class MyService extends EventEmitter {
  start() {
    this.emit("start");
  }
}
```

Keep your code **modular** and **decoupled** by **emitting from objects**, not directly.

#### ⚙️ Under the Hood – How `EventEmitter` Works

- `emit(event, ...)` checks if listeners exist for the `event`.
- If yes, all callbacks are invoked **synchronously** in registration order.
- `once()` wraps your callback in an internal function that removes itself after first call.

---

#### 🔄 Comparison with Other Async Models

| Model        | Use Case                      | Description                         |
| ------------ | ----------------------------- | ----------------------------------- |
| Callback     | Simple async ops              | Prone to callback hell              |
| Promise      | One-time result               | Chainable and readable              |
| async/await  | Syntactic sugar over Promises | Sequential async code               |
| EventEmitter | **Multiple events** over time | Good for reactive/event-driven apps |

---

#### ✅ When to Use `EventEmitter`

- Logging or analytics hooks
- Plugin/extension systems
- HTTP server events (like `req.on('data')`)
- Custom state machines / workflows
- Reactive services or pub/sub logic

#### 📦 Real-world Examples in Node.js

| API                   | Event Names                      |
| --------------------- | -------------------------------- |
| `fs.createReadStream` | `'data'`, `'end'`, `'error'`     |
| `http.Server`         | `'request'`, `'connection'`      |
| `child_process`       | `'exit'`, `'message'`, `'error'` |

#### 📌 Final Advice

✅ **Great for real-time systems**  
✅ **Avoid when events aren't needed** (use Promises for single result)  
✅ **Always handle `'error'` events**  
✅ **Profile memory for high listener counts**  
✅ **Encapsulate emitters inside classes/modules**

---

### ✅ Expert Advice

- **Use `async/await` for readability**, but don't forget `.catch`.
- **Use `Promise.all` wisely** — avoid it if promises depend on each other.
- **Promisify legacy callbacks** to modernize your codebase.
- **Don’t overuse async** — avoid unnecessary async functions.
- **Avoid top-level await** unless in ESM or special Node environments.
- **Combine async/await with state machines** for workflows and orchestration.
- **Use `setTimeout` and `setInterval`** in frontend/browser code.
- **Use `setImmediate` for post-I/O logic in Node.js**, especially when deferring execution to allow the event loop to continue.
- **Use `process.nextTick` for internal async setup**, but avoid deep recursive `nextTick()` usage.
- For performance-critical or animation tasks in browsers, consider `requestAnimationFrame()`.

## 6. Event Loop and Node Internals

### 1. Internals

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

## 9. Command Line Apps

### ✅ 1. Exiting & Exit Codes

#### 🔹 `process.exit([code])`

- Ends the Node.js process immediately.
- If code is:
  - `0`: success
  - non-zero: failure (e.g., `1`, `2`…)

#### 🔸 Example

```js
if (!process.env.API_KEY) {
  console.error("Missing API_KEY in environment");
  process.exit(1); // non-zero = error
}

console.log("Running with valid API_KEY");
process.exit(0); // optional, 0 = success
```

#### ✅ Best Practices

| Situation                | Exit Code |
| ------------------------ | --------- |
| Success                  | 0         |
| Generic failure          | 1         |
| Misuse of shell builtins | 2         |
| Command not found        | 127       |
| Permission denied        | 126       |
| Custom internal errors   | 64–78     |

> 🔥 **Pro Tip:** Always `console.error()` on failure so users/devs see meaningful messages.

---

### ✅ 2. Command Line Arguments

#### 🔹 `process.argv`

##### What is it?

A Node.js array representing the command-line arguments passed when starting the process.

```bash
node app.js hello world
```

```js
console.log(process.argv);
```

Output:

```js
[
  "/usr/local/bin/node", // node binary
  "/your/path/app.js", // your script
  "hello",
  "world",
];
```

##### 🔸 Parsing Arguments Manually

```js
const args = process.argv.slice(2);
const [name, age] = args;
console.log(`Name: ${name}, Age: ${age}`);
```

```bash
node app.js John 30
# Output: Name: John, Age: 30
```

✅ Use manual parsing only for **very basic scripts**.

---

#### 🛠️ Building Advanced CLI? Use...

### ✅ `commander.js` — A Modern CLI Framework

> "Elegant CLI parsing for Node.js inspired by Ruby's OptionParser"

#### 📦 Install

```bash
npm install commander
```

---

#### ✅ Basic Example

```js
#!/usr/bin/env node
// cli.js
const { program } = require("commander");

program.name("greet").description("A CLI tool to greet users").version("1.0.0");

program
  .argument("<name>", "name to greet")
  .option("-u, --uppercase", "use uppercase")
  .action((name, options) => {
    const greeting = `Hello, ${name}`;
    console.log(options.uppercase ? greeting.toUpperCase() : greeting);
  });

program.parse(process.argv);
```

```bash
node cli.js Alice
# Output: Hello, Alice

node cli.js Bob --uppercase
# Output: HELLO, BOB
```

---

### ✅ Advanced Options & Flags

```js
program
  .option("-c, --count <number>", "repeat count", parseInt)
  .option("-d, --debug", "enable debug mode");

program.action((options) => {
  if (options.debug) console.log("Debug mode is ON");
  console.log("Running", options.count || 1, "times");
});
```

```bash
node cli.js --count 5 --debug
```

---

#### ✅ Subcommands

```js
program
  .command("deploy")
  .description("Deploy the app")
  .option("--staging", "Deploy to staging")
  .action((opts) => {
    if (opts.staging) console.log("Deploying to staging...");
    else console.log("Deploying to production...");
  });
```

```bash
node cli.js deploy --staging
```

---

### ✅ CLI Help Output

Built-in!

```bash
node cli.js --help
```

```
Usage: greet [options] <name>

A CLI tool to greet users

Arguments:
  name          name to greet

Options:
  -u, --uppercase  use uppercase
  -V, --version    output the version number
  -h, --help       display help for command
```

---

### 🧠 Best Practices for CLI Tools

| Tip | Practice                                                               |
| --- | ---------------------------------------------------------------------- |
| ✅  | Always handle unexpected input with friendly errors                    |
| ✅  | Use `--help` descriptions everywhere                                   |
| ✅  | Document exit codes and what they mean                                 |
| ✅  | Use `process.exit(1)` on errors, `process.exit(0)` on success          |
| ✅  | For complex tools, split commands into subcommands (like `git commit`) |
| ✅  | Use `chalk` or `kleur` for colored output                              |

---

### 🧠 Advice from Real World

- 🔁 For repeatable logic: structure your CLI as a **library + CLI wrapper**
- 🧪 Test your CLI using tools like [`execa`](https://github.com/sindresorhus/execa) or `child_process`
- 🐳 If you're using Docker, use `process.cwd()` smartly for path resolution
- 🪝 Consider `hooks` (like `--pre`, `--dry-run`, `--force`) for safer commands
- 📦 Use `bin` in `package.json` to expose it globally:

```json
"bin": {
  "mycli": "cli.js"
}
```

Then:

```bash
npm link
mycli deploy
```

### Taking Input

In Node.js, you can take input via:

1. `process.stdin` – Low-level, built-in
2. `prompts` – Lightweight async/await-based library
3. `inquirer` – Powerful and full-featured interactive prompt toolkit

We'll cover each with advanced examples, best practices, and advice.

#### `process.stdin` — (Low-level Input)

#### 🔹 Basics

```js
process.stdin.setEncoding("utf8");

console.log("Enter your name:");
process.stdin.on("data", (data) => {
  console.log(`Hello, ${data.trim()}!`);
  process.exit(0);
});
```

#### 🔹 With `readline` (recommended for line-by-line input)

```js
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (answer) => {
  console.log(`Hello, ${answer}`);
  rl.close();
});
```

#### ✅ Best Practices

- Always call `rl.close()` to avoid hanging.
- Use `rl.on('SIGINT')` to handle Ctrl+C gracefully.
- Wrap in a `Promise` for async/await flows:

```js
function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

(async () => {
  const name = await ask("Your name: ");
  console.log(`Hi ${name}`);
})();
```

---

#### Prompts Package — (Minimal, Async, Modern)

> [🔗 GitHub: https://github.com/terkelg/prompts](https://github.com/terkelg/prompts)

#### 📦 Install

```bash
npm install prompts
```

#### 🔹 Example

```js
const prompts = require("prompts");

(async () => {
  const response = await prompts({
    type: "text",
    name: "username",
    message: "What is your name?",
  });

  console.log(`Hi, ${response.username}`);
})();
```

#### 🔹 Multiple Questions

```js
(async () => {
  const questions = [
    {
      type: "text",
      name: "email",
      message: "Enter your email:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password:",
    },
    {
      type: "confirm",
      name: "subscribe",
      message: "Subscribe to newsletter?",
      initial: true,
    },
  ];

  const response = await prompts(questions);
  console.log(response);
})();
```

#### ✅ Best Practices

- Handle `onCancel` to gracefully exit:

```js
const onCancel = () => {
  console.log("User canceled. Exiting.");
  process.exit(1);
};

const response = await prompts(questions, { onCancel });
```

- Use `validate` for input checks.

#### Inquirer Package — (Most Powerful for Complex Input)

> [🔗 GitHub: https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

#### 📦 Install

```bash
npm install inquirer
```

#### 🔹 Basic Example

```js
const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "input",
      name: "username",
      message: "What is your name?",
    },
  ])
  .then((answers) => {
    console.log(`Hello, ${answers.username}`);
  });
```

#### 🔹 Advanced Types

```js
inquirer
  .prompt([
    {
      type: "list",
      name: "framework",
      message: "Pick your favorite JS framework:",
      choices: ["React", "Vue", "Svelte", "Angular"],
    },
    {
      type: "checkbox",
      name: "features",
      message: "Select features:",
      choices: ["TypeScript", "ESLint", "Prettier"],
    },
    {
      type: "password",
      name: "secret",
      message: "Enter a secret:",
    },
  ])
  .then((answers) => console.log(answers));
```

---

#### 🔹 Conditional Questions

```js
inquirer
  .prompt([
    {
      type: "confirm",
      name: "deploy",
      message: "Do you want to deploy?",
    },
    {
      type: "input",
      name: "env",
      message: "Enter environment (prod/stage):",
      when: (answers) => answers.deploy,
    },
  ])
  .then((answers) => console.log(answers));
```

---

#### ✅ Best Practices

| Tip                                    | Why                      |
| -------------------------------------- | ------------------------ |
| Use `when`                             | For conditional logic    |
| Use `validate`                         | To enforce input formats |
| Group questions logically              | Easier UX                |
| Use `async/await` with inquirer.prompt | Cleaner code             |
| Combine with `chalk` for color output  | Improves UX              |

#### 🔚 Final Advice

| Tool            | Use When                                                     |
| --------------- | ------------------------------------------------------------ |
| `process.stdin` | You need **low-level**, raw stream-based input               |
| `prompts`       | You want a **lightweight**, async/await CLI                  |
| `inquirer`      | You want **rich CLI UX**: lists, checkboxes, dynamic prompts |

> 🧠 Bonus Tip: Combine `inquirer`, `chalk`, and `commander` to build a **beautiful CLI** tool.

### Printing Output

##### `process.stdout` – Standard Output

#### 🔹 Basics:

```js
process.stdout.write("Hello, World!\n"); // No newline by default
```

- It writes to the terminal synchronously.
- Unlike `console.log`, you control formatting and line breaks manually.

#### 🔹 Advanced Usage:

```js
// Simulate progress
const interval = setInterval(() => {
  process.stdout.write(".");
}, 200);

setTimeout(() => {
  clearInterval(interval);
  process.stdout.write("\nDone!\n");
}, 2000);
```

✅ **Best Practices**:

- Use `process.stdout.write` for **overwriting lines**, spinners, or progress updates.
- Buffer output for large streams (e.g., from child processes or file reads).

---

#### `process.stderr` – Standard Error

Used for **logging errors**, **warnings**, and **diagnostic info**.

```js
process.stderr.write("This is an error message\n");
```

#### 🧠 Pro Tip:

Separating output lets you redirect stdout and stderr independently in Unix-like systems:

```bash
node script.js > output.log 2> error.log
```

✅ **Best Practices**:

- Use `stderr` for logging anything not meant for normal output.
- Makes parsing output from CLI tools much easier.

---

#### `chalk` – Terminal String Styling

> GitHub: [https://github.com/chalk/chalk](https://github.com/chalk/chalk)

#### 📦 Install:

```bash
npm install chalk
```

#### 🔹 Basic Usage:

```js
import chalk from "chalk";

console.log(chalk.green("Success!"));
console.log(chalk.red("Error!"));
console.log(chalk.yellow("Warning!"));
```

#### 🔹 Composing Styles:

```js
console.log(chalk.bold.underline.blue("Important message"));
```

#### 🔹 Template Literals:

```js
console.log(chalk`{green Bright} {bgRed.bold  ERROR }`);
```

✅ **Best Practices**:

- Use `chalk` consistently for log levels (`info`, `warn`, `error`, `debug`).
- Create a `logger` module to abstract your styled logging:

```js
// logger.js
import chalk from "chalk";

export const log = console.log;
export const error = (msg) => log(chalk.red("❌ " + msg));
export const success = (msg) => log(chalk.green("✅ " + msg));
export const info = (msg) => log(chalk.cyan("ℹ️ " + msg));
```

---

#### `cli-progress` – Beautiful Progress Bars

> GitHub: [https://github.com/AndiDittrich/Node.CLI-Progress](https://github.com/AndiDittrich/Node.CLI-Progress)

#### 📦 Install:

```bash
npm install cli-progress
```

#### 🔹 Basic Example:

```js
import cliProgress from "cli-progress";

// Create a single progress bar
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(100, 0);

let value = 0;
const interval = setInterval(() => {
  value += 5;
  bar.update(value);

  if (value >= 100) {
    clearInterval(interval);
    bar.stop();
  }
}, 200);
```

#### 🔹 Multiple Bars:

```js
const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);

const task1 = multibar.create(100, 0);
const task2 = multibar.create(100, 0);

let i1 = 0,
  i2 = 0;
const interval = setInterval(() => {
  task1.update((i1 += 2));
  task2.update((i2 += 3));

  if (i1 >= 100 && i2 >= 100) {
    clearInterval(interval);
    multibar.stop();
  }
}, 200);
```

✅ **Best Practices**:

- Keep updates lightweight and not too frequent to avoid flickering.
- Combine with `chalk` for enhanced visuals (e.g., colors for labels).
- Useful for file downloads, batch processing, data fetching.

---

#### ✅ Summary Table

| Feature          | Purpose                            | When to Use                              |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| `process.stdout` | Raw, synchronous output            | Low-level formatting, overwriting lines  |
| `process.stderr` | Raw error stream                   | Warnings, diagnostics, errors            |
| `chalk`          | Color, bold, underline, formatting | Style output for better UX               |
| `cli-progress`   | Visual progress bars               | Show progress in CLI tools, data loaders |

---

#### 🧠 Expert Advice

- **Modularize CLI output**: Create a `logger.js` and `ui.js` for centralized logging/styling.
- **Think UX for CLI**: Just like web apps, make CLI tools user-friendly with visual feedback.
- **Combine `inquirer`, `chalk`, `cli-progress`** for highly interactive terminal apps.
- **Avoid console.log in production logs** — use structured logging or levels.

## 10. Working with API

1. [Realtime - Socket.io](/Nodejs/sub/realtime.md)
2. [ExpressJs](/Nodejs/sub/expressjs.md)

## 11. Keeping Application Running

### 🧠 What is `nodemon`?

**`nodemon`** is a development utility that monitors your Node.js files and automatically **restarts the server/app** when changes are detected. It makes local development faster and less repetitive.

---

#### ✅ Why Use `nodemon`?

| Feature             | Benefit                                           |
| ------------------- | ------------------------------------------------- |
| Auto-restarts app   | Save time — no need to manually stop/start server |
| File watching       | Works with `.js`, `.ts`, `.json`, etc.            |
| Custom script entry | Run any file (e.g., `index.ts`, `app.js`)         |
| Debug friendly      | Works with `--inspect`, environment variables     |

#### 🛠️ Installation

### Globally (Recommended):

```bash
npm install -g nodemon
```

### Or as a dev dependency:

```bash
npm install --save-dev nodemon
```

---

### ▶️ Basic Usage

```bash
nodemon app.js
```

Whenever `app.js` or its dependencies change, `nodemon` restarts the app automatically.

---

### ⚙️ `package.json` Integration

```json
{
  "scripts": {
    "dev": "nodemon app.js"
  }
}
```

Now run:

```bash
npm run dev
```

---

### 🎯 Watching Specific File Types

By default, `nodemon` watches `.js`, `.json`, `.mjs`, `.cjs`, and `.node`.

You can add custom extensions:

```bash
nodemon --ext js,json,ts
```

Or in a `nodemon.json` config (recommended for big projects):

---

### 📁 Create a `nodemon.json` File

```json
{
  "watch": ["src"],
  "ext": "js,json,ts",
  "ignore": ["node_modules", "logs"],
  "exec": "ts-node src/app.ts"
}
```

### Then just run:

```bash
nodemon
```

---

### 🧪 Use with TypeScript (`ts-node`)

```bash
npm install -D ts-node typescript
```

### Run a TS file directly:

```bash
nodemon --exec ts-node src/index.ts
```

Or via `nodemon.json` as shown earlier.

---

### 🚫 Ignore Specific Files

Inline:

```bash
nodemon --ignore 'logs/*'
```

Or inside `nodemon.json`:

```json
{
  "ignore": ["logs", "*.test.js"]
}
```

---

### 🧵 Pass Environment Variables

```bash
NODE_ENV=development nodemon app.js
```

Or with cross-platform compatibility (Windows/Linux):

```bash
npx cross-env NODE_ENV=development nodemon app.js
```

---

### 🐞 Enable Debugging with Nodemon

```bash
nodemon --inspect app.js
```

You can debug in Chrome via `chrome://inspect`.

---

### 🛡 Best Practices

| Practice                      | Description                        |
| ----------------------------- | ---------------------------------- |
| Use `nodemon.json`            | Cleaner config, version-controlled |
| Use scripts in `package.json` | Avoid memorizing long CLI commands |
| Use with `ts-node`            | Best for TypeScript dev            |
| Ignore logs/tmp/test files    | Avoid unnecessary restarts         |
| Separate dev vs prod scripts  | Don't use `nodemon` in production  |

---

### 📦 Bonus: Install `concurrently` for frontend/backend apps

```bash
npm install concurrently --save-dev
```

Then in `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js",
    "client": "vite"
  }
}
```

---

### 🧠 Summary

- Use `nodemon` to speed up dev iteration.
- Combine with `ts-node`, `dotenv`, and `cross-env` for full stack CLI control.
- Don't use in production — use PM2 or Docker.

## 12. Templating Engines

Pending

## 13. Working with Databases

Pending

## 14. Testing

Pending

## 15. Logging

1. [Winston](/Nodejs/logging/winston.md)
1. [Morgan](/Nodejs/logging/morgan.md)

## 16. Keeping App Running

1. [Pm2](/Nodejs/sub/pm2.md)
2. forever Package
3. nohup

## 17. Threads

### Child Process

### Cluster

### Worker Threads

## 18. Streams

## 19. More Debugging

-- Memory Leaks
-- node --inspect
-- Using APM

## 20. Common Built-in Modules

1. [FS](/Nodejs/sub/fs.md)
2. os
3. net
4. [Path](/Nodejs/sub/path.md)
5. url
6. events
7. http/https
8. events
9. assert
10. crypto
11. process
12. perf_hooks
13. Buffer
14. [Streams](/Nodejs/sub/streams.md)
