import type { ZodType } from 'zod';

export function assertApiSuccess<T extends { success: boolean; message?: string }>(
  res: T,
): asserts res is T & { success: true } {
  if (!res.success) {
    throw new Error(res.message ?? 'API request failed');
  }
}

/** Returns parsed data when schema matches; otherwise returns raw value (wire-tolerant). */
export function parseApiData<T>(schema: ZodType<T>, raw: unknown): T {
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : (raw as T);
}
