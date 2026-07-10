'use client';

import { useToastStore } from '@/stores/use-toast-store';
import { dataTestId } from '@/lib/test-id';
import { cn } from '@/lib/utils';

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const hide = useToastStore((s) => s.hide);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            'pointer-events-auto rounded-lg border bg-background p-4 shadow-lg',
            toast.type === 'error' && 'border-destructive/50',
            toast.type === 'success' && 'border-green-500/50',
          )}
          {...dataTestId('app-toast-message')}
        >
          {toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}
          <p className="text-sm text-muted-foreground">{toast.message}</p>
          <button
            type="button"
            className="mt-2 text-xs text-primary underline"
            onClick={() => hide(toast.id)}
          >
            閉じる
          </button>
        </div>
      ))}
    </div>
  );
}
