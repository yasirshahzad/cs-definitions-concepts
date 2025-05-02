# Environment Variables

## 🔹 **What is `dotenv`?**

The `dotenv` package loads environment variables from a `.env` file into `process.env`. This allows you to keep secrets and configuration out of your code.

---

## 📦 **1. Install `dotenv`**

```bash
npm install dotenv
```

---

## 📁 **2. Create a `.env` File**

Create a `.env` file in your project root:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
```

⚠️ **Never commit `.env` to GitHub**  
Add it to `.gitignore`:

```
.env
```

---

## 🔄 **3. Load `.env` in your App**

In the entry point of your Node.js app (e.g., `index.js`, `app.js`, `server.js`):

```js
require("dotenv").config();

console.log(process.env.PORT); // 3000
```

Or using `import` in TypeScript/ESM:

```ts
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.PORT);
```

## 📌 **4. `process.env` Usage Best Practices**

- `process.env.VARIABLE_NAME` always returns a **string** or `undefined`.
- Use fallback values:

```js
const port = process.env.PORT || 3000;
```

- Convert types manually if needed:

```js
const isProd = process.env.NODE_ENV === "production";
const timeout = Number(process.env.TIMEOUT);
```

---

## 🧪 **5. Validate Environment Variables (Optional but Smart)**

Use a schema validation library like [`zod`](https://github.com/colinhacks/zod) or `joi` to ensure `.env` contains valid values.

Example with `zod`:

```ts
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().min(1),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
});

const env = envSchema.parse(process.env); // Throws if any env var is missing or invalid
```

---

## 🧱 **6. Frontend Frameworks (React, Vite, Next.js)**

Frontend build tools handle environment variables differently:

#### ✅ **React (CRA)**

- Must start variables with `REACT_APP_`

`.env`:

```
REACT_APP_API_URL=https://api.example.com
```

Usage:

```js
console.log(process.env.REACT_APP_API_URL);
```

#### ✅ **Vite**

- Must start variables with `VITE_`

`.env`:

```
VITE_API_URL=https://api.example.com
```

Usage:

```js
console.log(import.meta.env.VITE_API_URL);
```

#### ✅ **Next.js**

- For runtime config, use `NEXT_PUBLIC_`

`.env`:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

Usage:

```js
console.log(process.env.NEXT_PUBLIC_API_URL);
```

---

## 🧪 **7. Multiple `.env` Files**

You can have different `.env` files for different environments:

- `.env` – default
- `.env.development`
- `.env.production`
- `.env.test`

Then load them accordingly:

```js
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
```

---

## ✅ Summary: Rules of Thumb

| Task          | How                                                   |
| ------------- | ----------------------------------------------------- |
| Load env vars | `require('dotenv').config()`                          |
| Access vars   | `process.env.MY_VAR`                                  |
| Secure vars   | Use `.gitignore` and `.env`                           |
| Validate vars | Use `zod` or `joi`                                    |
| Frontend apps | Use `REACT_APP_`, `VITE_`, or `NEXT_PUBLIC_` prefixes |
