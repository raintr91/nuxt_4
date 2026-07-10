'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

export function AppLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
