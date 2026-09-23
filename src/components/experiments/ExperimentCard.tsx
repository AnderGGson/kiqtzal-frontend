import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'
import type { Experiment } from '../../types'

interface ExperimentCardProps {
  experiment: Experiment
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <article className="experiment-card">
      <h3 className="experiment-card__name">{experiment.name}</h3>
      <p className="experiment-card__mode">{experiment.mode}</p>
      <p className="experiment-card__date">Inicio: {formatDate(experiment.startedAt)}</p>
      <Link to={`/experiments/${experiment.id}`}>Ver detalle</Link>
    </article>
  )
}