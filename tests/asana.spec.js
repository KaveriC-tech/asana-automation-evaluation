const { test, expect } = require('@playwright/test');
const testData = require('./data/testData.json');

const { credentials, testCases } = testData;

// Helper - login
async function login(page, email, password) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Username' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForLoadState('networkidle');
}

// Helper - navigate to project
async function navigateToProject(page, projectName) {
  await page.getByRole('button', { name: projectName }).click();
  await page.waitForTimeout(500);
}

// Helper - get column name for a task
async function getTaskColumn(page, taskName) {
  const allColumns = page.locator('h2');
  const columnCount = await allColumns.count();

  for (let i = 0; i < columnCount; i++) {
    const columnHeader = allColumns.nth(i);
    const columnText = await columnHeader.textContent();

    // Get the parent container of this column header
    const columnContainer = page.locator('div').filter({
      has: page.locator('h2', { hasText: columnText }),
      hasText: taskName
    }).first();

    const found = await columnContainer.count();
    if (found > 0) {
      return columnText.replace(/\s*\(\d+\)\s*$/, '').trim();
    }
  }
  return null;
}

// Helper - get tags for a task
async function getTaskTags(page, taskName) {
  // Find task card by its heading
  const taskHeading = page.getByRole('heading', { name: taskName });
  await taskHeading.waitFor({ state: 'visible' });

  // Get parent card
  const card = page.locator('div').filter({
    has: page.getByRole('heading', { name: taskName })
  }).last();

  // Get all spans in the card that look like tags
  const spans = card.locator('span');
  const spanCount = await spans.count();
  const tags = [];

  for (let i = 0; i < spanCount; i++) {
    const text = (await spans.nth(i).textContent()).trim();
    if (
      text.length > 0 &&
      text.length <= 20 &&
      !text.includes('/') &&
      !text.includes('@') &&
      !/^\d+$/.test(text)
    ) {
      tags.push(text);
    }
  }
  return tags;
}

// ── DATA-DRIVEN TESTS ──
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
