import { httpClient } from './httpClient'
import type { ApiResult, Measurement } from '../types'

export interface MeasurementQuery {
  from?: string
  to?: string
  after?: string
  limit?: number
}

function buildQuery(params?: MeasurementQuery): string {
  const entries = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)] as [string, string])
  const query = new URLSearchParams(entries).toString()
  return query ? `?${query}` : ''
}

export function fetchLatestMeasurement(): Promise<ApiResult<Measurement | null>> {
  return httpClient<Measurement | null>('/measurements/latest')
}

export function fetchMeasurements(params?: MeasurementQuery): Promise<ApiResult<Measurement[]>> {
  return httpClient<Measurement[]>(`/measurements${buildQuery(params)}`)
}