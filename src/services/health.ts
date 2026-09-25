import { httpClient } from './httpClient'
import type { ApiResult } from '../types'

export interface HealthStatus {
  status: string
  database: 'up' | 'down'
  timestamp: string
}

interface HealthOptions {
  signal?: AbortSignal
  baseUrl?: string
}

export async function fetchHealth(options: HealthOptions = {}): Promise<ApiResult<HealthStatus>> {
  const { signal, baseUrl } = options
  const result = await httpClient<HealthStatus>('/health', { signal }, baseUrl)
  if (!result.ok) return result

  const { status, database, timestamp } = result.data
  const valid =
    typeof status === 'string' &&
    (database === 'up' || database === 'down') &&
    typeof timestamp === 'string'

  if (!valid) {
    return {
      ok: false,
      error: { code: 'INVALID_RESPONSE', message: 'La respuesta de salud tiene un formato inválido' },
    }
  }

  return { ok: true, data: { status, database, timestamp } }
}
