import { useEffect, useRef, useState } from 'react'
import { MAX_BACKOFF_MS } from '../utils/constants'

export interface PollingState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  isRefreshing: boolean
  lastUpdatedAt: Date | null
  isStale: boolean
}

interface PollingOptions {
  staleAfterMs?: number
  enabled?: boolean
  resetKey?: string | number
}

export function usePolling<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  intervalMs: number,
  options: PollingOptions = {},
): PollingState<T> {
  const { staleAfterMs, enabled = true, resetKey } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const isStale =
    lastUpdatedAt !== null &&
    staleAfterMs !== undefined &&
    Date.now() - lastUpdatedAt.getTime() > staleAfterMs

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let active = true
    let running = false
    let failures = 0
    let timer: number | undefined
    let controller: AbortController | null = null

    const schedule = (delay: number) => {
      timer = window.setTimeout(() => void run(), delay)
    }

    const run = async () => {
      if (!active || running) return
      if (document.hidden) {
        schedule(intervalMs)
        return
      }

      const activeController = new AbortController()
      controller = activeController
      running = true
      setIsRefreshing(true)

      try {
        const result = await fetcherRef.current(activeController.signal)
        if (!active) return
        setData(result)
        setError(null)
        setLastUpdatedAt(new Date())
        failures = 0
      } catch (err) {
        if (!active || activeController.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Error desconocido')
        failures += 1
      }

      if (!active) return
      running = false
      setIsRefreshing(false)
      setIsLoading(false)
      schedule(Math.min(intervalMs * 2 ** failures, MAX_BACKOFF_MS))
    }

    const handleVisibilityChange = () => {
      if (document.hidden) return
      if (timer !== undefined) window.clearTimeout(timer)
      void run()
    }

    void run()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      active = false
      if (timer !== undefined) window.clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, intervalMs, resetKey])

  return { data, error, isLoading, isRefreshing, lastUpdatedAt, isStale }
}
