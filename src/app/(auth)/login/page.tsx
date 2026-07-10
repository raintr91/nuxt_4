import { Suspense } from 'react';
import { LoginCard } from '@/components/auth/login-card';
import { Spinner } from '@/components/ui';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      }
    >
      <LoginCard />
    </Suspense>
  );
}
