import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface HeaderProps {
  logo?: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

export function Header({ logo, title, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between border-b bg-background px-4',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {logo}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
