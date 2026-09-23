import { timeAgo } from '../../utils/format'
import type { Measurement } from '../../types'

interface ConnectionStatusProps {
  measurement: Measurement | null
  isLoading: boolean
}

export function ConnectionStatus({ measurement, isLoading }: ConnectionStatusProps) {
  if (isLoading) {
    return <p className="connection-status connection-status--loading">Verificando estado del sistema...</p>
  }

  if (!measurement) {
    return <p className="connection-status connection-status--offline">Sin señal: el sistema no ha registrado mediciones.</p>
  }

  return <p className="connection-status connection-status--online">Última medición: {timeAgo(measurement.timestamp)}</p>
}