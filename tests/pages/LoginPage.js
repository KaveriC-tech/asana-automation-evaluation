class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { LoginPage };
