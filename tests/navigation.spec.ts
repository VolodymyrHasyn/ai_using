import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Навігація', () => {
  test('усі внутрішні посилання хедера відкриваються без помилок @smoke', async ({ page, request }) => {
    const home = new HomePage(page);
    await home.open();

    const links = await home.getInternalHeaderLinks();
    expect(links.length, 'У хедері має бути хоча б одне внутрішнє посилання').toBeGreaterThan(0);

    for (const link of links) {
      const res = await request.get(link);
      expect.soft(res.status(), `Статус для ${link}`).toBeLessThan(400);
    }
  });

  test('перехід по першому посиланню хедера змінює URL', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    const [first] = await home.getInternalHeaderLinks();
    test.skip(!first, 'Не знайдено внутрішніх посилань');

    await page.goto(first, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(first);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('клік по логотипу повертає на головну', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const [first] = await home.getInternalHeaderLinks();
    test.skip(!first, 'Не знайдено внутрішніх посилань');

    await page.goto(first, { waitUntil: 'domcontentloaded' });
    await home.logo.click();
    await expect(page).toHaveURL(/luxequality\.com\/?$/);
  });

  test('неіснуюча сторінка повертає 404', async ({ request }) => {
    const res = await request.get('/this-page-does-not-exist-12345');
    expect(res.status()).toBe(404);
  });
});
