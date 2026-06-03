export type ApiSuccess<T> = {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown> | null
}

export type ApiError = {
  success: false
  message?: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export function assertApiSuccess<T>(res: ApiResponse<T>, fallbackMessage?: string): asserts res is ApiSuccess<T> {
  if (!('success' in res) || res.success !== true) {
    throw Object.assign(new Error((res as ApiError).message || fallbackMessage || 'API request failed'), { data: res })
  }
}
