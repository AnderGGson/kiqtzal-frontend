import { getApiBaseUrl } from '../config/apiBaseUrl'
import type { ApiErrorBody, ApiResult } from '../types'

async function parseError(response: Response): Promise<ApiResult<never>> {
  const payload = (await response.json().catch(() => null)) as ApiErrorBody | null
  return {
    ok: false,
    error:
      payload?.error ?? {
        code: response.status.toString(),
        message: `Error HTTP ${response.status}`,
      },
  }
}

export async function httpClient<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })

    if (!response.ok) return parseError(response)

    const data = (await response.json()) as T
    return { ok: true, data }
  } catch {
    return {
      ok: false,
      error: { code: 'NETWORK_ERROR', message: 'No se pudo conectar con el backend' },
    }
  }
}