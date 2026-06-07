import { Page } from "@playwright/test";
import { PageTexts } from "../constants/page-texts";
import { Routes } from "../constants/routes";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private get emailInput() {
    return this.page.locator("#email");
  }

  private get passwordInput() {
    return this.page.locator("#password");
  }

  private get loginButton() {
    return this.page.getByRole("button", { name: PageTexts.LOGIN.SIGN_IN });
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.LOGIN);
    await this.waitForPageReady();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState("networkidle");
  }
}
