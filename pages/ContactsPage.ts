import { Page, Locator } from '@playwright/test';
import { NavigablePage } from './NavigablePage';

export class ContactsPage extends NavigablePage {
  protected readonly navLabel = /^\s*contacts?(\s+us)?\s*$/i;

  constructor(page: Page) {
    super(page);
  }

  get form(): Locator {
    return this.page.locator('form').first();
  }

  get nameInput(): Locator {
    return this.form.locator('input[name*="name" i], input[placeholder*="name" i]').first();
  }

  get emailInput(): Locator {
    return this.form.locator('input[type="email"], input[name*="mail" i]').first();
  }

  get messageInput(): Locator {
    return this.form.locator('textarea').first();
  }

  get submitButton(): Locator {
    return this.form.locator('button[type="submit"], input[type="submit"], button').first();
  }

  get emailLinks(): Locator {
    return this.page.locator('a[href^="mailto:"]');
  }

  get phoneLinks(): Locator {
    return this.page.locator('a[href^="tel:"]');
  }
}
