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

function valueOrDash(value: number | null, unit = ''): string {
  return value !== null ? `${formatNumber(value)} ${unit}` : '—'
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
    <div className="table-scroll">
      <table className="measurements-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Gas sucio</th>
            <th>Gas limpio</th>
            <th>Humedad</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={measurement.id}>
              <td>{formatDate(measurement.timestamp)}</td>
              <td>{formatNumber(measurement.dirtyAir.gas)}</td>
              <td>{formatNumber(measurement.cleanAir.gas)}</td>
              <td>
                {formatNumber(measurement.dirtyAir.humidity)}% /{' '}
                {formatNumber(measurement.cleanAir.humidity)}%
              </td>
              <td>
                {valueOrDash(measurement.dirtyAir.temperature)} /{' '}
                {valueOrDash(measurement.cleanAir.temperature)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}