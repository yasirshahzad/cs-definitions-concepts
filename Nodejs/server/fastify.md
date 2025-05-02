# Fastify

## 🚀 1. **Install Fastify**

```bash
npm install fastify
```

Or with TypeScript:

```bash
npm install fastify @types/node typescript ts-node --save-dev
```

## 🔧 2. **Create a Basic Server**

### `server.js`

```js
const fastify = require("fastify")({ logger: true });

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  fastify.log.info(`Server listening at ${address}`);
});
```

---

## 📌 3. **Key Concepts Overview**

| Concept         | Fastify                                      |
| --------------- | -------------------------------------------- |
| Routing         | `fastify.get/post/put/delete(path, handler)` |
| Validation      | JSON schema per route                        |
| Plugins         | `fastify.register()` for modular code        |
| Lifecycle hooks | `onRequest`, `preHandler`, etc.              |
| Decorators      | Extend instance or request                   |
| Built-in logger | Pino logger                                  |
| Schema-based    | Auto-generates OpenAPI docs (with plugin)    |

---

## 🛣️ 4. **Define Routes and Handle Methods**

```js
fastify.post("/user", async (request, reply) => {
  const { name, age } = request.body;
  return { user: { name, age } };
});
```

---

## ✅ 5. **Add Schema Validation**

```js
fastify.post(
  "/login",
  {
    schema: {
      body: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
  },
  async (req, reply) => {
    const { username } = req.body;
    return { token: `signed-token-for-${username}` };
  }
);
```

Fastify **automatically returns 400** for invalid input. No extra work!

---

## 🧩 6. **Use Plugins**

Create modular features:

```js
// routes/user.js
async function userRoutes(fastify, options) {
  fastify.get("/users", async () => {
    return [{ id: 1, name: "Alice" }];
  });
}

module.exports = userRoutes;
```

Register it:

```js
fastify.register(require("./routes/user"));
```

---

## 🪝 7. **Use Hooks (Middleware-like)**

```js
fastify.addHook("onRequest", async (request, reply) => {
  console.log("Incoming request:", request.raw.url);
});
```

---

## 🧠 8. **Use Decorators (Extend Fastify)**

```js
fastify.decorate("utility", () => "Helper");

fastify.get("/helper", (req, reply) => {
  return fastify.utility(); // returns 'Helper'
});
```

---

## 📦 9. **Parse Cookies, Serve Static Files, CORS**

Install plugins:

```bash
npm install @fastify/cors @fastify/static @fastify/cookie
```

Register them:

```js
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/static/", // localhost:3000/static/image.jpg
});
```

---

## 🔐 10. **Authentication and Authorization**

Fastify doesn’t include auth, but you can use `@fastify/jwt`:

```bash
npm install @fastify/jwt
```

```js
fastify.register(require("@fastify/jwt"), { secret: "supersecret" });

fastify.post("/login", (req, reply) => {
  const token = fastify.jwt.sign({ user: "john" });
  return { token };
});

fastify.get("/protected", {
  preHandler: fastify.authenticate,
  handler: async () => {
    return { secure: true };
  },
});

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});
```

---

## 🧪 11. **Testing with `tap`**

Fastify suggests using `tap` for lightweight testing.

```bash
npm install tap
```

Example test:

```js
const build = require("../app"); // your server as a function
const tap = require("tap");

tap.test("GET `/` route", async (t) => {
  const app = build();
  const res = await app.inject({ method: "GET", url: "/" });

  t.equal(res.statusCode, 200);
  t.same(JSON.parse(res.body), { hello: "world" });
});
```

---

## 🌍 12. **Fastify with TypeScript**

### `app.ts`

```ts
import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
  return { hello: "TypeScript" };
});

fastify.listen({ port: 3000 });
```

Add `tsconfig.json`, use `ts-node` for development.

---

## 📖 13. **Useful Fastify Plugins**

| Plugin               | Use                                       |
| -------------------- | ----------------------------------------- |
| `@fastify/jwt`       | JSON Web Tokens                           |
| `@fastify/cors`      | CORS                                      |
| `@fastify/formbody`  | Parse `application/x-www-form-urlencoded` |
| `@fastify/swagger`   | Auto-generate Swagger/OpenAPI docs        |
| `@fastify/static`    | Serve static files                        |
| `@fastify/websocket` | Add WebSocket support                     |

---

## ✅ Final Tips for Mastery

