# Portal Base — Reference

Bổ sung chi tiết cho [SKILL.md](SKILL.md). Đọc khi cần template code đầy đủ hoặc tra bảng naming.

---

## Service template

```ts
// src/services/work-order.service.ts
import { WorkOrderListResponseSchema } from '@portal/models/work-order';
import { apiFetch } from '@/lib/api-client';
import { assertApiSuccess, parseApiData } from '@/services/shared/api-response';

export function createWorkOrderService(fetch = apiFetch) {
  return {
    async list(params?: Record<string, string>) {
      const res = await fetch('/work-orders', { query: params });
      assertApiSuccess(res);
      return parseApiData(WorkOrderListResponseSchema, res.data);
    },
  };
}
```

## Hook list template

```ts
// src/hooks/work-order/useWorkOrderList.ts
'use client';

import { useCallback, useState } from 'react';
import { createWorkOrderService } from '@/services/work-order.service';
import { workOrderMockSearch } from '@/mocks/work-order.mock';

export function useWorkOrderList() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setPending(true);
    try {
      const result = await workOrderMockSearch();
      setItems(result.items);
    } finally {
      setPending(false);
    }
  }, []);

  return { items, pending, load, service: createWorkOrderService() };
}
```

## Page + testId template

```tsx
// src/app/(dashboard)/work-orders/page.tsx
'use client';

import { useEffect } from 'react';
import { DataListPage } from '@/components/common';
import { useWorkOrderList } from '@/hooks/work-order/useWorkOrderList';

export default function WorkOrdersPage() {
  const { items, pending, load, columns } = useWorkOrderList();
  useEffect(() => { void load(); }, [load]);

  return (
    <DataListPage
      testId="work-orders-page"
      title="Work Orders"
      columns={columns}
      items={items}
      pending={pending}
      rowTestId="work-order-row"
    />
  );
}
```

## Playwright spec template

```ts
import { expect, test } from '@playwright/test';
import { assertLayoutIntegrity } from './helpers/assertLayoutIntegrity';
import { mockAuthenticatedSession } from './helpers/session';

test.describe('Work orders', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/work-orders/');
    await assertLayoutIntegrity(page);
  });

  test('shows page shell', async ({ page }) => {
    await expect(page.getByTestId('work-orders-page')).toBeVisible();
  });
});
```

---

## Auth login reference ids

`src/components/auth/login-card.tsx` · route `/login/`:

| testId | Element |
|--------|---------|
| `auth-login-page` | Root |
| `auth-login-form` | Form |
| `auth-login-email-input` | Email |
| `auth-login-password-input` | Password |
| `auth-login-submit-btn` | Submit |
| `auth-login-error-alert` | API error |

## Global app shell ids

| testId | Component |
|--------|-----------|
| `app-toast-message` | Toast body |
| `app-dialog-confirm-btn` | Confirm dialog |

## Thư mục quan trọng

```
src/
├── app/(auth)|/(dashboard)/
├── hooks/
├── services/
├── stores/
├── validations/
├── components/ui|molecules|organisms/
├── lib/api-client.ts
└── middleware.ts
packages/models/          # @portal/models
tests/e2e/
docs/operational/E2E-TESTIDS.md
```

## HTTP / E2E env

| Biến | Mục đích |
|------|----------|
| `PORT` | Next dev server (default 3000) |
| `E2E_PORT` | E2E dev server (default 3005) |
| `NEXT_PUBLIC_API_URL` | API base for `apiFetch` |
| `PLAYWRIGHT_SKIP_WEBSERVER=1` | Test against running app |
| `PLAYWRIGHT_BASE_URL` | Remote/staging URL |
