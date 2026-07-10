'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '@/validations/auth/schemas';
import type { LoginRequest } from '@portal/models/auth';
import { ApiClientError } from '@/lib/api-client';
import { Button, Input, Label } from '@/components/ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/';
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    try {
      await login(data);
      router.replace(nextPath);
    } catch (err) {
      if (err instanceof ApiClientError && err.statusCode === 403) {
        setError('このポータルへのアクセス権限がありません。');
        return;
      }
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className="w-full" data-testid="auth-login-page">
      <header className="pb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">ログイン</h2>
        <p className="mt-3 text-base text-muted-foreground">アカウント情報を入力してください。</p>
      </header>

      <form data-testid="auth-login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div
            className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            data-testid="auth-login-error-alert"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            testId="auth-login-email-input"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            testId="auth-login-password-input"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting} testId="auth-login-submit-btn">
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password/" className="underline-offset-4 hover:underline">
            パスワードをお忘れですか？
          </Link>
        </p>
      </form>
    </div>
  );
}
