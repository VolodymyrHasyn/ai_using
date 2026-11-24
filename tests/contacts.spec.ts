import { test, expect } from '@playwright/test';
import { ContactsPage } from '../pages/ContactsPage';

test.describe('Сторінка Contacts', () => {
  let contacts: ContactsPage;

  test.beforeEach(async ({ page }) => {
    contacts = new ContactsPage(page);
    await contacts.openViaMenu();
  });

  test('відкривається через меню і має заголовок @smoke', async ({ page }) => {
    await expect(page).not.toHaveURL(/^https:\/\/luxequality\.com\/?$/);
    await expect(contacts.mainHeading).toBeVisible();
  });

  test('містить контактну форму з полем email і кнопкою @smoke', async () => {
    await expect(contacts.form).toBeAttached();
    await expect(contacts.emailInput).toBeAttached();
    await expect(contacts.submitButton).toBeAttached();
  });

  test('email: некоректне значення відхиляється, коректне приймається', async () => {
    await contacts.emailInput.fill('not-an-email');
    expect(await contacts.emailInput.evaluate((e) => (e as HTMLInputElement).checkValidity())).toBe(false);

    await contacts.emailInput.fill('qa.tester@example.com');
    expect(await contacts.emailInput.evaluate((e) => (e as HTMLInputElement).checkValidity())).toBe(true);
  });

  test('поля форми приймають введення (без відправки)', async () => {
    if (await contacts.nameInput.count()) {
      await contacts.nameInput.fill('Test User');
      await expect(contacts.nameInput).toHaveValue('Test User');
    }
    if (await contacts.messageInput.count()) {
      await contacts.messageInput.fill('Autotest message, please ignore.');
      await expect(contacts.messageInput).toHaveValue(/Autotest/);
    }
  });

  test('є контактні дані: email, телефон або посилання на месенджери (soft)', async ({ page }) => {
    const mail = await contacts.emailLinks.count();
    const tel = await contacts.phoneLinks.count();
    const social = await page.locator('a[href*="linkedin"], a[href*="t.me"], a[href*="wa.me"], a[href*="facebook"]').count();
    expect.soft(mail + tel + social, 'Очікуємо хоча б один спосіб зв’язку').toBeGreaterThan(0);
  });

  test('немає горизонтального скролу', async () => {
    await contacts.expectNoHorizontalScroll();
  });

  // УВАГА: форма не відправляється, щоб не створювати реальні заявки на продакшені.
});
