# Command Line Arguments

## ✅ 1. Exiting & Exit Codes

### 🔹 `process.exit([code])`

- Ends the Node.js process immediately.
- If code is:
  - `0`: success
  - non-zero: failure (e.g., `1`, `2`…)

### 🔸 Example

```js
if (!process.env.API_KEY) {
  console.error("Missing API_KEY in environment");
  process.exit(1); // non-zero = error
}

console.log("Running with valid API_KEY");
process.exit(0); // optional, 0 = success
```

### ✅ Best Practices

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

## ✅ 2. Command Line Arguments

### 🔹 `process.argv`

#### What is it?

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

### 🛠️ Building Advanced CLI? Use...

## ✅ `commander.js` — A Modern CLI Framework

> "Elegant CLI parsing for Node.js inspired by Ruby's OptionParser"

### 📦 Install

```bash
npm install commander
```

---

### ✅ Basic Example

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

### ✅ Subcommands

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

## 🧠 Advice from Real World

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
