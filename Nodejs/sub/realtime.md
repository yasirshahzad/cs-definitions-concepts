# 🚀 Real-Time Chat App with Node.js & Socket.IO

We'll go from basic to advanced in **5 stages**:

## 🔧 Stage 1: Project Setup

### 📁 Folder Structure

```
chat-app/
├── server/
│   └── index.js
├── client/
│   └── index.html
└── package.json
```

---

## ✅ Stage 2: Basic Chat App (Single Room, Broadcast)

### 1. Install Dependencies

```bash
npm init -y
npm install express socket.io
```

---

### 2. Server Code (server/index.js)

```js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "../client")));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", { id: socket.id, message: data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

---

### 3. Client Code (client/index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Chat App</title>
  </head>
  <body>
    <h1>Real-time Chat</h1>
    <ul id="messages"></ul>
    <input id="input" autocomplete="off" /><button>Send</button>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();

      const input = document.getElementById("input");
      const messages = document.getElementById("messages");
      const button = document.querySelector("button");

      button.onclick = () => {
        const text = input.value;
        socket.emit("chatMessage", text);
        input.value = "";
      };

      socket.on("chatMessage", (data) => {
        const item = document.createElement("li");
        item.textContent = `${data.id}: ${data.message}`;
        messages.appendChild(item);
      });
    </script>
  </body>
</html>
```

---

## 🧠 Stage 3: Add Rooms Support

### Server: Join Room + Broadcast to Room Only

```js
socket.on("joinRoom", (room) => {
  socket.join(room);
  socket.to(room).emit("chatMessage", {
    id: "System",
    message: `${socket.id} joined ${room}`,
  });
});

socket.on("chatMessage", ({ room, message }) => {
  io.to(room).emit("chatMessage", { id: socket.id, message });
});
```

### Client

```js
// Join a room (hardcoded or dynamic)
socket.emit("joinRoom", "general");

// Send message to room
button.onclick = () => {
  const text = input.value;
  socket.emit("chatMessage", { room: "general", message: text });
};
```

---

## 🔐 Stage 4: Add Username + Auth

### Server

```js
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Username required"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  socket.on("chatMessage", ({ room, message }) => {
    io.to(room).emit("chatMessage", { user: socket.username, message });
  });
});
```

### Client

```js
const socket = io({
  auth: {
    username: prompt("Enter username"),
  },
});
```

---

## ☁️ Stage 5: Advanced Features

### ✅ Typing Indicator

```js
// Server
socket.on("typing", (room) => {
  socket.to(room).emit("typing", socket.username);
});
```

```js
// Client
input.oninput = () => {
  socket.emit("typing", "general");
};

socket.on("typing", (username) => {
  console.log(`${username} is typing...`);
});
```

---

### ✅ Private Messaging (1-to-1)

```js
// Track users
const users = {};

io.on("connection", (socket) => {
  users[socket.username] = socket.id;

  socket.on("privateMessage", ({ to, message }) => {
    const targetId = users[to];
    if (targetId) {
      io.to(targetId).emit("privateMessage", {
        from: socket.username,
        message,
      });
    }
  });
});
```

---

### ✅ Chat History (in-memory or DB like MongoDB)

```js
let chatHistory = [];

socket.on("chatMessage", ({ room, message }) => {
  chatHistory.push({ room, user: socket.username, message });
  io.to(room).emit("chatMessage", { user: socket.username, message });
});
```

---

## 🧰 Bonus: Scalability with Redis Adapter

If you're scaling across servers:

```bash
npm install @socket.io/redis-adapter ioredis
```

```js
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient();
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));
```

---

## 📦 Next Steps & Deployment

- ✅ Use a frontend framework (React, Vue)
- ✅ Use `express-session` or JWT auth
- ✅ Store chats in MongoDB/Postgres
- ✅ Deploy to Vercel (frontend) + Render / DigitalOcean / EC2 for backend
- ✅ Add file sharing (using `socket.emit('file', ...)`)
- ✅ Support emojis and markdown (sanitize input)
