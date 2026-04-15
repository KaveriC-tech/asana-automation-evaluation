class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToProject(projectName) {
    await this.page.getByText(projectName, { exact: true }).click();
  }

  async getTaskColumn(taskName) {
    const task = this.page.locator(`.card:has-text("${taskName}")`);
    await task.waitFor({ state: 'visible' });
    const column = this.page.locator(`.column:has(.card:has-text("${taskName}")) h2`);
    return await column.textContent();
  }

  async getTaskTags(taskName) {
    const task = this.page.locator(`.card:has-text("${taskName}")`);
    const tags = task.locator('.tag, .badge, [class*="tag"], [class*="badge"]');
    const count = await tags.count();
    const tagTexts = [];
    for (let i = 0; i < count; i++) {
      const text = await tags.nth(i).textContent();
      if (text.trim()) tagTexts.push(text.trim());
    }
    return tagTexts;
  }
}

module.exports = { ProjectPage };
