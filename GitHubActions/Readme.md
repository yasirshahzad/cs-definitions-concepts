# Github Actions

## ✅ What Is GitHub Actions?

**GitHub Actions** is a powerful CI/CD tool that allows you to **automate your software development workflows** directly in your GitHub repository.

You can automate tasks like:

- Installing dependencies
- Running tests
- Building your app
- Deploying to cloud platforms (Firebase, Vercel, Heroku, AWS, etc.)

## 🧰 Project Assumptions

You have a Node.js project structured like this:

```
your-project/
├── .github/workflows/nodejs-deploy.yml
├── package.json
├── firebase.json
├── public/
└── src/
```

Your `package.json` includes:

```json
{
  "scripts": {
    "test": "jest",
    "build": "npm run build-command"
  }
}
```

## 🔐 Step 1: Generate Firebase Token

Run this command in your local terminal:

```bash
firebase login:ci
```

Copy the generated **Firebase CI token**.

## 🔑 Step 2: Add Secret to GitHub

Go to your repository on GitHub:

- Navigate to **Settings → Secrets and variables → Actions**
- Click **"New repository secret"**
- Add:

| Name             | Value                      |
| ---------------- | -------------------------- |
| `FIREBASE_TOKEN` | (Paste your CI token here) |

## 📂 Step 3: Firebase Project Setup

If you haven't already:

```bash
npm install -g firebase-tools
firebase init
```

- Choose **Hosting**
- Select your Firebase project or create a new one
- Set `public/` as the hosting directory
- Choose `yes` to configure as a SPA (if it's a frontend app)

This generates a `firebase.json` file in your root directory.

## ⚙️ Step 4: Create GitHub Actions Workflow

Create a workflow file:

📄 **.github/workflows/nodejs-deploy.yml**

```yaml
name: Node.js CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build the project
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_TOKEN }}"
          channelId: live
          projectId: your-firebase-project-id
```

> 🔄 Replace `your-firebase-project-id` with your actual Firebase project ID.  
> The `FIREBASE_TOKEN` secret is used here to authenticate the deployment.

---

## 🧪 What This Workflow Does

| Step              | Description                                     |
| ----------------- | ----------------------------------------------- |
| `on: push`        | Triggered when you push to the `main` branch    |
| `checkout`        | Clones your code into the GitHub runner         |
| `setup-node`      | Installs Node.js version 20                     |
| `npm install`     | Installs your project dependencies              |
| `npm test`        | Runs your test suite (uses Jest)                |
| `npm run build`   | Builds your project (adjust for your setup)     |
| `firebase deploy` | Deploys the `public` folder to Firebase Hosting |

## 📦 Optional: Cache `node_modules` for Speed

Add before `npm install`:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## ✅ Success: From Code to Cloud

Now every time you push to `main`, GitHub Actions will:

1. Install your dependencies
2. Run your tests
3. Build your app
4. Deploy it to Firebase Hosting 🎉
