export const POLL_INTERVAL_MS = 5_000
export const HEALTH_POLL_INTERVAL_MS = 15_000
export const HISTORY_POLL_INTERVAL_MS = 10_000
export const MAX_BACKOFF_MS = 30_000
export const CHART_MAX_POINTS = 500
export const DEFAULT_TIME_WINDOW_MS = 30 * 60_000
export const HISTORY_PAGE_SIZE = 25

export const TIME_WINDOWS = [
  { label: '5 min', value: 5 * 60_000 },
  { label: '30 min', value: 30 * 60_000 },
  { label: '1 h', value: 60 * 60_000 },
  { label: '6 h', value: 6 * 60 * 60_000 },
  { label: '24 h', value: 24 * 60 * 60_000 },
  { label: '7 días', value: 7 * 24 * 60 * 60_000 },
] as const

export const HISTORY_TIME_WINDOWS = [
  { label: 'Todo el historial', value: 0 },
  ...TIME_WINDOWS,
] as const
