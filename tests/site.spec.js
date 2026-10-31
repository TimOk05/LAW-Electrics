const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
];

for (const viewport of viewports) {
  test(`${viewport.name}: layout, assets and interactions`, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}`));

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveTitle(/LAW Electrics/);
    await expect(page.locator('h1')).toContainText('Electrical work');
    await expect(page.locator('main')).toBeVisible();
    if (viewport.width <= 560) await expect(page.locator('[data-mobile-call]')).toBeHidden();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    const missingBackgrounds = await page.locator('.photo-crop').evaluateAll((items) => items.filter((item) => getComputedStyle(item).backgroundImage === 'none').length);
    expect(missingBackgrounds).toBe(0);

    await page.getByText('Electrical fault', { exact: true }).click();
    await expect(page.locator('input[value="fault"]')).toBeChecked();
    await page.locator('#urgency').selectOption('urgent');
    await page.getByRole('button', { name: 'Show my next step' }).click();
    await expect(page.locator('[data-selector-result]')).toContainText('call now');
    if (viewport.width <= 560) await expect(page.locator('[data-mobile-call]')).toBeVisible();

    if (viewport.width <= 820) {
      const menuButton = page.locator('[data-menu-button]');
      await expect(menuButton).toHaveAccessibleName('Open menu');
      await menuButton.click();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      await expect(menuButton).toHaveAccessibleName('Close menu');
      await expect(page.locator('[data-nav]')).toHaveClass(/is-open/);
      await page.keyboard.press('Escape');
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    }

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}

test('keyboard navigation exposes the skip link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

