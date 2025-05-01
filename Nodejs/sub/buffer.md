# 💾 What is a Buffer?

- A **Buffer** is like a **raw chunk of memory**.
- It stores **binary data** directly (without string encoding).

✅ Useful for files, TCP streams, image processing, video streaming, etc.

## 📦 Create a Buffer

## From a String

```javascript
const buf = Buffer.from("Hello World");
console.log(buf);
// Output: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
```

- Each character → binary.

---

### From an Array

```javascript
const buf = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf.toString());
// Output: Hello
```

- Array of bytes.

---

### Allocate Empty Buffer

```javascript
const buf = Buffer.alloc(10);
console.log(buf);
// Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

- 10 bytes, initialized to `0`.

---

## 🔎 Read/Write Buffer

## Write to Buffer

```javascript
const buf = Buffer.alloc(5);
buf.write("abc");
console.log(buf.toString());
// Output: abc
```

- Overwrites buffer memory.

---

## Read from Buffer

```javascript
const buf = Buffer.from("Hello");
console.log(buf[0]);
// Output: 72
console.log(String.fromCharCode(buf[0]));
// Output: H
```

- Buffers are **indexed** like arrays!

---

## 🧠 Important Buffer Methods

| Method                                                    | What it does                      |
| :-------------------------------------------------------- | :-------------------------------- |
| `toString([encoding])`                                    | Convert buffer to readable string |
| `toJSON()`                                                | Get JSON representation           |
| `slice(start, end)`                                       | Create a sub-buffer (no copy!)    |
| `copy(targetBuffer, targetStart, sourceStart, sourceEnd)` | Copy parts of buffer              |
| `concat([buf1, buf2])`                                    | Merge multiple buffers            |
| `length`                                                  | Size of buffer in bytes           |

---

## ⚡ Encoding Types

- `'utf8'` (default)
- `'ascii'`
- `'base64'`
- `'hex'`
- `'binary'`
- `'latin1'`

```javascript
const buf = Buffer.from("Hello", "utf8");
console.log(buf.toString("hex"));
// Output: 48656c6c6f
```

---

## Os Module

| Function                 | What it Gives (Detailed)                                                                                                                                |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `os.platform()`          | Operating System platform (`win32`, `linux`, `darwin` for macOS). Useful for OS-specific behavior.                                                      |
| `os.arch()`              | CPU architecture (`x64`, `arm`, `arm64`). Important for compiling binaries or optimizing code.                                                          |
| `os.cpus()`              | Detailed info about each CPU core (model, speed in MHz, times spent in user/system/idle). Helps in load balancing, threading decisions.                 |
| `os.totalmem()`          | Total system memory (RAM) in **bytes**. Must convert to MB/GB manually for readable formats.                                                            |
| `os.freemem()`           | Free/available system memory (RAM) in **bytes**. Helps monitor memory usage in real-time.                                                               |
| `os.uptime()`            | System uptime in **seconds**. Useful for monitoring server stability, scheduling restarts.                                                              |
| `os.hostname()`          | Machine's hostname (network identity). Often used for logging, networking, or configuration purposes.                                                   |
| `os.homedir()`           | Absolute path of the current user's home directory. Useful for storing user-specific files or config.                                                   |
| `os.networkInterfaces()` | Details about all network interfaces — IP addresses (IPv4/IPv6), MAC addresses, etc. Important for networking apps and discovering public/internal IPs. |
