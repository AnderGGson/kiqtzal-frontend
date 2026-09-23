import { useEffect, useState } from 'react'
import { fetchExperimentById } from '../services/experiments'
import type { Experiment } from '../types'

interface ExperimentState {
  experiment: Experiment | null
  isLoading: boolean
  error: string | null
}

export function useExperimentById(id: string | undefined): ExperimentState {
  const [state, setState] = useState<ExperimentState>({
    experiment: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!id) {
      setState({ experiment: null, isLoading: false, error: 'Identificador no válido' })
      return
    }

    let cancelled = false

    void fetchExperimentById(id).then((result) => {
      if (cancelled) return
      if (result.ok) setState({ experiment: result.data, isLoading: false, error: null })
      else setState({ experiment: null, isLoading: false, error: result.error.message })
    })

    return () => {
      cancelled = true
    }
  }, [id])

  return state
}