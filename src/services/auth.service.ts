import {
  LoginResponseSchema,
  type LoginRequest,
} from '@portal/models/auth';
import { UserMeSchema } from '@portal/models/user';
import { ApiSuccessSchema } from '@portal/models/common/api.schema';
import { parseSchemaOrThrow } from '@portal/models/common/parse';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const ApiLoginResponseSchema = ApiSuccessSchema(z.unknown());
const ApiUserMeSchema = ApiSuccessSchema(z.unknown());

function assertSuccess<T extends { success: boolean }>(res: T): asserts res is T & { success: true } {
  if (!res.success) {
    throw new Error('API request failed');
  }
}

export function createAuthService() {
  return {
    async login(payload: LoginRequest) {
      const res = await apiFetch<z.infer<typeof ApiLoginResponseSchema>>('/auth/login', {
        method: 'POST',
        body: payload,
      });
      assertSuccess(res);
      return parseSchemaOrThrow(LoginResponseSchema, res.data);
    },

    async fetchMe() {
      const res = await apiFetch<z.infer<typeof ApiUserMeSchema>>('/auth/me', { method: 'GET' });
      assertSuccess(res);
      return parseSchemaOrThrow(UserMeSchema, res.data);
    },

    async logout() {
      await apiFetch('/auth/logout', { method: 'POST' });
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
