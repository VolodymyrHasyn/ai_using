import { test, expect } from '@playwright/test';
import { ServicesPage } from '../pages/ServicesPage';

test.describe('Сторінка Services', () => {
  let services: ServicesPage;

  test.beforeEach(async ({ page }) => {
    services = new ServicesPage(page);
    await services.openViaMenu();
  });

  test('відкривається через меню і має заголовок h1 @smoke', async ({ page }) => {
    await expect(page).not.toHaveURL(/^https:\/\/luxequality\.com\/?$/);
    await expect(services.mainHeading).toBeVisible();
  });

  test('має title та meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect.soft(desc, 'meta description').toBeTruthy();
  });

  test('описує основні напрями тестування', async ({ page }) => {
    const text = (await page.locator('body').innerText()).toLowerCase();
    const found = ServicesPage.expectedKeywords.filter((k) => k.test(text));
    expect(found.length, 'Має згадуватись щонайменше 3 з ключових напрямів').toBeGreaterThanOrEqual(3);
  });

  test('є кілька підзаголовків-послуг', async () => {
    expect(await services.serviceHeadings.count()).toBeGreaterThan(1);
  });

  test('внутрішні посилання зі сторінки не зламані', async ({ request }) => {
    const links = (await services.getInternalContentLinks()).slice(0, 25);
    for (const link of links) {
      const res = await request.get(link);
      expect.soft(res.status(), `Статус для ${link}`).toBeLessThan(400);
    }
  });

  test('немає горизонтального скролу', async () => {
    await services.expectNoHorizontalScroll();
  });
});
