import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { formatDate } from '../../utils/format'
import type { Experiment } from '../../types'

interface ExperimentDetailProps {
  experiment: Experiment | null
  isLoading: boolean
  error: string | null
}

export function ExperimentDetail({ experiment, isLoading, error }: ExperimentDetailProps) {
  if (isLoading) return <Spinner label="Cargando experimento..." />
  if (error) return <ErrorBanner message={error} />
  if (!experiment) return <EmptyState title="Experimento no encontrado" />

  return (
    <article className="experiment-detail">
      <h2>{experiment.name}</h2>
      <p>{experiment.description ?? 'Sin descripción'}</p>
      <p>Modo: {experiment.mode}</p>
      <p>Inicio: {formatDate(experiment.startedAt)}</p>
    </article>
  )
}