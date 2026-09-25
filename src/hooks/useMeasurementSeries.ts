import { useCallback } from 'react'
import { fetchMeasurements } from '../services/measurements'
import { CHART_MAX_POINTS, CHART_WINDOW_MS, POLL_INTERVAL_MS } from '../utils/constants'
import { usePolling } from './usePolling'
import type { Measurement } from '../types'

export function useMeasurementSeries() {
  const fetcher = useCallback(async (): Promise<Measurement[]> => {
    const from = new Date(Date.now() - CHART_WINDOW_MS).toISOString()
    const result = await fetchMeasurements({ from, limit: CHART_MAX_POINTS })
    if (!result.ok) throw new Error(result.error.message)
    return result.data.slice().reverse()
  }, [])

  return usePolling<Measurement[]>(fetcher, POLL_INTERVAL_MS)
}