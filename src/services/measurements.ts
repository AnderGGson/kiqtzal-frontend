import { httpClient } from './httpClient'
import { toMeasurement, toMeasurementList } from './measurementMapper'
import type { ApiMeasurement, ApiResult, Measurement, MeasurementQueryParams } from '../types'

const API_MAX_LIMIT = 500

function buildQuery(params?: MeasurementQueryParams): string {
  const entries: [string, string][] = []

  if (params?.limit !== undefined) {
    entries.push(['limit', String(Math.min(Math.max(Math.trunc(params.limit), 1), API_MAX_LIMIT))])
  }
  if (params?.offset !== undefined) {
    entries.push(['offset', String(Math.max(Math.trunc(params.offset), 0))])
  }
  if (params?.from) entries.push(['from', params.from])
  if (params?.to) entries.push(['to', params.to])

  const query = new URLSearchParams(entries).toString()
  return query.length > 0 ? `?${query}` : ''
}

export async function fetchLatestMeasurement(
  signal?: AbortSignal,
): Promise<ApiResult<Measurement | null>> {
  const result = await httpClient<ApiMeasurement | null>('/measurements/latest', { signal })
  if (!result.ok) return result
  if (result.data === null) return { ok: true, data: null }

  const measurement = toMeasurement(result.data)
  if (measurement === null) {
    return {
      ok: false,
      error: { code: 'INVALID_RESPONSE', message: 'La última lectura tiene un formato inválido' },
    }
  }

  return { ok: true, data: measurement }
}

export async function fetchMeasurements(
  params?: MeasurementQueryParams,
  signal?: AbortSignal,
): Promise<ApiResult<Measurement[]>> {
  const result = await httpClient<unknown>(`/measurements${buildQuery(params)}`, { signal })
  if (!result.ok) return result
  return { ok: true, data: toMeasurementList(result.data) }
}
