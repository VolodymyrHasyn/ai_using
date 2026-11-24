import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Головна сторінка', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
  });

  test('відкривається з правильним title та h1 @smoke', async ({ page }) => {
    await expect(page).toHaveTitle(/Luxe Quality|QA|Testing/i);
    await expect(home.mainHeading).toBeVisible();
    await expect(home.mainHeading).toContainText(/Software Testing|QA/i);
  });

  test('хедер і футер відображаються @smoke', async () => {
    await expect(home.header).toBeVisible();
    await expect(home.footer).toBeAttached();
  });

  test('містить ключові секції', async () => {
    const sections = [
      /Our Services/i,
      /Case Studies/i,
      /Why Choose Luxe Quality/i,
      /Client.?s feedback/i,
      /Get in touch/i,
      /Our workflow/i,
    ];
    for (const s of sections) {
      await expect(home.section(s), `Секція ${s} має існувати`).toBeAttached();
    }
  });

  test('відображає переваги компанії', async ({ page }) => {
    const benefits = ['Quick Start', 'QA/AQA Specialization', 'Own Training Center', 'Wide Range Of Services'];
    for (const b of benefits) {
      await expect(page.getByText(b, { exact: false }).first()).toBeAttached();
    }
  });

  test('пропозиція 40 годин безкоштовного тестування присутня', async ({ page }) => {
    await expect(page.getByText(/40 hours of free testing/i).first()).toBeAttached();
  });

  test('немає горизонтального скролу', async () => {
    await home.expectNoHorizontalScroll();
  });

  test('на сторінці немає зламаних зображень', async ({ page }) => {
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 800));
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('load');
    const broken = await page.$$eval('img', (imgs) =>
      imgs
        .filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc && !i.currentSrc.startsWith('data:'))
        .map((i) => i.currentSrc),
    );
    expect(broken, `Зламані зображення: ${broken.join(', ')}`).toEqual([]);
  });
});
