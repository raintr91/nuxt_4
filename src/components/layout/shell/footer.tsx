import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode;
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        'flex h-10 shrink-0 items-center justify-center border-t bg-muted/30 px-4 text-xs text-muted-foreground',
        className,
      )}
    >
      {children ?? `© ${new Date().getFullYear()} One CRM Platform`}
    </footer>
  );
}
