# 🧠 What is CQRS?

**CQRS** stands for:

> **Command Query Responsibility Segregation** — a design pattern that **separates read and write operations** into **different models**, often even different services.

---

## 📊 Key Idea

| Operation Type | Responsibility | Example                                    |
| -------------- | -------------- | ------------------------------------------ |
| **Command**    | Write          | `POST /users`, `PUT /orders/1/cancel`      |
| **Query**      | Read           | `GET /users`, `GET /orders?status=shipped` |

- **Commands**: Change application state (create/update/delete)
- **Queries**: Read application state (no side effects)

---

## 🏗️ Why Use CQRS?

| Benefit                             | Description                                                  |
| ----------------------------------- | ------------------------------------------------------------ |
| ✅ **Scalability**                  | You can **scale reads and writes independently**             |
| ✅ **Optimized Models**             | Use different DB schemas or technologies for reads vs writes |
| ✅ **Clear Separation of Concerns** | Clean, decoupled code                                        |
| ✅ **Event Sourcing Ready**         | CQRS works well with event-driven design                     |

## 🧰 When to Use It

✅ Use CQRS if:

- You're building **complex domains** with many reads and writes
- You want to **optimize reads for speed and scale**
- You're using **Event Sourcing**
- You need **audit trails or history tracking**

❌ Avoid CQRS if:

- Your app is **simple** (CRUD + no scaling concerns)
- You don't have the **engineering capacity** to manage complexity

# 🧪 CQRS in Practice (with Node.js)

## 🛠️ Step-by-Step Demo: Orders System

### 🎯 Use Case:

- Users **place orders** (Write)
- Admins **view orders** dashboard (Read)

## 🧱 Architecture Overview

```plaintext
┌─────────────┐         ┌────────────┐
│ Write Model │         │ Read Model │
│ (Commands)  │         │ (Queries)  │
│             │         │            │
│ MongoDB     │         │ PostgreSQL │
└────┬────────┘         └─────┬──────┘
     │                          │
     └───> Emit Event ────────> │
          ("OrderPlaced")      │
```

---

### 1️⃣ Define Commands

- `POST /orders`: Create new order
- `PUT /orders/:id/cancel`: Cancel an order

In `apps/order-service/src/controllers/order.controller.ts`:

```ts
// Command Handler
app.post("/orders", async (req, res) => {
  const { userId, items } = req.body;
  const order = await orderService.createOrder(userId, items);
  // Emit event to update read model
  eventBus.publish("OrderCreated", order);
  res.status(201).json(order);
});
```

---

### 2️⃣ Define Queries

In `apps/query-service/src/controllers/query.controller.ts`:

```ts
// Query Handler
app.get("/orders", async (req, res) => {
  const orders = await postgres.query(
    "SELECT * FROM orders WHERE status = $1",
    ["confirmed"]
  );
  res.json(orders.rows);
});
```

---

### 3️⃣ Event Bus (RabbitMQ or NATS)

Let `order-service` publish events:

```ts
eventBus.publish('OrderCreated', {
  orderId: '123',
  userId: 'abc',
  items: [...],
});
```

Let `query-service` consume and update its DB:

```ts
eventBus.subscribe("OrderCreated", async (event) => {
  await postgres.query("INSERT INTO orders (id, user_id, ...) VALUES (...)");
});
```

---

### 4️⃣ Two Separate Databases

- `order-service` (MongoDB)
- `query-service` (PostgreSQL, optimized for fast reads)

📌 You may choose same or different DBs depending on your needs.

---

## 🧠 Important Concepts to Master with CQRS

| Concept                  | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Eventual Consistency** | Read and write DBs may not sync immediately                 |
| **Idempotency**          | Events may be received twice — make handlers safe           |
| **Schema per model**     | Write model is normalized, Read model is often denormalized |
| **Replay events**        | You can rebuild read DB from past events (Event Sourcing)   |

---

## ✅ Pros and Cons of CQRS

### ✅ Pros

- Perfect for **complex, high-load systems**
- Enables **independent scaling**
- Easy to do **analytics and reports** on the read side
- Works well with **microservices**

### ❌ Cons

- More **complex** (needs messaging, sync handling)
- **Eventual consistency** can confuse devs
- Harder to **debug and trace**

---

## 📚 Resources to Deepen Your Knowledge

