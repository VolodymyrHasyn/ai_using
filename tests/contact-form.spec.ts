import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Контактна форма', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
    await home.contactForm.scrollIntoViewIfNeeded();
  });

  test('форма присутня на головній і має поле email та кнопку відправки @smoke', async () => {
    await expect(home.contactForm).toBeAttached();
    await expect(home.emailInput).toBeAttached();
    await expect(home.submitButton).toBeAttached();
  });

  test('поле email відхиляє некоректне значення (HTML5-валідація)', async () => {
    await home.emailInput.fill('not-an-email');
    const valid = await home.emailInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(false);
  });

  test('поле email приймає коректне значення', async () => {
    await home.emailInput.fill('qa.tester@example.com');
    const valid = await home.emailInput.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(true);
  });

  // ВАЖЛИВО: тести НЕ відправляють форму, щоб не створювати реальні заявки на продакшені.
});
