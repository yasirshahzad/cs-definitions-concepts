# HTTP & Web Servers

## 1. HTTP Protocol Fundamentals

**Key Concepts:**

- **Client-Server Model**: HTTP is a request-response protocol between a client (browser) and server
- **Stateless**: Each request is independent (sessions are maintained via cookies/tokens)
- **Text-Based**: Human-readable format (though can transmit binary data)
- **Methods**:
  - `GET` - Retrieve data
  - `POST` - Create data
  - `PUT`/`PATCH` - Update data
  - `DELETE` - Remove data
  - `HEAD`/`OPTIONS` - Metadata/visibility

**Request/Response Structure:**

```text
GET /index.html HTTP/1.1       |       HTTP/1.1 200 OK
Host: example.com              |       Content-Type: text/html
User-Agent: Chrome             |       <html>...
```

## 2. HTTP Status Codes & Headers

**Important Status Codes:**

- **2xx Success**:
  - `200 OK` - Standard success
  - `201 Created` - Resource created (POST)
  - `204 No Content` - Success but no body (DELETE)
- **3xx Redirection**:
  - `301 Moved Permanently`
  - `304 Not Modified` (caching)
- **4xx Client Errors**:
  - `400 Bad Request` - Malformed request
  - `401 Unauthorized` - Needs authentication
  - `403 Forbidden` - No permission
  - `404 Not Found`
  - `429 Too Many Requests`
- **5xx Server Errors**:
  - `500 Internal Server Error`
  - `502 Bad Gateway`
  - `503 Service Unavailable`

**Key Headers:**

- **Request Headers**:
  - `Authorization`: Bearer tokens
  - `Content-Type`: application/json, multipart/form-data
  - `Accept`: What client can handle
  - `Cookie`, `User-Agent`
- **Response Headers**:
  - `Set-Cookie`
  - `Cache-Control`
  - `Location` (for redirects)
  - `Access-Control-Allow-Origin` (CORS)

## 3. REST API Design Principles

**Key Constraints:**

1. **Client-Server Separation**
2. **Statelessness** - Each request contains all needed context
3. **Cacheability** - Responses should define cacheability
4. **Uniform Interface**:
   - Resource identification in URIs (`/users/123`)
   - Resource manipulation through representations (JSON/XML)
   - Self-descriptive messages
   - HATEOAS (Hypermedia as the Engine of Application State) - Include links to related resources

**Best Practices:**

- Use nouns (not verbs) in endpoints:
  - ✅ `/users`
  - ❌ `/getUsers`
- Plural resource names: `/products` instead of `/product`
- Nest resources for hierarchy: `/users/5/orders`
- Filter/sort/paginate via query params:
  - `/users?role=admin&sort=-createdAt&limit=10`
- Version your API: `/v1/users`
- Use proper status codes
- Standardize error responses:
  ```json
  {
    "error": {
      "code": "invalid_email",
      "message": "The provided email is invalid"
    }
  }
  ```
- Security:
  - Always use HTTPS
  - Validate input
  - Rate limiting
  - CORS configuration

**Example RESTful Routes:**

```text
GET    /articles          - List all articles
POST   /articles          - Create new article
GET    /articles/:id      - Get specific article
PUT    /articles/:id      - Replace entire article
PATCH  /articles/:id      - Partial update
DELETE /articles/:id      - Delete article
```

## 4. Error Handling & Status Codes

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Route with error
app.get("/error", (req, res) => {
  throw new AppError("Something went wrong", 500);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});
```

## 5. Advanced Features: Pagination

```javascript
// Mock database with 100 posts
let allPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  content: `Content for post ${i + 1}`,
}));

// Paginated GET endpoint
app.get("/api/v2/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const results = {
    data: allPosts.slice(startIndex, startIndex + limit),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(allPosts.length / limit),
      totalItems: allPosts.length,
    },
    links: {
      next:
        page < Math.ceil(allPosts.length / limit)
          ? `/api/v2/posts?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/v2/posts?page=${page - 1}&limit=${limit}` : null,
    },
  };

  res.json(results);
});
```

**Sample Response:**

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 100
  },
  "links": {
    "next": "/api/v2/posts?page=3&limit=10",
    "prev": "/api/v2/posts?page=1&limit=10"
  }
}
```

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

## Bonus: Complete Project Structure

```text
project/
├── src/
│   ├── app.js          # Main app setup
│   ├── routes/         # Route definitions
│   ├── middleware/     # Custom middleware
│   ├── controllers/    # Route handlers
│   ├── models/         # Data models
│   └── utils/          # Helpers & utilities
├── package.json
└── .env                # Environment variables
```

Express.js is a critical skill for any Senior Node.js Developer. Let me help you master the key concepts with explanations and code snippets that will impress your interviewers.
