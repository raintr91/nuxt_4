import { cn } from '@/lib/utils';
import { forwardRef, type LabelHTMLAttributes } from 'react';
import { Label as ShadcnLabel } from '@/components/ui/label';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <ShadcnLabel ref={ref} className={className} {...props}>
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </ShadcnLabel>
  ),
);
Label.displayName = 'Label';
