import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get mainHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 }).first();
  }

  get logo(): Locator {
    return this.header.locator('a[href="/"], a[href="https://luxequality.com/"]').first();
  }

  get contactForm(): Locator {
    return this.page.locator('form').first();
  }

  get emailInput(): Locator {
    return this.contactForm.locator('input[type="email"], input[name*="mail" i]').first();
  }

  get submitButton(): Locator {
    return this.contactForm.locator('button[type="submit"], input[type="submit"]').first();
  }

  section(text: string | RegExp): Locator {
    return this.page.getByText(text).first();
  }

  async open() {
    await this.goto('/');
  }
}
