import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`головна коректно відображається на ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const home = new HomePage(page);
    await home.open();
    await expect(home.mainHeading).toBeVisible();
    await home.expectNoHorizontalScroll();
  });
}
