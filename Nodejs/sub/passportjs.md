# 🔐 Passport.js – From Beginner to Advanced

## 📌 What is Passport.js?

**Passport.js** is a flexible and modular authentication middleware for Node.js. It supports a wide range of authentication strategies including:

- Local (username/password)
- OAuth (Google, GitHub, Facebook, etc.)
- JWT
- Custom strategies

## 🚀 Getting Started

### 📦 Install Passport and Express

```bash
npm install passport express express-session
```

For local auth:

```bash
npm install passport-local
```

For OAuth (e.g., Google):

```bash
npm install passport-google-oauth20
```

---

## 🧱 Basic Setup

### 1. Create Express Server

```js
// app.js
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Init Passport
app.use(passport.initialize());
app.use(passport.session());
```

### 2. Define Users and Auth Strategy

```js
const users = [{ id: 1, username: "admin", password: "1234" }];

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user || user.password !== password) {
      return done(null, false, { message: "Invalid credentials" });
    }
    return done(null, user);
  })
);
```

### 3. Serialize and Deserialize User

```js
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});
```

### 4. Routes

```js
// Login route
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

// Profile route
app.get("/profile", ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.username}`);
});

// Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
```

## 🧠 Advanced Concepts

### 🔐 OAuth (e.g., Google Login)

#### Install Strategy

```bash
npm install passport-google-oauth20
```

#### Configure Strategy

```js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: "GOOGLE_CLIENT_ID",
      clientSecret: "GOOGLE_CLIENT_SECRET",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Lookup or create user
      const user = {
        id: profile.id,
        username: profile.displayName,
        provider: profile.provider,
      };
      done(null, user);
    }
  )
);
```

#### Routes

```js
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);
```

### 🔐 JWT Authentication with Passport

For stateless APIs.

```bash
npm install passport-jwt jsonwebtoken
```

#### JWT Strategy

```js
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secretKey",
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    const user = users.find((u) => u.id === jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  })
);
```

#### Create JWT Token

```js
import jwt from "jsonwebtoken";

app.post("/login", (req, res) => {
  const user = users.find((u) => u.username === req.body.username);
  if (!user) return res.status(401).send("Unauthorized");

  const token = jwt.sign({ id: user.id }, "secretKey");
  res.json({ token });
});
```

#### Secure Routes

```js
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Secure data");
  }
);
```

## ✅ Best Practices

| Practice                        | Reason                                |
| ------------------------------- | ------------------------------------- |
| Use HTTPS                       | For any OAuth or password-based login |
| Store secrets securely          | Use `dotenv` or a secret manager      |
| Use strong session secrets      | Prevent session hijacking             |
| Limit login attempts            | Prevent brute-force attacks           |
| Sanitize inputs                 | Prevent injection attacks             |
| Use CSRF tokens on forms        | For web form security                 |
| Store minimal user info in JWTs | Avoid sensitive data exposure         |

## 🛡 Tools & Extensions

| Tool                      | Use Case                  |
| ------------------------- | ------------------------- |
| `passport-local`          | Username/password         |
| `passport-jwt`            | Token-based APIs          |
| `passport-google-oauth20` | Google OAuth2             |
| `express-session`         | Session handling          |
| `bcrypt`                  | Hash passwords            |
| `connect-ensure-login`    | Middleware for auth guard |

## 🧪 Testing Auth Routes

Use **Postman** or **curl** to test:

```bash
curl -X POST -d "username=admin&password=1234" http://localhost:3000/login
```

## ✅ Summary

| Concept                 | Description                           |
| ----------------------- | ------------------------------------- |
| `passport.initialize()` | Sets up Passport middleware           |
| `passport.session()`    | Handles sessions for persistent login |
| Local Strategy          | Traditional username/password login   |
| OAuth Strategy          | Google, GitHub, etc.                  |
| JWT Strategy            | For APIs and mobile apps              |
| `serialize/deserialize` | Handles storing user in session       |
| `ensureAuthenticated`   | Protects secure routes                |
