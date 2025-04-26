# MongoDB

---

## 🟢 1. What is MongoDB?

- MongoDB is a **NoSQL database** (Non-relational).
- It stores data in **flexible JSON-like documents** (called BSON - Binary JSON).
- Each record is a **document**, and documents are grouped into **collections** (similar to tables in SQL).

Example of a document:

```json
{
  "name": "John Doe",
  "age": 29,
  "skills": ["Node.js", "React", "MongoDB"]
}
```

---

## 🟢 2. Key Concepts:

| Concept    | Meaning                               |
| ---------- | ------------------------------------- |
| Database   | A container for collections           |
| Collection | A container for documents             |
| Document   | A record (JSON-like structure)        |
| Field      | A key-value pair inside a document    |
| BSON       | MongoDB uses a binary version of JSON |

---

## 🟢 3. MongoDB vs SQL:

| MongoDB              | SQL                    |
| -------------------- | ---------------------- |
| Collection           | Table                  |
| Document (BSON/JSON) | Row                    |
| Field                | Column                 |
| Embedded Documents   | Joins (related tables) |

---

## 🟢 4. Basic CRUD Operations:

Suppose we are using a database called `company` and a collection called `employees`.

| Operation | Command                   | Example                                                            |
| --------- | ------------------------- | ------------------------------------------------------------------ |
| Create    | `insertOne`, `insertMany` | `db.employees.insertOne({ name: "Alice", age: 30 })`               |
| Read      | `find`, `findOne`         | `db.employees.find({ age: { $gt: 25 } })`                          |
| Update    | `updateOne`, `updateMany` | `db.employees.updateOne({ name: "Alice" }, { $set: { age: 31 } })` |
| Delete    | `deleteOne`, `deleteMany` | `db.employees.deleteOne({ name: "Alice" })`                        |

---

## 🟢 5. Important Query Operators:

- `$gt`, `$gte` → greater than, greater than or equal
- `$lt`, `$lte` → less than, less than or equal
- `$in` → match any value in an array
- `$or`, `$and`, `$not` → logical operators
- `$exists` → check if field exists

Example:

```javascript
db.employees.find({
  $or: [{ age: { $gt: 30 } }, { name: "John" }],
});
```

---

## 🟢 6. Indexes:

- **Indexes** make queries faster (just like a book index).
- Create an index on a field:

```javascript
db.employees.createIndex({ age: 1 }); // 1 for ascending, -1 for descending
```

- Find indexes:

```javascript
db.employees.getIndexes();
```

---

## 🟢 7. Aggregation Framework (SUPER important for interviews!):

- Used for complex queries like grouping, filtering, transforming data.

Example: Get average age of employees:

```javascript
db.employees.aggregate([
  { $group: { _id: null, averageAge: { $avg: "$age" } } },
]);
```

Main aggregation stages:
| Stage | Purpose |
|---------------|-----------------------------------------|
| `$match` | Filter documents (like WHERE) |
| `$group` | Group documents |
| `$sort` | Sort documents |
| `$project` | Reshape documents (include/exclude fields) |
| `$lookup` | Join collections (similar to SQL JOIN) |

---

## 🟢 8. Data Modeling in MongoDB:

- **Embedded Documents**: Nest related data inside documents.
- **References**: Store only ObjectIDs to reference another document.

Example (Embedded):

```json
{
  "name": "John",
  "address": { "city": "New York", "zip": "10001" }
}
```

Example (Reference):

```json
{
  "name": "John",
  "address_id": ObjectId("...")
}
```

---

## 🟢 9. Transactions:

- MongoDB now supports **multi-document ACID transactions** (important in banking/financial apps).

```javascript
const session = await client.startSession();
session.startTransaction();
try {
  await db
    .collection("accounts")
    .updateOne({ _id: 1 }, { $inc: { balance: -100 } }, { session });
  await db
    .collection("accounts")
    .updateOne({ _id: 2 }, { $inc: { balance: 100 } }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
session.endSession();
```

---

## 🟢 10. MongoDB Atlas:

- **MongoDB Atlas** is the cloud version of MongoDB.
- Provides ready-to-use MongoDB clusters, backups, monitoring, security, scaling.

---

## 🟢 11. Advanced Topics:

| Topic                       | What it is                                     |
| --------------------------- | ---------------------------------------------- |
| **Sharding**                | Horizontal scaling of data across many servers |
| **Replication**             | High availability via replica sets             |
| **Change Streams**          | Listen to real-time database changes           |
| **Schema Validation**       | Enforce rules on document fields               |
| **Time Series Collections** | Handle time-based data efficiently             |

---

# ⭐ Structure I'll Follow Next ⭐

1. Setup MongoDB (local and Atlas)
2. Practice CRUD and Queries
3. Deep Dive into Aggregation
4. Learn Indexing and Performance
5. Data Modeling Best Practices
6. Transactions
7. Security & Backup
8. Replication, Sharding, Advanced Scalability

---

Would you like me to continue and start with **Installation + Setting Up MongoDB** first?  
(Or we can directly jump into **practical queries** if you're already set up!) 🚀

**Tell me!** 🔥
