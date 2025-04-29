# 🧠 Domain-Driven Design (DDD) Roadmap

---

## 1. What is DDD? (Basic)

**Definition**:

> DDD is a way to design complex software by _deeply understanding_ the **business/domain**, and reflecting it in your code structure.

**Key idea**:

- **Code ≈ Business Language**.
- Focus on the **core domain**, **not just the technology**.

✅ _The system is modeled after real business rules and language_.

---

## 2. The 3 Building Blocks of DDD

| Layer            | Purpose                                               | Example                         |
| :--------------- | :---------------------------------------------------- | :------------------------------ |
| **Entity**       | An object with identity (ID)                          | `User`, `Order`                 |
| **Value Object** | An object with no ID, only properties                 | `Address`, `Money`, `Email`     |
| **Aggregate**    | A cluster of Entities/ValueObjects with a single root | `Order` → has many `OrderItems` |

---

## 3. DDD Layers (Architecture)

Imagine the system like an Onion:

```
Application Layer (outermost)
 └── Domain Layer
       └── Infrastructure Layer (db, APIs)
```

Or in NestJS:

| Layer                | Purpose                           | NestJS                                   |
| :------------------- | :-------------------------------- | :--------------------------------------- |
| Application Layer    | Orchestrates use cases            | `Services`, `Command Handlers`           |
| Domain Layer         | Business rules                    | `Entities`, `ValueObjects`, `Aggregates` |
| Infrastructure Layer | Talks to database, 3rd party APIs | `Repositories`, `Adapters`               |

**Important Rule**:

> Infrastructure depends on Domain.  
> Domain NEVER depends on Infrastructure.

---

## 4. Important DDD Concepts

✅ **Entity** — Identity + Behavior

```typescript
class User {
  constructor(
    private readonly id: string,
    private name: string,
    private email: Email
  ) {}

  changeEmail(newEmail: Email) {
    this.email = newEmail;
  }
}
```

✅ **Value Object** — No Identity, Immutable

```typescript
class Email {
  constructor(private readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error("Invalid email address");
    }
  }

  private isValidEmail(email: string) {
    return email.includes("@");
  }

  getValue() {
    return this.value;
  }
}
```

✅ **Aggregate Root** — Entity that protects internal consistency

```typescript
class Order {
  private items: OrderItem[] = [];

  addItem(productId: string, quantity: number) {
    this.items.push(new OrderItem(productId, quantity));
  }

  getTotalQuantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
```

✅ **Repository** — Interface for persisting Aggregates

```typescript
interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order>;
}
```

✅ **Domain Event** — Something happened important to business

```typescript
class OrderCreatedEvent {
  constructor(public readonly orderId: string) {}
}
```

---

## 5. Visual Graph: DDD Layers

I'll draw the diagram for you.

```plaintext
--------------------------
| Application Layer      |
| (Use Cases, Services)   |
--------------------------
| Domain Layer            |
| (Entities, Aggregates,  |
|  Value Objects, Events) |
--------------------------
| Infrastructure Layer    |
| (DB, APIs, Email Sender)|
--------------------------
```

→ _Higher layers depend on lower layers_  
→ _Domain is independent, pure business logic_

---

## 6. DDD in NestJS Example (Simple Mini App)

Example: User Registration

```
src/
├── user/
│   ├── application/
│   │   ├── services/
│   │   │   └── register-user.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── value-objects/
│   │   │   └── email.vo.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── typeorm-user.repository.ts
│   │   ├── database/
│   │   │   └── user.orm-entity.ts
│   ├── user.module.ts
```

### Example Files:

**domain/entities/user.entity.ts**

```typescript
export class User {
  constructor(private readonly id: string, private email: Email) {}

  changeEmail(newEmail: Email) {
    this.email = newEmail;
  }
}
```

**domain/value-objects/email.vo.ts**

```typescript
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error("Invalid Email");
    }
  }
  private isValidEmail(email: string): boolean {
    return email.includes("@");
  }
}
```

**application/services/register-user.service.ts**

```typescript
@Injectable()
export class RegisterUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    const user = new User(uuidv4(), new Email(email));
    await this.userRepository.save(user);
    return user;
  }
}
```

**infrastructure/repositories/typeorm-user.repository.ts**

```typescript
@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity) private repo: Repository<UserOrmEntity>
  ) {}

  async save(user: User): Promise<void> {
    const entity = this.repo.create({
      id: user.id,
      email: user.email.getValue(),
    });
    await this.repo.save(entity);
  }
}
```

---

### 7. Advanced Topics (Mastery Level)

| Topic                                               | Why Important                                                   |
| :-------------------------------------------------- | :-------------------------------------------------------------- |
| **Domain Events**                                   | Decouples logic (e.g., when an Order is created, fire an event) |
| **Event Sourcing**                                  | Store all changes/events instead of just the current state      |
| **Command Query Responsibility Segregation (CQRS)** | Separate Read and Write models                                  |
| **Sagas**                                           | Handle complex long-running transactions (microservices)        |
| **Bounded Contexts**                                | Divide huge systems into isolated subdomains                    |
| **Anti-Corruption Layers (ACL)**                    | Protect your clean domain model from dirty external models      |

