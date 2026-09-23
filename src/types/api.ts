export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface MeasurementQueryParams extends PaginationParams {
  from?: string
  to?: string
  after?: string
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorBody['error'] }