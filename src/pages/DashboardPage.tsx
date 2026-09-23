import { useLatestMeasurement } from '../hooks/useLatestMeasurement'
import { useExperiments } from '../hooks/useExperiments'
import { ConnectionStatus } from '../components/connection/ConnectionStatus'
import { LatestMeasurementCard } from '../components/measurements/LatestMeasurementCard'
import { ExperimentList } from '../components/experiments/ExperimentList'
import { ChartPlaceholder } from '../components/charts/ChartPlaceholder'

export function DashboardPage() {
  const { measurement, isLoading } = useLatestMeasurement()
  const experiments = useExperiments()

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      <ConnectionStatus measurement={measurement} isLoading={isLoading} />
      <LatestMeasurementCard measurement={measurement} isLoading={isLoading} />
      <div className="dashboard__charts">
        <ChartPlaceholder title="Gas" />
        <ChartPlaceholder title="Humedad" />
        <ChartPlaceholder title="Temperatura" />
      </div>
      <h2>Experimentos</h2>
      <ExperimentList
        experiments={experiments.data}
        isLoading={experiments.isLoading}
        error={experiments.error}
      />
    </section>
  )
}