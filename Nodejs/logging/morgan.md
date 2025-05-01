# 🧠 What is Morgan?

Morgan is just a **middleware** for Express that **logs HTTP requests**.

**Every time** someone hits your server (GET, POST, etc.), Morgan logs the request info like:

- method (GET, POST)
- url
- status code (200, 404, 500)
- response time

**Why Morgan?**

- Understand incoming traffic
- Debug easily
- Monitor performance
- Create audit trails

---

## 📦 Install Morgan

```bash
npm install morgan
```

---

## ✨ 1. Basic Usage (Built-in Formats)

In `app.js`:

```js
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(morgan("dev")); // Tiny colored logs

app.get("/", (req, res) => {
  res.send("Hello Morgan!");
});

app.listen(3000, () => console.log("Server started"));
```

Now if you hit `/`, you see:

```
GET / 200 5.123 ms - 13
```

---

## ✨ 2. Morgan Predefined Formats

Morgan has **5 built-in formats**:

| Name       | Description                                       |
| ---------- | ------------------------------------------------- |
| `combined` | Apache style logs, **recommended for production** |
| `common`   | Shorter version of combined                       |
| `dev`      | Colored concise output for **development**        |
| `short`    | Short output, less info                           |
| `tiny`     | Super minimal (method, url, status, time)         |

Example:

```js
app.use(morgan("combined"));
```

> **Tip**: Use `dev` in local dev and `combined` in production.

---

## ✨ 3. Custom Morgan Tokens

You can **define your own tokens**!

```js
morgan.token("id", (req) => req.id);
```

Now use it:

```js
app.use(morgan(":id :method :url :status :response-time ms"));
```

Suppose you attach a unique `id` to each request:

```js
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(2, 10);
  next();
});
```

You'll see logs like:

```
e4fr9tp9 GET /about 200 4.293 ms
```

---

## ✨ 4. Logging to File Instead of Console

You can redirect Morgan logs to a file.

```js
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
```

Now all request logs will go to `access.log`.

---

## ✨ 5. Conditionally Enable Morgan Based on Environment

You don't want to log all the time, right?

```js
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: accessLogStream }));
}
```

Best practice!

---

## ✨ 6. Advanced: Send Morgan Logs to Winston

**Combine Morgan with Winston** for super powerful structured logs.

```js
const logger = require("./utils/logger"); // your winston logger

app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);
```

Now:

- `logger.http()` captures Morgan logs
- You get file rotation, JSON format, alerting etc.

---

## ✨ 7. Full Custom Morgan Format Example

Custom logs like:

```
[2025-05-01 10:32:14] IP: 192.168.0.5 GET /api/v1/users 200 5.32 ms
```

Setup:

```js
morgan.token("timestamp", () => new Date().toISOString());
morgan.token("remote-addr", (req) => req.ip);

app.use(
  morgan("[:timestamp] IP: :remote-addr :method :url :status :response-time ms")
);
```

---

## 🚀 Final Morgan Master Setup for Real-World App

```js
const express = require("express");
const morgan = require("morgan");
const logger = require("./utils/logger");
const fs = require("fs");
const path = require("path");

const app = express();
const logStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log"),
  { flags: "a" }
);

morgan.token("id", (req) => req.id || "-");
morgan.token("timestamp", () => new Date().toISOString());

const format =
  "[:timestamp] :id :method :url :status :res[content-length] - :response-time ms";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan(format, {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}
```

---

## ✍️ Summary Table

| Concept              | Key Line                                       |
| -------------------- | ---------------------------------------------- |
| Simple logging       | `app.use(morgan('dev'))`                       |
| Write to file        | `stream: accessLogStream`                      |
| Custom tokens        | `morgan.token('name', fn)`                     |
| Send to Winston      | `stream: { write: (msg) => logger.http(msg) }` |
| Env-specific logging | `if (NODE_ENV === 'development')`              |

---

## ⚡ Bonus

You can **completely disable Morgan** during tests by doing:

```js
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
```

---

Perfect. Let's now **master a real-world logging system** using **Morgan**, **Winston**, and **Express** — structured, readable logs for **both console and file**, across **dev and production** environments.

---

## 🧱 Directory Structure Example

```
project/
├── logs/
│   ├── access.log         <- Morgan logs
│   └── error.log          <- Winston error logs
├── utils/
│   └── logger.js          <- Winston setup
├── app.js                 <- Express app setup
└── package.json
```

---

## ⚙️ Step 1: Install Dependencies

```bash
npm install express morgan winston
```

---

## 🧠 Step 2: Setup Winston (`utils/logger.js`)

```js
const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),
  ],
});

module.exports = logger;
```

---

## 🔌 Step 3: Set Up Morgan with Winston in `app.js`

```js
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");

const app = express();

// --- Attach a unique ID to each request (optional but useful)
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(2, 10);
  next();
});

// --- Define custom Morgan tokens
morgan.token("id", (req) => req.id);
morgan.token("timestamp", () => new Date().toISOString());

// --- Create reusable format string
const format =
  "[:timestamp] :id :method :url :status :res[content-length] - :response-time ms";

// --- Log to file using Morgan (access logs)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  { flags: "a" }
);

// --- Conditionally use console vs file based on environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan(format, {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  // Optional: Still log raw access logs to file
  app.use(morgan(format, { stream: accessLogStream }));
}

// --- Routes
app.get("/", (req, res) => {
  res.send("Hello, logging world!");
});

// --- Simulate error logging
app.get("/error", (req, res, next) => {
  const error = new Error("Something broke");
  next(error);
});

// --- Error handler
app.use((err, req, res, next) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start Server
app.listen(3000, () => {
  logger.info("Server running on http://localhost:3000");
});
```

---

## 🧪 Sample Output

### ✅ Console (dev):

```
GET / 200 6.512 ms - 18
```

### 📁 `logs/access.log` (prod):

```
[2025-05-01T18:21:55.712Z] xy81klrz GET / 200 18 - 1.42 ms
```

### 📁 `logs/error.log`:

```
[2025-05-01T18:23:02.123Z] ERROR: [GET] /error - Something broke
```

---

## 🛡️ Production Best Practices

- `combined.log`: All logs from `info` level up
- `error.log`: Only `error` level logs
- Use tools like **PM2**, **Logrotate**, or **Elastic Stack** for log management
- Mask sensitive data from logs
- Use `req.headers['user-agent']` or `req.ip` in custom tokens for deeper analytics

---

## 🧩 Optional Improvements

- Add a `logger.stream` export so you can reuse with Morgan
- Add daily log rotation using [`winston-daily-rotate-file`](https://www.npmjs.com/package/winston-daily-rotate-file)
- Send logs to remote services (LogDNA, Datadog, Sentry)

---

## 🔁 Summary

| Feature            | Implementation                           |
| ------------------ | ---------------------------------------- |
| Console logs (dev) | `morgan('dev')`                          |
| File logs (prod)   | `fs.createWriteStream()` + Winston       |
| Error logging      | `logger.error()` inside error middleware |
| Custom tokens      | `morgan.token('name', fn)`               |
| Unified logging    | Morgan → Winston                         |
