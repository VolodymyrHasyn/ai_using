import { Page, Locator } from '@playwright/test';
import { NavigablePage } from './NavigablePage';

export class ServicesPage extends NavigablePage {
  protected readonly navLabel = /^\s*services\s*$/i;

  constructor(page: Page) {
    super(page);
  }

  /** Ключові послуги, заявлені на сайті/в профілях компанії. */
  static readonly expectedKeywords = [
    /manual/i,
    /automat/i,
    /performance/i,
    /api/i,
    /mobile/i,
    /security/i,
  ];

  get serviceHeadings(): Locator {
    return this.page.getByRole('heading', { level: 2 });
  }

  get ctaLink(): Locator {
    return this.page.getByRole('link', { name: /contact|get in touch|free|start|talk/i }).first();
  }
}
