# Luxe Quality — Playwright + TypeScript autotests

Автотести для https://luxequality.com (Page Object Model).

## Встановлення
```bash
npm install
npx playwright install --with-deps
```

## Запуск
```bash
npm test                  # усі тести, усі браузери
npm run test:chromium     # лише Chromium
npm run test:smoke        # лише @smoke
npm run test:headed       # з відкритим браузером
npm run test:ui           # UI-режим Playwright
npm run report            # відкрити HTML-звіт
```

Інший стенд: `BASE_URL=https://staging.example.com npm test`

## Структура
```
pages/   BasePage, HomePage (Page Objects)
tests/   home, navigation, contact-form, seo-and-security, responsive, performance
.github/workflows/playwright.yml  CI
```

## Примітки
- Тест контактної форми **не відправляє** форму, щоб не створювати реальні заявки.
- Локатори універсальні; за потреби уточніть їх через `npm run codegen`.
