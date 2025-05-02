# Event Emitter

`EventEmitter` is a class in Node.js that provides a way to **emit named events** and **register listeners** (callbacks) for those events — enabling **decoupled**, **asynchronous**, and **reactive** design.

> Think of it like a pub/sub system:
>
> - **Publisher** emits an event
> - **Subscribers** respond to it

## 🛠️ Basic Usage

```js
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("greet", (name) => {
  console.log(`Hello, ${name}`);
});

myEmitter.emit("greet", "Alice"); // Hello, Alice
```

## 📚 Core Methods

| Method                      | Description                          |
| --------------------------- | ------------------------------------ |
| `on(event, listener)`       | Registers a listener                 |
| `emit(event, [...args])`    | Emits an event                       |
| `once(event, listener)`     | Listener runs only once              |
| `off` / `removeListener`    | Removes a specific listener          |
| `removeAllListeners(event)` | Removes all listeners for that event |
| `listenerCount(event)`      | Gets count of listeners              |
| `eventNames()`              | Lists all registered event names     |

---

## 🚀 Advanced Usage

### 🔁 `once()`

```js
myEmitter.once("boot", () => {
  console.log("Booting system...");
});

myEmitter.emit("boot"); // logs
myEmitter.emit("boot"); // ignored
```

---

### 🛑 Removing Listeners

```js
function ping() {
  console.log("Pinged");
}

myEmitter.on("ping", ping);
myEmitter.off("ping", ping); // or .removeListener('ping', ping)
myEmitter.emit("ping"); // nothing happens
```

### 📦 Multiple Listeners

```js
myEmitter.on("data", (msg) => console.log(`1st: ${msg}`));
myEmitter.on("data", (msg) => console.log(`2nd: ${msg}`));

myEmitter.emit("data", "Hello");

// Output:
// 1st: Hello
// 2nd: Hello
```

Listeners run in the **order** they are registered.

### 📦 Practical Use Case, _Chat App Simulation_

```js
class Chat extends EventEmitter {
  sendMessage(user, message) {
    this.emit("message", { user, message });
  }
}

const chat = new Chat();

chat.on("message", ({ user, message }) => {
  console.log(`[${user}] says: ${message}`);
});

chat.sendMessage("John", "Hello!");
```

### ⚠️ Warning: Max Listeners Limit

To prevent memory leaks, Node sets a **default max listener limit of 10**.

```js
myEmitter.setMaxListeners(20); // Customize it
```

Or increase globally:

```js
require("events").defaultMaxListeners = 20;
```

If exceeded, you'll see a warning:

```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected
```

## Best Practices

### ✅ 1. **Always Handle Errors**

```js
myEmitter.on("error", (err) => {
  console.error("Error caught:", err);
});

myEmitter.emit("error", new Error("Oops"));
```

❗Uncaught `'error'` event = process crash.

### ✅ 2. **Use `once()` for Init Events**

Good for bootstrapping logic, initial config, or self-destructing handlers.

---

### ✅ 3. **Avoid Listener Leaks**

Clean up with `.off()` or `.removeAllListeners()` where needed:

```js
myEmitter.removeAllListeners("eventName");
```

### ✅ 4. **Use Custom Emitters (OOP)**

```js
class MyService extends EventEmitter {
  start() {
    this.emit("start");
  }
}
```

Keep your code **modular** and **decoupled** by **emitting from objects**, not directly.

## ⚙️ Under the Hood – How `EventEmitter` Works

- `emit(event, ...)` checks if listeners exist for the `event`.
- If yes, all callbacks are invoked **synchronously** in registration order.
- `once()` wraps your callback in an internal function that removes itself after first call.
