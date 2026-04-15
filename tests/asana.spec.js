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
  // Column headers contain "(number)" like "To Do (2)" — use this to distinguish from page title
  const columnHeaders = page.locator('h2').filter({ hasText: /\(\d+\)/ });
  const count = await columnHeaders.count();

  for (let i = 0; i < count; i++) {
    const header = columnHeaders.nth(i);
    const headerText = await header.textContent();

    // Get the parent of this column header and check if it contains the task
    const parent = page.locator('div').filter({
      has: page.locator('h2').filter(
