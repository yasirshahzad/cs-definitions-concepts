# Authentication Methods

## JWT (JSON Web Tokens)

- **What it is**: A stateless authentication mechanism that uses digitally signed tokens
- **Structure**: Header.Payload.Signature
- **Key features**:
  - Self-contained (contains all needed info)
  - Typically expires (short-lived access tokens + refresh tokens)
  - Signed (JWS) or encrypted (JWE)
- **Implementation**:

  ```javascript
  const jwt = require("jsonwebtoken");

  // Create token
  const token = jwt.sign({ userId: 123 }, "secret", { expiresIn: "1h" });

  // Verify token
  jwt.verify(token, "secret", (err, decoded) => {
    console.log(decoded.userId); // 123
  });
  ```

## Session-based Authentication

- **What it is**: Stateful authentication using server-side sessions
- **How it works**:
  1. Server creates session ID on login
  2. Session ID stored in cookie
  3. Server validates session on each request
- **Implementation**:

  ```javascript
  const express = require("express");
  const session = require("express-session");

  app.use(
    session({
      secret: "your secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true },
    })
  );

  app.post("/login", (req, res) => {
    req.session.userId = 123; // Store user ID in session
  });
  ```

## OAuth 2.0 / OpenID Connect

- **OAuth 2.0**: Authorization framework (not authentication)
- **OpenID Connect**: Authentication layer on top of OAuth 2.0
- **Flows**:
  - Authorization Code (web apps)
  - Implicit (legacy)
  - Client Credentials (machine-to-machine)
  - Device Code (TVs, IoT)
  - Refresh Token
  - [Read More](/Nodejs/sub/passportjs.md)
