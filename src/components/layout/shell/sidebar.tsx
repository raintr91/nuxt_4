import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { navTestId } from '@/lib/test-id';

export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  active?: boolean;
  children?: SidebarMenuItem[];
}

export interface SidebarProps {
  items: SidebarMenuItem[];
  collapsed?: boolean;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ items, collapsed, className, header, footer }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-card',
        collapsed ? 'w-16' : 'w-60',
        className,
      )}
    >
      {header && <div className="border-b p-4">{header}</div>}

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                data-testid={navTestId(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center px-2',
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {footer && <div className="border-t p-4">{footer}</div>}
    </aside>
  );
}
