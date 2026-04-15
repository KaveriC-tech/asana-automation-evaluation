class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToProject(projectName) {
    await this.page.getByText(projectName, { exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTaskColumn(taskName) {
    // Get all column sections on the page
    const columnHeaders = this.page.locator('h2');
    const count = await columnHeaders.count();

    for (let i = 0; i < count; i++) {
      const header = columnHeaders.nth(i);
      const headerText = await header.textContent();

      // Check if this column contains the task
      const columnSection = this.page.locator('div').filter({
        has: header,
      }).filter({
        hasText: taskName,
      }).first();

      const exists = await columnSection.count();
      if (exists > 0) {
        // Strip the count e.g. "To Do (2)" → "To Do"
        return headerText.replace(/\s*\(\d+\)\s*$/, '').trim();
      }
    }
    return null;
  }

  async getTaskTags(taskName) {
    // Find the task card that contains the task name
    const taskCard = this.page.locator('div').filter({
      hasText: taskName,
    }).last();

    // Tags are styled spans inside the card
    const tags = taskCard.locator('span').filter({
      hasNotText: taskName,
    });

    const count = await tags.count();
    const tagTexts = [];

    for (let i = 0; i < count; i++) {
      const text = await tags.nth(i).textContent();
      const trimmed = text.trim();
      // Only include short tag-like text (not dates or names)
      if (trimmed && trimmed.length > 0 && trimmed.length < 20 && !trimmed.includes('/')) {
        tagTexts.push(trimmed);
      }
    }

    return tagTexts;
  }
}

module.exports = { ProjectPage };
