import { fetchHealth } from '../services/health'
import type { HealthStatus } from '../services/health'
import { HEALTH_POLL_INTERVAL_MS } from '../utils/constants'
import { usePolling } from './usePolling'

export function useHealth() {
  return usePolling<HealthStatus>(async (signal) => {
    const result = await fetchHealth({ signal })
    if (!result.ok) throw new Error(result.error.message)
    return result.data
  }, HEALTH_POLL_INTERVAL_MS)
}
