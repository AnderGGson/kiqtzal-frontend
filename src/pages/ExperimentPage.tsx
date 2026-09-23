import { useParams } from 'react-router-dom'
import { useExperimentById } from '../hooks/useExperimentById'
import { useMeasurements } from '../hooks/useMeasurements'
import { ExperimentDetail } from '../components/experiments/ExperimentDetail'
import { MeasurementsTable } from '../components/measurements/MeasurementsTable'

export function ExperimentPage() {
  const { id } = useParams<{ id: string }>()
  const experimentQuery = useExperimentById(id)
  const measurementsQuery = useMeasurements(id)

  return (
    <section className="experiment-page">
      <ExperimentDetail
        experiment={experimentQuery.experiment}
        isLoading={experimentQuery.isLoading}
        error={experimentQuery.error}
      />
      <h2>Mediciones</h2>
      <MeasurementsTable
        measurements={measurementsQuery.data}
        isLoading={measurementsQuery.isLoading}
        error={measurementsQuery.error}
      />
    </section>
  )
}