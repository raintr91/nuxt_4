import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function MoAppBar({
  title,
  className,
  leading,
  actions,
}: {
  title?: string;
  className?: string;
  leading?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4',
        className,
      )}
    >
      {leading}
      {title ? <h1 className="text-lg font-semibold">{title}</h1> : null}
      <div className="flex-1" />
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
