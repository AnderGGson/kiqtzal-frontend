import { formatNumber } from '../../utils/format'
import type { Measurement } from '../../types'

interface ComparisonSummaryProps {
  measurement: Measurement | null
  isLoading: boolean
}

function temperatureLabel(value: number | null): string {
  return value !== null ? `${formatNumber(value)} °C` : '—'
}

export function ComparisonSummary({ measurement, isLoading }: ComparisonSummaryProps) {
  if (isLoading) {
    return <div className="summary-grid summary-grid--empty">Consultando mediciones...</div>
  }

  if (!measurement) {
    return (
      <div className="summary-grid summary-grid--empty">
        Sin mediciones todavía. Esperando datos del ESP32.
      </div>
    )
  }

  const { dirtyAir, cleanAir } = measurement
  const difference = dirtyAir.gas - cleanAir.gas
  const reduction = dirtyAir.gas > 0 ? (difference / dirtyAir.gas) * 100 : 0

  return (
    <div className="summary-grid">
      <div className="summary-card summary-card--dirty">
        <h4>Entrada — aire sucio</h4>
        <dl>
          <div>
            <dt>Gas</dt>
            <dd>{formatNumber(dirtyAir.gas)}</dd>
          </div>
          <div>
            <dt>Humedad</dt>
            <dd>{formatNumber(dirtyAir.humidity)} %</dd>
          </div>
          <div>
            <dt>Temperatura</dt>
            <dd>{temperatureLabel(dirtyAir.temperature)}</dd>
          </div>
        </dl>
      </div>

      <div className="summary-card summary-card--clean">
        <h4>Salida — aire limpio</h4>
        <dl>
          <div>
            <dt>Gas</dt>
            <dd>{formatNumber(cleanAir.gas)}</dd>
          </div>
          <div>
            <dt>Humedad</dt>
            <dd>{formatNumber(cleanAir.humidity)} %</dd>
          </div>
          <div>
            <dt>Temperatura</dt>
            <dd>{temperatureLabel(cleanAir.temperature)}</dd>
          </div>
        </dl>
      </div>

      <div className="summary-card summary-card--reduction">
        <h4>Reducción de gas</h4>
        <p className="summary__value">{formatNumber(Math.max(0, reduction), 1)}%</p>
        <p className="summary__detail">
          Diferencia: {formatNumber(difference)} en la última lectura
        </p>
      </div>
    </div>
  )
}