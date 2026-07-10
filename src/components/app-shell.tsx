'use client';

import { AdminLayout } from '@/components/layout/shell/admin-layout';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/layout/app-link';
import { NavUser } from '@/components/layout/nav-user';
import {
  getDashboardSidebarGroups,
  getPortalBrandTitle,
  getSidebarHeader,
} from '@/config/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const sidebarGroups = getDashboardSidebarGroups(pathname);

  return (
    <AdminLayout
      LinkComponent={AppLink}
      activePathname={pathname}
      sidebarGroups={sidebarGroups}
      sidebarHeader={getSidebarHeader()}
      sidebarFooter={<NavUser />}
      header={{
        title: getPortalBrandTitle(),
        searchPlaceholder: 'Search…',
      }}
      footer={
        <span suppressHydrationWarning>© {new Date().getFullYear()} Portal</span>
      }
    >
      {children}
    </AdminLayout>
  );
}
