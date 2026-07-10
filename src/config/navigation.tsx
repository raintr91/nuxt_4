import type { SidebarMenuGroup, SidebarMenuItem } from '@/components/layout/shell/admin-layout-types';
import { LayoutDashboard } from 'lucide-react';
import type { ReactNode } from 'react';

export function getDashboardSidebarGroups(pathname: string): SidebarMenuGroup[] {
  const items: SidebarMenuItem[] = [
    {
      id: 'dashboard',
      label: 'ホーム',
      href: '/',
      icon: <LayoutDashboard className="size-4" />,
      active: pathname === '/' || pathname === '',
    },
  ];

  return [{ id: 'general', label: 'General', items }];
}

export function getPortalBrandTitle(): string {
  return 'Shadcn Portal';
}

export function getSidebarHeader(): ReactNode {
  return (
    <div className="flex h-14 items-center gap-2 px-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
        S
      </span>
      <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        Shadcn Portal
      </span>
    </div>
  );
}
