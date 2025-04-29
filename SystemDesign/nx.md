# 🧠 What is Nx?

**Nx** is a powerful **monorepo tool** for building full-stack applications using modular architecture. It helps manage **multiple apps and libraries** within a single repository — perfect for microservices.

> ✅ **Use case**: When you're managing many small services (microservices), Nx makes sharing code, testing, building, and deploying easier and faster.

## 🎯 Why Use Nx for Microservices?

| Feature                         | Benefit                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| 🔧 **Code Sharing**             | Share common logic (e.g., auth, validation) between services |
| 🧪 **Integrated Testing**       | One unified way to test all services                         |
| ⚙️ **Dependency Graph**         | Visualize relationships between services and libraries       |
| 🚀 **Targeted Builds**          | Only rebuild what changed — saves CI/CD time                 |
| 🗂️ **Better Organization**      | Clear folder structure for large teams                       |
| 📦 **Package-based Deployment** | Build & deploy services independently                        |

---

## 🛠️ Step-by-Step: Setting up Nx for Node.js Microservices

### 1️⃣ Install Nx and Create a Workspace

```bash
npx create-nx-workspace@latest microservices-workspace
# Choose: "apps with no preset"
cd microservices-workspace
```

---

### 2️⃣ Add the Node Plugin for Nx

```bash
npm install --save-dev @nx/node
```

---

### 3️⃣ Create Microservices (Apps)

```bash
npx nx g @nx/node:app users
npx nx g @nx/node:app auth
npx nx g @nx/node:app booking
```

Each service is now its own standalone Node.js app under `apps/`.

---

### 4️⃣ Create and Share Libraries

Useful for common logic like:

- **auth-utils**
- **database-helpers**
- **dto-validators**

```bash
npx nx g @nx/js:lib auth-utils
npx nx g @nx/js:lib dto-validators
```

These libraries are now available under `libs/`.

### 5️⃣ Use Shared Libraries in Apps

Inside your app (e.g., `apps/users/src/main.ts`):

```ts
import { validateUser } from "@microservices-workspace/dto-validators";
```

Nx auto-resolves aliases via `tsconfig.base.json`.

---

### 6️⃣ Serve a Microservice

```bash
npx nx serve users
```

---

### 7️⃣ View the Dependency Graph

```bash
npx nx graph
```

📊 This shows how your services and libraries depend on each other. Very useful for large systems!

---

### 8️⃣ Run Tests

Run tests for **one service**:

```bash
npx nx test auth
```

Run tests for **everything**:

```bash
npx nx run-many --target=test --all
```

---

### 9️⃣ Build Specific Services

```bash
npx nx build users
```

Great for deploying individual services.

---

### 🔁 Example Monorepo Structure with Nx

```text
microservices-workspace/
├── apps/
│   ├── users/
│   ├── auth/
│   └── booking/
├── libs/
│   ├── auth-utils/
│   └── dto-validators/
├── tools/
├── nx.json
├── tsconfig.base.json
└── package.json
```

---

## 🔄 Advanced Nx Features for Microservices

| Feature                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| 🧱 **Project Boundaries**  | Enforce which services can depend on which libs      |
| 📦 **Package-based Build** | Use `@nx/nest`, `@nx/express` for type-safe services |
| ⏱ **Affected Commands**    | Run/test/build only changed projects                 |
| 📁 **Generators**          | Create code scaffolds fast with `nx g`               |
| 📜 **Custom Executors**    | Define how your services are built or deployed       |

---

## 📚 Recommended Learning Resources

- **Official Docs**: [https://nx.dev](https://nx.dev)
- **YouTube**: Search “Nx monorepo for microservices” — many great walkthroughs
- **Nx Examples Repo**: [https://github.com/nrwl/nx-examples](https://github.com/nrwl/nx-examples)

---

## 🔥 Final Thoughts

Nx is an **industry-grade tool** trusted by large teams (even Google uses it internally). For Node.js microservices, it provides:

- Clean separation
- Scalable builds/tests
- Incredible productivity for teams and solo devs

---

### ✅ What's Next?

Would you like a **real Nx-based microservices starter project** that includes:

- User/Auth/Booking services
- Shared libraries
- RabbitMQ or REST communication
- Docker integration
