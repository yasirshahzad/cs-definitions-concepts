# Modules

## **1. CommonJS Modules (CJS)**

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

### Module Caching

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

### Module Resolution Algorithm

When you write `require('foo')`, Node tries in this order:

1. Check if `'foo'` is a core module (like `fs`, `path`).
2. Check if there's a `node_modules/foo` directory with `package.json` main entry.
3. Look for `foo.js`, `foo.json`, `foo.node` files.
4. Move **up the directory tree** if not found (parent folders).

## **2. ECMAScript Modules (ESM)**

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

## **Key Differences**

| Feature            | CommonJS (`require`)        | ESM (`import`)                    |
| ------------------ | --------------------------- | --------------------------------- |
| Syntax             | `require`, `module.exports` | `import`, `export`                |
| Loading            | Synchronous                 | Asynchronous                      |
| Default in Node.js | Yes (without config)        | With `.mjs` or `"type": "module"` |
| Browser Support    | No (requires bundler)       | Yes (modern browsers)             |

---

## 🧱 Part 1: Creating Custom Modules in Node.js

Node.js uses the **CommonJS module system** (via `require()`/`module.exports`) and also supports **ES Modules** (via `import/export`).

### ✅ Step-by-Step: Creating a Custom Module

Let’s create a math utility module.

### 📁 File: `mathUtil.js`

```js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Export functions
module.exports = {
  add,
  multiply,
};
```

### 📁 File: `main.js`

```js
const math = require("./mathUtil");

console.log("Add:", math.add(2, 3)); // 5
console.log("Multiply:", math.multiply(4, 5)); // 20
```

> 🔁 Tip: You can also export a single function or class directly:

```js
module.exports = function greet(name) {
  return `Hello, ${name}`;
};
```

---

## 📦 Best Practices for Custom Modules

- Keep modules **small and single-purpose**.
- Use **clear exports**.
- Separate logic, config, DB, routes, etc. into **individual modules**.
- Use **`index.js`** to aggregate submodules when needed.

---

## 🌍 Part 2: The `global` Keyword in Node.js

### 🔎 What is `global`?

- In Node.js, `global` is like `window` in browsers — it provides global scope.
- Avoid using `global` too much; use it only for constants or one-time app-wide config.

### ✅ Example: Defining Global Variables

```js
// defineGlobal.js
global.appName = "MyApp";
global.logger = (msg) => console.log(`[${global.appName}] ${msg}`);
```

```js
// useGlobal.js
require("./defineGlobal");
global.logger("Server started..."); // [MyApp] Server started...
```

> ⚠️ **Avoid polluting** the global scope unnecessarily — use `global` sparingly and with purpose.

---

## 🛠️ Use Cases for `global` in Node.js

✅ Suitable for:

- Shared configuration values (`global.config`)
- Logging helpers (`global.logger`)
- Environment flags

❌ Avoid for:

- Large objects
- Mutable shared state
- Replacing dependency injection

---

## 💡 Bonus: How Modules Are Cached

When you `require()` a module, Node.js **caches** it — meaning if it's required again, it won’t re-run the file:

```js
require("./initOnce"); // runs and logs
require("./initOnce"); // silent (cached)
```

---

## 🧠 Summary

| Feature          | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `module.exports` | How you define what your module exposes               |
| `require()`      | How you import a module                               |
| `global`         | A special object for global variables (use sparingly) |
| Module cache     | Modules are cached after the first load               |
