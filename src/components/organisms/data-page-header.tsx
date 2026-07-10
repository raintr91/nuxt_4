import { dataTestId, dataTestIdWrapper } from '@/lib/test-id';
import type { ReactNode } from 'react';

export function DataPageHeader({
  title,
  description,
  testId,
  actions,
}: {
  title: string;
  description?: string;
  testId?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6" {...dataTestId(testId)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold" {...dataTestId(testId ? `${testId}-title` : undefined)}>
            {title}
          </h1>
          {description ? (
            <p
              className="mt-1 text-sm text-muted-foreground"
              {...dataTestId(testId ? `${testId}-description` : undefined)}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
