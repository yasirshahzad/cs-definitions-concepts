# NPM

- **Semantic Versioning (SemVer)**:

  - `"^1.2.3"` — update minor/patch versions automatically.
  - `"~1.2.3"` — update only patch versions automatically.
  - `"1.2.3"` — exact version, no automatic updates.

- **Installing Dev Dependencies**:

```bash
npm install nodemon --save-dev
```

(`--save-dev` saves it in `devDependencies`, not `dependencies`.)

- **Global vs Local packages**:

  - **Global (`-g`)**: installed once, available everywhere (e.g., `npm install -g typescript`).
  - **Local**: installed in project `node_modules/` (recommended for projects).

- **npx**: Runs a package without globally installing it.

```bash
npx create-react-app my-app
```

- **npm scripts** (powerful automation!):

```json
"scripts": {
  "dev": "nodemon index.js",
  "build": "webpack --config webpack.config.js",
  "test": "jest"
}
```

Run them:

```bash
npm run dev
```

## **1. Updating npm Packages**

**Update a specific package:**

```bash
npm install <package-name>@latest
```

**Update all dependencies in `package.json`:**

```bash
npm update
```

**Upgrade across major versions (e.g., lodash v3 → v4):**
Use [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates):

```bash
npx npm-check-updates -u
npm install
```

## **2. Running Scripts**

You can define scripts in the `package.json` file under the `"scripts"` section:

**Example `package.json`:**

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  }
}
```

**Run a script:**

```bash
npm run start
npm run dev
npm test      # Special case, can be shortened
```

## **3. npm Workspaces**

**What it is:**  
npm Workspaces allow managing multiple packages (like a monorepo) in a single repository.

**Example `package.json`:**

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*"]
}
```

**Directory Structure:**

```text
my-monorepo/
├── package.json  (root with workspaces)
└── packages/
    ├── app/
    │   └── package.json
    └── utils/
        └── package.json
```

**Install all workspace packages:**

```bash
npm install
```

**Run script in specific workspace:**

```bash
npm run build --workspace=utils
```

---

### **4. Creating npm Packages**

**Steps to create and publish a package:**

1. **Initialize a new package:**

   ```bash
   npm init
   ```

2. **Write your module code:**

   ```js
   // index.js
   module.exports = function greet(name) {
     return `Hello, ${name}!`;
   };
   ```

3. **Add entry in `package.json`:**

   ```json
   {
     "main": "index.js"
   }
   ```

4. **Login and publish:**

   ```bash
   npm login
   npm publish
   ```

   > Your package must have a **unique name** on npm and the project must **not be private**.
