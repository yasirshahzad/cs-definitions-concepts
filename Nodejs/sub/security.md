# Security Best Practices

## Helmet.js

- **What it does**: Sets various HTTP headers for security
- **Implementation**:
  ```javascript
  const helmet = require("helmet");
  app.use(helmet());
  ```
- **Headers it sets**:
  - Content Security Policy (CSP)
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME sniffing prevention)
  - Strict-Transport-Security (HSTS)

## CSRF Protection

- **What it is**: Prevents Cross-Site Request Forgery attacks
- **Implementation**:

  ```javascript
  const csrf = require("csurf");
  app.use(csrf({ cookie: true }));

  // Include CSRF token in forms
  app.get("/form", (req, res) => {
    res.render("send", { csrfToken: req.csrfToken() });
  });
  ```

  ```html
  <!-- In your form -->
  <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
  ```

## Rate Limiting

- **Why it's important**: Prevents brute force and DDoS attacks
- **In-memory implementation**:

  ```javascript
  const rateLimit = require("express-rate-limit");

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  app.use("/api/", limiter);
  ```

- **Redis-based implementation**:

  ```javascript
  const RedisStore = require("rate-limit-redis");

  const limiter = rateLimit({
    store: new RedisStore({
      expiry: 60 * 60, // 1 hour
    }),
    max: 100,
    delayMs: 0, // disable delaying
  });
  ```

## Input Validation/Sanitization

- **Why it's important**: Prevents XSS, SQL injection, etc.
- **Implementation**:

  ```javascript
  const { body, validationResult } = require("express-validator");

  app.post(
    "/user",
    body("username").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }).trim().escape(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Process data
    }
  );
  ```

## Password Hashing

- **Best practices**:
  - Never store plaintext passwords
  - Use slow hashing algorithms (bcrypt, Argon2, PBKDF2)
  - Include salt
- **bcrypt implementation**:

  ```javascript
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  // Hashing
  bcrypt.hash("myPassword", saltRounds, (err, hash) => {
    // Store hash in DB
  });

  // Verification
  bcrypt.compare("myPassword", hash, (err, result) => {
    // result == true if match
  });
  ```

- **Argon2 implementation**:

  ```javascript
  const argon2 = require("argon2");

  // Hashing
  try {
    const hash = await argon2.hash("password");
  } catch (err) {
    /* handle error */
  }

  // Verification
  try {
    if (await argon2.verify("<big long hash>", "password")) {
      // password match
    }
  } catch (err) {
    /* handle error */
  }
  ```
