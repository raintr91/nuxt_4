'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui';
import { useAuthToken } from '@/hooks/use-auth-cookie';
import { useAuth } from '@/hooks/use-auth';

const PUBLIC_PREFIXES = ['/login', '/forgot-password', '/reset-password'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, ready } = useAuthToken();
  const { isLoading } = useAuth();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (!ready) return;

    if (token) {
      redirectingRef.current = false;
      return;
    }

    if (redirectingRef.current) return;
    redirectingRef.current = true;
    router.replace(`/login/?next=${encodeURIComponent(pathname)}`);
  }, [ready, token, pathname, router]);

  if (!ready || !token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

export function isPublicAuthRoute(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}
