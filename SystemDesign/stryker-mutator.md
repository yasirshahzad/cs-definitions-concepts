# **Master Stryker Mutator for Node.js Interviews**

## 1. 🔥 What is Stryker Mutator?

| Concept              | Description                                                                                                    |
| :------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Stryker**          | A mutation testing framework                                                                                   |
| **Mutation Testing** | Automatically changes (mutates) code to see if tests fail. If tests pass on broken code — your tests are weak. |
| **Mutants**          | Code versions with small changes (e.g., `+` → `-`, `true` → `false`)                                           |
| **Killed Mutants**   | Mutations that your tests **caught** (good)                                                                    |
| **Survived Mutants** | Mutations that **weren't caught** (bad)                                                                        |
| **Mutation Score**   | % of mutants your tests caught (Killed / Total)                                                                |
| **Goal**             | Achieve high Mutation Score, proving tests are strong                                                          |

## 2. 📦 Different Stryker Services and Plugins

| Area                   | Tool/Plugin                                                      | Purpose                                   |
| :--------------------- | :--------------------------------------------------------------- | :---------------------------------------- |
| **Main Tool**          | `@stryker-mutator/core`                                          | Core mutation testing engine              |
| **Runner**             | `stryker-cli`                                                    | Command line interface to run Stryker     |
| **Test Runner**        | `@stryker-mutator/jest-runner` / `@stryker-mutator/mocha-runner` | Connect Stryker to your test framework    |
| **Reporters**          | `html`, `clear-text`, `dashboard`                                | Visualize mutation scores                 |
| **Framework Adapters** | Jest, Mocha, Jasmine, etc.                                       | Stryker supports multiple test frameworks |
| **Dashboard**          | Stryker Dashboard (optional)                                     | Upload mutation test results online       |
| **Mutators**           | Built-in (arithmetic, logical, etc.)                             | Mutation operators that Stryker uses      |

## 3. ⚙️ Stryker Typical Workflow (Senior Developer View)

| Step                  | Tool                         | Action                                         |
| :-------------------- | :--------------------------- | :--------------------------------------------- |
| **Install Stryker**   | npm                          | `npm install --save-dev @stryker-mutator/core` |
| **Configure Stryker** | `stryker.conf.json`          | Choose mutators, test runner, file patterns    |
| **Run Stryker**       | CLI                          | `npx stryker run`                              |
| **Analyze Results**   | Reporters                    | Check which mutants survived                   |
| **Strengthen Tests**  | Test Framework (Jest, Mocha) | Improve tests to kill more mutants             |
| **CI Integration**    | GitHub Actions / GitLab CI   | Run mutation testing in pipelines              |
| **Optional**          | Stryker Dashboard            | Visualize across PRs/releases                  |

## 4. 🛠 Example `stryker.conf.json` (for Node.js + Jest)

```js
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutate: ["src/**/*.js"],
  testRunner: "jest",
  jest: {
    projectType: "custom",
    config: require("./jest.config.js"),
  },
  reporters: ["html", "clear-text", "progress"],
  coverageAnalysis: "off",
};
```

✅ Best practices:

- **Mutate only source files** (`src/**/*.js`)
- **Don't mutate tests**
- **Use multiple reporters**

## 5. 📈 Perfect Stryker DevOps Architecture

```
Local Dev
  ↓
Local Mutation Test (npx stryker run)
  ↓
Commit to Git
  ↓
CI Pipeline
  → npm test
  → npx stryker run
  → Upload mutation report to Stryker Dashboard (optional)
  ↓
Pull Request Review
  → Check mutation score
  → Force minimum mutation score policy
```

| Stage           | Tool/Service              | Purpose                                            |
| :-------------- | :------------------------ | :------------------------------------------------- |
| **Local Dev**   | Stryker CLI               | Fast mutation tests before commit                  |
| **CI/CD**       | GitHub Actions, GitLab CI | Enforce mutation score thresholds                  |
| **Monitoring**  | Stryker Dashboard         | Long-term mutation tracking                        |
| **Enforcement** | Git Hooks (Husky)         | Block commits if mutation score too low (optional) |

## 6. 🚦 Key Metrics for Interviews

| Metric                  | Description           | Senior-level Insight         |
| :---------------------- | :-------------------- | :--------------------------- |
| **Mutation Score**      | % mutants killed      | Aim for > 80%                |
| **Killed Mutants**      | Tests caught mutation | Proves test robustness       |
| **Survived Mutants**    | Tests missed mutation | Weakness, must improve tests |
| **Timeout Mutants**     | Infinite loops etc.   | Fix test design or code      |
| **No Coverage Mutants** | Not even tested       | Must write missing tests     |

## 7. 🔥 Advanced Senior Engineer Moves (For Bonus Points)

| Skill                        | How to Showcase                                                                         |
| :--------------------------- | :-------------------------------------------------------------------------------------- |
| **Selective Mutation**       | Mutate only critical files in critical PRs                                              |
| **Performance Optimization** | Run only on changed files (not whole repo)                                              |
| **Thresholds in CI**         | Configure minimum mutation score; fail build if too low                                 |
| **Visual Reporting**         | Enable HTML report + link it in PRs                                                     |
| **Testing Mindset**          | Explain how mutation testing finds _untestable code_ (tight coupling, poor abstraction) |
| **Test Types**               | Mutations should be killed by unit tests, not integration tests                         |

Example CI config enforcing mutation score:

```yml
- name: Run Stryker
  run: npx stryker run

- name: Enforce mutation score
  run: |
    if [ $(jq '.mutationScore' reports/mutation/mutation-score.json) -lt 80 ]; then
      echo "Mutation score too low!"
      exit 1
    fi
```

## ⚡ Quick Summary: Interview Key Points to Say

- 'Stryker introduces real-world bug simulations by mutating code.'
- 'Killed mutants = good tests, survived mutants = weak tests.'
- 'Mutation score shows actual **test quality**, not just **test quantity** like code coverage.'
- 'I run Stryker locally and integrate it into CI/CD pipelines to enforce high-quality standards.'
- 'In critical services, I prefer Stryker thresholds even stricter than coverage thresholds.'

## 🔥 If you want, next I can create:

- A **full real Node.js repo** setup with Stryker (step-by-step)
- **Mock interview questions** for Stryker
- **CI/CD pipeline file** ready to copy-paste
