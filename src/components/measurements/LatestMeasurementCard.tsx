import { formatDate, formatNumber } from '../../utils/format'
import type { Measurement } from '../../types'

interface LatestMeasurementCardProps {
  measurement: Measurement | null
  isLoading: boolean
}

export function LatestMeasurementCard({ measurement, isLoading }: LatestMeasurementCardProps) {
  if (isLoading) return <div className="latest-card">Consultando última medición...</div>
  if (!measurement) return <div className="latest-card">Sin mediciones registradas</div>

  return (
    <div className="latest-card">
      <h3>Última medición</h3>
      <p>Gas: {formatNumber(measurement.gas)}</p>
      <p>Humedad: {formatNumber(measurement.humidity)}</p>
      <p>Temperatura: {measurement.temperature !== null ? formatNumber(measurement.temperature) : 'No disponible'}</p>
      <p>Registrada: {formatDate(measurement.timestamp)}</p>
    </div>
  )
}