- 📘 **Book**: _Implementing Domain-Driven Design_ by Vaughn Vernon
- 📺 YouTube: "CQRS and Event Sourcing" by Greg Young (the original inventor)
- 🧪 Practice Project: [https://github.com/stemmlerjs/ddd-forum](https://github.com/stemmlerjs/ddd-forum) — great DDD + CQRS example

## 📦 Real-world Tools to Use

| Tool                         | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `RabbitMQ / NATS / Kafka`    | Messaging between services                   |
| `MongoDB`                    | Great for write side (flexible schema)       |
| `PostgreSQL / Elasticsearch` | Great for read side (structured / full-text) |
| `Zod / Yup`                  | For validating command DTOs                  |
| `TypeScript`                 | Helps with DTO safety & event types          |

---

## 🧠 Summary

```plaintext
1. Commands mutate state (create/cancel/etc)
2. Queries read state (no side effects)
3. Write and read are separated in services, models, DBs
4. Events connect write -> read (via message bus)
5. Eventual consistency must be handled
```

---

## 🧱 Event Sourcing + CQRS (Overview)

### ❗ Traditional State Storage

```bash
UPDATE orders SET status = 'shipped' WHERE id = 123;
```

> ❌ Overwrites state → ❌ No history

### ✅ Event Sourced Storage

```bash
Event 1: OrderPlaced { id: 123, user: 'Ali', items: [...] }
Event 2: OrderPaid { orderId: 123 }
Event 3: OrderShipped { orderId: 123 }
```

> ✅ Full history → ✅ Can **replay** to rebuild state

## 🔄 Architecture Overview

```plaintext
             ┌──────────────┐
             │  Command Bus │
             └─────┬────────┘
                   │
            ┌──────▼──────┐
            │  Command    │
            │  Handlers   │
            └──────┬──────┘
                   │
         ┌─────────▼─────────┐
         │ Append Event to   │◄──────┐
         │  Event Store (DB) │       │
         └─────────┬─────────┘       │
                   │                 │
                   ▼                 │
        ┌─────────────────────┐      │
        │  Publish Domain     │──────┘
        │      Events         │
        └─────────┬───────────┘
                  │
        ┌─────────▼────────────┐
        │  Projector (Query DB)│
        └──────────────────────┘
```

---

## 🛠️ Implementation Steps in Node.js

### 1️⃣ Event Store

Store domain events in a **dedicated collection/table**, e.g. MongoDB:

```ts
{
  _id: 'uuid',
  aggregateId: 'order-123',
  type: 'OrderPlaced',
  data: { userId: 'u1', items: [...] },
  timestamp: ISODate()
}
```

Use append-only strategy. Never delete or update events.

---

### 2️⃣ Write (Command) Side

- You **handle commands**
- You **generate events**
- You **append events to Event Store**

```ts
async function handlePlaceOrderCommand(command: PlaceOrderCommand) {
  const event = {
    type: "OrderPlaced",
    data: { orderId: uuid(), userId: command.userId, items: command.items },
  };

  await eventStore.append(event);
  eventBus.publish(event); // Notify read model
}
```

---

### 3️⃣ Read Side (Projectors)

- Project events into a **read-optimized model**

```ts
eventBus.subscribe("OrderPlaced", async (event) => {
  await postgres.query(
    `
    INSERT INTO orders (id, user_id, status)
    VALUES ($1, $2, $3)
  `,
    [event.data.orderId, event.data.userId, "pending"]
  );
});
```

---

### 4️⃣ Rebuilding State from Events

```ts
async function rebuildOrder(orderId: string) {
  const events = await eventStore.getEventsForAggregate(orderId);

  let order = new Order();
  for (const event of events) {
    order.apply(event); // hydrate state from history
  }

  return order;
}
```

In Domain-Driven Design (DDD), this is often implemented via an **`apply()`** method per event in the aggregate root.

---

## 🧠 Benefits of Event Sourcing + CQRS

| Benefit               | Description                            |
| --------------------- | -------------------------------------- |
| ✅ **Auditability**   | Full change history of every aggregate |
| ✅ **Time Travel**    | Rebuild any state at any point in time |
| ✅ **Resilience**     | Reconstruct projections after failures |
| ✅ **Loose Coupling** | Events make the system decoupled       |

---

## ⚠️ Challenges

| Challenge               | Mitigation                                                  |
| ----------------------- | ----------------------------------------------------------- |
| ❗ Schema Evolution     | Use event versioning and transformers                       |
| ❗ Event Order          | Ensure correct replay ordering (timestamp or version field) |
| ❗ Debugging Complexity | Use centralized logging and tracing                         |
| ❗ Learning Curve       | Start with smaller modules first                            |

---

## 🧪 Example Stack for Node.js

| Tool                 | Role                                       |
| -------------------- | ------------------------------------------ |
| `TypeScript`         | Event DTO types                            |
| `MongoDB`            | Event Store (append-only collection)       |
| `PostgreSQL`         | Read DB (optimized projections)            |
| `RabbitMQ` or `NATS` | Event Bus (pub/sub)                        |
| `Zod`                | Command/Event validation                   |
| `Jest`               | Unit tests for aggregates & event handlers |

## 📦 Event Store Implementation (Simple Example)

```ts
class EventStore {
  constructor(private db: MongoClient) {}

  async append(event: Event) {
    await this.db.collection("events").insertOne({
      ...event,
      timestamp: new Date(),
    });
  }

  async getEventsForAggregate(id: string): Promise<Event[]> {
    return await this.db
      .collection("events")
      .find({ aggregateId: id })
      .sort({ timestamp: 1 })
      .toArray();
  }
}
```

## ✅ Checklist: CQRS + Event Sourcing Done Right

✅ Separate **Command & Query models**  
✅ Use **append-only** event store  
✅ Always **apply events** to build state  
✅ Handle **event replay** for rebuilding  
✅ Use **projectors** for fast read models  
✅ Keep **idempotent** event handlers  
✅ Add **versioning** for evolving schemas
