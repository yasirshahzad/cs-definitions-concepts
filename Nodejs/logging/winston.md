# 🧠 Winston Mastery: Advanced Guide

## 🔧 1. Install Winston

```bash
npm install winston
```

---

## 📦 2. Basic Setup (Just to Ground You)

```js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // log levels: error, warn, info, http, verbose, debug, silly
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

logger.info("App started");
```

---

## 🚀 3. Logging Levels (Built-in)

Winston uses [npm logging levels](https://github.com/winstonjs/winston#logging-levels):

| Level   | Value |
| ------- | ----- |
| error   | 0     |
| warn    | 1     |
| info    | 2     |
| http    | 3     |
| verbose | 4     |
| debug   | 5     |
| silly   | 6     |

You can customize these too (shown later).

---

## 🎯 4. Create a Custom Logger (Best Practice)

### 🔁 `logger.js`

```js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

// Custom format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp(),
    errors({ stack: true }), // handles error stack traces
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
});

module.exports = logger;
```

### ✅ Usage:

```js
const logger = require("./logger");

logger.info("Server is running");
logger.error(new Error("Something broke"));
```

---

## 📚 5. Log Rotation with `winston-daily-rotate-file`

### 🛠 Install:

```bash
npm install winston-daily-rotate-file
```

### 🔁 Add to Transports:

```js
const DailyRotateFile = require("winston-daily-rotate-file");

logger.add(
  new DailyRotateFile({
    filename: "logs/app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
  })
);
```

---

## 🔥 6. HTTP Request Logging (Express.js Integration)

```bash
npm install express morgan
```

```js
const express = require("express");
const morgan = require("morgan");
const logger = require("./logger");

const app = express();

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.get("/", (req, res) => {
  logger.info("Home route hit");
  res.send("Hello world");
});
```

---

## 🛠 7. Custom Levels (Optional)

```js
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const logger = createLogger({
  levels: customLevels.levels,
  format: combine(colorize(), timestamp(), customFormat),
  transports: [new transports.Console()],
});

logger.fatal("Fatal crash");
```

---

## 🔐 8. Logging Sensitive Info (Best Practice)

- Never log passwords, tokens, or PII.
- Use a custom sanitizer middleware:

```js
function sanitizeInput(input) {
  // Remove password/token fields
  if (input.password) input.password = "[REDACTED]";
  if (input.token) input.token = "[REDACTED]";
  return input;
}
```

---

## 🌐 9. Logging to External Services

### Option A: Log to ElasticSearch

```bash
npm install winston-elasticsearch
```

```js
const Elasticsearch = require("winston-elasticsearch");
const esTransport = new Elasticsearch({ level: "info" });
logger.add(esTransport);
```

### Option B: Log to Datadog, Sentry, etc. (via Winston transport wrappers)

---

## 🧪 10. Testing Logs in Jest

Mock the logger:

```js
jest.mock("./logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const logger = require("./logger");

expect(logger.info).toHaveBeenCalledWith("Some message");
```

---

## 📦 11. Full Example Use Case

In a real project structure:

```
src/
├── middlewares/
│   └── errorHandler.js
├── utils/
│   └── logger.js
├── app.js
```

**Middleware example:**

```js
module.exports = (err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};
```

---

## 📈 Bonus: JSON Logs for Production

```js
format: combine(timestamp(), errors({ stack: true }), format.json());
```

Useful with logging pipelines (e.g., ELK, AWS CloudWatch, Datadog).

---

## 🚀 Summary of What You Can Do with Winston

✅ Multi-level logging  
✅ Console + file + rotating logs  
✅ Exception + rejection handling  
✅ Integrate with Express.js  
✅ Sanitize sensitive data  
✅ External logging services  
✅ Structured JSON logs  
✅ Custom formats + colors  
✅ Testable log output  
✅ Scalable and production-grade

Here’s a **plug-and-play Winston logging setup** for a production-ready **Express.js app** — complete with file rotation, error handling middleware, HTTP logging, and exception/rejection capture.

---

## ✅ Step-by-Step Setup for a Real Project

### 🗂 Project Structure

```
your-app/
├── logs/
├── src/
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── package.json
```

---

## 📦 Step 1: Install Required Packages

```bash
npm install express winston winston-daily-rotate-file morgan
```

---

## 🧠 Step 2: Create `logger.js` (advanced + reusable)

### 📁 `src/utils/logger.js`

```js
const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const logDir = path.join(__dirname, "..", "..", "logs");

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "info",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),
    dailyRotateFileTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDir}/exceptions.log` }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: `${logDir}/rejections.log` }),
  ],
});

module.exports = logger;
```

---

## 🌐 Step 3: Setup Express with Morgan + Logger

### 📁 `src/app.js`

```js
const express = require("express");
const morgan = require("morgan");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// HTTP request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  logger.info("Root route accessed");
  res.send("Hello from Winston setup!");
});

// Route to simulate error
app.get("/error", () => {
  throw new Error("This is a test error");
});

// Error middleware (last)
app.use(errorHandler);

module.exports = app;
```

---

## 🔥 Step 4: Centralized Error Middleware

### 📁 `src/middlewares/errorHandler.js`

```js
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};
```

---

## 🚀 Step 5: Start Server

### 📁 `src/server.js`

```js
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
```

---

## ✅ Run the App

```bash
node src/server.js
```

Visit:

- `http://localhost:3000/` → normal log
- `http://localhost:3000/error` → test error logging

Logs will go to:

- Console (colored)
- `logs/YYYY-MM-DD.log`
- `logs/exceptions.log` (for `uncaughtException`)
- `logs/rejections.log` (for `unhandledRejection`)

---

## 🧪 Bonus: Simulate Crashes

To test exception & rejection logs:

```js
// Uncaught Exception
setTimeout(() => {
  throw new Error("Uncaught Exception test");
}, 3000);

// Unhandled Rejection
setTimeout(() => Promise.reject(new Error("Unhandled Rejection test")), 5000);
```

---

## 🧼 Tip: Ignore Logging in Tests

In `logger.js`:

```js
if (process.env.NODE_ENV === "test") {
  logger.transports.forEach((t) => (t.silent = true));
}
```
