const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });

  // OR

  // res.setHeaders({ "Content-Type": "text/plain" });

  res.end("Hello World\n");
});

server.on("request", (req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
});

server.on("close", () => {
  console.log("Server closed");
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.on("connection", (socket) => {
  console.log("New connection established");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
