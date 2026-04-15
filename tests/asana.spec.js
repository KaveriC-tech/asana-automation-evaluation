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
  await page.getByRole('button', { name: projectName }).click();
  await page.waitForLoadState('networkidle');
}

async function getTaskColumn(page, taskName) {
  // Each column is a div with class "flex flex-col w-80 bg-gray-50 rounded-lg p-4"
  const columns = page.locator('div.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4');
  const count = await columns.count();

  for (let i = 0; i < count; i++) {
    const column = columns.nth(i);
    const taskExists = await column.locator('h3', { hasText: taskName }).count();
    if (taskExists > 0) {
      // Get the h2 text — only the direct text node, not the span with count
      const h2 = column.locator('h2');
      const fullText = await h2.textContent();
      // Remove the count like "(2)" from the end
      return fullText.replace(/\s*\(\d+\)\s*$/, '').trim();
    }
  }
  return null;
}

async function getTaskTags(page, taskName) {
  // Find the task card by h3 heading
  const card = page.locator('div.bg-white.p-4.rounded-lg').filter({
    has: page.locator('h3', { hasText: taskName })
  });

  // Tags are spans with rounded-full class inside the card
  const tags = card.locator('span.rounded-full');
  const count = await tags.count();
  const tagTexts = [];

  for (let i = 0; i < count; i++) {
    const text = await tags.nth(i).textContent();
    tagTexts.push(text.trim());
  }

  return tagTexts;
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
