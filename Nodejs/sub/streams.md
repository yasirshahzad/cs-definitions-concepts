# Streams

- **Streams** handle **data chunks** — not entire files.
- Super useful for **big files**, **networks**, and **memory** efficiency.

## 🧵 4 Types of Streams

- **Readable**: Read data (file, HTTP request)
- **Writable**: Write data (file, HTTP response)
- **Duplex**: Both (like TCP socket)
- **Transform**: Modify while passing (gzip compression)

### 🛠️ Basic Stream Usage

#### Read a file (Readable)

```javascript
const fs = require("fs");

const readable = fs.createReadStream("./bigfile.txt", { encoding: "utf8" });

readable.on("data", (chunk) => {
  console.log("Chunk:", chunk.length);
});

readable.on("end", () => {
  console.log("Done reading.");
});
```

---

#### Write to a file (Writable)

```javascript
const writable = fs.createWriteStream("./output.txt");

writable.write("Hello World!\n");
writable.end();

writable.on("finish", () => {
  console.log("Done writing.");
});
```

---

#### Pipe (Connect streams)

```javascript
const read = fs.createReadStream("./bigfile.txt");
const write = fs.createWriteStream("./copy.txt");

read.pipe(write);
```

✅ Reads + Writes efficiently — no manual handling!

---

## 🚰 Pipeline Pattern

Instead of manually managing `.on('data')`, use **pipeline**:

```javascript
const { pipeline } = require("stream");
const fs = require("fs");

pipeline(
  fs.createReadStream("./bigfile.txt"),
  fs.createWriteStream("./copy.txt"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("Pipeline succeeded.");
  }
);
```

✅ Automatic error handling.  
✅ Cleaner than `.pipe()` chain.

---

## 📈 Handle Backpressure Manually

```javascript
const read = fs.createReadStream("./bigfile.txt");
const write = fs.createWriteStream("./copy.txt");

read.on("data", (chunk) => {
  const ok = write.write(chunk);
  if (!ok) {
    read.pause();
    write.once("drain", () => {
      read.resume();
    });
  }
});
```

✅ If writable is **full**, pause reading temporarily.

---

## 🧪 Create a Transform Stream (Modify Data)

Example: Convert text to **uppercase** while streaming.

```javascript
const { Transform } = require("stream");

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

pipeline(
  fs.createReadStream("./input.txt"),
  upper,
  fs.createWriteStream("./output.txt"),
  (err) => {
    if (err) console.error("Transform failed:", err);
    else console.log("Transform done.");
  }
);
```

✅ Modify while moving data! (No memory hit)

---

## ⚙️ Stream Options

- `highWaterMark`: Buffer size (default 64KB)
- `encoding`: auto decode (e.g., `'utf8'`)

```javascript
fs.createReadStream("./file.txt", { highWaterMark: 128 * 1024 });
```

✅ Tune buffer size for optimization.

---

## 🎬 Build a Mini Streaming Video Server

**Stream a video file** chunk-by-chunk via HTTP:

```javascript
const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((req, res) => {
    const videoPath = path.join(__dirname, "video.mp4");
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  })
  .listen(8000);

console.log("Streaming server running on http://localhost:8000");
```

✅ Handles **partial content** for smooth seeking!  
✅ Supports **large videos** without memory crash.

---

## 📁 Build a CLI Tool for GB-Sized File Processing

**Replace text in a huge file** without loading all.

```javascript
const fs = require("fs");
const { Transform, pipeline } = require("stream");

const replaceTransform = new Transform({
  transform(chunk, encoding, callback) {
    const data = chunk.toString().replace(/oldword/g, "newword");
    callback(null, data);
  },
});

pipeline(
  fs.createReadStream(process.argv[2]), // input file
  replaceTransform,
  fs.createWriteStream("output.txt"), // output file
  (err) => {
    if (err) console.error("CLI processing failed:", err);
    else console.log("File processed successfully.");
  }
);
```

Run from CLI:

```bash
node cli-tool.js input.txt
```

✅ Can handle **GB+ files** easily.  
✅ Memory-safe.

---

## 🧠 Quick Summary

| You Mastered                | Means                          |
| :-------------------------- | :----------------------------- |
| Readable / Writable streams | Chunk-by-chunk processing      |
| Pipe and pipeline           | Stream chaining + error safety |
| Transform streams           | Modify data during flow        |
| Backpressure handling       | Avoid overload                 |
| Custom stream apps          | Server + CLI tools             |

## 📂 **Reading/Writing Files — STREAMS Instead of readFile**

At advanced level, we **do not load full file in memory**.  
We use **Streams**.

```javascript
const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const stream = fs.createReadStream("./bigfile.txt");

  stream.pipe(res); // Auto-handles backpressure
});

server.listen(3000, () => console.log("Streaming server running"));
```

✅ **Streams** solve:

- **Memory Efficiency** (big files)
- **Backpressure** (client slower than server)

🔵 `fs.createReadStream` returns a readable **stream**, and `res` is a writable stream.
