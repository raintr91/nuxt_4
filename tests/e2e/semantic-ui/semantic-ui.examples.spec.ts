import { expect, test, waitForSemanticUiReady } from '../fixtures/semantic-ui'

test.describe('Semantic UI examples', () => {
  test('login page passes level 1 semantic smoke checks', async ({ page, consoleErrors }) => {
    await page.goto('/login')
    await waitForSemanticUiReady(page, {
      rootTestId: 'auth-login-page',
      waitForTestIds: ['auth-login-submit-btn'],
      waitForFonts: true,
      waitForImages: 'visible'
    })

    await expect(page).toHaveNoConsoleErrors(consoleErrors)
    await expect(page).toHaveNoHorizontalScroll()
    await expect(page).toHaveNoBrokenImages()
    await expect(page.getByTestId('auth-login-page')).toHaveNoTextOverflow({
      allowTruncate: true
    })
  })
})
