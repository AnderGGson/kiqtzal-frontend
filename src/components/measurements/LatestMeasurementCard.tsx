import { formatDate, formatNumber } from '../../utils/format'
import type { Measurement } from '../../types'

interface LatestMeasurementCardProps {
  measurement: Measurement | null
  isLoading: boolean
}

export function LatestMeasurementCard({ measurement, isLoading }: LatestMeasurementCardProps) {
  if (isLoading) return <div className="latest-card">Consultando última medición...</div>
  if (!measurement) return <div className="latest-card">Sin mediciones registradas</div>

  const { dirtyAir, cleanAir } = measurement

  return (
    <div className="latest-card">
      <h3>Última medición</h3>
      <p>
        Gas — sucio {formatNumber(dirtyAir.gas)} · limpio {formatNumber(cleanAir.gas)}
      </p>
      <p>
        Humedad — sucia {formatNumber(dirtyAir.humidity)}% · limpia {formatNumber(cleanAir.humidity)}%
      </p>
      <p>
        Temperatura — {dirtyAir.temperature !== null ? formatNumber(dirtyAir.temperature) : '—'} /{' '}
        {cleanAir.temperature !== null ? formatNumber(cleanAir.temperature) : '—'} °C
      </p>
      <p>Registrada: {formatDate(measurement.timestamp)}</p>
    </div>
  )
}