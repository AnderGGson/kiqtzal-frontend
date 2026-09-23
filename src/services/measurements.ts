import { httpClient } from './httpClient'
import type { ApiResult, Measurement } from '../types'

export function fetchLatestMeasurement(): Promise<ApiResult<Measurement | null>> {
  return httpClient<Measurement | null>('/measurements/latest')
}