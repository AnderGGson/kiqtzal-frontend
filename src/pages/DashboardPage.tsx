import { useLatestMeasurement } from '../hooks/useLatestMeasurement'
import { useMeasurementSeries } from '../hooks/useMeasurementSeries'
import { useExperiments } from '../hooks/useExperiments'
import { ConnectionStatus } from '../components/connection/ConnectionStatus'
import { ComparisonSummary } from '../components/measurements/ComparisonSummary'
import { AirQualityChart } from '../components/charts/AirQualityChart'
import { BackendSettings } from '../components/settings/BackendSettings'
import { ExperimentList } from '../components/experiments/ExperimentList'

export function DashboardPage() {
  const { measurement, isLoading } = useLatestMeasurement()
  const series = useMeasurementSeries()
  const experiments = useExperiments()

  return (
    <section className="dashboard">
      <h1>Dashboard en vivo</h1>
      <ConnectionStatus measurement={measurement} isLoading={isLoading} />
      <ComparisonSummary measurement={measurement} isLoading={isLoading} />
      <div className="dashboard__charts">
        <AirQualityChart
          title="Gas — calidad de aire"
          metric="gas"
          measurements={series.data ?? []}
        />
        <AirQualityChart
          title="Humedad relativa"
          metric="humidity"
          measurements={series.data ?? []}
          unit="%"
        />
        <AirQualityChart
          title="Temperatura"
          metric="temperature"
          measurements={series.data ?? []}
          unit="°C"
        />
      </div>
      <BackendSettings />
      <h2>Experimentos</h2>
      <ExperimentList
        experiments={experiments.data}
        isLoading={experiments.isLoading}
        error={experiments.error}
      />
    </section>
  )
}