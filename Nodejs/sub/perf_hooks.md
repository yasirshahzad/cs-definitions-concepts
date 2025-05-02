# 🔧 What is `perf_hooks`?

`perf_hooks` is a Node.js module that provides an API to measure performance with **nanosecond-level precision** using the **Performance Timing API**, similar to the browser.

> You must import it:

```js
const { performance, PerformanceObserver } = require("perf_hooks");
```

---

## 🧪 Basic Usage

### ✅ 1. `performance.now()`

```js
const { performance } = require("perf_hooks");

const start = performance.now();

for (let i = 0; i < 1e6; i++) {
  Math.sqrt(i);
}

const end = performance.now();
console.log(`Execution time: ${end - start}ms`);
```

> Accurate to microseconds (e.g., `12.305799ms`)

---

## 📌 2. `PerformanceObserver` – Observe custom performance entries

```js
const { performance, PerformanceObserver } = require("perf_hooks");

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks(); // Cleanup
});
obs.observe({ entryTypes: ["measure"] });

performance.mark("start-task");
// Some code
for (let i = 0; i < 1e7; i++) {}
performance.mark("end-task");

performance.measure("Loop Time", "start-task", "end-task");
```

> This gives detailed measurements that can be observed/recorded.

---

## 📌 3. `performance.measure()` for Named Benchmarks

```js
performance.mark("A");
setTimeout(() => {
  performance.mark("B");
  performance.measure("timeout duration", "A", "B");
}, 200);
```

---

## 📌 4. Measure Function Execution Time

Reusable wrapper:

```js
function measure(label, fn) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(3)}ms`);
}

measure("Square Roots", () => {
  for (let i = 0; i < 1e6; i++) Math.sqrt(i);
});
```

---

## 📌 5. Using `performance.timerify()` for async functions

Measure how long async functions actually take:

```js
const { performance, PerformanceObserver, timerify } = require("perf_hooks");

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries());
});
obs.observe({ entryTypes: ["function"] });

const asyncFunc = timerify(async function fetchData() {
  return new Promise((res) => setTimeout(res, 500));
});

asyncFunc();
```

> `timerify()` can wrap async functions for profiling.

---

## 📌 6. `performance.nodeTiming`

Get timings of Node process itself (boot time, module load, etc.)

```js
console.log(performance.nodeTiming);
// {
//   nodeStart: 0,
//   v8Start: 2.58,
//   bootstrapComplete: 20.57,
//   ...
// }
```

---

## ✅ Summary: Mastery Checklist

| Task                                                          | Done |
| ------------------------------------------------------------- | ---- |
| Use `performance.now()` to time code blocks                   | ✅   |
| Use `performance.mark()` + `measure()` for labeled benchmarks | ✅   |
| Observe entries with `PerformanceObserver`                    | ✅   |
| Profile async functions with `timerify()`                     | ✅   |
| Access Node process performance data with `nodeTiming`        | ✅   |
