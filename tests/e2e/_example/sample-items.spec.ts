import { expect, test } from '@playwright/test';

import { assertLayoutIntegrity } from '../helpers/assertLayoutIntegrity';
import { mockAuthenticatedSession } from '../helpers/session';

test.describe('Contract pilot sample items', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
  });

  test('loads list from fast-api-base GET /sample-items', async ({ page }) => {
    await page.goto('/sample-items');
    await expect(page.getByTestId('sample-items-page')).toBeVisible();
    await expect(page.getByTestId('sample-items-row').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('sample-items-table')).toContainText(/Contract gen pilot|Sample/i);
    await assertLayoutIntegrity(page);
  });
});
