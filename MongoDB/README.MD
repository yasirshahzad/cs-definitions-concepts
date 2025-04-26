# MongoDB

---

## 🟢 1. What is MongoDB?

MongoDB is a powerful, open-source NoSQL database that offers a document-oriented data model, providing a flexible alternative to traditional relational databases. Unlike SQL databases, MongoDB stores data in BSON format, which is similar to JSON, enabling efficient and scalable data storage and retrieval.

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

## 🟢 2. Key Concepts

| Concept    | Meaning                               |
| ---------- | ------------------------------------- |
| Database   | A container for collections           |
| Collection | A container for documents             |
| Document   | A record (JSON-like structure)        |
| Field      | A key-value pair inside a document    |
| BSON       | MongoDB uses a binary version of JSON |

---

## SQL vs NoSQL Summary

| **Aspect**         | **SQL (Relational)**                                | **NoSQL (Non-relational)**                            |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------- |
| **Data Structure** | Tables with rows and columns                        | Document, key-value, column-family, or graph-based    |
| **Schema**         | Fixed (predefined) schema                           | Flexible and dynamic schema                           |
| **Scalability**    | Vertically scalable (upgrade server hardware)       | Horizontally scalable (add more servers)              |
| **Data Integrity** | ACID-compliant (strong consistency)                 | BASE-compliant (more available, eventual consistency) |
| **Query Language** | SQL (Structured Query Language)                     | Varies (e.g., MongoDB Query Language)                 |
| **Performance**    | Great for complex queries and transactions          | Better for handling large-scale, fast data operations |
| **Use Case**       | Best for transactional systems (e.g., banking, ERP) | Ideal for big data, real-time apps, and data lakes    |
| **Examples**       | MySQL, PostgreSQL, Oracle, MS SQL Server            | MongoDB, Cassandra, CouchDB, Neo4j                    |

---

## 🟢 3. MongoDB vs SQL

| MongoDB              | SQL                    |
| -------------------- | ---------------------- |
| Collection           | Table                  |
| Document (BSON/JSON) | Row                    |
| Field                | Column                 |
| Embedded Documents   | Joins (related tables) |

- **Schema Design**:

  - RDBMS uses structured tables with defined relationships.
  - MongoDB is document-oriented, schema-less, and flexible.

- **Transactions and Joins**:

  - Complex transactions and joins are better handled by RDBMS; MongoDB does not support complex joins.

- **Key Features of MongoDB**:

  - **Document-Oriented**: Stores complete objects in single documents.
  - **Indexing**: Boosts query performance significantly.
  - **Scalability**: Horizontal scaling using sharding.
  - **Replication & High Availability**: Data redundancy across multiple servers ensures reliability.
  - **Aggregation**: Similar to SQL’s `GROUP BY`, for summarizing data.

- **When to Use MongoDB**:

  - Handling **Big Data**.
  - Applications with **frequently changing or unstable schemas**.
  - Managing **distributed data** safely across servers.

- **Programming Language Support**:  
  MongoDB officially supports many languages like C, C++, Rust, C#, Java, Node.js, Python, Go, and more.

---

**What is BSON?**

- **BSON** stands for **Binary JSON**.
- It’s a **binary-encoded** format used to **store** and **transport** data.
- BSON is similar to **JSON** (JavaScript Object Notation), but it's designed to be **faster**, **more efficient**, and to **support more data types**.

**Key Features of BSON:**

- **Binary format**: Makes reading/writing to disk or network faster than plain JSON text.
- **Rich Data Types**: Supports more types than JSON, like `Date`, `Binary Data`, `ObjectId`, etc.
- **Efficient Traversal**: BSON is organized in a way that makes it easy for databases (like MongoDB) to quickly find and extract fields.
- **Size Overhead**: BSON documents are usually **slightly larger** than equivalent JSON because it stores additional metadata (like field lengths and types).

**Why MongoDB uses BSON?**

- MongoDB uses BSON internally to store documents.
- It allows MongoDB to quickly query documents and perform operations like indexing because type information is already stored.

**Example:**

A JSON document like this:

```json
{
  "name": "Alice",
  "age": 30,
  "isMember": true
}
```

Would be stored in **BSON** as a compact, efficient binary format with type information for each field (`string`, `int32`, `boolean`).

---

## 🟢 4. Basic CRUD Operations

Suppose we are using a database called `company` and a collection called `employees`.

| Operation | Command                   | Example                                                            |
| --------- | ------------------------- | ------------------------------------------------------------------ |
| Create    | `insertOne`, `insertMany` | `db.employees.insertOne({ name: "Alice", age: 30 })`               |
| Read      | `find`, `findOne`         | `db.employees.find({ age: { $gt: 25 } })`                          |
| Update    | `updateOne`, `updateMany` | `db.employees.updateOne({ name: "Alice" }, { $set: { age: 31 } })` |
| Delete    | `deleteOne`, `deleteMany` | `db.employees.deleteOne({ name: "Alice" })`                        |

---

## 🟢 5. Important Query Operators

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

## 🟢 6. Indexes

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

## 🟢 7. Aggregation Framework (SUPER important for interviews!)

- Used for complex queries like grouping, filtering, transforming data.

Example: Get average age of employees:

```javascript
db.employees.aggregate([
  { $group: { _id: null, averageAge: { $avg: "$age" } } },
]);
```

Main aggregation stages:

| Stage      | Purpose                                    |
| ---------- | ------------------------------------------ |
| `$match`   | Filter documents (like WHERE)              |
| `$group`   | Group documents                            |
| `$sort`    | Sort documents                             |
| `$project` | Reshape documents (include/exclude fields) |
| `$lookup`  | Join collections (similar to SQL JOIN)     |

---

## 🟢 8. Data Modeling in MongoDB

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

## 🟢 9. Transactions

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

## 🟢 10. MongoDB Atlas

- **MongoDB Atlas** is the cloud version of MongoDB.
- Provides ready-to-use MongoDB clusters, backups, monitoring, security, scaling.

---

## 🟢 11. Advanced Topics

| Topic                       | What it is                                     |
| --------------------------- | ---------------------------------------------- |
| **Sharding**                | Horizontal scaling of data across many servers |
| **Replication**             | High availability via replica sets             |
| **Change Streams**          | Listen to real-time database changes           |
| **Schema Validation**       | Enforce rules on document fields               |
| **Time Series Collections** | Handle time-based data efficiently             |
