# URL

## 📦 `url` Module Overview

There are two ways to work with URLs in Node.js:

### ✅ Legacy API (Node.js <= v10): `require('url')`

### ✅ Modern WHATWG API (Recommended): `new URL()`

---

## 🔧 Basic Import

```js
// Legacy API
const url = require("url");

// Modern API
const { URL } = require("url");
```

---

## ✅ 1. Parsing a URL (Modern API)

```js
const { URL } = require("url");

const myURL = new URL("https://example.com:8080/path/name?query=value#hash");

console.log(myURL.protocol); // 'https:'
console.log(myURL.hostname); // 'example.com'
console.log(myURL.port); // '8080'
console.log(myURL.pathname); // '/path/name'
console.log(myURL.search); // '?query=value'
console.log(myURL.hash); // '#hash'
```

---

## ✅ 2. Working with Query Parameters

```js
console.log(myURL.searchParams.get("query")); // 'value'

myURL.searchParams.append("lang", "en");
console.log(myURL.href); // Full URL with new query
```

---

## ✅ 3. Constructing a URL

```js
const myURL = new URL("/user?id=123", "https://myapp.com");

console.log(myURL.href); // 'https://myapp.com/user?id=123'
```

---

## ✅ 4. Legacy Parsing (`url.parse`) — Not Recommended

```js
const url = require("url");

const parsed = url.parse("https://example.com:8080/path?name=joe#top", true);

console.log(parsed.hostname); // 'example.com'
console.log(parsed.query.name); // 'joe'
```

---

## ✅ 5. Formatting a URL

```js
const { URL } = require("url");

const myURL = new URL("https://example.com");
myURL.pathname = "/docs";
myURL.searchParams.set("q", "nodejs");

console.log(myURL.toString()); // 'https://example.com/docs?q=nodejs'
```

---

## ✅ 6. Resolving Relative URLs (Legacy Only)

```js
const url = require("url");

const result = url.resolve("https://example.com/foo/", "../bar");
console.log(result); // 'https://example.com/bar'
```

> ⚠️ Deprecated in favor of the `URL` constructor with base.

---

## 🔥 Real-World Use Case: Handling URLs in an HTTP Server

```js
const http = require("http");
const { URL } = require("url");

http
  .createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);

    if (reqUrl.pathname === "/greet" && reqUrl.searchParams.has("name")) {
      const name = reqUrl.searchParams.get("name");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello, ${name}!`);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  })
  .listen(3000);

console.log("Server running on http://localhost:3000");
```

Test it:

```bash
curl http://localhost:3000/greet?name=Alice
```

---

## ✅ Summary: Most Useful Modern API Methods

| Method / Property      | Description                       |
| ---------------------- | --------------------------------- |
| `new URL(input, base)` | Parses or constructs a URL        |
| `url.href`             | Full URL string                   |
| `url.pathname`         | Path of the URL                   |
| `url.searchParams`     | URLSearchParams object            |
| `.get(name)`           | Get query param value             |
| `.append(name, value)` | Add a query param                 |
| `.toString()`          | Convert URL object back to string |

## 🧠 Project: **Query String Inspector + Short Link Generator**

### ✅ Features:

- Accepts a full URL from the user
- Parses it and displays:
  - Host
  - Pathname
  - Query parameters (as key/value pairs)
- Optionally lets user update/add/remove query parameters
- Returns a formatted short version of the URL

---

## 🛠 Step-by-Step Guide

### 1. Create `url-tool.js`

```js
const readline = require("readline");
const { URL } = require("url");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const input = await ask("Enter a full URL: ");

  try {
    const myURL = new URL(input);

    console.log("\n🔍 Parsed URL:");
    console.log("Protocol:", myURL.protocol);
    console.log("Host:", myURL.host);
    console.log("Pathname:", myURL.pathname);

    console.log("\n🧾 Query Parameters:");
    if ([...myURL.searchParams].length === 0) {
      console.log("  (No parameters found)");
    } else {
      myURL.searchParams.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    // Ask to update or add a new parameter
    const update = await ask("\nWant to add or update a query param? (y/n): ");
    if (update.toLowerCase() === "y") {
      const key = await ask("Enter param key: ");
      const value = await ask("Enter param value: ");
      myURL.searchParams.set(key, value);
    }

    // Ask to delete a parameter
    const del = await ask("Want to delete a param? (y/n): ");
    if (del.toLowerCase() === "y") {
      const key = await ask("Enter param key to delete: ");
      myURL.searchParams.delete(key);
    }

    console.log("\n🔗 Final URL:");
    console.log(myURL.toString());

    // Generate a "shortened" version (only domain and pathname)
    const short = myURL.origin + myURL.pathname;
    console.log("\n✂️ Short version:", short);
  } catch (err) {
    console.error("❌ Invalid URL:", err.message);
  }

  rl.close();
}

main();
```

---

## 🚀 How to Run

```bash
node url-tool.js
```

**Sample Input:**

```
https://mywebsite.com/search?query=nodejs&sort=desc
```

---

## 🧪 Practice Ideas:

- Support relative URLs + base URLs
- Export modified URL to a `.txt` file
- Accept multiple URLs and batch modify them
- Make a CLI utility with argument parsing (using `commander` or `yargs`)
