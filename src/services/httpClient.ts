import { getApiBaseUrl } from '../config/apiBaseUrl'
import type { ApiError, ApiErrorBody, ApiResult } from '../types'

const DEFAULT_TIMEOUT_MS = 10_000

async function parseError(response: Response): Promise<ApiError> {
  const payload = (await response.json().catch(() => null)) as ApiErrorBody | null
  if (payload?.error) return payload.error
  return { code: response.status.toString(), message: `Error HTTP ${response.status}` }
}

export async function httpClient<T>(
  path: string,
  init?: RequestInit,
  baseUrl: string = getApiBaseUrl(),
): Promise<ApiResult<T>> {
  const controller = new AbortController()
  const externalSignal = init?.signal
  let timedOut = false

  if (externalSignal?.aborted) controller.abort()
  else externalSignal?.addEventListener('abort', () => controller.abort(), { once: true })

  const timeout = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${baseUrl}${path}`, { ...init, signal: controller.signal })

    if (!response.ok) return { ok: false, error: await parseError(response) }

    const body = await response.text()
    if (body.length === 0) {
      return { ok: false, error: { code: 'INVALID_RESPONSE', message: 'La API devolvió una respuesta vacía' } }
    }

    try {
      return { ok: true, data: JSON.parse(body) as T }
    } catch {
      return {
        ok: false,
        error: { code: 'INVALID_RESPONSE', message: 'La API devolvió un JSON inválido' },
      }
    }
  } catch {
    if (externalSignal?.aborted) {
      return { ok: false, error: { code: 'ABORTED', message: 'Solicitud cancelada' } }
    }
    if (timedOut) {
      return { ok: false, error: { code: 'TIMEOUT', message: 'La API no respondió a tiempo' } }
    }
    return {
      ok: false,
      error: { code: 'NETWORK_ERROR', message: 'No se pudo conectar con el backend' },
    }
  } finally {
    window.clearTimeout(timeout)
  }
}
