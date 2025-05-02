# HTTP

## 🧱 1. **Create a Basic HTTP Server**

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

---

## 🔍 2. **Understand the `req` and `res` Objects**

### `req` (IncomingMessage)

- `.method` — GET, POST, etc.
- `.url` — Path + query string
- `.headers` — Object of request headers
- `.on('data')` / `.on('end')` — Read body stream (for POST data)

### `res` (ServerResponse)

- `.statusCode` — HTTP status code
- `.setHeader(name, value)` — Set HTTP headers
- `.write()` / `.end()` — Write response body

---

## 🗂️ 3. **Route Requests Manually**

```js
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Home Page</h1>");
  } else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});
```

---

## 📤 4. **Read POST Data (Body Parsing)**

```js
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/data") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("Received:", body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Data received" }));
    });
  }
});
```

---

## 🌐 5. **Serve Static Files**

```js
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  const ext = path.extname(filePath);
  const contentType =
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    }[ext] || "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});
```

---

## 🔐 6. **Handle Query Strings**

```js
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  if (parsedUrl.pathname === "/search") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ keyword: query.q }));
  }
});
```

---

## ⚡ 7. **Make Outgoing HTTP Requests**

Using built-in `http` or `https` module:

```js
const https = require("https");

https.get("https://jsonplaceholder.typicode.com/todos/1", (res) => {
  let data = "";

  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log(JSON.parse(data));
  });
});
```

---

## 📌 Summary of Key Concepts

| Feature              | How it Works                                   |
| -------------------- | ---------------------------------------------- |
| Create server        | `http.createServer()`                          |
| Set status & headers | `res.writeHead(status, headers)`               |
| Parse body           | Listen to `req.on('data')` and `req.on('end')` |
| Serve files          | Use `fs.readFile` with content type            |
| Parse query params   | Use `url.parse(req.url, true)`                 |
| Outgoing requests    | Use `http.get()` or `https.get()`              |
