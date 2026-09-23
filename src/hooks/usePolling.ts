import { useEffect, useRef, useState } from 'react'

interface PollingState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number): PollingState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)

  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false

    async function tick() {
      try {
        const result = await fetcherRef.current()
        if (cancelled) return
        setData(result)
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void tick()
    const interval = setInterval(() => void tick(), intervalMs)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [intervalMs])

  return { data, isLoading, error }
}