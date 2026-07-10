'use client';

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserInitials } from '@/lib/auth-session';
import { useAuth } from '@/hooks/use-auth';

export function NavUser() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user?.full_name ?? user?.name ?? user?.email ?? 'User';

  async function onLogout() {
    await logout();
    router.replace('/login/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-sidebar-accent">
        <Avatar className="size-8">
          <AvatarFallback>{getUserInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled>
          <User className="mr-2 size-4" />
          プロフィール
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="mr-2 size-4" />
          設定
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} data-testid="nav-logout-btn">
          <LogOut className="mr-2 size-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
