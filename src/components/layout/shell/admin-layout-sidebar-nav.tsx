'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import type { AdminLayoutProps, SidebarMenuGroup, SidebarMenuItem as SidebarMenuItemType } from '@/components/layout/shell/admin-layout-types';
import { AdminLayoutNavMenuItem, hasActiveDescendant } from '@/components/layout/shell/admin-layout-nav-menu-item';

export { AdminLayoutNavMenuItem } from '@/components/layout/shell/admin-layout-nav-menu-item';

function groupHasActiveItem(items: Parameters<typeof hasActiveDescendant>[0][]): boolean {
  return items.some(hasActiveDescendant);
}

export function AdminLayoutNavItems({
  items,
  LinkComponent,
  activePathname,
}: {
  items: SidebarMenuItemType[];
  LinkComponent: AdminLayoutProps['LinkComponent'];
  activePathname?: string;
}) {
  return (
    <>
      {items.map((item) => (
        <AdminLayoutNavMenuItem
          key={item.id}
          item={item}
          LinkComponent={LinkComponent}
          activePathname={activePathname}
        />
      ))}
    </>
  );
}

export function AdminLayoutCollapsibleGroup({
  group,
  LinkComponent,
  activePathname,
}: {
  group: SidebarMenuGroup;
  LinkComponent: AdminLayoutProps['LinkComponent'];
  activePathname?: string;
}) {
  const hasActive = groupHasActiveItem(group.items);
  const [open, setOpen] = useState(hasActive);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive, activePathname]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
              <SidebarMenuButton
                type="button"
                isActive={hasActive}
                className="pr-2"
                onClick={() => setOpen((prev) => !prev)}
              >
                <span className="flex-1 truncate text-left">{group.label}</span>
                <ChevronRight
                  className={cn(
                    'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    open && 'rotate-90',
                  )}
                />
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarMenuSub className="mx-0 border-0 py-0 pl-3">
                  {group.items.map((item) => (
                    <AdminLayoutNavMenuItem
                      key={item.id}
                      item={item}
                      LinkComponent={LinkComponent}
                      nested
                      activePathname={activePathname}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
