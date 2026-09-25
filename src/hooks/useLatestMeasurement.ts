import { fetchLatestMeasurement } from '../services/measurements'
import { HEALTH_POLL_INTERVAL_MS } from '../utils/constants'
import { usePolling } from './usePolling'
import type { Measurement } from '../types'

export function useLatestMeasurement(enabled = true) {
  return usePolling<Measurement | null>(async (signal) => {
    const result = await fetchLatestMeasurement(signal)
    if (!result.ok) throw new Error(result.error.message)
    return result.data
  }, HEALTH_POLL_INTERVAL_MS, { enabled })
}
