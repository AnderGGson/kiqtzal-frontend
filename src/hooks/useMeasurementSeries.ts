import { useCallback } from 'react'
import { STALE_AFTER_MS } from '../config/qualityThresholds'
import { fetchMeasurements } from '../services/measurements'
import { CHART_MAX_POINTS, POLL_INTERVAL_MS } from '../utils/constants'
import { usePolling } from './usePolling'
import type { Measurement } from '../types'

export function useMeasurementSeries(windowMs: number) {
  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<Measurement[]> => {
      const from = new Date(Date.now() - windowMs).toISOString()
      const result = await fetchMeasurements({ from, limit: CHART_MAX_POINTS }, signal)
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    [windowMs],
  )

  return usePolling<Measurement[]>(fetcher, POLL_INTERVAL_MS, {
    staleAfterMs: STALE_AFTER_MS,
    resetKey: windowMs,
  })
}
