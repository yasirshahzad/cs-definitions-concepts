# Usage Techniques

## 🔹 1. Creating Baselines

### 🧠 What it means

Baseline testing measures **normal performance** (e.g., latency, RPS) under **expected user load**. It's your reference point.

### ✅ How to do it with Artillery:

Create a simple test plan `baseline.yml`:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60 # Run for 1 minute
      arrivalRate: 10 # 10 virtual users per second

scenarios:
  - flow:
      - get:
          url: "/api"
```

### ▶ Run the test:

```bash
artillery run baseline.yml -o baseline.json
artillery report baseline.json
```

### 🎯 Goal:

Use this to compare against future test runs — if latency increases later, you'll know when and why.

---

## 🔹 2. Simulating Real-World Load

### 🧠 What it means:

Mimic how real users behave — login, browse, wait, interact, etc.

### ✅ How to model it in Artillery:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 300
      arrivalRate: 5 # 5 new users/sec over 5 mins

scenarios:
  - name: Real User Journey
    flow:
      - post:
          url: "/login"
          json:
            username: "test"
            password: "1234"
          capture:
            json: "$.token"
            as: "authToken"
      - think: 2
      - get:
          url: "/dashboard"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - think: 5
      - get:
          url: "/profile"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

### 🧩 `think` delays simulate user pauses.

This makes the test more realistic than just hammering the server continuously.

---

## 🔹 3. Analyzing Latency, RPS, and Throughput

### 🧠 What it means:

Understanding how fast your server is and how well it handles requests.

### ✅ Metrics Artillery provides:

When you run:

```bash
artillery run test.yml -o result.json
artillery report result.json
```

You’ll get:

- `latency (min, max, median)` → Response time stats
- `rps` (requests per second)
- `throughput` (bytes/sec)
- `errors` (e.g. timeouts, 500s)

### ✅ Interpreting them:

| Metric     | What it tells you                         |
| ---------- | ----------------------------------------- |
| Latency    | How fast your server responds             |
| RPS        | How many requests/sec your app can handle |
| Errors     | If the app breaks under pressure          |
| Throughput | Total data served per second              |

Use this to **spot bottlenecks** and decide if you need to scale or optimize.

---

## 🔹 4. Integrating with CI/CD Pipelines

### 🧠 What it means

Automatically run performance tests during deployment (e.g., GitHub Actions, GitLab CI).

### ✅ Example with GitHub Actions

```yaml
# .github/workflows/loadtest.yml
name: Load Test

on: [push]

jobs:
  artillery:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Artillery
        run: npm install -g artillery

      - name: Run load test
        run: artillery run baseline.yml -o report.json

      - name: Fail if too many errors
        run: |
          ERRORS=$(jq '.aggregate.errors' report.json)
          if [ "$ERRORS" -gt 10 ]; then
            echo "Too many errors: $ERRORS"
            exit 1
          fi
```

### ✅ Why it's useful:

- Prevents bad deployments by catching performance regressions.
- Keeps response time in check every time you deploy.

---

## ✅ Summary Table

| Goal                      | Artillery Technique                               |
| ------------------------- | ------------------------------------------------- |
| Baseline Performance      | `arrivalRate: X` for Y seconds (low, steady load) |
| Realistic Load Simulation | Multi-step flows + `think` pauses                 |
| Performance Metrics       | `latency`, `rps`, `throughput`, `errors`          |
| CI/CD Integration         | Run with GitHub Actions, GitLab CI, Jenkins, etc  |
