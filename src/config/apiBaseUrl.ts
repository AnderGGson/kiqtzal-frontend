import env from './env'

const STORAGE_KEY = 'kiqtzal.backendUrl'

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

export function getApiBaseUrl(): string {
  const custom = window.localStorage.getItem(STORAGE_KEY)
  if (custom && custom.trim().length > 0) return stripTrailingSlash(custom.trim())
  return stripTrailingSlash(env.apiBaseUrl ?? '/api')
}

export function setApiBaseUrl(url: string): void {
  const value = url.trim()
  if (value.length > 0) window.localStorage.setItem(STORAGE_KEY, stripTrailingSlash(value))
  else window.localStorage.removeItem(STORAGE_KEY)
}