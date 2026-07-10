'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navTestId } from '@/lib/test-id';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { AdminLayoutProps, SidebarMenuItem as SidebarMenuItemType } from '@/components/layout/shell/admin-layout-types';

function DefaultLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

function hasActiveDescendant(item: SidebarMenuItemType): boolean {
  if (item.active) return true;
  return item.children?.some(hasActiveDescendant) ?? false;
}

export { hasActiveDescendant };

export function AdminLayoutNavMenuItem({
  item,
  LinkComponent,
  nested = false,
  activePathname,
}: {
  item: SidebarMenuItemType;
  LinkComponent: AdminLayoutProps['LinkComponent'];
  nested?: boolean;
  activePathname?: string;
}) {
  const Link = LinkComponent ?? DefaultLink;
  const hasChildren = (item.children?.length ?? 0) > 0;
  const childActive = item.children?.some(hasActiveDescendant) ?? false;
  const [open, setOpen] = useState(item.active || childActive);

  useEffect(() => {
    if (item.active || childActive) setOpen(true);
  }, [item.active, childActive, activePathname]);

  const ItemWrapper = nested ? SidebarMenuSubItem : SidebarMenuItem;
  const LeafButton = nested ? SidebarMenuSubButton : SidebarMenuButton;

  if (!hasChildren) {
    return (
      <ItemWrapper>
        <LeafButton
          render={<Link href={item.href} />}
          data-testid={navTestId(item.id)}
          isActive={item.active}
          tooltip={nested ? undefined : item.label}
        >
          {item.icon}
          <span>{item.label}</span>
        </LeafButton>
        {!nested && item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
      </ItemWrapper>
    );
  }

  const ParentButton = nested ? SidebarMenuSubButton : SidebarMenuButton;

  return (
    <ItemWrapper>
      <Collapsible open={open} onOpenChange={setOpen}>
        <ParentButton
          type="button"
          isActive={item.active || childActive}
          tooltip={nested ? undefined : item.label}
          className={cn(!nested && 'pr-2')}
          onClick={() => setOpen((prev) => !prev)}
        >
          {item.icon}
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRight
            className={cn(
              'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-90',
            )}
          />
        </ParentButton>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-0 border-0 py-0 pl-3">
            {item.children!.map((child) => (
              <AdminLayoutNavMenuItem
                key={child.id}
                item={child}
                LinkComponent={LinkComponent}
                nested
                activePathname={activePathname}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      {!nested && item.badge !== undefined && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </ItemWrapper>
  );
}
