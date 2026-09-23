import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { formatDate, formatNumber } from '../../utils/format'
import type { Measurement } from '../../types'

interface MeasurementsTableProps {
  measurements: Measurement[] | null
  isLoading: boolean
  error: string | null
}

export function MeasurementsTable({ measurements, isLoading, error }: MeasurementsTableProps) {
  if (isLoading) return <Spinner label="Cargando mediciones..." />
  if (error) return <ErrorBanner message={error} />
  if (!measurements || measurements.length === 0) {
    return (
      <EmptyState
        title="Sin mediciones"
        description="Las mediciones aparecerán aquí cuando el backend tenga datos."
      />
    )
  }

  return (
    <table className="measurements-table">
      <thead>
        <tr>
          <th>Hora</th>
          <th>Gas</th>
          <th>Humedad</th>
          <th>Temperatura</th>
        </tr>
      </thead>
      <tbody>
        {measurements.map((measurement) => (
          <tr key={measurement.id}>
            <td>{formatDate(measurement.timestamp)}</td>
            <td>{formatNumber(measurement.gas)}</td>
            <td>{formatNumber(measurement.humidity)}</td>
            <td>{measurement.temperature !== null ? formatNumber(measurement.temperature) : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}