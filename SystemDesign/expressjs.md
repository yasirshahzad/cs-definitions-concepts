# Mastering Express.js for Senior Node.js Developer Interviews

Express.js is a critical skill for any Senior Node.js Developer. Let me help you master the key concepts with explanations and code snippets that will impress your interviewers.

## Core Concepts to Master

### 1. Middleware Architecture

**Concept**: Express is built around middleware functions that have access to request, response, and the next middleware in the cycle.

```javascript
// Custom middleware example
const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
};

app.use(loggerMiddleware);

// Error handling middleware (note the 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

### 2. Routing System

**Concept**: Express provides a robust routing mechanism to handle different HTTP methods and URL patterns.

```javascript
// Basic routing
app.get("/users", (req, res) => {
  res.send("GET request to /users");
});

// Route parameters
app.get("/users/:userId", (req, res) => {
  res.send(`User ID: ${req.params.userId}`);
});

// Route chaining
app
  .route("/books")
  .get((req, res) => res.send("Get all books"))
  .post((req, res) => res.send("Add a book"))
  .put((req, res) => res.send("Update all books"));
```

### 3. Router Module (for modular applications)

**Concept**: The Express Router helps create modular, mountable route handlers.

```javascript
// In routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("User list"));
router.get("/:id", (req, res) => res.send(`User ${req.params.id}`));

module.exports = router;

// In main app.js
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);
```

### 4. Request/Response Handling

**Concept**: Understanding req/res objects is crucial for handling HTTP requests properly.

```javascript
app.post("/submit", (req, res) => {
  // Accessing request data
  const body = req.body; // Needs body-parser middleware
  const queryParam = req.query.sort;
  const headers = req.headers["user-agent"];

  // Setting response
  res
    .status(201)
    .set("X-Custom-Header", "value")
    .cookie("token", "abc123", { httpOnly: true })
    .json({ success: true, data: body });
});
```

### 5. Template Engines (for SSR)

**Concept**: Express can serve dynamic HTML using template engines.

```javascript
app.set("view engine", "pug"); // or ejs, handlebars

app.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.user,
  });
});
```

### 6. Error Handling

**Concept**: Proper error handling separates junior from senior developers.

```javascript
// Async error handling wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get(
  "/user/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err; // Will be caught by error handler
    }
    res.json(user);
  })
);

// Central error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});
```

### 7. Security Best Practices

**Concept**: Security is critical for senior developers to understand.

```javascript
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Basic security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const cors = require("cors");
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://yourotherdomain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 8. Performance Optimization

**Concept**: Senior developers need to optimize Express applications.

```javascript
// Compression middleware
const compression = require("compression");
app.use(compression());

// Response time header
const responseTime = require("response-time");
app.use(responseTime());

// Cluster mode for multi-core CPUs
if (cluster.isMaster) {
  const cpuCount = require("os").cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  // Express app initialization here
}
```

### 9. File Uploads

**Concept**: Handling file uploads is a common requirement.

```javascript
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

app.post("/upload", upload.single("avatar"), (req, res) => {
  // req.file is the 'avatar' file
  // req.body will hold the text fields
  res.json({ file: req.file, body: req.body });
});
```

### 10. WebSockets Integration

**Concept**: Real-time features are often needed in modern apps.

```javascript
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(`Echo: ${message}`);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Advanced Interview Questions to Prepare For

1. **How does Express middleware work under the hood?**

   - Discuss the concept of the middleware stack and how `next()` progresses through it.

2. **How would you structure a large Express application?**

   - Talk about modular routing, separation of concerns, and potentially using the MVC pattern.

3. **How do you handle authentication in Express?**

   - Discuss JWT, sessions, OAuth, and passport.js integration.

4. **What are some performance bottlenecks in Express and how would you address them?**

   - Cover synchronous middleware, blocking operations, and database query optimization.

5. **How would you implement rate limiting in Express?**

   - Discuss middleware like `express-rate-limit` and Redis-backed solutions.

6. **Explain the Express request lifecycle.**

   - Walk through from request entry to response, including middleware sequence.

7. **How do you ensure your Express app is secure?**

   - Cover Helmet, CSRF protection, input validation, and secure headers.

---
