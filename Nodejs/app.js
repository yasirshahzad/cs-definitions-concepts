const fs = require("fs");
const http = require("http");
const { pipeline } = require("stream/promises");

const server = http.createServer(async (req, res) => {
  const stream = fs.createReadStream("./bigfile.txt");

  await pipeline(stream, res);
});

server.listen(3000, () => console.log("Streaming server running"));
