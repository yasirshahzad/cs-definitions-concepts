# Preventing **XSS** (Cross-Site Scripting) and **SQL Injection**

## 🛡 **XSS (Cross-Site Scripting) Prevention**

XSS vulnerabilities allow attackers to inject malicious scripts into web pages, potentially compromising user data. The most common types are **stored XSS** and **reflected XSS**.

### **Preventive Measures for XSS**

1. **Sanitize User Inputs**

   - Always sanitize user inputs before displaying them on your website.
   - Use libraries like **DOMPurify** or **sanitize-html** to sanitize HTML content.

   Example using **DOMPurify**:

   ```bash
   npm install dompurify
   ```

   ```js
   const DOMPurify = require("dompurify");

   const sanitizedInput = DOMPurify.sanitize(userInput);
   res.send(sanitizedInput);
   ```

2. **Escape User Inputs**

   - Use **escape encoding** (like `HTML entities`) for user-supplied data.
   - Example: `&lt;` instead of `<` to prevent the browser from interpreting it as HTML.

   Use a library like **xss**:

   ```bash
   npm install xss
   ```

   ```js
   const xss = require("xss");
   const safeInput = xss(userInput);
   ```

3. **Content Security Policy (CSP)**

   - Implement a strict **CSP** to control what scripts can be executed.
   - In Express, you can set a CSP header:

   ```js
   const helmet = require("helmet");
   app.use(
     helmet.contentSecurityPolicy({
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"],
       },
     })
   );
   ```

4. **Avoid Inline Scripts**

   - Never inject user-generated content directly into `<script>` tags.
   - Always use external scripts or templates that avoid inline execution.

5. **Use Secure JavaScript Frameworks**

   - Use React, Angular, or Vue, which automatically escape data before rendering in the DOM.
   - Example in React:
     ```jsx
     <div>{userInput}</div>  {/* Automatically escaped */}
     ```

6. **HTTP-only and Secure Cookies**

   - Set cookies with `HttpOnly` and `Secure` flags to prevent access from JavaScript.
   - Use **SameSite** attribute for additional CSRF protection.

   Example:

   ```js
   res.cookie("session", sessionID, {
     httpOnly: true,
     secure: true,
     sameSite: "Strict",
   });
   ```

---

## 🛡 **SQL Injection Prevention**

SQL Injection vulnerabilities allow attackers to manipulate your database queries by injecting malicious SQL code. To prevent this, ensure all user inputs are handled properly in database queries.

### **Preventive Measures for SQL Injection**

1. **Use Parameterized Queries or Prepared Statements**

   - The **best practice** is to use parameterized queries where user input is treated as a parameter, not part of the query string.

   In **Node.js** using **pg** (PostgreSQL) or **mysql2** (MySQL):

   ```js
   // PostgreSQL with 'pg' library
   const { Client } = require("pg");
   const client = new Client();
   await client.connect();

   const result = await client.query(
     "SELECT * FROM users WHERE username = $1",
     [userInput]
   );

   // MySQL with 'mysql2' library
   const mysql = require("mysql2");
   const connection = mysql.createConnection({
     host,
     user,
     password,
     database,
   });
   const [rows, fields] = await connection.execute(
     "SELECT * FROM users WHERE username = ?",
     [userInput]
   );
   ```

2. **Avoid Dynamic Queries**

   - Never concatenate user input directly into a query string, as this leaves you vulnerable to SQL injection.
   - For example, **bad practice**:
     ```js
     const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
     ```

3. **Use ORM Libraries**

   - **ORMs** like **Sequelize**, **TypeORM**, or **Objection.js** automatically handle parameterized queries for you.

   Example using **Sequelize**:

   ```js
   const users = await User.findAll({
     where: {
       username: userInput,
     },
   });
   ```

4. **Escaping Input (for non-ORM use cases)**

   - If you must directly write raw SQL, use functions to escape user input.
   - **MySQL2** and **pg** have built-in methods for this:

   ```js
   const mysql = require("mysql2");
   const safeInput = mysql.escape(userInput);
   const query = `SELECT * FROM users WHERE username = ${safeInput}`;
   ```

5. **Limit User Privileges**

   - Ensure that your database account used in production has limited permissions (e.g., only `SELECT` for certain users).
   - Avoid using **admin** or highly privileged accounts in production.

6. **Input Validation**

   - Validate input types, lengths, and formats before passing them to SQL queries.
   - Use libraries like **Joi** or **express-validator** to validate inputs.

   Example using **express-validator**:

   ```js
   const { body } = require("express-validator");

   app.post(
     "/login",
     [
       body("username").isString().isLength({ min: 3 }),
       body("password").isLength({ min: 6 }),
     ],
     (req, res) => {
       // handle request
     }
   );
   ```

---

## 📦 **Additional Recommendations**

- **Regularly Audit Dependencies**: Use tools like **npm audit** or **Snyk** to identify vulnerabilities in your project’s dependencies.

  Example:

  ```bash
  npm audit fix
  ```

- **Logging and Monitoring**: Use proper logging to catch malicious activity early. Services like **Winston** or **Pino** for logging and **Sentry** for error tracking can be invaluable.

---

### TL;DR: **Best Practices for Preventing XSS and SQL Injection**

| Vulnerability     | Prevention Method                                                        |
| ----------------- | ------------------------------------------------------------------------ |
| **XSS**           | Sanitize inputs, use `CSP`, escape user data, avoid inline scripts       |
| **SQL Injection** | Use parameterized queries, ORM libraries, escape inputs, validate inputs |
