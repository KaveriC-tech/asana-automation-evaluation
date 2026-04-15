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
  // Each column is a div with these exact Tailwind classes from the real HTML
  const columns = page.locator('div.flex.flex-col.w-80');
  const count = await columns.count();

  for (let i = 0; i < count; i++) {
    const column = columns.nth(i);
    // Task names are in h3 elements
    const taskExists = await column.locator('h3').filter({ hasText: taskName }).count();
    if (taskExists > 0) {
      // Get column header text from h2 and strip the "(2)" count
      const h2Text = await column.locator('h2').textContent();
      return h2Text.replace(/\s*\(\d+\)\s*$/, '').trim();
    }
  }
  return null;
}

async function getTaskTags(page, taskName) {
  // Find the exact card using h3 task name
  const card = page.locator('div.bg-white.p-4.rounded-lg').filter({
    has: page.locator('h3').filter({ hasText: taskName })
  });

  // Tags are span elements with rounded-full class
  const tagSpans = card.locator('span.rounded-full');
  const count = await tagSpans.count();
  const tags = [];

  for (let i = 0; i < count; i++) {
    const text = await tagSpans.nth(i).textContent();
    tags.push(text.trim());
  }

  return tags;
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
