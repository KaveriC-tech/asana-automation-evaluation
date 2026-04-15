# Asana Demo App — Playwright Automation Evaluation

![Playwright Tests](https://github.com/KaveriC-tech/asana-automation-evaluation/actions/workflows/playwright.yml/badge.svg)

A data-driven Playwright test suite built in JavaScript that automates and validates task management workflows on the Asana demo application.

---

## Tech Stack

- **Framework:** Playwright
- **Language:** JavaScript (Node.js)
- **Pattern:** Page Object Model (POM)
- **Test Data:** Data-driven via JSON
- **Reporting:** Playwright HTML Reporter

---

## Project Structure
asana-automation-evaluation/
├── tests/
│   ├── asana.spec.js          # Main test file — all 6 test cases
│   ├── pages/
│   │   ├── LoginPage.js       # Page Object for login
│   │   └── ProjectPage.js     # Page Object for project/task navigation
│   └── data/
│       └── testData.json      # All test data — credentials + 6 test cases
├── playwright.config.js       # Playwright configuration
├── package.json
└── .gitignore
---

## Test Cases

| # | Project | Task | Column | Tags |
|---|---------|------|--------|------|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

---

## Data-Driven Approach

All test cases are stored in `tests/data/testData.json`. The test file loops through the JSON array dynamically — meaning new test cases can be added by simply updating the JSON file with zero code changes required.

---

## How to Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/KaveriC-tech/asana-automation-evaluation.git
cd asana-automation-evaluation
```

**2. Install dependencies**
```bash
npm install
npx playwright install
```

**3. Run all tests**
```bash
npm test
```

**4. Run in headed mode (watch the browser)**
```bash
npm run test:headed
```

**5. View HTML report**
```bash
npm run report
```

---

## Author

**Kaveri C** — QA Automation Engineer
[GitHub](https://github.com/KaveriC-tech)
