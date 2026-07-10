import type { ComponentType, ReactNode } from 'react';

export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  active?: boolean;
  children?: SidebarMenuItem[];
}

export interface SidebarMenuGroup {
  id: string;
  label: string;
  items: SidebarMenuItem[];
}

export interface AdminLayoutProps {
  activePathname?: string;
  sidebarGroups: SidebarMenuGroup[];
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  header?: {
    title?: string;
    searchPlaceholder?: string;
    actions?: ReactNode;
  };
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  children: ReactNode;
  className?: string;
  LinkComponent?: ComponentType<{
    href: string;
    children?: ReactNode;
    className?: string;
    'data-testid'?: string;
  }>;
}
