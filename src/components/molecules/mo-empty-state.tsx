import type { ReactNode } from 'react';

export function MoEmptyState({
  title,
  description,
  children,
  icon,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
      {icon}
      {title ? <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
