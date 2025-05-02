# Taking Input

In Node.js, you can take input via:

1. `process.stdin` – Low-level, built-in
2. `prompts` – Lightweight async/await-based library
3. `inquirer` – Powerful and full-featured interactive prompt toolkit

We'll cover each with advanced examples, best practices, and advice.

## `process.stdin` — (Low-level Input)

### 🔹 Basics

```js
process.stdin.setEncoding("utf8");

console.log("Enter your name:");
process.stdin.on("data", (data) => {
  console.log(`Hello, ${data.trim()}!`);
  process.exit(0);
});
```

### 🔹 With `readline` (recommended for line-by-line input)

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

### ✅ Best Practices

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

## Prompts Package — (Minimal, Async, Modern)

> [🔗 GitHub: https://github.com/terkelg/prompts](https://github.com/terkelg/prompts)

### 📦 Install

```bash
npm install prompts
```

### 🔹 Example

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

### 🔹 Multiple Questions

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

### ✅ Best Practices

- Handle `onCancel` to gracefully exit:

```js
const onCancel = () => {
  console.log("User canceled. Exiting.");
  process.exit(1);
};

const response = await prompts(questions, { onCancel });
```

- Use `validate` for input checks.

## Inquirer Package — (Most Powerful for Complex Input)

> [🔗 GitHub: https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

### 📦 Install

```bash
npm install inquirer
```

### 🔹 Basic Example

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

### 🔹 Advanced Types

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

### 🔹 Conditional Questions

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

### ✅ Best Practices

| Tip                                    | Why                      |
| -------------------------------------- | ------------------------ |
| Use `when`                             | For conditional logic    |
| Use `validate`                         | To enforce input formats |
| Group questions logically              | Easier UX                |
| Use `async/await` with inquirer.prompt | Cleaner code             |
| Combine with `chalk` for color output  | Improves UX              |

### 🔚 Final Advice

| Tool            | Use When                                                     |
| --------------- | ------------------------------------------------------------ |
| `process.stdin` | You need **low-level**, raw stream-based input               |
| `prompts`       | You want a **lightweight**, async/await CLI                  |
| `inquirer`      | You want **rich CLI UX**: lists, checkboxes, dynamic prompts |

> 🧠 Bonus Tip: Combine `inquirer`, `chalk`, and `commander` to build a **beautiful CLI** tool.
