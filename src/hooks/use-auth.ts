'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiClientError } from '@/lib/api-client';
import {
  clearAuthSession,
  getStoredUser,
  setAuthSession,
  setStoredUser,
} from '@/lib/auth-session';
import { useAuthToken } from '@/hooks/use-auth-cookie';
import { createAuthService } from '@/services/auth.service';
import type { LoginRequest } from '@portal/models/auth';

const authService = createAuthService();
const ME_STALE_MS = 5 * 60_000;

export function useAuth() {
  const queryClient = useQueryClient();
  const { token, ready: tokenReady } = useAuthToken();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.fetchMe(),
    enabled: tokenReady && !!token,
    staleTime: ME_STALE_MS,
    retry: 1,
  });

  const user = meQuery.data ?? getStoredUser();

  async function login(input: LoginRequest) {
    const result = await authService.login(input);
    setAuthSession(result);
    if (!result.user) {
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      const me = await authService.fetchMe();
      setStoredUser(me);
      return { ...result, user: me };
    }
    return result;
  }

  async function logout() {
    try {
      if (token) await authService.logout();
    } finally {
      clearAuthSession();
      await queryClient.resetQueries({ queryKey: ['auth'] });
    }
  }

  return {
    token,
    user,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    error: meQuery.error instanceof ApiClientError ? meQuery.error : null,
  };
}
