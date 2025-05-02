# Net

## 📦 How to Import the Module

```js
const net = require("net");
```

---

## ✅ Common Use Cases

- Building **TCP servers**
- Writing **TCP clients**
- Socket communication (like chat, game, message queue apps)
- IPC (Inter-Process Communication)

---

## 🔧 1. Creating a TCP Server

### API

- `net.createServer([options][, connectionListener])`

### Example

```js
const net = require("net");

const server = net.createServer((socket) => {
  console.log("New client connected");

  socket.write("Hello from server!\n");

  socket.on("data", (data) => {
    console.log("Received from client:", data.toString());
    socket.write(`You said: ${data}`);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
```

---

## 🔧 2. Creating a TCP Client

### API

- `net.createConnection(options[, connectionListener])`

### Example

```js
const net = require("net");

const client = net.createConnection({ port: 5000 }, () => {
  console.log("Connected to server");
  client.write("Hello from client!");
});

client.on("data", (data) => {
  console.log("Received from server:", data.toString());
});

client.on("end", () => {
  console.log("Disconnected from server");
});
```

---

## 🧠 Key Socket Events

On a `net.Socket` (used for both server and client):

| Event       | Description                               |
| ----------- | ----------------------------------------- |
| `'connect'` | When a connection is successfully made    |
| `'data'`    | When data is received                     |
| `'end'`     | When the other end signals end of message |
| `'close'`   | When the socket is fully closed           |
| `'error'`   | On connection or transmission error       |
| `'timeout'` | If a timeout is set and triggered         |

---

## 🔐 Optional: Setting a Timeout

```js
socket.setTimeout(10000); // 10 seconds

socket.on("timeout", () => {
  console.log("Socket timed out");
  socket.end();
});
```

---

## 📌 IPC (UNIX Domain Sockets / Named Pipes)

```js
// For UNIX (Linux/macOS)
const server = net.createServer((socket) => {
  socket.write("Hello via UNIX socket");
});
server.listen("/tmp/mysocket.sock");
```

---

## 🛠️ Bonus: Simple Chat Server (multi-client)

Would you like a simple **multi-client TCP chat app** using `net` to practice?

---

## 📚 Summary: Important Methods

| Method                   | Purpose                      |
| ------------------------ | ---------------------------- |
| `net.createServer()`     | Creates a new TCP server     |
| `server.listen(port)`    | Starts the server            |
| `net.createConnection()` | Connects to a TCP server     |
| `socket.write(data)`     | Sends data to the other side |
| `socket.end()`           | Closes the connection        |
| `socket.setTimeout(ms)`  | Sets inactivity timeout      |
| `socket.destroy()`       | Forcibly closes socket       |

Great! Here's a **mini-project** that will help you **master the `net` module** in Node.js:

---

## 🧠 Project: **TCP Chat Server (Multi-Client)**

### ✅ Features:

- Multiple clients can connect to the server
- Messages from one client are **broadcast to all others**
- Logs connection, disconnection, and messages
- Uses `net.createServer` and `net.Socket`

---

## 🛠 1. `chat-server.js`

```js
const net = require("net");

const clients = [];

const server = net.createServer((socket) => {
  console.log(
    "New client connected:",
    socket.remoteAddress + ":" + socket.remotePort
  );
  socket.write("Welcome to the chat server!\n");

  clients.push(socket);

  socket.on("data", (data) => {
    const message = data.toString().trim();

    // Broadcast to all other clients
    clients.forEach((client) => {
      if (client !== socket) {
        client.write(`Client ${socket.remotePort}: ${message}\n`);
      }
    });
  });

  socket.on("end", () => {
    console.log(`Client ${socket.remotePort} disconnected`);
    clients.splice(clients.indexOf(socket), 1);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(5000, () => {
  console.log("Chat server running on port 5000");
});
```

---

## 🛠 2. `chat-client.js`

```js
const net = require("net");
const readline = require("readline");

const client = net.createConnection({ port: 5000 }, () => {
  console.log("Connected to chat server");
});

client.on("data", (data) => {
  console.log(data.toString());
});

client.on("end", () => {
  console.log("Disconnected from server");
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  client.write(input);
});
```

---

## 🚀 How to Run

1. **Start server**

   ```bash
   node chat-server.js
   ```

2. **Open multiple terminals** and run:

   ```bash
   node chat-client.js
   ```

3. Start chatting — messages from one client appear in others.

---

## 🧪 Optional Enhancements

- Add username support
- Add time-stamps to messages
- Persist messages to a file
- Add command like `/quit` or `/list`
