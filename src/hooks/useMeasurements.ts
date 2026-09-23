import { useEffect, useState } from 'react'
import { fetchMeasurementsForExperiment } from '../services/experiments'
import type { Measurement } from '../types'

interface MeasurementsState {
  data: Measurement[] | null
  isLoading: boolean
  error: string | null
}

export function useMeasurements(experimentId: string | undefined): MeasurementsState {
  const [state, setState] = useState<MeasurementsState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!experimentId) {
      setState({ data: null, isLoading: false, error: 'Identificador no válido' })
      return
    }

    let cancelled = false

    void fetchMeasurementsForExperiment(experimentId).then((result) => {
      if (cancelled) return
      if (result.ok) setState({ data: result.data, isLoading: false, error: null })
      else setState({ data: null, isLoading: false, error: result.error.message })
    })

    return () => {
      cancelled = true
    }
  }, [experimentId])

  return state
}