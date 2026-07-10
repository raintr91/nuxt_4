'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  AdminLayoutCollapsibleGroup,
  AdminLayoutNavItems,
} from '@/components/layout/shell/admin-layout-sidebar-nav';
import type { AdminLayoutProps } from '@/components/layout/shell/admin-layout-types';

export type { AdminLayoutProps, SidebarMenuGroup, SidebarMenuItem, SidebarMenuItem as SidebarNavItem } from '@/components/layout/shell/admin-layout-types';

export function AdminLayout({
  sidebarGroups,
  sidebarHeader,
  sidebarFooter,
  header,
  footer,
  sidebarCollapsed,
  children,
  className,
  LinkComponent,
  activePathname,
}: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed} className={className}>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>{sidebarHeader}</SidebarHeader>

        <SidebarContent>
          {sidebarGroups.map((group) =>
            group.id === 'general' ? (
              <SidebarGroup key={group.id}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <AdminLayoutNavItems
                      items={group.items}
                      LinkComponent={LinkComponent}
                      activePathname={activePathname}
                    />
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              <AdminLayoutCollapsibleGroup
                key={group.id}
                group={group}
                LinkComponent={LinkComponent}
                activePathname={activePathname}
              />
            ),
          )}
        </SidebarContent>

        {sidebarFooter && <SidebarFooter>{sidebarFooter}</SidebarFooter>}
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
            {header?.title && <h1 className="hidden text-sm font-medium sm:block">{header.title}</h1>}
            {header?.searchPlaceholder && (
              <div className="ml-2 hidden flex-1 md:flex md:max-w-sm">
                <Input
                  type="search"
                  placeholder={header.searchPlaceholder}
                  className="h-8 bg-background"
                  readOnly
                  aria-hidden
                />
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">{header?.actions}</div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6">{children}</div>

        {footer && (
          <footer className="border-t px-4 py-3 text-center text-xs text-muted-foreground">{footer}</footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
