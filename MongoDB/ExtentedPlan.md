# MongoDb Study Plan (Extended)

## 1. Topics

### 1. **Introduction to MongoDB**

- What is MongoDB?
- MongoDB Architecture (high level)
- MongoDB vs Traditional SQL Databases (MySQL, Postgres)

---

### 2. **Data Models and Data Types**

- BSON vs JSON
- Embedded Documents
- MongoDB Core DataTypes (String, Number, ObjectId, Date, Array, Boolean, Null, Binary data, etc.)
- Schema Design Principles (Embedding vs Referencing)

---

### 3. **Collections and Documents**

- What is a Collection?
- What is a Document?
- CRUD Operations:
  - `insertOne()`, `insertMany()`
  - `updateOne()`, `updateMany()`
  - `deleteOne()`, `deleteMany()`
  - `bulkWrite()`
  - `find()`, `findOne()`
  - `countDocuments()`
  - `replaceOne()`
- Indexing:
  - `createIndex()`
  - `dropIndex()`
  - `listIndexes()`
- Upsert Option
- Write Concern

---

### 4. **Query and Projection**

- **Query Filters**
  - Comparison Operators (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`)
  - Logical Operators (`$and`, `$or`, `$not`, `$nor`)
  - Array Operators (`$in`, `$nin`, `$all`, `$size`, `$elemMatch`)
  - Element Operators (`$exists`, `$type`)
- **Projections**
  - Including fields
  - Excluding fields

---

### 5. **Indexing and Optimization**

- Why Indexes?
- Types of Indexes:
  - Single Field Index
  - Compound Index
  - Multikey Index (Array Fields)
  - Text Index
  - Geospatial Index
  - Hashed Index
- Atlas Search Indexes
- Explain Plan (`explain()` method for queries)
- Query Optimization Best Practices

---

### 6. **Aggregation and Pipeline**

- **What is Aggregation?**
- Aggregation Framework
- Aggregation Pipeline Stages:
  - `$match`, `$group`, `$sort`, `$project`, `$limit`, `$skip`, `$lookup`, `$unwind`, etc.
- Aggregation Pipeline Optimization
- Faceted Search using Aggregations

---

### 7. **MongoDB Transactions**

- ACID Transactions in MongoDB
- Multi-Document Transactions
- `startSession()` and `withTransaction()`
- Best Practices for Transactions

---

### 8. **Performance**

- **Replica Sets**
  - How replication works
  - Failover and Elections
- **Sharding**
  - What is Sharding?
  - Shard Keys
  - Sharded Cluster Setup
- Horizontal Scaling vs Vertical Scaling
- Monitoring and Troubleshooting Tools:
  - MongoDB Atlas Monitoring
  - `mongostat`
  - `mongotop`

---

### 9. **Security**

- Role-Based Access Control (RBAC)
- Authentication Methods:
  - SCRAM
  - X.509 Certificate Authentication
  - Kerberos Authentication
  - LDAP Proxy Authentication
- Encryption:
  - TLS/SSL encryption
  - Field-Level Encryption
- MongoDB Auditing and Logs

---

### 10. **MongoDB Development**

- Developer Tools:
  - MongoDB Compass
  - MongoDB Atlas UI
- MongoDB Shell (`mongosh`)
- Language Drivers:
  - Node.js Driver
  - Python (PyMongo)
  - Java Driver
- MongoDB Analyze (Performance Analyzer)

---

### 11. **MongoDB Recovery**

- Backup and Restore:
  - `mongodump` and `mongorestore`
- MongoDB Atlas Backup
- Point-in-Time Recovery (PITR)
- Oplog-Based Backup

---

### 🌟 Extra Topics

- Change Streams (Real-time Data Changes)
- Time Series Collections (for sensor or event data)
- Working with GridFS (for storing large files like videos/images)
- Serverless MongoDB (with Atlas Functions)
- MongoDB Schema Validation
- Multi-Tenancy Patterns (using MongoDB for SaaS apps)
- Connection Pooling

---

## 2. Data Models and Data Types in MongoDB

### 2.1. **BSON vs JSON**

- **JSON** (JavaScript Object Notation):

  - Human-readable data format like `{ "name": "John", "age": 30 }`
  - Supports basic data types: String, Number, Boolean, Null, Array, Object.

- **BSON** (Binary JSON):
  - Internal format MongoDB uses.
  - It's binary, faster for machines to parse.
  - **Supports more data types** than JSON like `Date`, `ObjectId`, `Binary data`, `Decimal128`, etc.

> Simply: You **write** JSON, but MongoDB **stores** BSON.

---

#### Example (JSON vs BSON internally)

**JSON you write:**

```json
{
  "name": "Alice",
  "age": 25,
  "createdAt": "2024-04-26T00:00:00Z"
}
```

**MongoDB stores internally as BSON:**

- `name`: UTF-8 string
- `age`: 32-bit integer
- `createdAt`: BSON Date object (not just text!)

---

### 2.2. **Embedded Documents**

MongoDB supports **documents inside documents** (nested objects).  
This is **called embedding**.

**Example:**

```js
db.users.insertOne({
  name: "John Doe",
  age: 28,
  address: {
    street: "123 Main Street",
    city: "New York",
    zip: "10001",
  },
});
```

- Here, `address` is an **embedded document** inside the `users` document.

**💡 When to Embed?**

- When data is accessed together frequently.
- For one-to-few relationships (e.g., a user and their address).

---

### 2.3. **MongoDB Core Datatypes**

MongoDB supports the following important types:

| Type                                      | Description                 | Example                                        |
| :---------------------------------------- | :-------------------------- | :--------------------------------------------- |
| String                                    | Text                        | `"name": "Alice"`                              |
| Number (Int32, Int64, Double, Decimal128) | Numeric values              | `"age": 30`                                    |
| Boolean                                   | true/false                  | `"isActive": true`                             |
| Date                                      | Date object                 | `"createdAt": ISODate("2024-04-26T00:00:00Z")` |
| Array                                     | List of items               | `"hobbies": ["reading", "traveling"]`          |
| Object                                    | Embedded document           | `"address": { "city": "Paris" }`               |
| ObjectId                                  | Unique identifier           | `"_id": ObjectId("6540d27f8c1b2d3a4a70c123")`  |
| Null                                      | Empty value                 | `"deletedAt": null`                            |
| Binary Data                               | Buffer data (images, files) | `"profilePic": BinData(0, "...")`              |

---

**Quick Code Examples:**

```js
db.examples.insertOne({
  name: "Test User",
  age: 30,
  isActive: true,
  hobbies: ["coding", "music"],
  birthdate: new Date("1994-07-15"),
  metadata: { verified: false, score: 42 },
  customId: new ObjectId(), // auto-generates if not given
  deletedAt: null,
});
```

---

### 2.4. **Data Model Design: Embedding vs Referencing**

When structuring data in MongoDB, you **choose between:**

| Embedding                            | Referencing                                                  |
| :----------------------------------- | :----------------------------------------------------------- |
| Embed related data inside a document | Store related data in a different collection and link via ID |
| Good for fast reads                  | Good for reducing duplication                                |
| Good for small, bounded subdocuments | Good for large or growing related data                       |

---

**Embedding Example (posts and comments):**

```js
db.posts.insertOne({
  title: "MongoDB Basics",
  body: "Learn MongoDB!",
  comments: [
    { user: "Ali", comment: "Great post!" },
    { user: "Sara", comment: "Thanks for the guide!" },
  ],
});
```

**Referencing Example (posts and comments in different collections):**

```js
db.posts.insertOne({ _id: 1, title: "MongoDB Basics", body: "Learn MongoDB!" });

db.comments.insertMany([
  { postId: 1, user: "Ali", comment: "Great post!" },
  { postId: 1, user: "Sara", comment: "Thanks for the guide!" },
]);
```

- Here, `comments` are a **separate collection** with `postId` as a **reference**.

---

### ✅ Quick Summary

| Topic              | Key Points                                           |
| :----------------- | :--------------------------------------------------- |
| BSON vs JSON       | MongoDB stores BSON internally                       |
| Embedded Documents | Nest documents inside documents                      |
| MongoDB Datatypes  | String, Number, Boolean, Array, Date, ObjectId, etc. |
| Data Modeling      | Choose Embed or Reference based on access patterns   |

---

Awesome!  
Let's continue with **3. Collections and Documents** — and I'll keep it **full of code examples** like you asked. 🚀

---

## 3. Collections and Documents

### 3.1. **Collections and Documents**

**Collection** → Like a table in SQL.  
**Document** → Like a row, but flexible (schema-less).

✅ In MongoDB:

- A **collection** holds **documents**.
- A **document** is a **JSON-like object** (BSON internally).

---

**Example - Create a collection and insert documents:**

```js
// Insert a single document into a collection
db.users.insertOne({
  name: "Alice",
  age: 25,
  email: "alice@example.com",
});

// Insert multiple documents
db.users.insertMany([
  { name: "Bob", age: 30, email: "bob@example.com" },
  { name: "Charlie", age: 28, email: "charlie@example.com" },
]);
```

**Note:**

- `db` means the current database (e.g., `use testdb;` before this).
- Collections are **auto-created** when you insert data!

---

### 3.2. **`insert()` Method** (Older)

MongoDB older versions used `insert()`, now we mostly use `insertOne()` or `insertMany()`.  
Still, here's how it works:

```js
// Insert one or more documents
db.products.insert([
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
]);
```

✅ `insert()` is similar to `insertMany()`.

---

### 3.3. **`update()` Method**

There are modern versions:

- `updateOne()`
- `updateMany()`

**Example - updateOne:**

```js
db.users.updateOne(
  { name: "Alice" }, // filter
  { $set: { age: 26 } } // update operation
);
```

**Example - updateMany:**

```js
db.users.updateMany(
  { age: { $lt: 30 } }, // users with age < 30
  { $inc: { age: 1 } } // increment age by 1
);
```

✅ `$set` → to change fields  
✅ `$inc` → to increase numeric fields

---

### 3.4. **`delete()` Method**

Modern methods are:

- `deleteOne()`
- `deleteMany()`

**Example - deleteOne:**

```js
db.users.deleteOne({ name: "Charlie" });
```

**Example - deleteMany:**

```js
db.users.deleteMany({ age: { $gt: 28 } }); // delete all users age > 28
```

---

### 3.5. **`bulkWrite()` Method**

Run **multiple operations** together in one network call (better performance).

**Example:**

```js
db.users.bulkWrite([
  { insertOne: { document: { name: "David", age: 24 } } },
  { updateOne: { filter: { name: "Bob" }, update: { $set: { age: 32 } } } },
  { deleteOne: { filter: { name: "Alice" } } },
]);
```

✅ Use this when you want many operations at once.

---

### 3.6. **`find()` Method**

**Retrieve documents** from a collection.

**Example - Basic:**

```js
db.users.find(); // get all users
```

**Example - With a filter:**

```js
db.users.find({ age: { $gte: 25 } });
```

**Example - Pretty format:**

```js
db.users.find().pretty();
```

---

### 3.7. **`countDocuments()` Method**

Count how many documents match a query.

**Example:**

```js
db.users.countDocuments({ age: { $gte: 25 } });
```

✅ Useful for pagination, reports, etc.

---

### 3.8. **`createIndex()` Method**

Improve query performance by creating indexes.

**Example - Create index on `email`:**

```js
db.users.createIndex({ email: 1 }); // 1 = ascending order
```

✅ Now queries on `email` will be much faster!

---

### 3.9. **`dropIndex()` Method**

Remove an index.

**Example:**

```js
db.users.dropIndex("email_1"); // index name is usually field_direction
```

✅ Use carefully — dropping an index can slow down queries!

---

### ✅ Quick Recap

| Method                     | Purpose                     | Example                                   |
| :------------------------- | :-------------------------- | :---------------------------------------- |
| insertOne(), insertMany()  | Add documents               | `db.collection.insertOne({...})`          |
| updateOne(), updateMany()  | Update documents            | `db.collection.updateOne(filter, update)` |
| deleteOne(), deleteMany()  | Delete documents            | `db.collection.deleteOne(filter)`         |
| bulkWrite()                | Perform multiple operations | `db.collection.bulkWrite([...])`          |
| find()                     | Query documents             | `db.collection.find(filter)`              |
| countDocuments()           | Count matching documents    | `db.collection.countDocuments(filter)`    |
| createIndex(), dropIndex() | Manage indexes              | `db.collection.createIndex({ field: 1 })` |

Awesome — let's move to **4. CRUD (MongoDB CRUD, upsert, write concern)**! 🚀  
I'll again give **clear explanations + many code examples**.

---

## 4. CRUD (Create, Read, Update, Delete)

MongoDB follows the traditional **CRUD** model:

| Operation  | MongoDB Methods               | Purpose            |
| :--------- | :---------------------------- | :----------------- |
| **Create** | `insertOne()`, `insertMany()` | Add documents      |
| **Read**   | `find()`, `findOne()`         | Retrieve documents |
| **Update** | `updateOne()`, `updateMany()` | Modify documents   |
| **Delete** | `deleteOne()`, `deleteMany()` | Remove documents   |

---

### 4.1. **Create**

Insert new documents into a collection.

```js
// Insert one document
db.books.insertOne({
  title: "The Alchemist",
  author: "Paulo Coelho",
  price: 15.99,
});

// Insert multiple documents
db.books.insertMany([
  { title: "1984", author: "George Orwell", price: 12.99 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", price: 10.99 },
]);
```

---

### 4.2. **Read**

Query documents from a collection.

```js
// Find all documents
db.books.find();

// Find specific documents
db.books.find({ author: "George Orwell" });

// Find one document
db.books.findOne({ title: "1984" });
```

You can also use **projections** to control what fields you return:

```js
// Only return title and author (no _id)
db.books.find({}, { _id: 0, title: 1, author: 1 });
```

---

### 4.3. **Update**

Modify existing documents.

```js
// Update one document
db.books.updateOne(
  { title: "The Alchemist" }, // Filter
  { $set: { price: 17.99 } } // Update operation
);

// Update many documents
db.books.updateMany(
  { price: { $lt: 15 } }, // Books cheaper than $15
  { $inc: { price: 2 } } // Increase price by 2
);
```

✅ MongoDB update operators like `$set`, `$inc`, `$unset` are very powerful.

---

### 4.4. **Delete**

Remove documents.

```js
// Delete one document
db.books.deleteOne({ title: "1984" });

// Delete many documents
db.books.deleteMany({ price: { $gt: 15 } });
```

✅ Deletes are **permanent** — be careful!

---

### 4.5. **Upsert Option**

**Upsert** = Update if exists, Insert if not.

**Example:**

```js
db.books.updateOne(
  { title: "Brave New World" }, // Filter
  { $set: { author: "Aldous Huxley", price: 13.99 } },
  { upsert: true } // Upsert option
);
```

✅ If `Brave New World` exists, it will update it.  
✅ If it doesn't exist, it will insert a **new document**.

---

### 4.6. **Write Concern**

**Write Concern** = How sure MongoDB should be that the write was successful.

You can control:

- **Acknowledged** writes
- **Replication** before confirming write
- **Journaled** writes (disk writes)

**Example - Basic acknowledged write:**

```js
db.books.insertOne(
  { title: "Sapiens", author: "Yuval Noah Harari" },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);
```

| Option           | Meaning                                                        |
| :--------------- | :------------------------------------------------------------- |
| `w: "majority"`  | Wait until the write has been propagated to most replica nodes |
| `j: true`        | Wait until the write is committed to disk                      |
| `wtimeout: 5000` | Timeout if not completed within 5 seconds                      |

✅ Higher write concern = More safe  
✅ But can also = Slower writes

---

### 🚀 Quick Full CRUD Example

```js
// 1. Create
db.students.insertOne({ name: "John Doe", grade: "A" });

// 2. Read
db.students.find({ name: "John Doe" });

// 3. Update
db.students.updateOne({ name: "John Doe" }, { $set: { grade: "A+" } });

// 4. Delete
db.students.deleteOne({ name: "John Doe" });
```

---

### 🔥 Summary Table

| CRUD          | Method                                  | Example                               |
| :------------ | :-------------------------------------- | :------------------------------------ |
| Create        | `insertOne()`, `insertMany()`           | Add documents                         |
| Read          | `find()`, `findOne()`                   | Query documents                       |
| Update        | `updateOne()`, `updateMany()`, `upsert` | Modify documents                      |
| Delete        | `deleteOne()`, `deleteMany()`           | Remove documents                      |
| Write Concern | Optional in all                         | `{ writeConcern: { w: "majority" } }` |

---

## 5. QUERY AND PROJECTION

### 5.1. **Basic Query**

MongoDB queries are similar to **JSON objects**. You provide a filter, and MongoDB will search for documents that match that filter.

**Example:**

```js
db.users.find({ age: 30 }); // Find all users aged 30
```

---

### 5.2. **Projections**

You can use **projections** to specify which fields to return in the result.

```js
// Find users aged 30, but only return the `name` and `age` fields
db.users.find({ age: 30 }, { name: 1, age: 1, _id: 0 });
```

✅ **`_id: 0`** removes the `_id` field from the result.

---

### 5.3. **Comparison Operators**

MongoDB supports comparison operators for filtering data.

#### Common Comparison Operators

- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal to
- `$lt`: Less than
- `$lte`: Less than or equal to
- `$in`: Match any value in an array
- `$nin`: Not in an array

**Examples:**

```js
// Find users aged greater than 25
db.users.find({ age: { $gt: 25 } });

// Find users whose age is either 25 or 30
db.users.find({ age: { $in: [25, 30] } });

// Find users whose age is not in [20, 22, 24]
db.users.find({ age: { $nin: [20, 22, 24] } });
```

---

### 5.4. **Logical Operators**

Logical operators combine multiple conditions.

#### Common Logical Operators

- `$and`: All conditions must be true
- `$or`: At least one condition must be true
- `$not`: Inverts the query
- `$nor`: None of the conditions must be true

**Examples:**

```js
// Find users aged 25 AND living in "New York"
db.users.find({ $and: [{ age: 25 }, { city: "New York" }] });

// Find users aged 25 OR 30
db.users.find({ $or: [{ age: 25 }, { age: 30 }] });

// Find users NOT aged 25
db.users.find({ age: { $not: { $eq: 25 } } });
```

---

### 5.5. **Array Operators**

MongoDB supports a variety of operators for querying **arrays**.

#### Common Array Operators:

- `$all`: Match all elements in an array
- `$elemMatch`: Match documents with arrays containing elements that satisfy a query
- `$size`: Match arrays of a specific size
- `$exists`: Check if a field exists (useful for arrays)

**Examples:**

```js
// Find users with a specific set of hobbies
db.users.find({ hobbies: { $all: ["reading", "swimming"] } });

// Find users with at least one hobby matching "music"
db.users.find({ hobbies: { $elemMatch: { $eq: "music" } } });

// Find users who have exactly 3 hobbies
db.users.find({ hobbies: { $size: 3 } });
```

---

### 5.6. **Element Operators**

These operators allow you to check the presence or type of a field.

#### Common Element Operators

- `$exists`: Matches documents that have a field
- `$type`: Matches documents that have a field of a specific type

**Examples:**

```js
// Find users with an email field
db.users.find({ email: { $exists: true } });

// Find users with an email field that is a string
db.users.find({ email: { $type: "string" } });
```

---

### 🧠 **Quick Examples**

Here's a set of queries combining multiple operators for practice:

```js
// 1. Find all users who are either 25 years old or live in "New York"
db.users.find({ $or: [{ age: 25 }, { city: "New York" }] });

// 2. Find all users who are not 30 years old and are in the "Engineering" department
db.users.find({ $and: [{ age: { $ne: 30 } }, { department: "Engineering" }] });

// 3. Find all products with the tag "electronics" and a price greater than 50
db.products.find({ tags: { $all: ["electronics"] }, price: { $gt: 50 } });

// 4. Find all users with exactly 2 hobbies
db.users.find({ hobbies: { $size: 2 } });

// 5. Find users with a `phoneNumber` field that is a string
db.users.find({ phoneNumber: { $type: "string" } });
```

---

### 🔥 Summary Table of Operators

| Operator     | Meaning                               | Example                                         |
| :----------- | :------------------------------------ | :---------------------------------------------- |
| `$eq`        | Equal to                              | `{ age: { $eq: 30 } }`                          |
| `$ne`        | Not equal to                          | `{ age: { $ne: 30 } }`                          |
| `$gt`        | Greater than                          | `{ age: { $gt: 30 } }`                          |
| `$gte`       | Greater than or equal to              | `{ age: { $gte: 25 } }`                         |
| `$lt`        | Less than                             | `{ age: { $lt: 40 } }`                          |
| `$lte`       | Less than or equal to                 | `{ age: { $lte: 30 } }`                         |
| `$in`        | Matches any of the values in an array | `{ age: { $in: [25, 30] } }`                    |
| `$nin`       | Does not match any value in an array  | `{ age: { $nin: [20, 22] } }`                   |
| `$and`       | Logical AND                           | `{ $and: [{ age: 30 }, { city: "New York" }] }` |
| `$or`        | Logical OR                            | `{ $or: [{ age: 30 }, { city: "New York" }] }`  |
| `$not`       | Logical NOT                           | `{ age: { $not: { $eq: 25 } } }`                |
| `$all`       | Matches all values in an array        | `{ tags: { $all: ["electronics"] } }`           |
| `$elemMatch` | Matches specific elements in an array | `{ hobbies: { $elemMatch: { $eq: "music" } } }` |
| `$size`      | Matches arrays of a specific size     | `{ hobbies: { $size: 3 } }`                     |
| `$exists`    | Matches documents with a field        | `{ email: { $exists: true } }`                  |
| `$type`      | Matches fields of a specific type     | `{ email: { $type: "string" } }`                |

---

Let's dive into **6. Indexing and Optimization**. This is a critical part of working with MongoDB because it can significantly improve the performance of queries by reducing the number of documents MongoDB needs to scan.

---

## 6. INDEXING AND OPTIMIZATION

### 6.1. **Index Types**

Indexes in MongoDB work similarly to indexes in books: they allow the database to quickly locate data without scanning the entire collection.

#### Common Index Types

- **Single Field Index**: Indexes a single field.
- **Compound Index**: Indexes multiple fields.
- **Multikey Index**: Indexes an array field, creating an index entry for each element in the array.
- **Text Index**: For full-text search on string fields.
- **Hashed Index**: Indexes the hashed value of a field.
- **Geospatial Indexes**: For spatial data (like location-based queries).

#### Example of Index Creation

##### Single Field Index

```js
// Create an index on the `age` field
db.users.createIndex({ age: 1 }); // 1 for ascending order, -1 for descending
```

#### Compound Index

```js
// Create a compound index on `name` and `age` fields
db.users.createIndex({ name: 1, age: -1 });
```

#### Text Index

```js
// Create a text index on `description` field
db.products.createIndex({ description: "text" });
```

---

### 6.2. **Using Indexes**

Once you have indexes, MongoDB will use them to optimize queries. Here's how you can check if an index is being used:

#### Check Index Usage

```js
// Explain the query to see if an index is being used
db.users.find({ age: 30 }).explain("executionStats");
```

The `"executionStats"` option will show you details like whether an index is being used, the number of documents scanned, and more.

---

### 6.3. **Indexing Strategy**

1. **Create Indexes on Frequently Queried Fields**: Index fields that are frequently used in queries to improve query speed.
2. **Compound Indexes**: Use compound indexes when queries involve multiple fields. However, order matters in compound indexes (the fields must be queried in the index order).
3. **Limit Index Size**: Avoid over-indexing. Indexing every field can degrade write performance, and indexes take up disk space.
4. **Use `explain()` to Monitor Index Efficiency**: Regularly monitor query performance to ensure the right indexes are being used.

---

### 6.4. **Query Optimization**

MongoDB provides several tools to optimize queries. The key ones are **query structure** and **indexing**.

#### 6.4.1. **Covered Queries**

A **covered query** is one where all the fields returned by the query are present in the index. This prevents MongoDB from having to scan the actual documents, thus improving performance.

**Example:**

```js
// Create an index on fields that will be queried and projected
db.users.createIndex({ age: 1, name: 1 });

// Query that only requires the indexed fields
db.users.find({ age: 30 }, { name: 1 }).explain("executionStats");
```

In the above query, if the index contains both `age` and `name`, MongoDB can use the index to "cover" the query, improving performance.

#### 6.4.2. **Use `limit()` and `skip()`**

When working with large datasets, it's often helpful to use `limit()` and `skip()` to avoid querying too many documents at once.

```js
// Find the first 10 users
db.users.find().limit(10);

// Skip the first 10 users, and find the next 10
db.users.find().skip(10).limit(10);
```

These commands are especially useful when you're implementing **pagination** in your application.

---

### 6.5. **Indexing with MongoDB Atlas Search**

MongoDB Atlas provides **Atlas Search**, which is built on **full-text search capabilities**.

#### 6.5.1. **Atlas Full-Text Search**

You can create advanced text indexes directly from the MongoDB Atlas UI.

- **Index fields** that you want to search against.
- Use **`$search`** stage in aggregation pipelines for advanced text searches.

Example using `$search`:

```js
db.products.aggregate([
  {
    $search: {
      text: {
        query: "laptop",
        path: "name",
      },
    },
  },
]);
```

---

### 6.6. **Managing Indexes**

- **List Indexes**:

```js
db.users.getIndexes();
```

- **Drop Index**:

```js
// Drop an index
db.users.dropIndex({ age: 1 });
```

- **Drop All Indexes**:

```js
// Drop all indexes except the default _id index
db.users.dropIndexes();
```

---

### 6.7. **Indexing and Performance Tuning**

#### 6.7.1. **Use Compound Indexes for Multiple Conditions**

When a query filters on multiple fields, a **compound index** is more efficient than creating separate indexes for each field.

```js
// Create a compound index on `age` and `city`
db.users.createIndex({ age: 1, city: 1 });

// This query will benefit from the compound index
db.users.find({ age: 30, city: "New York" });
```

#### 6.7.2. **Optimize Indexes for Sorting**

If you're frequently sorting by a field, consider adding an index to that field.

```js
// Create an index on `age` for sorting
db.users.createIndex({ age: 1 });

// Find users sorted by age
db.users.find().sort({ age: 1 });
```

---

## 7. AGGREGATION AND PIPELINE

### 7.1. **What is Aggregation?**

**Aggregation** means **processing data records** and **returning computed results**.

- It's like SQL's `GROUP BY`, `SUM()`, `COUNT()`, etc.
- It's **faster** and **more powerful** than manual loops.
- MongoDB provides the **Aggregation Pipeline**, where **documents pass through multiple stages** to be transformed.

---

### 7.2. **Aggregation Pipeline Structure**

```js
db.collection.aggregate([
  { Stage1 },
  { Stage2 },
  { Stage3 },
  ...
])
```

Each **stage** transforms the documents in some way.  
The output of one stage becomes the input to the next stage.

---

### 7.3. **Common Aggregation Stages**

| Stage      | Purpose                                       |
| ---------- | --------------------------------------------- |
| `$match`   | Filter documents (like `find()`)              |
| `$group`   | Group documents by a field and do aggregation |
| `$sort`    | Sort documents                                |
| `$project` | Reshape documents, add/remove fields          |
| `$limit`   | Limit the number of documents                 |
| `$skip`    | Skip a number of documents                    |
| `$count`   | Count documents                               |
| `$unwind`  | Deconstruct arrays into multiple documents    |
| `$lookup`  | Perform a LEFT JOIN with another collection   |

---

### 7.4. **Simple Example**

Suppose we have a `sales` collection:

```js
db.sales.insertMany([
  { item: "apple", quantity: 5, price: 10 },
  { item: "banana", quantity: 10, price: 5 },
  { item: "apple", quantity: 15, price: 10 },
  { item: "banana", quantity: 5, price: 5 },
]);
```

---

#### Example 1: Group sales by item and calculate total quantity

```js
db.sales.aggregate([
  {
    $group: {
      _id: "$item", // group by "item"
      totalQuantity: { $sum: "$quantity" },
    },
  },
]);
```

**Result:**

```json
[
  { "_id": "apple", "totalQuantity": 20 },
  { "_id": "banana", "totalQuantity": 15 }
]
```

---

#### Example 2: Match + Group + Sort

```js
db.sales.aggregate([
  { $match: { item: "apple" } }, // First filter
  {
    $group: {
      _id: "$item",
      totalSales: { $sum: { $multiply: ["$quantity", "$price"] } },
    },
  }, // Then group and sum
  { $sort: { totalSales: -1 } }, // Then sort descending
]);
```

**Result:**

```json
[{ "_id": "apple", "totalSales": 200 }]
```

---

### 7.5. **Important Aggregation Operators**

- `$sum`: Sum values.
- `$avg`: Average.
- `$min` / `$max`: Minimum / Maximum value.
- `$push`: Push values into an array.
- `$addToSet`: Add unique values to an array.
- `$first` / `$last`: Get first or last value (based on sort).

---

### 7.6. **Aggregation Pipeline Optimization**

🔵 **Best Practices for Optimization:**

1. **$match early**: Filter data as early as possible.

   ```js
   // Good: $match comes first
   [ { $match: {...} }, { $group: {...} } ]
   ```

2. **Use Indexes** with `$match` and `$sort`.
3. **Limit documents early** if possible using `$limit`.
4. **Minimize document size** using `$project` to keep only required fields.
5. **Avoid $lookup unless necessary** (joins can be slow).

---

### 7.7. **Advanced Example: JOIN with `$lookup`**

Suppose:

- Collection: `orders`
- Collection: `products`

```js
// products
db.products.insertMany([
  { _id: 1, name: "Laptop" },
  { _id: 2, name: "Phone" },
]);

// orders
db.orders.insertMany([
  { _id: 100, product_id: 1, quantity: 2 },
  { _id: 101, product_id: 2, quantity: 5 },
]);
```

#### Perform a JOIN using `$lookup`

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "products", // Join with products collection
      localField: "product_id", // Field from orders
      foreignField: "_id", // Field from products
      as: "productDetails", // Output array field
    },
  },
]);
```

**Result:**

```json
[
  {
    "_id": 100,
    "product_id": 1,
    "quantity": 2,
    "productDetails": [{ "_id": 1, "name": "Laptop" }]
  },
  {
    "_id": 101,
    "product_id": 2,
    "quantity": 5,
    "productDetails": [{ "_id": 2, "name": "Phone" }]
  }
]
```

---

### ✨ QUICK CHEAT SHEET

| Pipeline Stage | Example                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `$match`       | Filter documents: `{ $match: { status: "active" } }`                    |
| `$group`       | Group documents: `{ $group: { _id: "$category", total: { $sum: 1 } } }` |
| `$sort`        | Sort documents: `{ $sort: { age: -1 } }`                                |
| `$project`     | Reshape documents: `{ $project: { name: 1, age: 1 } }`                  |
| `$lookup`      | Join collections                                                        |
| `$unwind`      | Split array fields                                                      |

---

Awesome! Let's build a **real-world MongoDB aggregation** for a **Leaderboard**. 🎯  
This is a super useful pattern for games, online courses, sales apps, fitness apps, etc.

---

### 🏆 Building a Leaderboard using MongoDB Aggregation

### 1. Sample Data

Suppose we have a `scores` collection like this:

```js
db.scores.insertMany([
  { player: "Alice", points: 1200, level: 5, country: "USA" },
  { player: "Bob", points: 950, level: 4, country: "Canada" },
  { player: "Charlie", points: 1450, level: 6, country: "USA" },
  { player: "David", points: 500, level: 2, country: "UK" },
  { player: "Eva", points: 1300, level: 5, country: "Germany" },
  { player: "Frank", points: 750, level: 3, country: "USA" },
]);
```

---

### 2. Goal

✅ Rank players based on `points`  
✅ Show top N players (e.g., top 3)  
✅ Optionally, filter by `country`

---

### 3. Simple Leaderboard: Top 3 Players

```js
db.scores.aggregate([
  { $sort: { points: -1 } }, // Sort by points descending
  { $limit: 3 }, // Only top 3
  { $project: { _id: 0, player: 1, points: 1, level: 1 } }, // Show only needed fields
]);
```

**Result:**

```json
[
  { "player": "Charlie", "points": 1450, "level": 6 },
  { "player": "Eva", "points": 1300, "level": 5 },
  { "player": "Alice", "points": 1200, "level": 5 }
]
```

---

### 4. Leaderboard by Country: Top 2 USA Players

```js
db.scores.aggregate([
  { $match: { country: "USA" } }, // Filter by country
  { $sort: { points: -1 } }, // Sort by points
  { $limit: 2 }, // Top 2
  { $project: { _id: 0, player: 1, points: 1, level: 1 } },
]);
```

**Result:**

```json
[
  { "player": "Charlie", "points": 1450, "level": 6 },
  { "player": "Alice", "points": 1200, "level": 5 }
]
```

---

### 5. Full Leaderboard with Ranks

MongoDB 5.0+ introduced **`$setWindowFields`**, allowing you to **assign RANKS**!

```js
db.scores.aggregate([
  {
    $setWindowFields: {
      sortBy: { points: -1 },
      output: {
        rank: { $rank: {} }, // Assign rank based on points
      },
    },
  },
  {
    $project: { _id: 0, player: 1, points: 1, level: 1, rank: 1 },
  },
]);
```

**Result:**

```json
[
  { "player": "Charlie", "points": 1450, "level": 6, "rank": 1 },
  { "player": "Eva", "points": 1300, "level": 5, "rank": 2 },
  { "player": "Alice", "points": 1200, "level": 5, "rank": 3 },
  { "player": "Bob", "points": 950, "level": 4, "rank": 4 },
  { "player": "Frank", "points": 750, "level": 3, "rank": 5 },
  { "player": "David", "points": 500, "level": 2, "rank": 6 }
]
```

---

### 🎯 Concepts Used Here

- `$match` → Filter by country
- `$sort` → Sort players
- `$limit` → Limit results
- `$project` → Select specific fields
- `$setWindowFields` + `$rank` → Assigning ranking numbers (MongoDB 5.0+)

---

### ✨ Bonus Tips

- You can also add **pagination** with `$skip` + `$limit` for "load more players."
- You can **group by level** using `$group` and show average points per level.
- You can **join** with a `users` collection (profile images, bios) using `$lookup`.

---

### 🏆 Leaderboard with Daily / Weekly / Monthly Aggregation

### 1. Sample Data (with Timestamps)

We'll insert some **sample scores** where users score points on different days.

```js
db.scores.insertMany([
  { player: "Alice", points: 300, timestamp: new Date("2025-04-25T10:00:00Z") },
  { player: "Alice", points: 200, timestamp: new Date("2025-04-25T15:00:00Z") },
  { player: "Bob", points: 400, timestamp: new Date("2025-04-25T12:00:00Z") },
  {
    player: "Charlie",
    points: 500,
    timestamp: new Date("2025-04-24T09:00:00Z"),
  },
  { player: "David", points: 250, timestamp: new Date("2025-04-23T18:00:00Z") },
  { player: "Eva", points: 600, timestamp: new Date("2025-04-22T14:00:00Z") },
  { player: "Frank", points: 450, timestamp: new Date("2025-04-21T16:00:00Z") },
]);
```

---

### 2. 🎯 Daily Leaderboard (group by date)

```js
db.scores.aggregate([
  {
    $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        player: "$player",
      },
      totalPoints: { $sum: "$points" },
    },
  },
  { $sort: { "_id.date": -1, totalPoints: -1 } },
  {
    $group: {
      _id: "$_id.date",
      topPlayers: {
        $push: { player: "$_id.player", points: "$totalPoints" },
      },
    },
  },
  { $sort: { _id: -1 } },
]);
```

🔵 **Explanation:**

- First group by **date** + **player**.
- Sum the points per player for that date.
- Then group again by **date** to get a list of top players.

---

✅ **Result (Daily Leaderboard):**

```json
[
  {
    "_id": "2025-04-25",
    "topPlayers": [
      { "player": "Bob", "points": 400 },
      { "player": "Alice", "points": 500 }
    ]
  },
  {
    "_id": "2025-04-24",
    "topPlayers": [
      { "player": "Charlie", "points": 500 }
    ]
  },
  {
    "_id": "2025-04-23",
    "topPlayers": [
      { "player": "David", "points": 250 }
    ]
  },
  ...
]
```

---

### 3. 🎯 Weekly Leaderboard (group by week)

```js
db.scores.aggregate([
  {
    $group: {
      _id: {
        week: { $isoWeek: "$timestamp" }, // Group by ISO week
        year: { $isoWeekYear: "$timestamp" },
        player: "$player",
      },
      totalPoints: { $sum: "$points" },
    },
  },
  { $sort: { "_id.year": -1, "_id.week": -1, totalPoints: -1 } },
  {
    $group: {
      _id: { year: "$_id.year", week: "$_id.week" },
      topPlayers: {
        $push: { player: "$_id.player", points: "$totalPoints" },
      },
    },
  },
  { $sort: { "_id.year": -1, "_id.week": -1 } },
]);
```

✅ **Result (Weekly Leaderboard):**

```json
[
  {
    "_id": { "year": 2025, "week": 17 },
    "topPlayers": [
      { "player": "Eva", "points": 600 },
      { "player": "Frank", "points": 450 },
      { "player": "Charlie", "points": 500 }
    ]
  }
]
```

---

### 4. 🎯 Monthly Leaderboard (group by month)

```js
db.scores.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$timestamp" },
        month: { $month: "$timestamp" },
        player: "$player",
      },
      totalPoints: { $sum: "$points" },
    },
  },
  { $sort: { "_id.year": -1, "_id.month": -1, totalPoints: -1 } },
  {
    $group: {
      _id: { year: "$_id.year", month: "$_id.month" },
      topPlayers: {
        $push: { player: "$_id.player", points: "$totalPoints" },
      },
    },
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } },
]);
```

✅ **Result (Monthly Leaderboard):**

```json
[
  {
    "_id": { "year": 2025, "month": 4 },
    "topPlayers": [
      { "player": "Eva", "points": 600 },
      { "player": "Charlie", "points": 500 },
      { "player": "Frank", "points": 450 },
      { "player": "Bob", "points": 400 },
      { "player": "Alice", "points": 500 },
      { "player": "David", "points": 250 }
    ]
  }
]
```

---

### ✨ Concepts We Used

- `$group` → To group scores by day/week/month
- `$dateToString`, `$year`, `$month`, `$isoWeek`, `$isoWeekYear` → Date operations
- `$sort` → To order players by points
- `$push` → Collect players under one document
- `$sum` → Total points for a player

---

## 8. 🛡️ MongoDB Transactions

### 📖 What is a Transaction?

A **Transaction** in MongoDB is like a **"bundle of multiple operations"** that are treated as a single unit.  
✅ **All operations succeed together**, or  
❌ **All operations fail together** (rollback).

Very useful for **financial apps**, **inventory systems**, **multi-step updates**, etc.

---

### 🧠 Key Points

- MongoDB transactions are **ACID compliant** (Atomic, Consistent, Isolated, Durable).
- Available on **replica sets** (MongoDB 4.0+) and **sharded clusters** (MongoDB 4.2+).
- You use **sessions** to start a transaction.

---

#### 📦 Example 1: Single-document Update without Transaction

Normally without transaction:

```js
db.accounts.updateOne({ username: "Alice" }, { $inc: { balance: -100 } });

db.accounts.updateOne({ username: "Bob" }, { $inc: { balance: 100 } });
```

If **one update succeeds and the other fails**, your data is inconsistent!  
Imagine deducting money from Alice but not crediting Bob. 🥲

---

### 🚀 Example 2: Multi-document Transaction

**Safe Money Transfer** between Alice ➡️ Bob:

```js
// Start a session
const session = await db.getMongo().startSession();

try {
  session.startTransaction(); // 👈 Start Transaction

  await db.accounts.updateOne(
    { username: "Alice" },
    { $inc: { balance: -100 } },
    { session }
  );

  await db.accounts.updateOne(
    { username: "Bob" },
    { $inc: { balance: 100 } },
    { session }
  );

  await session.commitTransaction(); // ✅ Commit changes
  console.log("Transaction committed successfully!");
} catch (error) {
  await session.abortTransaction(); // ❌ Rollback if error
  console.error("Transaction aborted due to error:", error);
} finally {
  await session.endSession(); // End session
}
```

---

### ⚙️ Important Methods

| Method                | Meaning                  |
| :-------------------- | :----------------------- |
| `startSession()`      | Start a client session   |
| `startTransaction()`  | Start a transaction      |
| `commitTransaction()` | Commit (apply) changes   |
| `abortTransaction()`  | Abort (rollback) changes |
| `endSession()`        | Close the session        |

---

### 🌟 Important Notes

- Use **transactions only when needed**; they are heavier than normal ops.
- If you're working **inside one document**, MongoDB already ensures atomicity (no transaction needed).
- Set **write concern** and **read concern** inside transaction for strong guarantees.

Example:

```js
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
});
```

---

### 🎯 Where Transactions are SUPER useful

- **Banking systems** (transfer money).
- **Inventory management** (update stock and orders).
- **Booking systems** (hotel, flight booking — reserve multiple things atomically).
- **User creation flow** (create user + assign permissions + log).

---

### Quick Summary

| Concept                    | Description                                   |
| :------------------------- | :-------------------------------------------- |
| Multi-document Transaction | Modify multiple documents safely              |
| ACID                       | Atomicity, Consistency, Isolation, Durability |
| Session                    | Required to handle transactions               |
| Commit or Abort            | You either fully save or fully undo           |

---

## 9. ⚡ PERFORMANCE in MongoDB

MongoDB is **designed to scale**, but to make it _perform really well_, you need to understand:

- **Replica Sets** (for fault tolerance)
- **Sharding** (for horizontal scaling)
- **Indexing** (already discussed earlier)
- **Monitoring and Troubleshooting**

### 9.1. 🔁 Replica Sets (High Availability)

A **Replica Set** is a group of MongoDB servers that **keep copies** of the same data.

**At any time:**

- 1 node = **Primary** (accepts writes/reads)
- Others = **Secondaries** (copies/replicas)
- If the primary crashes, an **automatic election** makes a secondary the new primary.

👉 **Purpose:** Data redundancy, automatic failover, backup.

---

#### 📦 Example: Create a Replica Set Locally

(Assuming you have 3 `mongod` servers running)

```bash
# Start each mongod server with a replica set name
mongod --replSet "rs0" --port 27017 --dbpath /data/node1
mongod --replSet "rs0" --port 27018 --dbpath /data/node2
mongod --replSet "rs0" --port 27019 --dbpath /data/node3
```

Then connect and initiate:

```js
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" },
  ],
});
```

Now you have a **replica set**! 🎯

---

### 9.2. 🧩 Sharding (Horizontal Scaling)

When your **data is too big** for one server, you **split** (shard) it across multiple servers.

**Each shard** holds part of the dataset.

👉 **Purpose:** Scale **out** (horizontally) and handle massive data volume.

---

#### 🧠 How Sharding Works

- **Shard Key**: Field used to divide data.
- **Mongos**: Query router that knows where data is.
- **Config Servers**: Store metadata about the cluster.

---

### 📦 Example: Simple Sharded Cluster

```bash
# Start config servers
mongod --configsvr --replSet configReplSet --port 27019 --dbpath /data/config

# Start shards
mongod --shardsvr --port 27018 --dbpath /data/shard1
mongod --shardsvr --port 27017 --dbpath /data/shard2

# Start mongos router
mongos --configdb configReplSet/localhost:27019
```

Then enable sharding on your database:

```js
sh.enableSharding("mydatabase");
sh.shardCollection("mydatabase.users", { userId: "hashed" });
```

Done! 🔥

---

### 9.3. 📈 Monitoring and Troubleshooting

You **must monitor** your MongoDB servers in production.

---

#### 🛠 Built-in Tools

- `mongostat` — Show live server stats.
- `mongotop` — Show collection read/write activity.

```bash
mongostat --host localhost:27017
mongotop --host localhost:27017
```

---

### 📊 MongoDB Atlas (Cloud Monitoring)

If you're using **MongoDB Atlas**, it gives you beautiful **dashboards**:

- Slow queries
- Replica lag
- Disk I/O
- CPU usage
- Index usage
- Query performance

✅ Easy to set **alerts** when something goes wrong.

---

### 🚨 Troubleshooting Tips

| Symptom            | Possible Cause                   |
| :----------------- | :------------------------------- |
| High Latency       | Missing indexes, slow disk       |
| Replica Lag        | Network issues, slow secondaries |
| Sharding imbalance | Bad shard key choice             |
| High Memory Usage  | Large working set                |

---

### 🔥 Real-world Practices for PERFORMANCE

- Always **create indexes** on query fields.
- Use **read preference** (nearest, secondary, etc.) smartly.
- Pick a **good shard key** (high cardinality + low update rate).
- Monitor **replica lag** and fix issues immediately.
- Use **bulk operations** to reduce network round trips.

---

### 🎯 Quick Summary

| Concept      | Why Important           |
| :----------- | :---------------------- |
| Replica Sets | High availability (HA)  |
| Sharding     | Handle massive datasets |
| Monitoring   | Catch problems early    |

Awesome! Let's dive into

## 10: 🔒 SECURITY in MongoDB

Security is **critical** once you move beyond your local laptop — you must lock down MongoDB properly!

We'll cover:

- Role-Based Access Control (RBAC)
- TLS/SSL Encryption
- Encryption at Rest
- Authentication Methods (X.509, LDAP, Kerberos)
- Auditing

### 10.1. 🛡️ Role-Based Access Control (RBAC)

MongoDB uses **roles** to control what users can do.

👉 Instead of giving users full admin rights, you assign them **roles**.

#### 📦 Example: Create a User with Role

First, enable authentication in your `mongod`:

```bash
mongod --auth --dbpath /data/db
```

Then connect locally without authentication to create a user:

```javascript
use admin;

db.createUser({
  user: "siteAdmin",
  pwd: "SuperSecret123",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});
```

Now this user can **create other users** across databases.

✅ Best practice: Use **least privilege** principle — only grant what's needed.

---

#### ✨ Common Built-in Roles

| Role           | Description                    |
| :------------- | :----------------------------- |
| `read`         | Read-only access               |
| `readWrite`    | Read and write                 |
| `dbAdmin`      | Database administration tasks  |
| `userAdmin`    | Manage users and roles         |
| `clusterAdmin` | Manage cluster-wide operations |

---

### 10.2. 🔐 TLS/SSL Encryption (Secure Data in Transit)

TLS/SSL encrypts all data moving between **clients ↔ servers**.

**Without it**, passwords and sensitive data could be sniffed!

#### 📦 Example: Start MongoDB with SSL

First, create a self-signed certificate (for dev):

```bash
openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key
cat mongodb-cert.key mongodb-cert.crt > mongodb.pem
```

Start `mongod` with SSL:

```bash
mongod --sslMode requireSSL --sslPEMKeyFile /path/to/mongodb.pem
```

✅ In production, use **certificates signed by a trusted CA**.

### 10.3. 🔒 Encryption at Rest (Data at Rest Encryption)

Even if attackers get your disks, they can't read the data.

#### Options

| Method                    | Description                                         |
| :------------------------ | :-------------------------------------------------- |
| WiredTiger Encryption     | Built-in file-level encryption (Enterprise Edition) |
| Cloud Provider Encryption | Atlas automatically encrypts data                   |
| OS Disk Encryption        | Use Linux LUKS, Windows BitLocker, etc.             |

### 10.4. 🧩 Authentication Methods

MongoDB supports multiple authentication systems:

#### 🔹 1. Username/Password Authentication

Normal `db.createUser` users/passwords like shown above.

#### 🔹 2. X.509 Certificate Authentication

Used for **server-to-server** authentication or **client-to-server** without passwords.

Each client/server presents a valid **certificate** to connect.

```bash
mongod --auth --sslMode requireSSL --sslPEMKeyFile server.pem --sslCAFile ca.pem
```

In Mongo Shell:

```bash
mongo --ssl --sslPEMKeyFile client.pem --sslCAFile ca.pem
```

#### 🔹 3. Kerberos Authentication

Use **Kerberos tickets** (SSO) instead of passwords — popular in enterprise environments.

```bash
mongod --auth --setParameter authenticationMechanisms=GSSAPI
```

#### 🔹 4. LDAP Authentication (Proxy)

Connect MongoDB to your organization's **LDAP server** (e.g., Active Directory).

Instead of managing MongoDB users manually, you integrate with existing user accounts.

### 10.5. 🕵️ MongoDB Audit

**Auditing** allows you to **track**:

- who connected,
- what they queried,
- what they updated/deleted.

Enable auditing:

```bash
mongod --auditDestination file --auditFormat JSON --auditPath /var/log/mongodb/auditLog.json
```

✅ Useful for security compliance (GDPR, HIPAA, etc.)

### 🔥 Real-World Security Best Practices

| Tip                           | Why                         |
| :---------------------------- | :-------------------------- |
| Enable authentication         | Prevent unauthorized access |
| Enforce TLS/SSL               | Protect data in transit     |
| Use strong passwords          | Defend against brute force  |
| Use role-based access control | Limit user permissions      |
| Enable auditing               | Track suspicious activity   |
| Encrypt at rest               | Protect stolen disks        |

---

Great! Let's move on to **Section 11: MONGODB DEVELOPMENT** 🚀

---

## 11. MONGODB DEVELOPMENT

In this section, we'll cover key development tools and features that can help you work more efficiently with MongoDB. These include:

1. **Developer Tools** (to work interactively with MongoDB)
2. **MongoDB Analyze** (for analyzing and optimizing your MongoDB performance)

Let's break each one down:

### 11.1. 🛠 Developer Tools

MongoDB offers several powerful developer tools to streamline your workflow, such as:

- **MongoDB Compass** (GUI for MongoDB)
- **Mongo Shell** (Command-line tool)
- **MongoDB Atlas UI** (for cloud-based MongoDB)

### 🔹 1. MongoDB Compass

**MongoDB Compass** is a GUI tool that allows you to:

- **Visualize** your MongoDB data
- **Run queries** without having to use the shell
- **Inspect schema** to understand how your data is structured
- **Create and manage indexes** easily
- **Manage database users** and perform backups

It also has performance monitoring capabilities to help optimize your queries and indexes.

---

### 🔹 2. Mongosh Shell

The **Mongosh Shell** is the command-line tool for interacting with MongoDB.

You can:

- Run queries
- Insert, update, delete data
- Perform administrative tasks

```bash
mongosh --host localhost --port 27017
```

Once connected, you can run MongoDB commands:

```js
use mydatabase; // Switch to a database
db.collection.find(); // Query the collection
```

For advanced users, the Mongo shell is perfect for **quick testing**, **scripting**, and **debugging**.

---

### 🔹 3. MongoDB Atlas UI

If you're using **MongoDB Atlas** (MongoDB's cloud service), you have access to an easy-to-use web interface to:

- Manage databases, collections, users, and clusters
- Monitor performance in real time
- Set up and manage backups
- Configure security settings

**Atlas** is ideal if you don't want to manage infrastructure and just want to focus on your application.

---

### 11.2. 💻 Language Drivers

MongoDB provides **official language drivers** for multiple programming languages, so you can easily integrate MongoDB with your application.

### 11.3. 📊 MongoDB Analyze (Performance Insights)

MongoDB **Analyze** is available via the **MongoDB Atlas** UI and can be used to optimize your queries and schema. It includes:

- **Explain Plans**: Understand how your queries are being executed.
- **Query Optimization**: Analyze slow queries and optimize them.
- **Index Suggestions**: See if adding indexes will improve query performance.

#### 🔹 Explain Plans

MongoDB allows you to see how it executes your queries using **Explain**:

```js
db.users.find({ age: { $gt: 30 } }).explain("executionStats");
```

This will return a detailed explanation of the query execution, including index usage, scan type, and more.

---

#### 🔹 Query Profiling

MongoDB has a **Query Profiler** to log slow queries.

Enable it in the shell:

```js
db.setProfilingLevel(1, { slowms: 100 }); // Log queries taking longer than 100ms
```

Check the profile:

```js
db.system.profile.find().pretty();
```

---

#### 🔹 Index Suggestions

MongoDB Atlas offers **index suggestions** based on query patterns, helping to **optimize your performance**.

---

### 🎯 Summary of Section 11: MONGODB DEVELOPMENT

| Topic                                      | Why It's Important                                                          |
| :----------------------------------------- | :-------------------------------------------------------------------------- |
| Developer Tools (Compass, Shell, Atlas UI) | Provides GUI, CLI, and cloud tools for ease of use                          |
| Language Drivers                           | MongoDB integrates seamlessly with languages like Node.js, Python, Java, C# |
| MongoDB Analyze                            | Helps you analyze and optimize performance, queries, and indexes            |

---

## 12. MONGODB RECOVERY

In this section, we'll explore essential MongoDB tools and practices for backup and recovery. These are critical for protecting your data and ensuring business continuity in case of system failures or data corruption.

### 12.1. **Backup and Recovery**

#### 🔹 Backup Strategies

There are different strategies for backing up MongoDB data:

1. **File System Backup (Cold Backup)**

   - This involves taking a snapshot of your database files when the MongoDB server is shut down. It's the simplest but least flexible method.

2. **Mongodump and Mongorestore**

   - **`mongodump`** creates a binary backup of the data from your MongoDB instance.
   - **`mongorestore`** is used to restore data from a dump.

3. **Cloud Backups with MongoDB Atlas**

   - If you're using **MongoDB Atlas**, you can use the automated backup feature that provides scheduled backups and point-in-time recovery.

4. **Oplog-based Backups (For Replicas)**
   - MongoDB uses an **Oplog** (operation log) to replicate data across nodes in a replica set. You can use this log to perform incremental backups by capturing the operations that have been performed on the database.

#### 🔹 MongoDB Backup using **`mongodump`**

**`mongodump`** is the primary tool for creating backups in MongoDB. It creates a BSON file of your MongoDB database or collection.

#### 📦 Example of Backing Up a Database

```bash
mongodump --uri="mongodb://localhost:27017" --db=mydatabase --out=/path/to/backup/
```

- **`--uri`**: Specifies the connection string to MongoDB (can include authentication credentials).
- **`--db`**: The database to back up.
- **`--out`**: Directory where the backup will be stored.

#### 📦 Example of Backing Up a Specific Collection

```bash
mongodump --uri="mongodb://localhost:27017" --db=mydatabase --collection=mycollection --out=/path/to/backup/
```

You can use `mongodump` to backup all collections or just one. You can also apply filters using query parameters.

#### 💡 Note

- `mongodump` is typically run from the MongoDB shell or command line.
- The backup will be in BSON format, which you can restore later with `mongorestore`.

#### 🔹 MongoDB Restore using **`mongorestore`**

**`mongorestore`** is used to restore a MongoDB backup created with `mongodump`.

#### 📦 Example of Restoring a Database:

```bash
mongorestore --uri="mongodb://localhost:27017" --db=mydatabase /path/to/backup/mydatabase/
```

- **`--uri`**: Specifies the connection string to MongoDB (including authentication credentials if needed).
- **`--db`**: The database to restore.
- **`/path/to/backup/mydatabase/`**: Path to the backup directory.

#### 📦 Example of Restoring a Specific Collection:

```bash
mongorestore --uri="mongodb://localhost:27017" --db=mydatabase --collection=mycollection /path/to/backup/mydatabase/mycollection.bson
```

### 12.2. **Point-in-Time Recovery with MongoDB Atlas**

If you are using **MongoDB Atlas**, the cloud service offers built-in **Point-in-Time Recovery** (PITR) which allows you to restore a database to any specific point in time, without needing to manually manage backups.

#### Key Features

- **Automated Backups**: Atlas performs scheduled backups automatically.
- **Point-in-Time Restoration**: You can select the exact timestamp to restore from.
- **Continuous Backup**: Changes are backed up incrementally using the **Oplog**.

### 12.3. **Backup and Restore with Replica Sets**

If you're running MongoDB as a **Replica Set**, you can use **Oplog-based backups** for incremental backups, which will capture only the changes since the last backup.

To perform an Oplog-based backup:

1. Use **`mongodump`** to dump the primary replica data.
2. Continuously track and dump the Oplog (operation log) for incremental changes.
3. Use **`mongorestore`** to restore the primary replica data, followed by restoring the Oplog to get incremental changes.

### 12.4. **MongoDB Backup Scheduling with Cron**

For automated backups on Linux or macOS, you can schedule your backups using **cron jobs**.

#### 📦 Example: Scheduling Backups with Cron

1. Open your crontab file:

```bash
crontab -e
```

2. Add a cron job to back up MongoDB every day at 2 AM:

```bash
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017" --db=mydatabase --out=/path/to/backup/$(date +\%F)
```

This will create a new backup every day with the current date in the folder name.

---

### 12.5. **Recovery in Case of Failure**

To recover from a failure:

1. Ensure that your last backup is intact.
2. If using **MongoDB Atlas**, restore from the backup or point-in-time recovery.
3. If using **`mongodump`** and **`mongorestore`**, restore the backup files to a fresh MongoDB instance.

### 12.6. **Monitoring and Alerting**

It's crucial to set up **monitoring** to ensure your backups are occurring as scheduled and to be alerted to any issues.

If using **MongoDB Atlas**, you can set up **alerts** to monitor your backup status and receive notifications if backups fail.

### 🎯 Summary of Section 12: MONGODB RECOVERY

| Topic                              | Why It's Important                                                              |
| :--------------------------------- | :------------------------------------------------------------------------------ |
| **Backup Strategies**              | Regular backups ensure data is safe in case of failure.                         |
| **Mongodump & Mongorestore**       | These tools allow you to back up and restore MongoDB databases and collections. |
| **Point-in-Time Recovery (Atlas)** | Helps restore data from any point in time, minimizing data loss.                |
| **Replica Set Backups**            | Oplog-based backups help you keep up-to-date backups with minimal data loss.    |
| **Automated Backups with Cron**    | Ensures that backups happen automatically at specified intervals.               |
| **Monitoring and Alerts**          | Monitoring tools alert you to issues with backups, preventing disasters.        |

---

## 13. **Change Streams (Real-time Data Changes)**

### What are Change Streams?

Change Streams provide a real-time feed of changes to documents in MongoDB. It allows you to listen to changes on a collection, database, or even the entire MongoDB deployment. This is especially useful for applications that need real-time notifications or updates.

Change Streams rely on MongoDB's replication and Oplog (operation log), making it efficient for detecting changes.

### 📦 Example of Using Change Streams in MongoDB

```js
const { MongoClient } = require("mongodb");

async function watchChanges() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("mydb");
    const collection = database.collection("mycollection");

    // Open a Change Stream to monitor changes on the collection
    const changeStream = collection.watch();

    changeStream.on("change", (change) => {
      console.log("Change detected:", change);
    });
  } finally {
    // Always close the client
    await client.close();
  }
}

watchChanges().catch(console.error);
```

This example listens to any changes (insert, update, delete) on the `mycollection` collection and prints the changes to the console.

---

## 14. **Time Series Collections**

### What are Time Series Collections?

Time Series Collections are a special type of collection in MongoDB optimized for storing and querying time series data. This is ideal for storing data generated by sensors, logs, and other event-driven sources.

MongoDB 5.0 introduced the `timeseries` collection type, which makes it easier to manage and query large volumes of time series data efficiently.

### 📦 Example of Creating a Time Series Collection

```js
const { MongoClient } = require("mongodb");

async function createTimeSeriesCollection() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("mydb");

    // Create a time series collection
    await database.createCollection("sensor_data", {
      timeseries: {
        timeField: "timestamp",
        metaField: "sensor_id", // Optional, for grouping data by sensor
        granularity: "seconds", // granularity options: minutes, seconds, or milliseconds
      },
    });

    console.log("Time series collection created successfully!");
  } finally {
    await client.close();
  }
}

createTimeSeriesCollection().catch(console.error);
```

This code creates a collection named `sensor_data` to store time series data with a `timestamp` field for time-based queries.

---

## 15. **Working with GridFS**

### What is GridFS?

GridFS is a specification for storing large files such as images, videos, or documents in MongoDB. It divides large files into smaller chunks and stores them in the database, making it easier to manage and retrieve them in a distributed manner.

GridFS uses two collections:

- `fs.files`: Contains metadata for each file.
- `fs.chunks`: Contains chunks of the file.

### 📦 Example of Using GridFS to Upload and Retrieve Files

```js
const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");

async function uploadFile() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("mydb");
    const bucket = new GridFSBucket(database);

    // Upload a file to GridFS
    const uploadStream = bucket.openUploadStream("myfile.txt");
    fs.createReadStream("/path/to/myfile.txt").pipe(uploadStream);
    uploadStream.on("finish", () => {
      console.log("File uploaded successfully!");
    });
  } finally {
    await client.close();
  }
}

async function downloadFile() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("mydb");
    const bucket = new GridFSBucket(database);

    // Download a file from GridFS
    const downloadStream = bucket.openDownloadStreamByName("myfile.txt");
    downloadStream.pipe(fs.createWriteStream("/path/to/downloaded_file.txt"));
    downloadStream.on("end", () => {
      console.log("File downloaded successfully!");
    });
  } finally {
    await client.close();
  }
}

uploadFile().catch(console.error);
downloadFile().catch(console.error);
```

This example demonstrates how to upload a file to GridFS and download it. Files are divided into chunks and stored in the database.

---

## 16. **Serverless MongoDB (With Atlas Functions)**

### What is Serverless MongoDB?

MongoDB Atlas offers serverless clusters that automatically scale according to the application's needs. With serverless clusters, you don't need to manage database servers manually.

Atlas also provides **Atlas Functions**, which allow you to write and execute serverless functions directly within your MongoDB Atlas cluster, similar to AWS Lambda.

### 📦 Example of Serverless MongoDB with Atlas Functions

You can define a function in Atlas that runs a MongoDB query when triggered:

1. **Define a Function in Atlas**:
   - Go to the **MongoDB Atlas UI**.
   - Select your project and navigate to **Realm**.
   - Create a new function with the following code:

```js
exports = async function (payload) {
  const collection = context.services
    .get("mongodb-atlas")
    .db("mydb")
    .collection("mycollection");
  const result = await collection.find({}).toArray();
  return result;
};
```

2. **Call the Function**:
   You can call this function from your application using the following MongoDB Realm SDK:

```js
const { Stitch, RemoteMongoClient } = require("mongodb-stitch-client");

const client = Stitch.initializeAppClient("your-app-id");
const mongodb = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

const getData = async () => {
  const collection = mongodb.db("mydb").collection("mycollection");
  const data = await collection.find({}).toArray();
  console.log(data);
};

getData().catch(console.error);
```

---

## 17. **MongoDB Schema Validation**

### What is Schema Validation?

MongoDB allows you to define rules that enforce data structure validation for documents in a collection. This can be useful for ensuring that your documents adhere to a specific schema, which is important for data consistency.

### 📦 Example of Schema Validation in MongoDB

```js
const { MongoClient } = require("mongodb");

async function createCollectionWithValidation() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("mydb");

    await database.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email"],
          properties: {
            name: {
              bsonType: "string",
              description: "Name must be a string",
            },
            email: {
              bsonType: "string",
              pattern: "^.+@.+..+$",
              description: "Email must be a valid email address",
            },
          },
        },
      },
    });

    console.log("Collection created with validation rules.");
  } finally {
    await client.close();
  }
}

createCollectionWithValidation().catch(console.error);
```

This code defines schema validation for the `users` collection, ensuring that every document contains a `name` (string) and a valid `email`.

---

## 18. **Multi-Tenancy Patterns (Using MongoDB for SaaS Apps)**

### What is Multi-Tenancy?

In SaaS applications, **multi-tenancy** means that a single instance of the application serves multiple customers (tenants). MongoDB provides several strategies for multi-tenancy:

- **Single Database, Shared Collections**: All tenants share the same collections.
- **Single Database, Separate Collections**: Each tenant has its own collection.
- **Separate Databases per Tenant**: Each tenant has a separate database.

### 📦 Example of Multi-Tenancy with Separate Databases

```js
async function getTenantData(tenantId) {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const tenantDb = client.db(tenantId); // Use tenantId to access their specific DB
    const collection = tenantDb.collection("orders");
    const data = await collection.find({}).toArray();
    console.log(data);
  } finally {
    await client.close();
  }
}

getTenantData("tenant123").catch(console.error);
```

This approach allows each tenant to have its own isolated database, making it easier to scale and manage tenants independently.

---

## 19. **Connection Pooling**

### What is Connection Pooling?

Connection pooling improves the performance of MongoDB applications by reusing connections to the database, rather than establishing new connections for every request.

MongoDB automatically manages connection pooling, but you can configure the pool size using the connection string or through MongoDB client options.

### 📦 Example of Connection Pooling

```js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/?maxPoolSize=20"; // Set max pool size

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db("mydb");
  const collection = database.collection("mycollection");

  const data = await collection.find({}).toArray();
  console.log(data);

  await client.close();
}

run().catch(console.error);
```

In this example, we set `maxPoolSize` to control the maximum number of connections MongoDB will maintain in the pool.

---

### ✅ **Summary of Advanced MongoDB Topics**

- **Change Streams**: Real-time data change notifications.
- **Time Series Collections**: Efficient storage and querying of time series data.
- **GridFS**: Storing large files such as videos/images.
- **Serverless MongoDB**: MongoDB Atlas provides serverless database features.
- **Schema Validation**: Enforcing data structure rules.
- **Multi-Tenancy Patterns**: Different strategies for supporting multiple tenants in a SaaS app.
- **Connection Pooling**: Efficiently managing database connections.
