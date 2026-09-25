import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHealth } from '../hooks/useHealth'
import { useLatestMeasurement } from '../hooks/useLatestMeasurement'
import { useMeasurementSeries } from '../hooks/useMeasurementSeries'
import { AirQualityChart } from '../components/charts/AirQualityChart'
import { ConnectionStatus } from '../components/connection/ConnectionStatus'
import { ComparisonSummary } from '../components/measurements/ComparisonSummary'
import { TimeWindowSelector } from '../components/common/TimeWindowSelector'
import { ErrorBanner } from '../components/common/ErrorBanner'
import { CHART_MAX_POINTS, DEFAULT_TIME_WINDOW_MS, TIME_WINDOWS } from '../utils/constants'
import { timeAgo } from '../utils/format'
import type { Measurement } from '../types'

export function DashboardPage() {
  const [windowMs, setWindowMs] = useState(DEFAULT_TIME_WINDOW_MS)
  const series = useMeasurementSeries(windowMs)
  const health = useHealth()

  const measurements: Measurement[] = series.data ?? []
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null
  const latestOutsideWindow = useLatestMeasurement(latest === null)

  const showEmptyHint = latest === null && !series.isLoading && series.error === null
  const showSampleLimitHint = measurements.length >= CHART_MAX_POINTS

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard en vivo</h1>
        <Link className="button button--primary" to="/historial">
          Ver historial completo
        </Link>
      </div>

      <ConnectionStatus
        measurement={latest}
        health={health.data}
        isLoading={series.isLoading}
        isStale={series.isStale}
        lastUpdatedAt={series.lastUpdatedAt}
        error={series.error}
      />

      <ComparisonSummary
        measurement={latest}
        isLoading={series.isLoading}
        error={series.error}
        isStale={series.isStale}
      />

      {series.error && latest !== null ? <ErrorBanner message={series.error} /> : null}

      {showEmptyHint ? (
        <p className="dashboard__hint">
          {latestOutsideWindow.data
            ? `No hay lecturas dentro del intervalo seleccionado. La medición más reciente del sistema es de ${timeAgo(latestOutsideWindow.data.timestamp)}: amplía el intervalo para verla en las gráficas.`
            : 'Todavía no hay lecturas registradas en la API. Las gráficas se llenarán solas cuando el Collector envíe datos.'}
        </p>
      ) : null}

      <div className="dashboard__toolbar">
        <TimeWindowSelector
          id="dashboard-time-window"
          label="Intervalo de las gráficas"
          options={TIME_WINDOWS}
          value={windowMs}
          onChange={setWindowMs}
        />
        {showSampleLimitHint ? (
          <span className="dashboard__hint dashboard__hint--inline">
            Se muestran los {measurements.length} registros más recientes (límite de la API).
          </span>
        ) : null}
      </div>

      <div className="dashboard__charts">
        <AirQualityChart
          title="Gas — sensor MQ (lectura cruda)"
          metric="gasRaw"
          measurements={measurements}
          isLoading={series.isLoading}
          isRefreshing={series.isRefreshing}
          error={series.error}
        />
        <AirQualityChart
          title="Humedad relativa"
          metric="humidity"
          measurements={measurements}
          unit="%"
          isLoading={series.isLoading}
          isRefreshing={series.isRefreshing}
          error={series.error}
        />
        <AirQualityChart
          title="Temperatura"
          metric="temperature"
          measurements={measurements}
          unit="°C"
          isLoading={series.isLoading}
          isRefreshing={series.isRefreshing}
          error={series.error}
        />
      </div>
    </section>
  )
}
