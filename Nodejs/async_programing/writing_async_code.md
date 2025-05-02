# Writing Async Code

## 🔁 1. CALLBACKS & CALLBACK HELL

### ✅ What is a Callback?

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

### ⚠️ Callback Hell

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

### 💡 Best Practice: Use Promises or Async/Await instead (see next sections)

### 🧠 BONUS: Error-First Callbacks

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

## 🔗 2. PROMISES

### ✅ What is a Promise?

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

### ⚙️ Chaining Promises

```js
fetchUser()
  .then((user) => fetchProfile(user.id))
  .then((profile) => fetchPosts(profile.id))
  .then((posts) => console.log(posts))
  .catch(console.error);
```

---

### ✅ `Promise.all`, `Promise.allSettled`, `Promise.race`

### `Promise.all`

Waits for all promises to resolve or **rejects early** if any fail.

```js
Promise.all([fetchUser(), fetchSettings()])
  .then(([user, settings]) => console.log(user, settings))
  .catch(console.error);
```

### `Promise.allSettled`

Waits for **all** to complete, regardless of rejection.

```js
Promise.allSettled([fetchUser(), fetchSettings()]).then((results) => {
  results.forEach((res) => console.log(res.status, res.value || res.reason));
});
```

### `Promise.race`

Returns the result of the **first** settled promise.

```js
Promise.race([slowPromise(), fastPromise()])
  .then(console.log)
  .catch(console.error);
```

### 🧠 Best Practices for Promises

- Always return promises inside `.then()` chains.
- Always `.catch()` errors.
- Use `finally()` to clean up.
- Prefer `Promise.allSettled` when you want full results without short-circuiting.

## 🔮 3. `async/await`

### ✅ Cleaner Syntax for Promises

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

### 💡 Advanced `async/await`

#### Retry Logic

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

### 🧠 Best Practices for `async/await`

- Wrap top-level awaits in try/catch.
- Use `Promise.all` for independent promises.
- Avoid mixing `await` with `.then()`.

## 🔁 4. CONVERTING CALLBACKS TO PROMISES (Promisify)

### ✅ Manual Promisify

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

### ✅ Node.js `util.promisify`

```js
const { promisify } = require("util");
const fs = require("fs");

const readFile = promisify(fs.readFile);
readFile("data.txt", "utf8").then(console.log);
```

## 🔁 5. `setTimeout(callback, delay)`

### ✅ What It Does

Schedules a callback to run **once after** a minimum delay.

```js
setTimeout(() => {
  console.log("Executed after 1 second");
}, 1000);
```

### 🧠 Notes

- The delay is **not guaranteed** — it's a _minimum wait time_.
- Timer accuracy depends on system load and event loop state.

### 🧪 Advanced: Zero-delay trap

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

### ✅ Best Practices

- Use for **delays**, **deferring work**, or **debouncing**.
- Always clear with `clearTimeout(timerId)` if needed.

```js
const id = setTimeout(() => {
  console.log("This will not run");
}, 500);
clearTimeout(id);
```

## 🔁 6. `setInterval(callback, interval)`

### ✅ What It Does

Schedules a callback to run **repeatedly every X ms**.

```js
let count = 0;
const intervalId = setInterval(() => {
  console.log("Tick", ++count);
  if (count === 3) clearInterval(intervalId);
}, 1000);
```

### ⚠️ Issues:

- Execution **drift** can happen if the callback takes too long:

```js
setInterval(() => {
  const start = Date.now();
  while (Date.now() - start < 600) {} // simulates heavy task
  console.log("Interval fired");
}, 500);
```

- Above, the callback takes longer than the interval.

### ✅ Best Practices:

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

## 🆕 7. `setImmediate(callback)` (Node.js only)

### ✅ What It Does

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

### 📊 Comparison

| Function            | When it executes                    |
| ------------------- | ----------------------------------- |
| `setTimeout(fn, 0)` | After timer phase                   |
| `setImmediate(fn)`  | Immediately after current I/O event |

### ✅ Best Practices:

- Use when you want to **execute after I/O events** but before timers.
- Often used in libraries or native modules for scheduling low-priority work.

## ⚡ 8. `process.nextTick(callback)` (Node.js only)

### ✅ What It Does

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

### 🧠 Deep Understanding

`process.nextTick` callbacks are executed **before** the event loop continues — even before `Promise.resolve().then(...)` in some versions.

```js
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));

// Output:
// nextTick
// promise
```

### ⚠️ Danger: Starvation

```js
function recursiveTick() {
  process.nextTick(recursiveTick);
}
recursiveTick(); // Freezes everything
```

This **blocks the event loop** forever — never letting I/O or timers run.

### ✅ Best Practices

- Use for:
  - Cleanup after sync code
  - Ensuring predictable async behavior
  - Error throwing from async context

## 🧠 Summary Table

| Function             | Type       | Executes when                 | Use Case                                      |
| -------------------- | ---------- | ----------------------------- | --------------------------------------------- |
| `setTimeout(fn, 0)`  | Macro task | After min delay / timer phase | Run after delay, debouncing                   |
| `setInterval(fn, x)` | Macro task | Repeatedly every x ms         | Polling, repeating events                     |
| `setImmediate(fn)`   | Macro task | After current I/O completes   | Post I/O work (Node.js only)                  |
| `process.nextTick()` | Microtask  | Before any I/O/timer phase    | Async cleanup, fix sync/async ordering issues |
