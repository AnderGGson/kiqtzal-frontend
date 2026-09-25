export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface MeasurementQueryParams extends PaginationParams {
  from?: string
  to?: string
}

export interface ApiErrorDetail {
  code?: string
  message: string
  path?: (string | number)[]
}

export interface ApiError {
  code: string
  message: string
  details?: ApiErrorDetail[]
}

export interface ApiErrorBody {
  error: ApiError
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }
