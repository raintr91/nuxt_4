export type ApiErrorBody = {
  success?: false;
  message?: string;
  user_message?: string;
  errors?: Record<string, string[]>;
};

export class ApiClientError extends Error {
  statusCode: number;
  body?: ApiErrorBody;

  constructor(message: string, statusCode: number, body?: ApiErrorBody) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.body = body;
  }
}

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  query?: Record<string, unknown>;
};

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000'}/api`;

function buildApiUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, query, ...rest } = options;
  const token = typeof document !== 'undefined' ? document.cookie.match(/(?:^|; )auth_token=([^;]*)/)?.[1] : null;

  const response = await fetch(buildApiUrl(path, query), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message ?? payload?.user_message ?? `Request failed (${response.status})`,
      response.status,
      payload,
    );
  }

  return payload as T;
}
