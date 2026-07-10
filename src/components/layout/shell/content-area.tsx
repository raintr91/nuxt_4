import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ContentAreaProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'full' | '6xl' | '4xl';
}

const maxWidthMap = {
  full: 'max-w-full',
  '6xl': 'max-w-6xl',
  '4xl': 'max-w-4xl',
};

export function ContentArea({ children, className, maxWidth = 'full' }: ContentAreaProps) {
  return (
    <main className={cn('flex-1 overflow-y-auto p-6', className)}>
      <div className={cn('mx-auto w-full', maxWidthMap[maxWidth])}>{children}</div>
    </main>
  );
}
