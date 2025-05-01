# 🧠 **What is Integration Testing?**

Integration testing ensures **multiple units/components** (e.g., routes, middleware, database interactions) **work together correctly**.

You test things like:

- Routes and middleware together
- Controllers and services together
- Database integration with API endpoints

## 🧪 1. **Integration Testing Setup with Supertest & Jest**

### Example Project Structure

```
project/
├── src/
│   ├── app.ts            <-- Express App (no server.listen)
│   ├── server.ts         <-- Starts server
│   ├── routes/
│   ├── controllers/
│   └── models/
├── tests/
│   └── users.int.test.ts <-- Integration test
├── jest.config.js
└── package.json
```

---

## 🔧 2. **Express App (`app.ts`)**

```ts
// src/app.ts
import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

export default app;
```

## 🚀 3. **Server File (`server.ts`)**

```ts
// src/server.ts
import app from "./app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🧪 4. **Integration Test Example**

### ✅ Goal: Test `/api/users` POST endpoint

```ts
// tests/users.int.test.ts
import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/User"; // Mongoose model

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "John",
      email: "john@example.com",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("John");
  });
});
```

## 🧠 5. **Integration Testing Techniques**

| Technique                             | Example                      |
| ------------------------------------- | ---------------------------- |
| **Test with real DB (e.g., MongoDB)** | Best for integration realism |
| **Clear DB before/after**             | Use `beforeEach`/`afterEach` |
| **Use `supertest` for HTTP**          | Full HTTP request simulation |
| **Mock external services**            | Don't test 3rd-party APIs    |
| **Test happy and sad paths**          | 2xx, 4xx, 5xx                |

## ✅ 6. **Best Practices**

1. **Do not start the server** – use the Express `app` directly.
2. **Reset DB before each test** – keep tests isolated.
3. **Write test for both success and failure cases**.
4. **Avoid mocking your own DB in integration tests.**
5. **Use a test-specific database** (e.g., `testdb`).
6. **Use `supertest` for real HTTP simulation.**
7. **Group related tests using `describe()`** blocks.
8. **Keep fast feedback loop** – avoid long setups.

## ✅ 7. **Rules of Thumb**

| Rule                                                | Why                                 |
| --------------------------------------------------- | ----------------------------------- |
| Keep tests isolated                                 | Prevent flaky tests                 |
| Don’t mock the DB                                   | Integration means real DB           |
| Use in-memory DB (like MongoMemoryServer) for speed | Speeds up tests, no real disk write |
| Don’t use `app.listen()` in tests                   | Causes port conflicts               |
| Use `jest` globals (`beforeAll`, `afterEach`, etc.) | Clean setup/teardown                |

## ⚡ Bonus: MongoMemoryServer (Fast Tests)

```ts
// setup.ts (optional)
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
```

## ✅ **Advanced Integration Testing in Express (Jest + Supertest)**

We'll cover:

1. [Folder structure](#folder-structure)
2. [Auth route & JWT middleware](#auth-flow)
3. [Testing protected routes](#testing-protected-routes)
4. [Testing middleware (auth)](#testing-middleware-auth)
5. [Code coverage](#code-coverage)
6. [Best practices recap](#best-practices-recap)

---

### 📁 Folder Structure

```
project/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   └── userRoutes.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── models/
│   │   └── User.ts
│   └── utils/
│       └── jwt.ts
├── tests/
│   └── user.int.test.ts
├── jest.config.js
└── package.json
```

---

## 🔐 Auth Flow

### 🧱 JWT Middleware (`middleware/auth.ts`)

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
```

---

### 👤 User Model (`models/User.ts`)

```ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
});

export default mongoose.model("User", userSchema);
```

---

### 📦 JWT Utility (`utils/jwt.ts`)

```ts
import jwt from "jsonwebtoken";

export const generateToken = (user: { _id: string; email: string }) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1h",
    }
  );
};
```

---

### 🚦 Protected Route (`routes/userRoutes.ts`)

```ts
import express from "express";
import { authenticate } from "../middleware/auth";
import { getProfile } from "../controllers/userController";

const router = express.Router();

router.get("/profile", authenticate, getProfile);

export default router;
```

---

### 📋 Controller (`controllers/userController.ts`)

```ts
import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};
```

---

## 🔬 Testing Protected Routes

### 🧪 Integration Test (`tests/user.int.test.ts`)

```ts
import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/User";
import { generateToken } from "../src/utils/jwt";

describe("Protected Routes", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({
      name: "John",
      email: "john@example.com",
      password: "hashed",
    });
    userId = user._id.toString();
    token = generateToken(user);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("john@example.com");
  });

  it("should deny access without token", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should deny access with invalid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer wrong.token.here");

    expect(res.statusCode).toBe(403);
  });
});
```

## 📈 Code Coverage

### ✅ Configure Jest for Coverage in `package.json`

```json
"scripts": {
  "test": "jest --runInBand",
  "test:coverage": "jest --coverage"
},
```

### ✅ Run coverage

```bash
npm run test:coverage
```

### Output

```
--------------------|----------|----------|----------|----------|-------------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
--------------------|----------|----------|----------|----------|-------------------|
All files           |     95.2 |     88.9 |    90.91 |    95.2  |                   |
 middleware/auth.ts |      100 |      100 |      100 |     100  |                   |
 controllers/user...|    90.91 |    83.33 |    80.00 |    90.91 | 10                |
--------------------|----------|----------|----------|----------|-------------------|
```

> 🔥 Aim for **90%+ coverage**, especially on routes, middleware, and services.

## 🧠 Best Practices Recap

| Best Practice                                   | Why It Matters            |
| ----------------------------------------------- | ------------------------- |
| Test both **happy** and **failure** paths       | Full reliability          |
| **Don't mock DB** in integration                | Keep realism              |
| Use `beforeEach` and `afterEach`                | Isolate tests             |
| Validate **auth middleware** deeply             | Prevent security holes    |
| Use `supertest` only with `app`, not `listen()` | Avoid port issues         |
| Use `jest --coverage` regularly                 | Enforce test discipline   |
| Use `.env.test` file if needed                  | Keep test config isolated |
