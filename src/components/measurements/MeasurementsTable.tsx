import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { QualityDot } from './QualityTrafficLight'
import { assessMetric, overallLevel } from '../../utils/quality'
import { formatDate, formatValue } from '../../utils/format'
import type { Measurement } from '../../types'
import { ZONE_LABELS } from '../../types'

interface MeasurementsTableProps {
  measurements: Measurement[] | null
  isLoading: boolean
  error: string | null
}

function zoneLevel(measurement: Measurement, zone: 'entrada' | 'salida') {
  return overallLevel([
    assessMetric('temperature', measurement[zone].temperature).level,
    assessMetric('humidity', measurement[zone].humidity).level,
    assessMetric('gasRaw', measurement[zone].gasRaw).level,
  ])
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
            <th rowSpan={2} scope="col">
              ID
            </th>
            <th rowSpan={2} scope="col">
              Fecha y hora
            </th>
            <th colSpan={4} scope="colgroup">
              {ZONE_LABELS.entrada}
            </th>
            <th colSpan={4} scope="colgroup">
              {ZONE_LABELS.salida}
            </th>
          </tr>
          <tr>
            <th scope="col">Temp.</th>
            <th scope="col">Humedad</th>
            <th scope="col">Gas MQ</th>
            <th scope="col">Estado</th>
            <th scope="col">Temp.</th>
            <th scope="col">Humedad</th>
            <th scope="col">Gas MQ</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={measurement.id}>
              <td>{measurement.id}</td>
              <td>{formatDate(measurement.timestamp)}</td>
              <td>{formatValue(measurement.entrada.temperature, '°C')}</td>
              <td>{formatValue(measurement.entrada.humidity, '%')}</td>
              <td>{formatValue(measurement.entrada.gasRaw)}</td>
              <td>
                <QualityDot level={zoneLevel(measurement, 'entrada')} label="Entrada" />
              </td>
              <td>{formatValue(measurement.salida.temperature, '°C')}</td>
              <td>{formatValue(measurement.salida.humidity, '%')}</td>
              <td>{formatValue(measurement.salida.gasRaw)}</td>
              <td>
                <QualityDot level={zoneLevel(measurement, 'salida')} label="Salida" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
