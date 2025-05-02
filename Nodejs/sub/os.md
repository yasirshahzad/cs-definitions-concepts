Sure! The `os` module in Node.js provides a way to interact with the operating system. It allows you to retrieve system-related information such as hostname, platform, CPU architecture, memory usage, and more.

Below is a **comprehensive list of the most commonly used `os` module APIs** with **code examples** for each:

---

## ✅ 1. `os.hostname()`

Returns the hostname of the operating system.

```js
const os = require("os");
console.log("Hostname:", os.hostname());
```

---

## ✅ 2. `os.platform()`

Returns the platform (e.g., `'linux'`, `'darwin'`, `'win32'`).

```js
console.log("Platform:", os.platform());
```

---

## ✅ 3. `os.arch()`

Returns the CPU architecture (`'x64'`, `'arm'`, etc.).

```js
console.log("Architecture:", os.arch());
```

---

## ✅ 4. `os.cpus()`

Returns an array of objects containing information about each logical CPU core.

```js
console.log("CPU Info:", os.cpus());
```

---

## ✅ 5. `os.totalmem()`

Returns the total amount of system memory in bytes.

```js
console.log("Total Memory:", os.totalmem(), "bytes");
```

---

## ✅ 6. `os.freemem()`

Returns the amount of free system memory in bytes.

```js
console.log("Free Memory:", os.freemem(), "bytes");
```

---

## ✅ 7. `os.uptime()`

Returns the system uptime in seconds.

```js
console.log("System Uptime:", os.uptime(), "seconds");
```

---

## ✅ 8. `os.userInfo()`

Returns information about the current user.

```js
console.log("User Info:", os.userInfo());
```

---

## ✅ 9. `os.homedir()`

Returns the home directory of the current user.

```js
console.log("Home Directory:", os.homedir());
```

---

## ✅ 10. `os.tmpdir()`

Returns the operating system's default directory for temporary files.

```js
console.log("Temp Directory:", os.tmpdir());
```

---

## ✅ 11. `os.networkInterfaces()`

Returns a list of network interfaces.

```js
console.log("Network Interfaces:", os.networkInterfaces());
```

---

## ✅ 12. `os.type()`

Returns the operating system name (`'Linux'`, `'Darwin'`, `'Windows_NT'`).

```js
console.log("OS Type:", os.type());
```

---

## ✅ 13. `os.endianness()`

Returns the endianness of the CPU (`'BE'` or `'LE'`).

```js
console.log("Endianness:", os.endianness());
```

---

## Sample Use Case: System Summary Tool

```js
const os = require("os");

function getSystemSummary() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
    freeMemory: `${(os.freemem() / 1024 ** 3).toFixed(2)} GB`,
    uptime: `${(os.uptime() / 60).toFixed(2)} minutes`,
    cpuCount: os.cpus().length,
    homeDir: os.homedir(),
    tempDir: os.tmpdir(),
    network: os.networkInterfaces(),
  };
}

console.log(getSystemSummary());
```
