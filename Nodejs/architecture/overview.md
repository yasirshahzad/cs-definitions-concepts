# Application Architecture

## 📦 **Monolith vs Microservices in Node.js**

### **Monolith**

- **Single codebase** that handles all responsibilities (auth, user, payments, etc.).
- Easier to start and deploy.
- Ideal for small teams or MVPs.

**Example:**

```bash
app/
├── controllers/
├── services/
├── routes/
├── models/
└── app.js
```

**Pros**: Simple, easy to debug, fewer deployment complexities.  
**Cons**: Hard to scale teams, tight coupling, deployments can affect the whole app.

---

### **Microservices**

- Each service (user, billing, etc.) is **a standalone Node.js app**.
- Communicate via **HTTP, gRPC, or message queues (e.g., RabbitMQ, Kafka)**.
- Each has its own DB and deployment lifecycle.

**Example:**

```bash
services/
├── auth-service/
├── user-service/
└── billing-service/
```

**Pros**: Scalability, separation of concerns, independent deployments.  
**Cons**: Complexity, requires service discovery, observability, and distributed tracing.

**Use Node.js microservice frameworks**:

- [Moleculer](https://moleculer.services/)
- [Seneca](https://senecajs.org/)

---

## 🧱 **Architectures: MVC vs Clean vs Hexagonal**

### ✅ **MVC (Model-View-Controller)**

- Common and simple.
- Good for web apps (e.g., Express + EJS or APIs).

```bash
app/
├── models/
├── views/
├── controllers/
└── routes/
```

**Downside**: Can become messy as the app grows. Logic often ends up in controllers or models.

---

### ✅ **Clean Architecture (by Uncle Bob)**

- Layers: `Entities → UseCases → Interfaces → Frameworks`
- Core logic (entities/use cases) has no dependencies on web/db/external services.

```bash
src/
├── domain/       # Entities and business rules
├── use-cases/    # Application-specific logic
├── interfaces/   # Express, DB, etc.
└── infrastructure/ # Frameworks, tools
```

**Pros**: Testable, decoupled, scalable.  
**Use**: For serious apps where maintainability matters.

---

### ✅ **Hexagonal Architecture (Ports and Adapters)**

- Similar to Clean, but visualized differently.
- Core logic is surrounded by ports (interfaces) and adapters (concrete implementations).

```bash
src/
├── core/             # Business logic
│   ├── ports/        # Interfaces
│   └── services/
├── adapters/         # Express, DB, etc.
└── index.js
```

**Main Idea**: Your app shouldn't care if it's using Express, Fastify, Mongo, or PostgreSQL.

---

## 📁 **Folder Structure Best Practices**

For large apps, consider structuring **by feature**, not by type:

```bash
src/
├── users/
│   ├── user.controller.js
│   ├── user.service.js
│   └── user.route.js
├── auth/
│   ├── auth.controller.js
│   ├── auth.service.js
│   └── auth.route.js
├── config/
├── shared/
└── app.js
```

**Advantages**:

- Easier to find related code
- Better encapsulation
- Scales well

---

## 💉 **Dependency Injection (DI) with Awilix**

### Why use DI?

- Helps manage dependencies cleanly (no `require()` chaos)
- Makes testing and mocking easier
- Encourages loose coupling

### `awilix` Example

1. **Install**:

```bash
npm install awilix awilix-express
```

2. **Create your container**:

```js
// container.js
const { createContainer, asClass } = require("awilix");

const container = createContainer();

container.register({
  userService: asClass(require("./services/UserService")).singleton(),
  userController: asClass(require("./controllers/UserController")).singleton(),
});

module.exports = container;
```

3. **Use with Express**:

```js
const { scopePerRequest } = require("awilix-express");

app.use(scopePerRequest(container));
```

4. **Inject into controller**:

```js
class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  async getUser(req, res) {
    const user = await this.userService.findUser(req.params.id);
    res.json(user);
  }
}

module.exports = UserController;
```

---

### TL;DR

| Aspect                    | Best Use                                 |
| ------------------------- | ---------------------------------------- |
| **Monolith**              | Quick MVPs, simple apps                  |
| **Microservices**         | Scalable systems, large teams            |
| **MVC**                   | Small apps, prototyping                  |
| **Clean/Hexagonal**       | Maintainable, scalable architecture      |
| **Feature-based folders** | Large codebases                          |
| **Awilix**                | Decoupled, testable dependency injection |

Great — your experience with **Nx** (a powerful monorepo tool) is a solid advantage, especially if you're moving toward **modular, scalable architectures** like microservices or Clean Architecture in Node.js.

Let’s tie Nx into the concepts we’ve discussed and show how it fits:

---

## 🧠 **Nx + Node.js Architecture**

Nx excels at managing:

- **Monorepos** (multiple apps and libs in one repo)
- **Microservices** or **modular monoliths**
- Clear separation of **domain logic** via **libs**

### 🏗 Typical Nx Structure (for Node.js backend)

```bash
apps/
├── api-gateway/         # Express or Fastify API layer
├── users-service/       # Microservice or feature module
├── auth-service/

libs/
├── users/
│   ├── data-access/     # DB access logic (repositories)
│   ├── feature/         # Use cases / services
│   └── interfaces/      # Contracts, DTOs
├── auth/
├── shared/              # Common types, utils
```

### Benefits in Nx:

✅ Strict boundaries between services/features  
✅ Fast builds with caching  
✅ Reuse logic cleanly through **libs**  
✅ Type-safe integration between modules (with TypeScript)

---

## ✅ **Using Clean Architecture with Nx**

Nx encourages **Clean Architecture** by enforcing layer separation through `libs/`:

| Layer                              | Location (Nx)                             |
| ---------------------------------- | ----------------------------------------- |
| **Entities** (domain logic)        | `libs/users/core/` or `libs/shared/core/` |
| **Use Cases**                      | `libs/users/feature/`                     |
| **DB, external APIs**              | `libs/users/data-access/`                 |
| **API handlers** (Express/Fastify) | `apps/api-gateway/`                       |

---

## 💉 **Awilix with Nx**

You can still use `awilix` in Nx, typically within an app (e.g., `apps/api-gateway`) and register services from `libs`.

Example:

```ts
// apps/api-gateway/src/main.ts
const container = createContainer();

container.register({
  userService: asClass(require("@myorg/users/feature").UserService).singleton(),
  userRepo: asClass(require("@myorg/users/data-access").UserRepo).singleton(),
});
```

This combines:

- **Nx modularity**
- **Clean Architecture boundaries**
- **Awilix dependency injection**

---

## 🛠 Tips for Best Practices in Nx + Node.js

- Use `libs/*` for:
  - Reusable services, use cases, domain logic, DTOs, and types
- Use `apps/*` only for:
  - Wiring things together (routes, DI, frameworks)
- Use **tags in `nx.json`** to enforce dependency boundaries (e.g., no `app` importing from another `app`)
- Use **project generators** for consistent folder structure
