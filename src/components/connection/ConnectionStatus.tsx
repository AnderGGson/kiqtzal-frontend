import { timeAgo } from '../../utils/format'
import type { HealthStatus } from '../../services/health'
import type { Measurement } from '../../types'

interface ConnectionStatusProps {
  measurement: Measurement | null
  health: HealthStatus | null
  isLoading: boolean
  isStale: boolean
  lastUpdatedAt: Date | null
  error: string | null
}

type ConnectionTone = 'loading' | 'online' | 'stale' | 'error' | 'offline'

export function ConnectionStatus({
  measurement,
  health,
  isLoading,
  isStale,
  lastUpdatedAt,
  error,
}: ConnectionStatusProps) {
  const databaseDown = health !== null && health.database === 'down'

  let tone: ConnectionTone = 'online'
  let message = ''

  if (isLoading) {
    tone = 'loading'
    message = 'Verificando estado del sistema...'
  } else if (databaseDown) {
    tone = 'error'
    message = 'La API responde, pero la base de datos no está disponible.'
  } else if (error) {
    tone = 'error'
    message = `No se pudo actualizar: ${error}`
  } else if (measurement === null) {
    tone = 'offline'
    message = 'Sin señal: la API todavía no tiene mediciones.'
  } else if (isStale) {
    tone = 'stale'
    message = `Datos antiguos: la última lectura es de ${timeAgo(measurement.timestamp)}. Revisa el Collector.`
  } else {
    message = `Conectado · última lectura ${timeAgo(measurement.timestamp)}`
  }

  return (
    <div className="connection-status">
      <p className={`connection-status__badge connection-status__badge--${tone}`} role="status">
        {message}
      </p>
      {lastUpdatedAt !== null ? (
        <p className="connection-status__meta">Actualizado {timeAgo(lastUpdatedAt)}</p>
      ) : null}
      {health !== null ? (
        <p className="connection-status__meta">
          API: {health.status} · base de datos: {health.database === 'up' ? 'disponible' : 'caída'}
        </p>
      ) : null}
    </div>
  )
}
