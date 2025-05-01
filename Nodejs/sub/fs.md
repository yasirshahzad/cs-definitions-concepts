## 8. File System

Let's take an **advanced deep dive** into the following Node.js tools:

1. `fs` (File System) module
2. `glob` open-source package
3. `fs-extra` (extended fs module)

### ✅ 1. `fs` (File System Module)

The `fs` module is a **core Node.js module** for interacting with the file system.

#### ✅ Key Concepts

- Synchronous (`fs.readFileSync`) vs. Asynchronous (`fs.readFile`)
- Streams (`fs.createReadStream`, `fs.createWriteStream`)
- Promises (`fs.promises` API)
- Permissions & file modes
- Recursive directory manipulation

#### ⚙️ Basic Examples

#### 🔸 Async Read/Write

```js
const fs = require("fs");

fs.writeFile("example.txt", "Hello World", (err) => {
  if (err) throw err;
  console.log("File written successfully.");
});

fs.readFile("example.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data); // Hello World
});
```

#### 🔸 Promises API (Recommended for modern code)

```js
const fs = require("fs/promises");

(async () => {
  await fs.writeFile("data.txt", "Hello via Promises!");
  const content = await fs.readFile("data.txt", "utf-8");
  console.log(content);
})();
```

#### 🔸 Streaming a large file

```js
const fs = require("fs");

const readStream = fs.createReadStream("largefile.txt", "utf8");
readStream.on("data", (chunk) => console.log("Chunk:", chunk));
```

#### 🔸 Watching for file changes

```js
fs.watch("example.txt", (eventType, filename) => {
  console.log(`${filename} changed: ${eventType}`);
});
```

#### 🔥 Advanced Use: Recursive Directory Traversal

```js
const fs = require("fs/promises");
const path = require("path");

async function listFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      await listFiles(res);
    } else {
      console.log(res);
    }
  }
}
```

### ✅ 2. `glob` (Open Source)

[`glob`](https://www.npmjs.com/package/glob) is a powerful pattern-matching utility for finding files using shell-like wildcards.

#### 📦 Installation

```bash
npm install glob
```

#### 🔸 Basic Example

```js
const glob = require("glob");

// Find all .js files in any subdirectory
glob("**/*.js", (err, files) => {
  console.log(files);
});
```

#### 🔸 Promisified Version (Recommended)

```js
const { promisify } = require("util");
const glob = promisify(require("glob"));

(async () => {
  const files = await glob("src/**/*.ts");
  console.log(files);
})();
```

#### ✅ Use Case: Delete all `.log` files in a directory

```js
const fs = require("fs/promises");
const glob = require("glob");
const { promisify } = require("util");

const globAsync = promisify(glob);

(async () => {
  const logFiles = await globAsync("logs/**/*.log");
  for (const file of logFiles) {
    await fs.unlink(file);
    console.log(`Deleted ${file}`);
  }
})();
```

#### 🧠 Best Practices with `glob`

- Use absolute paths (`cwd` option) for better reliability
- Use `ignore` option to skip `node_modules`, `.git`, etc.

```js
glob("**/*.js", { ignore: ["node_modules/**", "**/*.test.js"] }, callback);
```

### ✅ 3. `fs-extra` (Supercharged `fs`)

[`fs-extra`](https://www.npmjs.com/package/fs-extra) extends the native `fs` with additional utilities like `copy`, `move`, `ensureDir`, `remove`.

#### 📦 Installation

```bash
npm install fs-extra
```

#### 🔸 Copying files & folders

```js
const fs = require("fs-extra");

(async () => {
  await fs.copy("src/assets", "dist/assets");
  console.log("Assets copied!");
})();
```

#### 🔸 Ensuring directory existence

```js
await fs.ensureDir("logs"); // Like mkdir -p
```

#### 🔸 Writing and ensuring parent dir

```js
await fs.outputFile("output/data/info.txt", "Hello");
```

#### 🔸 Removing files or folders

```js
await fs.remove("build"); // Recursively removes directory
```

#### 🔸 JSON utilities

```js
const config = { port: 3000 };
await fs.writeJson("config.json", config);
const json = await fs.readJson("config.json");
```

### 🚀 Best Practices

#### 🧩 fs vs fs/promises vs fs-extra

| Task               | Recommended API | Why?                         |
| ------------------ | --------------- | ---------------------------- |
| Simple read/write  | `fs.promises`   | Native & promise-friendly    |
| Recursive ops      | `fs-extra`      | Has robust utility functions |
| Wildcard file find | `glob`          | Best for complex matching    |

#### 🧠 Tips

- Use `fs.promises` or `fs-extra` instead of callbacks for cleaner async/await logic.
- Wrap `fs.watch` with debounce to avoid frequent triggering.
- Use `fs.createReadStream` / `createWriteStream` for large file performance.
- Avoid blocking sync calls like `fs.readFileSync` in production.
- Handle file permissions using `fs.chmod`, `fs.access`, etc.

### 💡 Real-World Use Case

Here's an advanced script that:

- Finds all `.json` files in a `data/` directory
- Backs them up to `backups/YYYY-MM-DD`
- Removes the originals

```js
const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");
const { promisify } = require("util");

const globAsync = promisify(glob);

(async () => {
  const date = new Date().toISOString().slice(0, 10);
  const backupDir = path.join("backups", date);
  await fs.ensureDir(backupDir);

  const jsonFiles = await globAsync("data/**/*.json");
  for (const file of jsonFiles) {
    const dest = path.join(backupDir, path.basename(file));
    await fs.move(file, dest);
    console.log(`Moved ${file} -> ${dest}`);
  }
})();
```
