import { usePolling } from './usePolling'
import { fetchLatestMeasurement } from '../services/measurements'
import { POLL_INTERVAL_MS } from '../utils/constants'
import type { Measurement } from '../types'

interface LatestMeasurementState {
  measurement: Measurement | null
  isLoading: boolean
  error: string | null
}

async function fetchLatest(): Promise<Measurement | null> {
  const result = await fetchLatestMeasurement()
  if (!result.ok) throw new Error(result.error.message)
  return result.data
}

export function useLatestMeasurement(): LatestMeasurementState {
  const { data, isLoading, error } = usePolling<Measurement | null>(fetchLatest, POLL_INTERVAL_MS)

  return { measurement: data, isLoading, error }
}