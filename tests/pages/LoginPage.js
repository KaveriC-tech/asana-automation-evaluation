class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput    = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
