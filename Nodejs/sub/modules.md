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
