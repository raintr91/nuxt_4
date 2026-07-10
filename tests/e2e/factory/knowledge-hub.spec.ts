import { expect, test } from '@playwright/test';

import { assertLayoutIntegrity } from '../helpers/assertLayoutIntegrity';
import { mockAuthenticatedSession } from '../helpers/session';

test.describe('Factory Knowledge Hub', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
  });

  test('submits query and shows answer from fast-api-base', async ({ page }) => {
    await page.goto('/factory/knowledge-hub');
    await expect(page.getByTestId('knowledge-hub-page')).toBeVisible();
    await page.getByTestId('knowledge-hub-query-input').fill('lockout procedure');
    await page.getByTestId('knowledge-hub-submit-btn').click();
    await expect(page.getByTestId('knowledge-hub-answer')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('knowledge-hub-answer')).toContainText(/stub|lockout|SOP/i);
    await assertLayoutIntegrity(page);
  });
});
