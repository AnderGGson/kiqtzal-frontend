import { useEffect, useState } from 'react'
import { fetchExperiments } from '../services/experiments'
import type { Experiment } from '../types'

interface ExperimentsState {
  data: Experiment[] | null
  isLoading: boolean
  error: string | null
}

export function useExperiments(): ExperimentsState {
  const [state, setState] = useState<ExperimentsState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    void fetchExperiments().then((result) => {
      if (cancelled) return
      if (result.ok) setState({ data: result.data, isLoading: false, error: null })
      else setState({ data: null, isLoading: false, error: result.error.message })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}