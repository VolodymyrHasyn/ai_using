import { test, expect } from '@playwright/test';

test.describe('SEO та базові перевірки', () => {
  test('має meta description і viewport @smoke', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description, 'meta description').toBeTruthy();
    expect(description!.length).toBeGreaterThan(30);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
  });

  test('має canonical або OpenGraph теги', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const canonical = await page.locator('link[rel="canonical"]').count();
    const og = await page.locator('meta[property^="og:"]').count();
    expect(canonical + og).toBeGreaterThan(0);
  });

  test('рівно один h1 на сторінці', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('усі зображення мають alt-атрибут (soft)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const missing = await page.$$eval('img:not([alt])', (imgs) => imgs.map((i) => i.getAttribute('src')));
    expect.soft(missing, `Зображення без alt: ${missing.join(', ')}`).toEqual([]);
  });

  test('robots.txt та sitemap доступні', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    const sitemap = await request.get('/sitemap.xml');
    expect.soft(sitemap.status(), 'sitemap.xml').toBeLessThan(400);
  });

  test('головна по HTTPS, без JS-помилок (soft)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/', { waitUntil: 'load' });
    expect(page.url()).toMatch(/^https:/);
    expect.soft(errors, `JS-помилки: ${errors.join(' | ')}`).toEqual([]);
  });
});
