# Error Handling in NodeJs

## 1. Types of Errors

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

## 🔥 2. Uncaught Exceptions

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

## 🌀 3. Handling Async Errors

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

## 🧠 4. Call Stack / Stack Trace

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

## 🧰 5. Using Debugger

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

## 🧩 Additional Tips

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

## 🧠 Final Advice

> "**Don't let your app die silently.** Log what happened, act on what you can, and recover gracefully if possible — otherwise fail fast."
