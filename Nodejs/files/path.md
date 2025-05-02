## 7. Node.js `path` Module

✅ The `path` module gives you **cross-platform** (Windows, Linux, Mac) ways to handle file/directory paths properly.

```javascript
const path = require("path");
```

### 1. **Basic but Critical Functions**

| Function          | Purpose                    |
| :---------------- | :------------------------- |
| `path.join()`     | Join path segments safely  |
| `path.resolve()`  | Resolve full absolute path |
| `path.basename()` | Get filename               |
| `path.dirname()`  | Get directory name         |
| `path.extname()`  | Get file extension         |

---

### 2. **path.join() — Safely Build Paths**

**Example:**

```javascript
const fullPath = path.join("folder", "subfolder", "file.txt");
console.log(fullPath);
// On Linux/Mac ➔ folder/subfolder/file.txt
// On Windows ➔ folder\subfolder\file.txt
```

✅ Automatically inserts the correct `/` or `\` depending on the OS.

---

### 3. **path.resolve() — Build Absolute Paths**

```javascript
const fullPath = path.resolve("folder", "file.txt");
console.log(fullPath);
// Outputs: /Users/yourname/project/folder/file.txt
```

- `resolve()` **starts from current working directory (cwd)**.
- `resolve()` is **smarter**: it handles `..` (parent folders).

Example:

```javascript
const x = path.resolve("a", "..", "b", "file.txt");
console.log(x);
// Means: from a's parent ➔ go into b ➔ file.txt
```

---

### 4. **path.basename() — Get the filename only**

```javascript
const fileName = path.basename("/folder/subfolder/file.txt");
console.log(fileName);
// file.txt
```

You can also **remove the extension**:

```javascript
const name = path.basename("/folder/subfolder/file.txt", ".txt");
console.log(name);
// file
```

---

### 5. **path.dirname() — Get the directory name**

```javascript
const dirName = path.dirname("/folder/subfolder/file.txt");
console.log(dirName);
// /folder/subfolder
```

---

### 6. **path.extname() — Get file extension**

```javascript
const ext = path.extname("/folder/subfolder/file.txt");
console.log(ext);
// .txt
```

✅ Useful to filter files: `.jpg`, `.png`, `.pdf`, etc.

---

### 7. **path.parse() and path.format() — Full Object Control**

#### a. parse()

```javascript
const parsed = path.parse("/folder/subfolder/file.txt");
console.log(parsed);
/*
{
  root: '/',
  dir: '/folder/subfolder',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/
```

✅ Breaks a full path into parts!

---

#### b. format()

```javascript
const formatted = path.format({
  dir: "/folder/subfolder",
  name: "file",
  ext: ".txt",
});
console.log(formatted);
// /folder/subfolder/file.txt
```

✅ Build a path from an object.

---

### 8. **Cross-Platform Differences (Important)**

| Path                     | Windows Example | Linux Example |
| :----------------------- | :-------------- | :------------ |
| separator                | `\`             | `/`           |
| delimiter (PATH env var) | `;`             | `:`           |

```javascript
console.log(path.sep); // \ (Windows) OR / (Linux)
console.log(path.delimiter); // ; (Windows) OR : (Linux)
```

✅ Good when handling environment variables like `PATH`.

### 9. **Relative vs Absolute Paths**

| Path Type | Example                      |
| :-------- | :--------------------------- |
| Absolute  | `/Users/you/folder/file.txt` |
| Relative  | `./folder/file.txt`          |

**Check if path is absolute:**

```javascript
console.log(path.isAbsolute("/folder/file.txt")); // true
console.log(path.isAbsolute("folder/file.txt")); // false
```

### ✅ 10. `process.cwd()` — _Current Working Directory_

**Definition:**  
Returns the current working directory _from which the Node.js process was started._

#### 🔸 Example

```js
console.log("process.cwd():", process.cwd());
```

If you run the file from:

```bash
cd /Users/dev/my-project
node scripts/run.js
```

You'll get:

```
/Users/dev/my-project
```

Even though the script is in `scripts/run.js`, it returns **where the command was run**, not the file location.

---

### ✅ 11. `__dirname` — _Directory Name of Current Module_

**Definition:**  
Returns the absolute path of the directory _where the current file resides_.

#### 🔸 Example

```js
console.log("__dirname:", __dirname);
```

If your file is `/Users/dev/my-project/scripts/run.js`, the output is:

```
/Users/dev/my-project/scripts
```

#### 🔥 Real Use Case

```js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.json");
const data = fs.readFileSync(filePath, "utf-8");
console.log(data);
```

✅ `__dirname` ensures the path is always **relative to the module**, regardless of where the script was run from.

---

### ✅ 12. `__filename` — _Full Path of Current File_

**Definition:**  
Gives the absolute file path of the **current module**.

#### 🔸 Example

```js
console.log("__filename:", __filename);
```

Output:

```
/Users/dev/my-project/scripts/run.js
```

This is useful when:

- Logging from deep inside a module
- Dynamically loading sibling modules

---

### 🔄 Differences and Comparison

| Feature         | `process.cwd()`                    | `__dirname`                       | `__filename`                       |
| --------------- | ---------------------------------- | --------------------------------- | ---------------------------------- |
| Meaning         | Where Node.js was **invoked from** | Where the **current file lives**  | Full **absolute path of the file** |
| Context         | Dynamic, depends on CLI location   | Static to the file                | Static to the file                 |
| Common use case | Config resolution, CLI tools       | File operations, relative modules | Logging, dynamic imports           |

### 🧠 Best Practices

#### ✅ When to Use What?

| Situation                                            | Use                                   |
| ---------------------------------------------------- | ------------------------------------- |
| Accessing a config relative to CLI location          | `process.cwd()`                       |
| Reading a file from the current file’s folder        | `__dirname`                           |
| Debugging or logging with full file context          | `__filename`                          |
| Building CLI tools with dynamic paths                | `path.resolve(process.cwd(), 'file')` |
| Creating relative import paths (avoid brittle `../`) | `path.join(__dirname, 'sub/file.js')` |

#### ✨ Advanced Example: Load Config Flexible

Advance Topics

```js
// load-config.js
const path = require("path");
const fs = require("fs");

function loadConfig(filename = "app.config.json") {
  const configPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(configPath)) throw new Error("Config not found");
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

module.exports = loadConfig;
```

This lets users run:

```bash
node app.js --config=my.custom.json
```

And `loadConfig()` still loads the file **from where the user is running**, not from deep inside a module.

### ⚙️ Compatibility: ESM Modules

In ESM (`.mjs` or `"type": "module"` in `package.json`), `__dirname` and `__filename` are **not available**. You must do this:

```js
// ESM alternative to __dirname and __filename
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

#### 🧠 My Advice

- Use `__dirname` when your module needs stable local file access (like templates, JSON, etc.)
- Use `process.cwd()` for **user-defined context**, especially in CLI tools and app entry points.
- Avoid hardcoded `../../` paths — use `path.join(__dirname, ...)` instead.
- Don't use `__filename` unnecessarily — use it for logging or introspection.

### 10. **Best Practice: Always Use path.join() or path.resolve()**

❌ Bad:

```javascript
const filePath = __dirname + "/folder/file.txt";
// Breaks on Windows
```

✅ Good:

```javascript
const filePath = path.join(__dirname, "folder", "file.txt");
```

✅ 100% portable between Linux, Mac, and Windows!
