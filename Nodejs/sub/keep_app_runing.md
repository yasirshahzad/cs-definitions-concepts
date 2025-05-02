# Keep Application Running

## 🧠 What is `nodemon`?

**`nodemon`** is a development utility that monitors your Node.js files and automatically **restarts the server/app** when changes are detected. It makes local development faster and less repetitive.

---

## ✅ Why Use `nodemon`?

| Feature             | Benefit                                           |
| ------------------- | ------------------------------------------------- |
| Auto-restarts app   | Save time — no need to manually stop/start server |
| File watching       | Works with `.js`, `.ts`, `.json`, etc.            |
| Custom script entry | Run any file (e.g., `index.ts`, `app.js`)         |
| Debug friendly      | Works with `--inspect`, environment variables     |

## 🛠️ Installation

## Globally (Recommended)

```bash
npm install -g nodemon
```

## Or as a dev dependency

```bash
npm install --save-dev nodemon
```

---

## ▶️ Basic Usage

```bash
nodemon app.js
```

Whenever `app.js` or its dependencies change, `nodemon` restarts the app automatically.

---

## ⚙️ `package.json` Integration

```json
{
  "scripts": {
    "dev": "nodemon app.js"
  }
}
```

Now run:

```bash
npm run dev
```

## 🎯 Watching Specific File Types

By default, `nodemon` watches `.js`, `.json`, `.mjs`, `.cjs`, and `.node`.

You can add custom extensions:

```bash
nodemon --ext js,json,ts
```

Or in a `nodemon.json` config (recommended for big projects):

## 📁 Create a `nodemon.json` File

```json
{
  "watch": ["src"],
  "ext": "js,json,ts",
  "ignore": ["node_modules", "logs"],
  "exec": "ts-node src/app.ts"
}
```

## Then just run:

```bash
nodemon
```

---

## 🧪 Use with TypeScript (`ts-node`)

```bash
npm install -D ts-node typescript
```

## Run a TS file directly:

```bash
nodemon --exec ts-node src/index.ts
```

Or via `nodemon.json` as shown earlier.

---

## 🚫 Ignore Specific Files

Inline:

```bash
nodemon --ignore 'logs/*'
```

Or inside `nodemon.json`:

```json
{
  "ignore": ["logs", "*.test.js"]
}
```

## 🧵 Pass Environment Variables

```bash
NODE_ENV=development nodemon app.js
```

Or with cross-platform compatibility (Windows/Linux):

```bash
npx cross-env NODE_ENV=development nodemon app.js
```

## 🐞 Enable Debugging with Nodemon

```bash
nodemon --inspect app.js
```

You can debug in Chrome via `chrome://inspect`.

## 🛡 Best Practices

| Practice                      | Description                        |
| ----------------------------- | ---------------------------------- |
| Use `nodemon.json`            | Cleaner config, version-controlled |
| Use scripts in `package.json` | Avoid memorizing long CLI commands |
| Use with `ts-node`            | Best for TypeScript dev            |
| Ignore logs/tmp/test files    | Avoid unnecessary restarts         |
| Separate dev vs prod scripts  | Don't use `nodemon` in production  |

---

## 📦 Bonus: Install `concurrently` for frontend/backend apps

```bash
npm install concurrently --save-dev
```

Then in `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js",
    "client": "vite"
  }
}
```

## 🧠 Summary

- Use `nodemon` to speed up dev iteration.
- Combine with `ts-node`, `dotenv`, and `cross-env` for full stack CLI control.
- Don't use in production — use PM2 or Docker.
