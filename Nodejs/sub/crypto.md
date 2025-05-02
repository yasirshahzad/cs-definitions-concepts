# 🔐 `crypto` Module Overview

## ✅ What it can do

- Hashing (SHA256, MD5, etc.)
- HMAC (keyed hashing)
- Symmetric encryption/decryption (AES)
- Asymmetric encryption (RSA)
- Random bytes / UUIDs
- Digital signatures & verification

> Import with:

```js
const crypto = require("crypto");
```

---

## 📌 1. **Hashing Data**

```js
const crypto = require("crypto");

const hash = crypto.createHash("sha256").update("password123").digest("hex");
console.log("SHA256:", hash);
```

✅ Common algorithms: `md5`, `sha1`, `sha256`, `sha512`

---

## 📌 2. **HMAC (Hash-based Message Authentication Code)**

```js
const hmac = crypto.createHmac("sha256", "my-secret-key");
hmac.update("important-message");
console.log("HMAC:", hmac.digest("hex"));
```

Use HMAC to verify **message integrity + authenticity**.

---

## 📌 3. **Generate Random Values**

```js
const random = crypto.randomBytes(16).toString("hex");
console.log("Random hex:", random);
```

Also useful for tokens, passwords, salts, etc.

---

## 📌 4. **Symmetric Encryption/Decryption (AES)**

### Encrypt/Decrypt with a shared password:

```js
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return Buffer.concat([cipher.update(text), cipher.final()]).toString("hex");
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ]).toString();
}

const encrypted = encrypt("secret message");
console.log("Encrypted:", encrypted);

const decrypted = decrypt(encrypted);
console.log("Decrypted:", decrypted);
```

---

## 📌 5. **RSA Key Pair (Asymmetric)**

```js
crypto.generateKeyPair(
  "rsa",
  {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  },
  (err, pub, priv) => {
    if (err) throw err;
    console.log("Public Key:\n", pub);
    console.log("Private Key:\n", priv);
  }
);
```

---

## 📌 6. **Digital Signatures and Verification (RSA)**

```js
const { generateKeyPairSync, sign, verify } = require("crypto");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const data = "This is sensitive data";
const signature = sign("sha256", Buffer.from(data), privateKey).toString("hex");

const isValid = verify(
  "sha256",
  Buffer.from(data),
  publicKey,
  Buffer.from(signature, "hex")
);

console.log("Signature valid?", isValid);
```

---

## 📌 7. **Password Hashing with `pbkdf2`**

```js
crypto.pbkdf2(
  "password123",
  "salt",
  100000,
  64,
  "sha512",
  (err, derivedKey) => {
    if (err) throw err;
    console.log("Derived Key:", derivedKey.toString("hex"));
  }
);
```

Use this for secure password storage (never store raw passwords!).

---

## 🧪 Challenge Project: Secure Password Tool

### `password-tool.js`

```js
const crypto = require("crypto");

const password = "mySecretPassword";
const salt = crypto.randomBytes(16).toString("hex");

crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
  if (err) throw err;
  const hashedPassword = derivedKey.toString("hex");
  console.log("🔐 Salt:", salt);
  console.log("🔐 Hashed Password:", hashedPassword);

  // Simulate login
  crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err2, verifyKey) => {
    const isMatch = hashedPassword === verifyKey.toString("hex");
    console.log("✅ Password Match?", isMatch);
  });
});
```

---

## ✅ Summary: Mastery Checklist

| Task                              | Status |
| --------------------------------- | ------ |
| Hash a password using SHA256      | ✅     |
| Create secure HMACs               | ✅     |
| Encrypt/decrypt messages with AES | ✅     |
| Generate random tokens            | ✅     |
| Use RSA to sign and verify data   | ✅     |
| Use `pbkdf2` to hash passwords    | ✅     |
