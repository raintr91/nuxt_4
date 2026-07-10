import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { dataTestId, testIdSuffix, type WithTestId } from '@/lib/test-id';

interface PageHeaderProps extends WithTestId {
  title: string;
  description?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  testId,
}: PageHeaderProps) {
  return (
    <div
      className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}
      {...dataTestId(testId)}
    >
      <div className="space-y-1">
        {breadcrumbs && <div className="text-sm text-muted-foreground">{breadcrumbs}</div>}
        <h2 className="text-2xl font-bold tracking-tight" {...dataTestId(testIdSuffix(testId, 'title'))}>{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground" {...dataTestId(testIdSuffix(testId, 'description'))}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
