import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Базовий клас для сторінок, що відкриваються з головної через пункт меню.
 * Шлях не хардкодиться: шукаємо посилання в хедері за текстом.
 */
export abstract class NavigablePage extends BasePage {
  protected abstract readonly navLabel: RegExp;

  constructor(page: Page) {
    super(page);
  }

  get navLink(): Locator {
    return this.header.getByRole('link', { name: this.navLabel }).first();
  }

  get mainHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 }).first();
  }

  /** Відкрити сторінку кліком по пункту меню з головної. */
  async openViaMenu() {
    await this.goto('/');
    await this.openMobileMenuIfNeeded();
    await expect(this.navLink, `Пункт меню ${this.navLabel} має бути в хедері`).toBeAttached();
    const href = await this.navLink.getAttribute('href');
    if (href && !href.startsWith('#')) {
      await this.page.goto(new URL(href, this.page.url()).toString(), { waitUntil: 'domcontentloaded' });
    } else {
      await this.navLink.click({ force: true });
    }
  }

  private async openMobileMenuIfNeeded() {
    if (await this.navLink.isVisible().catch(() => false)) return;
    const burger = this.header
      .locator('button, [class*="burger" i], [class*="menu" i][role="button"], [aria-label*="menu" i]')
      .first();
    if (await burger.isVisible().catch(() => false)) await burger.click();
  }

  /** Внутрішні унікальні посилання всередині <main> (або всієї сторінки). */
  async getInternalContentLinks(): Promise<string[]> {
    const scope = (await this.page.locator('main').count()) ? this.page.locator('main') : this.page.locator('body');
    const hrefs = await scope.locator('a[href]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    const origin = new URL(this.page.url()).origin;
    const set = new Set<string>();
    for (const h of hrefs) {
      try {
        const u = new URL(h);
        if (u.origin !== origin || !/^https?:$/.test(u.protocol)) continue;
        u.hash = '';
        set.add(u.toString());
      } catch {
        /* ignore */
      }
    }
    return [...set];
  }
}
