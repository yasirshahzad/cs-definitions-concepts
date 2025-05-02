# 📦 What is `process` in Node.js?

The `process` object is a **global object** in Node.js that provides information about, and control over, the current Node.js process.

```js
console.log(process); // global object, no import needed
```

---

## 🔑 Commonly Used `process` APIs

| API                                   | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `process.argv`                        | CLI arguments                                                |
| `process.env`                         | Environment variables                                        |
| `process.cwd()`                       | Current working directory                                    |
| `process.exit()`                      | Exit the process                                             |
| `process.stdin` / `stdout` / `stderr` | Input/output streams                                         |
| `process.on('event')`                 | Listen to signals like `exit`, `SIGINT`, `uncaughtException` |
| `process.memoryUsage()`               | Memory details                                               |
| `process.hrtime()`                    | High-resolution timing                                       |

---

## 🔹 1. `process.argv` – Command Line Arguments

```js
// command: node app.js hello world
console.log(process.argv);
// [ 'node', '/path/to/app.js', 'hello', 'world' ]

const args = process.argv.slice(2);
console.log("Your args:", args);
```

---

## 🔹 2. `process.env` – Environment Variables

```js
console.log(process.env.PATH); // System PATH

// Example: node app.js (with FOO=bar)
console.log(process.env.FOO); // 'bar'
```

✅ Useful with `.env` files (via dotenv library)

---

## 🔹 3. `process.cwd()` – Current Working Directory

```js
console.log("Current directory:", process.cwd());
```

---

## 🔹 4. `process.exit()` – Exit the process manually

```js
if (someFatalError) {
  console.error("Fatal error occurred!");
  process.exit(1); // 0 = success, 1 = error
}
```

---

## 🔹 5. `process.stdin`, `stdout`, `stderr`

```js
// Input from user
process.stdin.on("data", (data) => {
  console.log("You typed:", data.toString().trim());
});
```

```js
process.stdout.write("Hello from stdout\n");
process.stderr.write("This is an error message\n");
```

---

## 🔹 6. `process.on('exit' | 'SIGINT' | 'uncaughtException')`

```js
process.on("exit", (code) => {
  console.log(`Exiting with code ${code}`);
});

process.on("SIGINT", () => {
  console.log("Caught Ctrl+C (SIGINT)");
  process.exit();
});

process.on("uncaughtException", (err) => {
  console.error("Unhandled Error:", err);
  process.exit(1);
});
```

---

## 🔹 7. `process.memoryUsage()`

```js
console.log("Memory usage:", process.memoryUsage());
```

---

## 🔹 8. `process.hrtime()` – High-resolution timer

```js
const start = process.hrtime();
// ... some code
const diff = process.hrtime(start);
console.log(`Execution time: ${diff[0]}s ${diff[1] / 1e6}ms`);
```

---

## 🧪 Practice Project: CLI Argument Inspector

Create `cli-info.js`:

```js
console.log("--- CLI Arguments ---");
console.log(process.argv.slice(2));

console.log("\n--- Environment Variables ---");
console.log(process.env);

console.log("\n--- Working Directory ---");
console.log(process.cwd());

console.log("\n--- Memory Usage ---");
console.log(process.memoryUsage());

console.log("\n--- High-Resolution Timer Test ---");
const start = process.hrtime();
setTimeout(() => {
  const diff = process.hrtime(start);
  console.log(`Timer finished after: ${diff[0]}s ${diff[1] / 1e6}ms`);
}, 1000);
```

---

## ✅ Summary: Mastery Checklist

- [x] Use `process.argv` for custom CLI tools
- [x] Read `.env` variables from `process.env`
- [x] Gracefully handle process exit and signals
- [x] Use `stdin` for interactive CLI apps
- [x] Track memory and execution time for debugging
