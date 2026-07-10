'use client';

import { useEffect, useState } from 'react';
import { AUTH_SESSION_CHANGE_EVENT } from '@/lib/auth-constants';
import { getAccessToken } from '@/lib/auth-session';

export type AuthTokenState = {
  token: string | null;
  ready: boolean;
};

export function useAuthToken(): AuthTokenState {
  const [state, setState] = useState<AuthTokenState>({ token: null, ready: false });

  useEffect(() => {
    const sync = () => setState({ token: getAccessToken(), ready: true });
    sync();
    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, sync);
    return () => window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, sync);
  }, []);

  return state;
}
