'use client';

import type { ReactNode } from 'react';
import { Command } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh">
      <aside className="relative hidden w-[42%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b9db4] via-[#3aab9f] to-[#73b346]" />
        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
          <div className="mb-10 flex size-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <Command className="size-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">Portal</h1>
          <p className="mt-4 max-w-md text-lg text-white/90">Auth-first admin base — Next.js + shadcn/ui</p>
        </div>
        <p className="relative z-10 px-12 pb-10 text-sm text-white/70 xl:px-16">
          © {new Date().getFullYear()} Portal
        </p>
      </aside>

      <main className="flex min-h-svh flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Command className="size-6" />
            </div>
            <div>
              <p className="text-xl font-semibold">Portal</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[496px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
