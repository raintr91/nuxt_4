import { expect, test, waitForSemanticUiReady } from '../fixtures/semantic-ui'
import { scanA11y } from '../helpers/semantic-ui/accessibility'

test.describe('Semantic UI axe spike', () => {
  test('inspects AxeBuilder result shape on login page', async ({ page }, testInfo) => {
    await page.goto('/login')
    await waitForSemanticUiReady(page, {
      rootTestId: 'auth-login-page',
      waitForTestIds: ['auth-login-submit-btn'],
      waitForFonts: true,
      waitForImages: 'visible'
    })

    const results = await scanA11y(page, testInfo, {
      include: '[data-testid="auth-login-page"]',
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
    })

    expect(Array.isArray(results.violations)).toBe(true)
    expect(Array.isArray(results.incomplete)).toBe(true)

    for (const violation of results.violations) {
      expect(typeof violation.id).toBe('string')
      expect(Array.isArray(violation.nodes)).toBe(true)
    }
  })
})
