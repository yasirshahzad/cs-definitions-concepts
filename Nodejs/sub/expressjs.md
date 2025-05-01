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

## 3. Express.js Framework

**Core Concepts:**

```javascript
const express = require("express");
const app = express();
```

**Middleware:**

```javascript
// Application-level middleware
app.use(express.json()); // Body parser
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next(); // Critical for chaining
});

// Router-level middleware
const router = express.Router();
router.use(myMiddleware);

// Error-handling middleware (4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

**Routing:**

```javascript
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route parameters
app.get('/users/:userId', (req, res) => {
  res.send(req.params.userId);
});

// Route chaining
app.route('/book')
  .get((req, res) => { ... })
  .post((req, res) => { ... });

// Modular routes
const userRouter = require('./routes/users');
app.use('/users', userRouter);
```

## 4. REST API Design Principles

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

## 1. Basic Express Server with Routes

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

// Basic route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Route with parameters
app.get("/greet/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

// Route with query parameters
app.get("/search", (req, res) => {
  res.json({
    query: req.query.q,
    page: req.query.page || 1,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 2. Middleware for Logging & Auth

```javascript
// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date()}`);
  next();
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === "secret-token") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Protected route
app.get("/admin", authMiddleware, (req, res) => {
  res.send("Admin Dashboard");
});
```

## 3. REST API for Blog Posts

```javascript
let posts = [{ id: 1, title: "First Post", content: "Hello World" }];

app.use(express.json());

// GET all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// GET single post
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// POST create new post
app.post("/api/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    ...req.body,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT update post
app.put("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });

  Object.assign(post, req.body);
  res.json(post);
});

// DELETE post
app.delete("/api/posts/:id", (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  res.status(204).end();
});
```

## 4. Testing with Postman/cURL

**cURL Examples:**

```bash
# GET all posts
curl http://localhost:3000/api/posts

# GET single post
curl http://localhost:3000/api/posts/1

# POST new post
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Some content"}' \
  http://localhost:3000/api/posts

# Authenticated request
curl -H "Authorization: secret-token" \
  http://localhost:3000/admin
```

**Postman Tips:**

1. Set `Content-Type: application/json` header
2. For POST/PUT requests, send raw JSON body
3. Save requests in collections
4. Use environment variables for base URLs

---

## 5. Error Handling & Status Codes

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

## 6. Advanced Features: Pagination

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
