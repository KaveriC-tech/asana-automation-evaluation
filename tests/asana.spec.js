const { test, expect } = require('@playwright/test');
const testData = require('./data/testData.json');

const { credentials, testCases } = testData;

async function login(page, email, password) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Username' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForLoadState('networkidle');
}

async function navigateToProject(page, projectName) {
  await page.getByText(projectName, { exact: true }).first().click();
  await page.waitForTimeout(1000);
}

async function getTaskColumn(page, taskName) {
  // Get all h2 elements that have a number in brackets e.g. "To Do (2)"
  // This filters out the page title "Web Application" which has no brackets
  const allH2 = await page.locator('h2').allTextContents();

  for (const headerText of allH2) {
    // Only process column headers that have "(number)" pattern
    if (!/\(\d+\)/.test(headerText)) continue;

    // Check if task exists under this column by looking at the page structure
    const cleanHeader = headerText.replace(/\s*\(\d+\)\s*$/, '').trim();

    // Find all task headings under this column header
    const columnSection = page.locator('div').filter({ hasText: headerText }).first();
    const taskInColumn = await columnSection.getByRole('heading', { name: taskName, exact: true }).count();

    if (taskInColumn > 0) {
      return cleanHeader;
    }
  }
  return null;
}

async function getTaskTags(page, taskName) {
  // Known tags from the evaluation
  const knownTags = ['Feature', 'Bug', 'Design', 'High Priority'];

  // Find the card containing the task
  const taskHeading = page.getByRole('heading', { name: taskName, exact: true });
  await taskHeading.waitFor({ state: 'visible' });

  const card = page.locator('div').filter({
    has: page.getByRole('heading', { name: taskName, exact: true })
  }).last();

  const foundTags = [];

  // Check each known tag — does it exist in the card?
  for (const tag of knownTags) {
    const tagExists = await card.getByText(tag, { exact: true }).count();
    if (tagExists > 0) {
      foundTags.push(tag);
    }
  }

  return foundTags;
}

for (const tc of testCases) {
  test(`TC${tc.id} - ${tc.project} | "${tc.task}" should be in "${tc.column}" with tags: ${tc.tags.join(', ')}`, async ({ page }) => {

    // Step 1 — Login
    await login(page, credentials.email, credentials.password);

    // Step 2 — Navigate to project
    await navigateToProject(page, tc.project);

    // Step 3 — Verify task is in correct column
    const column = await getTaskColumn(page, tc.task);
    expect(column).toBe(tc.column);

    // Step 4 — Verify all expected tags are present
    const tags = await getTaskTags(page, tc.task);
    for (const expectedTag of tc.tags) {
      expect(tags).toContain(expectedTag);
    }

  });
}
