import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  get header(): Locator {
    return this.page.locator('header').first();
  }

  get footer(): Locator {
    return this.page.locator('footer').first();
  }

  /** Унікальні внутрішні посилання з хедера (без якорів, mailto, tel). */
  async getInternalHeaderLinks(): Promise<string[]> {
    const hrefs = await this.header
      .locator('a[href]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    const origin = new URL(this.page.url()).origin;
    const unique = new Set<string>();
    for (const href of hrefs) {
      try {
        const url = new URL(href);
        if (url.origin !== origin) continue;
        if (!['http:', 'https:'].includes(url.protocol)) continue;
        url.hash = '';
        if (url.pathname === '/') continue;
        unique.add(url.toString());
      } catch {
        /* ignore invalid URL */
      }
    }
    return [...unique];
  }

  async expectNoHorizontalScroll() {
    const overflow = await this.page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'Сторінка не повинна мати горизонтального скролу').toBeLessThanOrEqual(1);
  }
}
