import env from './env'

export function getApiBaseUrl(): string {
  return env.apiBaseUrl.replace(/\/+$/, '')
}
