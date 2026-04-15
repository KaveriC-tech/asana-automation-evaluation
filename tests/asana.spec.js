const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { ProjectPage } = require('./pages/ProjectPage');
const testData = require('./data/testData.json');

const { credentials, testCases } = testData;

for (const tc of testCases) {
  test(`TC${tc.id} - ${tc.project} | "${tc.task}" should be in "${tc.column}" with tags: ${tc.tags.join(', ')}`, async ({ page }) => {

    // Step 1 — Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);

    // Step 2 — Navigate to project
    const projectPage = new ProjectPage(page);
    await projectPage.navigateToProject(tc.project);

    // Step 3 — Verify task is in correct column
    const column = await projectPage.getTaskColumn(tc.task);
    expect(column.trim()).toBe(tc.column);

    // Step 4 — Verify tags
    const tags = await projectPage.getTaskTags(tc.task);
    for (const expectedTag of tc.tags) {
      expect(tags).toContain(expectedTag);
    }

  });
}
