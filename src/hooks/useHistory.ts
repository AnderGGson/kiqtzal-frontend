import { useCallback, useState } from 'react'
import { fetchMeasurements } from '../services/measurements'
import { HISTORY_PAGE_SIZE, HISTORY_POLL_INTERVAL_MS } from '../utils/constants'
import { usePolling } from './usePolling'
import type { Measurement } from '../types'

export function useHistory(windowMs: number, pageSize: number = HISTORY_PAGE_SIZE) {
  const [page, setPage] = useState(0)

  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<Measurement[]> => {
      const from = windowMs > 0 ? new Date(Date.now() - windowMs).toISOString() : undefined
      const result = await fetchMeasurements(
        { from, limit: pageSize, offset: page * pageSize },
        signal,
      )
      if (!result.ok) throw new Error(result.error.message)
      return result.data
    },
    [page, pageSize, windowMs],
  )

  const state = usePolling<Measurement[]>(fetcher, HISTORY_POLL_INTERVAL_MS, {
    resetKey: `${windowMs}-${page}-${pageSize}`,
  })

  return {
    ...state,
    page,
    hasPrevious: page > 0,
    hasNext: (state.data?.length ?? 0) >= pageSize,
    setPage,
  }
}