---

### 8. Real-world Example: Uber Backend (bounded contexts)

🚕 Uber's backend can have:

| Context         | Examples                            |
| :-------------- | :---------------------------------- |
| Rider Context   | Rider, TripRequest, PaymentMethod   |
| Driver Context  | Driver, Vehicle, DriverAvailability |
| Trip Context    | Trip, Route, FareCalculation        |
| Payment Context | Invoice, Payment, Refund            |

Each context is separate, and they **talk through APIs or events**, not direct models.

### 9. Quick Quiz (Self-Check)

✅ What’s the difference between Entity and Value Object?  
✅ What is an Aggregate Root’s job?  
✅ Why should the Domain layer NOT know about Infrastructure?  
✅ What is a Bounded Context?  
✅ When would you use Event Sourcing instead of CRUD?

Got it! 🎯  
You want **Domain-Driven Design (DDD)**, but **in Express + Node.js** (not NestJS).  
Perfect — this is an excellent skill because **NestJS is opinionated**, but **Express is bare**, so doing DDD in Express really shows _senior-level architecture_.

---

## 7. How to Structure DDD in Express

We will use the same DDD ideas:

```
src/
├── user/
│   ├── application/
│   │   └── register-user.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── value-objects/
│   │   │   └── email.vo.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── memory-user.repository.ts
│   └── user.controller.ts
├── shared/
│   └── errors/
│       └── app-error.ts
└── app.ts
```

### 1. `domain/entities/user.entity.ts`

```typescript
// src/user/domain/entities/user.entity.ts

import { Email } from "../value-objects/email.vo";

export class User {
  constructor(public readonly id: string, public email: Email) {}

  changeEmail(newEmail: Email) {
    this.email = newEmail;
  }
}
```

---

### 2. `domain/value-objects/email.vo.ts`

```typescript
// src/user/domain/value-objects/email.vo.ts

export class Email {
  constructor(private readonly value: string) {
    if (!this.validate(value)) {
      throw new Error("Invalid email address");
    }
  }

  private validate(email: string) {
    return email.includes("@");
  }

  getValue() {
    return this.value;
  }
}
```

---

### 3. `domain/repositories/user.repository.ts`

```typescript
// src/user/domain/repositories/user.repository.ts

import { User } from "../entities/user.entity";

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
```

---

### 4. `infrastructure/persistence/memory-user.repository.ts`

(Simulate a database with memory for now.)

```typescript
// src/user/infrastructure/persistence/memory-user.repository.ts

import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";

export class MemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}
```

---

### 5. `application/register-user.service.ts`

```typescript
// src/user/application/register-user.service.ts

import { UserRepository } from "../domain/repositories/user.repository";
import { User } from "../domain/entities/user.entity";
import { Email } from "../domain/value-objects/email.vo";
import { v4 as uuidv4 } from "uuid";

export class RegisterUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = new User(uuidv4(), new Email(email));
    await this.userRepository.save(user);
    return user;
  }
}
```

---

### 6. `user.controller.ts`

```typescript
// src/user/user.controller.ts

import { Router } from "express";
import { MemoryUserRepository } from "./infrastructure/persistence/memory-user.repository";
import { RegisterUserService } from "./application/register-user.service";

const userRouter = Router();

const userRepository = new MemoryUserRepository();
const registerUserService = new RegisterUserService(userRepository);

userRouter.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await registerUserService.execute(email);
    res.status(201).json({ id: user.id, email: user.email.getValue() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { userRouter };
```

---

### 7. `shared/errors/app-error.ts`

(For custom errors, optional at this stage.)

```typescript
// src/shared/errors/app-error.ts

export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}
```

---

### 8. `app.ts`

```typescript
// src/app.ts

import express from "express";
import { userRouter } from "./user/user.controller";

const app = express();

app.use(express.json());
app.use("/users", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

## 📊 Diagram of Flow

```plaintext
Express POST /users/register
    ↓
UserController
    ↓
RegisterUserService (Application Layer)
    ↓
User Entity + Email Value Object (Domain Layer)
    ↓
MemoryUserRepository (Infrastructure Layer)
```

---

### 🚀 How You Run It

1. Install dependencies:

```bash
npm init -y
npm install express uuid
npm install --save-dev typescript ts-node @types/express @types/node
```

2. Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

3. Add scripts in `package.json`:

```json
"scripts": {
  "start": "ts-node src/app.ts"
}
```

4. Run the server:

```bash
npm run start
```

---

## ✅ Now you have:

- Pure **DDD structure** ✅
- **Entities, Value Objects, Repositories** ✅
- **Application Layer** separated ✅
- **Infrastructure Layer** (Memory repo) ✅
