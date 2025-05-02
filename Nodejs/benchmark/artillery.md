# 🚀 Step-by-Step Guide to Master Artillery for Node.js

## ✅ 1. **Install Artillery**

Install globally:

```bash
npm install -g artillery
```

Or locally in your project:

```bash
npm install --save-dev artillery
```

Verify:

```bash
artillery --version
```

---

## ✅ 2. **Setup a Node.js HTTP Server for Testing**

Here’s a basic server:

```js
// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from /api" }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
```

Run it:

```bash
node server.js
```

---

## ✅ 3. **Create Your First Test Script**

Create a file called `loadtest.yml`:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30
      arrivalRate: 5

scenarios:
  - flow:
      - get:
          url: "/api"
```

📌 Explanation:

- **`target`**: The base URL of your server.
- **`phases`**: Simulates load (5 users/sec for 30s).
- **`scenarios`**: Defines user behavior, e.g., calling `GET /api`.

---

## ✅ 4. **Run the Load Test**

```bash
artillery run loadtest.yml
```

You'll get output like:

```
Scenarios launched: 150
Scenarios completed: 150
Requests completed: 150
RPS: 5.00
Latency: min 5 ms, max 25 ms, median 10 ms
```

---

## ✅ 5. **Add a POST Request Example**

```yaml
scenarios:
  - flow:
      - post:
          url: "/api"
          json:
            name: "Artillery"
```

And update your Node.js server to handle `POST`.

---

## ✅ 6. **Using Variables and Payloads**

Load dynamic data from a CSV:

**users.csv**

```csv
name
Alice
Bob
Charlie
```

**loadtest.yml**

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30
      arrivalRate: 5
  payload:
    path: "users.csv"
    fields:
      - name

scenarios:
  - flow:
      - post:
          url: "/api"
          json:
            name: "{{ name }}"
```

---

## ✅ 7. **Run and Generate a Report**

```bash
artillery run loadtest.yml -o report.json
artillery report report.json
```

This generates a nice HTML report (`report.html`) with graphs.

---

## ✅ 8. **Test WebSockets (Bonus)**

```yaml
config:
  target: "ws://localhost:8080"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - engine: "ws"
    flow:
      - send: { text: "hello" }
      - think: 1
      - send: { text: "world" }
```

---

## ✅ 9. **Run Artillery Programmatically (Node.js)**

```js
const artillery = require('artillery/core');

artillery.run({ config: {}, scenarios: [...] }, (err, result) => {
  if (err) throw err;
  console.log(result);
});
```

---

### ✅ 10. **Pro Tips**

- Use `artillery-plugin-expect` to add assertions.
- Use `artillery-plugin-metrics-by-endpoint` to break down metrics per route.
- Use multiple phases to simulate ramp-up, peak, and ramp-down.

---

### 📘 Summary Cheat Sheet

| Feature        | How                                                                    |
| -------------- | ---------------------------------------------------------------------- |
| Install        | `npm install -g artillery`                                             |
| Run test       | `artillery run loadtest.yml`                                           |
| Use payload    | Add `payload:` config and CSV file                                     |
| Save report    | `artillery run loadtest.yml -o out.json` + `artillery report out.json` |
| WebSocket test | Set `engine: "ws"` and use `send`                                      |

Great! Here's how to build a **realistic test plan with authentication and spike load testing** using **Artillery** to simulate real-world user behavior in a **Node.js** app.

---

## ✅ Scenario: Realistic Test Plan (Auth + Spike Load)

### 🧠 Goal

1. Authenticate users via `POST /login`
2. Use token to access `GET /dashboard`
3. Simulate a spike: ramp-up → burst → cool-down

### 🔐 Step 1: Sample Node.js Auth Server (JWT)

Here's a simple Express server for this test:

```js
// server.js
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const SECRET = "secret";

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Missing username");
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/dashboard", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send("No token");

  try {
    jwt.verify(auth.split(" ")[1], SECRET);
    res.json({ data: "Protected dashboard data" });
  } catch (e) {
    res.status(403).send("Invalid token");
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

Run:

```bash
node server.js
```

---

### 📄 Step 2: Create Payload File `users.csv`

```csv
username
john
alice
maria
```

---

### ⚙️ Step 3: Create Artillery Test Plan (`realistic.yml`)

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 30 # Warm-up
      arrivalRate: 5
    - duration: 15 # Spike
      arrivalRate: 50
    - duration: 30 # Cool-down
      arrivalRate: 5

  payload:
    path: "users.csv"
    fields:
      - username

  plugins:
    expect: {}

scenarios:
  - name: Authenticated Dashboard Access
    flow:
      - post:
          url: "/login"
          json:
            username: "{{ username }}"
          capture:
            json: "$.token"
            as: "authToken"

      - get:
          url: "/dashboard"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
```

---

### ▶️ Step 4: Run the Load Test

```bash
artillery run realistic.yml -o auth-test.json
```

---

### 📊 Step 5: Generate HTML Report

```bash
artillery report auth-test.json
```

Open `report.html` to visualize:

- RPS (requests per second)
- Latency trends
- Errors (401s, 403s if tokens fail)

---

## 📌 Tips for Realism

| Idea                    | How                                                 |
| ----------------------- | --------------------------------------------------- |
| Add delay between steps | Use `think: X` between steps to simulate user pause |
| Vary request payloads   | Use CSV or inline variables (`{{ name }}`)          |
| Add random paths        | Use `function` or `random` plugins                  |
| Test WebSockets         | Add `engine: "ws"` and simulate chat/messages       |
