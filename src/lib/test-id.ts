/** Shared `testId` → `data-testid` helpers for Playwright E2E. */

export type WithTestId = {
  /** Maps to `data-testid` on the interactive element (or page root). */
  testId?: string;
};

export function dataTestId(testId?: string): { 'data-testid'?: string } {
  return testId ? { 'data-testid': testId } : {};
}

export function dataTestIdWrapper(testId?: string, suffix = 'wrapper'): { 'data-testid'?: string } {
  return testId ? { 'data-testid': `${testId}-${suffix}` } : {};
}

/** Sidebar / nav link convention: `nav-{menuItemId}`. */
export function navTestId(menuItemId: string): string {
  return `nav-${menuItemId}`;
}

/**
 * Form input testId: `{pageAbbrev}-{field}-input` or `{pageAbbrev}-{field}s{index}-input` for arrays.
 * `pageTestId` may include `-page` suffix (stripped); page name may already be abbreviated.
 */
export function pageInputTestId(pageTestId: string, field: string, index?: number): string {
  const prefix = pageTestId.replace(/-page$/, '');
  const fieldKey = index === undefined ? field : `${field}s${index}`;
  return `${prefix}-${fieldKey}-input`;
}

/** Suffix helper — `testIdSuffix('auth-login', 'input')` → `auth-login-input`. */
export function testIdSuffix(testId: string | undefined, suffix: string): string | undefined {
  if (!testId) return undefined;
  return `${testId}-${suffix}`;
}

/** Dialog buttons — `dialogBtnTestId('tags-delete-dialog', 'confirm')` → `tags-delete-confirm-btn`. */
export function dialogBtnTestId(dialogTestId: string, action: 'cancel' | 'confirm'): string {
  const base = dialogTestId.replace(/-dialog$/, '');
  return `${base}-${action}-btn`;
}