- ✅ Use schemas **everywhere** to get auto validation and docs.
- ✅ Modularize code with plugins and route files.
- ✅ Use decorators for shared logic (auth, utils).
- ✅ Prefer `inject()` for unit testing.
- ✅ Explore `fastify-cli` for bootstrapping projects.

Great — let’s go beyond the basics and dive into **advanced Fastify** usage. This includes:

- Plugin encapsulation and hierarchy
- Advanced request validation with `zod`
- Type-safe development (with `TypeScript`)
- Graceful shutdown and lifecycle management
- Advanced error handling
- Fastify with database (e.g., PostgreSQL/Prisma or MongoDB)
- Request context, dependency injection
- File uploads
- Building a plugin
- Writing tests for isolated components

---

## 🧩 1. **Plugin Encapsulation & Scope Isolation**

Fastify's plugin system creates **encapsulated scopes**, meaning each plugin can have its own set of routes, decorators, etc.

```ts
fastify.register(async (childInstance) => {
  childInstance.get("/admin", async () => {
    return { protected: true };
  });
});

// Not accessible from root instance
```

You can also pass options:

```ts
fastify.register(
  (instance, opts, done) => {
    instance.get("/user", async () => ({ role: opts.role }));
    done();
  },
  { role: "admin" }
);
```

---

## 🔒 2. **Schema Validation with Zod + TypeScript**

```bash
npm install zod @fastify/type-provider-zod
```

```ts
import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { z } from "zod";

const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>();

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

fastify.post(
  "/login",
  {
    schema: {
      body: schema,
    },
  },
  async (req, reply) => {
    const { username } = req.body;
    return { username };
  }
);
```

---

## 🧠 3. **Lifecycle & Graceful Shutdown**

You can tap into Fastify’s lifecycle:

```ts
fastify.addHook("onReady", async () => {
  console.log("Server is ready");
});

fastify.addHook("onClose", async () => {
  console.log("Closing resources like DB or message queues");
});
```

Listen for system signals:

```ts
process.on("SIGINT", async () => {
  await fastify.close();
  process.exit(0);
});
```

---

## 📦 4. **Fastify with Prisma**

```bash
npm install @prisma/client fastify-plugin
```

### Create a Plugin

```ts
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
```

Add type declaration:

```ts
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
```

---

## 💥 5. **Advanced Error Handling**

```ts
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error); // Log with Pino
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message,
  });
});
```

Throw HTTP errors using `@fastify/http-errors`:

```ts
import createError from "@fastify/http-errors";

fastify.get("/error", async () => {
  throw createError(403, "Forbidden");
});
```

---

## 📂 6. **File Uploads with @fastify/multipart**

```bash
npm install @fastify/multipart
```

```ts
fastify.register(require("@fastify/multipart"));

fastify.post("/upload", async (req, reply) => {
  const data = await req.file();
  const buffer = await data.toBuffer();
  // Save buffer to disk/cloud/etc.
  return { name: data.filename };
});
```

---

## 🧪 7. **Advanced Testing with Injection & Mocks**

Use `fastify.inject()` to simulate HTTP requests.

### app.ts

```ts
export function buildApp() {
  const fastify = Fastify();
  fastify.get("/health", async () => ({ ok: true }));
  return fastify;
}
```

### test/app.test.ts

```ts
import { buildApp } from "../app";

test("GET /health", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/health" });

  expect(res.statusCode).toBe(200);
});
```

---

## 🪝 8. **Request Context / Dependency Injection**

Fastify has a lightweight context system. You can also use `@fastify/request-context`.

```bash
npm install @fastify/request-context
```

```ts
fastify.register(require("@fastify/request-context"), {
  defaultStoreValues: {
    requestId: null,
  },
});

fastify.addHook("onRequest", async (req) => {
  req.requestContext.set("requestId", req.id);
});

fastify.get("/ctx", async (req) => {
  return { id: req.requestContext.get("requestId") };
});
```

---

## 🔌 9. **Build Your Own Plugin**

```ts
import fp from "fastify-plugin";

async function myUtilityPlugin(fastify, opts) {
  fastify.decorate("sayHello", (name) => `Hello ${name}`);
}

export default fp(myUtilityPlugin);
```

```ts
fastify.register(require("./plugins/myUtility"));
console.log(fastify.sayHello("world")); // Hello world
```

---

## 🚀 10. **Production-Ready Tips**

✅ Enable compression, rate limits  
✅ Use `@fastify/swagger` for docs  
✅ Separate config/env with `dotenv`  
✅ Use reverse proxy like Nginx or Caddy  
✅ Add logging and metrics with Prometheus
