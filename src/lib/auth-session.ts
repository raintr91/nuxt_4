import {
  AUTH_ACCESS_TOKEN_COOKIE,
  AUTH_REFRESH_TOKEN_COOKIE,
  AUTH_SESSION_CHANGE_EVENT,
  AUTH_USER_COOKIE,
} from '@/lib/auth-constants';
import { getCookie, removeCookie, setCookie } from '@/lib/cookies';
import { hasWindow } from '@/lib/is-browser';
import type { LoginResponse } from '@portal/models/auth';
import type { UserMe } from '@portal/models/user';

function notifyAuthChange(): void {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

export function getAccessToken(): string | null {
  if (!hasWindow()) return null;
  return getCookie(AUTH_ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  if (!hasWindow()) return null;
  return getCookie(AUTH_REFRESH_TOKEN_COOKIE);
}

export function getStoredUser(): UserMe | null {
  if (!hasWindow()) return null;
  const raw = getCookie(AUTH_USER_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserMe;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserMe): void {
  setCookie(AUTH_USER_COOKIE, JSON.stringify(user));
  notifyAuthChange();
}

export function setAuthSession(result: LoginResponse & { user?: UserMe }): void {
  const token = result.accessToken ?? result.token ?? null;
  if (token) setCookie(AUTH_ACCESS_TOKEN_COOKIE, token);
  if (result.refreshToken) setCookie(AUTH_REFRESH_TOKEN_COOKIE, result.refreshToken);
  if (result.user) setStoredUser(result.user);
  notifyAuthChange();
}

export function clearAuthSession(): void {
  removeCookie(AUTH_ACCESS_TOKEN_COOKIE);
  removeCookie(AUTH_REFRESH_TOKEN_COOKIE);
  removeCookie(AUTH_USER_COOKIE);
  notifyAuthChange();
}

export function getUserInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}
