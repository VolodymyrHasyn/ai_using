import { test, expect } from '@playwright/test';

test('головна завантажується (DOMContentLoaded) швидше 5 секунд', async ({ page }) => {
  const start = Date.now();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const elapsed = Date.now() - start;
  expect(elapsed, `DOMContentLoaded: ${elapsed}ms`).toBeLessThan(5000);
});
