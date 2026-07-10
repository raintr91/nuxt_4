export function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

export function getCookie(name: string): string | null {
  if (!hasWindow()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, maxAgeDays = 7): void {
  if (!hasWindow()) return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeCookie(name: string): void {
  if (!hasWindow()) return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}
