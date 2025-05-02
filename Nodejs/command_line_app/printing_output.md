# Printing Output

## `process.stdout` – Standard Output

### 🔹 Basics:

```js
process.stdout.write("Hello, World!\n"); // No newline by default
```

- It writes to the terminal synchronously.
- Unlike `console.log`, you control formatting and line breaks manually.

### 🔹 Advanced Usage:

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

### `process.stderr` – Standard Error

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

## `chalk` – Terminal String Styling

> GitHub: [https://github.com/chalk/chalk](https://github.com/chalk/chalk)

### 📦 Install

```bash
npm install chalk
```

### 🔹 Basic Usage

```js
import chalk from "chalk";

console.log(chalk.green("Success!"));
console.log(chalk.red("Error!"));
console.log(chalk.yellow("Warning!"));
```

### 🔹 Composing Styles

```js
console.log(chalk.bold.underline.blue("Important message"));
```

### 🔹 Template Literals

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

## `cli-progress` – Beautiful Progress Bars

> GitHub: [https://github.com/AndiDittrich/Node.CLI-Progress](https://github.com/AndiDittrich/Node.CLI-Progress)

### 📦 Install

```bash
npm install cli-progress
```

### 🔹 Basic Example

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

### 🔹 Multiple Bars

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

### ✅ Summary Table

| Feature          | Purpose                            | When to Use                              |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| `process.stdout` | Raw, synchronous output            | Low-level formatting, overwriting lines  |
| `process.stderr` | Raw error stream                   | Warnings, diagnostics, errors            |
| `chalk`          | Color, bold, underline, formatting | Style output for better UX               |
| `cli-progress`   | Visual progress bars               | Show progress in CLI tools, data loaders |

### 🧠 Expert Advice

- **Modularize CLI output**: Create a `logger.js` and `ui.js` for centralized logging/styling.
- **Think UX for CLI**: Just like web apps, make CLI tools user-friendly with visual feedback.
- **Combine `inquirer`, `chalk`, `cli-progress`** for highly interactive terminal apps.
- **Avoid console.log in production logs** — use structured logging or levels.
