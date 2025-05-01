# Test Driven Development

## ✅ What is TDD?

**Test-Driven Development (TDD)** is a software development process that relies on the **"Red-Green-Refactor"** cycle:

1. **Red**: Write a failing test (it should fail because the functionality doesn't exist yet).
2. **Green**: Write minimal code to make the test pass.
3. **Refactor**: Improve the implementation without changing behavior.

## 🧠 TDD Workflow (Rule of Thumb)

```txt
Write test → Run test (fails) → Write code → Run test (passes) → Refactor
```

## 🧪 Sample Stack: Express.js + Jest + Supertest

We’ll use:

- `express` for routing
- `jest` for assertions
- `supertest` to simulate HTTP requests

## 🔧 Setup

Install dependencies:

```bash
npm install express
npm install --save-dev jest supertest
```

In `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

## 📁 Folder Structure

```
project/
├── app.js
├── routes/
│   └── user.js
├── controllers/
│   └── userController.js
├── tests/
│   └── user.test.js
```

## ✏️ Step-by-Step TDD in Practice

### 1. 🟥 Write Failing Test (Red)

**`tests/user.test.js`**:

```js
const request = require("supertest");
const app = require("../app");

describe("GET /users", () => {
  it("should return a list of users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([])); // default: empty array
  });
});
```

### 2. 🟩 Make Test Pass (Green)

**`app.js`**:

```js
const express = require("express");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

module.exports = app;
```

**`routes/user.js`**:

```js
const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

router.get("/", getUsers);

module.exports = router;
```

**`controllers/userController.js`**:

```js
exports.getUsers = (req, res) => {
  res.status(200).json([]); // placeholder
};
```

### 3. 🔁 Refactor

Move logic from controller to a service layer, add validations, etc.

## ✅ Techniques & Best Practices

### 1. **Write Tests First**

Always write tests before implementing features. It helps clarify requirements.

### 2. **Small Increments**

Write one small test case at a time. Don’t jump ahead.

### 3. **Isolate Side Effects**

Stub/mocks for DB calls or 3rd-party APIs using `jest.mock`.

### 4. **Use Factories or Fixtures**

Avoid repetitive test data. Use factories to generate consistent test input.

## 🔐 Example: Testing Auth Middleware

**`middleware/auth.js`**:

```js
module.exports = function (req, res, next) {
  const token = req.headers["authorization"];
  if (!token || token !== "Bearer valid-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
```

**Add to Route:**

```js
const auth = require("../middleware/auth");
router.get("/secure", auth, (req, res) => {
  res.json({ message: "Access granted" });
});
```

**Test:**

```js
describe("GET /users/secure", () => {
  it("should reject request without token", async () => {
    const res = await request(app).get("/users/secure");
    expect(res.statusCode).toBe(401);
  });

  it("should allow request with valid token", async () => {
    const res = await request(app)
      .get("/users/secure")
      .set("Authorization", "Bearer valid-token");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
  });
});
```

## 📈 Code Coverage

Track code coverage using Jest:

```bash
npx jest --coverage
```

Add to `package.json`:

```json
"scripts": {
  "test": "jest --coverage"
}
```

This ensures you cover:

- Controllers
- Middleware
- Routes
- Error handling

## 🧰 Advanced Tips

- ✅ Test both success and failure scenarios.
- ✅ Use descriptive test names.
- ✅ Use `describe` blocks to group tests by route/module.
- ✅ Run tests in watch mode (`jest --watch`).
- ✅ Use `.only` and `.skip` to focus during dev.

## 🧪 Test Helper: Factory Function

Create a test data factory:

```js
function createUserData(overrides = {}) {
  return {
    name: "Test User",
    email: "test@example.com",
    ...overrides,
  };
}
```

Use it:

```js
const user = createUserData({ email: "custom@example.com" });
```

## 📌 Summary

| Principle          | Tip                                              |
| ------------------ | ------------------------------------------------ |
| Red-Green-Refactor | Write failing test → Make it pass → Improve code |
| Write First        | Tests drive design clarity and correctness       |
| Use Supertest      | For real HTTP-like Express testing               |
| Mock Side Effects  | Avoid hitting real DBs or APIs                   |
| Track Coverage     | Use `jest --coverage`                            |
| Structure Tests    | Group logically using `describe()`               |
