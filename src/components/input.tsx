'use client';

import { cn } from '@/lib/utils';
import { dataTestId, dataTestIdWrapper, type WithTestId } from '@/lib/test-id';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, WithTestId {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, testId, ...props }, ref) => (
    <div className="w-full" {...dataTestIdWrapper(testId)}>
      <ShadcnInput
        ref={ref}
        className={cn(error && 'border-destructive', className)}
        aria-invalid={error ? true : undefined}
        {...dataTestId(testId)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
