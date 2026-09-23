import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { ExperimentCard } from './ExperimentCard'
import type { Experiment } from '../../types'

interface ExperimentListProps {
  experiments: Experiment[] | null
  isLoading: boolean
  error: string | null
}

export function ExperimentList({ experiments, isLoading, error }: ExperimentListProps) {
  if (isLoading) return <Spinner label="Cargando experimentos..." />
  if (error) return <ErrorBanner message={error} />
  if (!experiments || experiments.length === 0) {
    return (
      <EmptyState
        title="Aún no hay experimentos"
        description="Los experimentos aparecerán aquí cuando el backend tenga datos."
      />
    )
  }

  return (
    <ul className="experiment-list">
      {experiments.map((experiment) => (
        <li key={experiment.id}>
          <ExperimentCard experiment={experiment} />
        </li>
      ))}
    </ul>
  )
}