import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { QUALITY_THRESHOLDS } from '../../config/qualityThresholds'
import { formatDate, formatNumber, timeTick } from '../../utils/format'
import type { Measurement, MetricKey } from '../../types'

const GOOD_COLOR = '#0e5a36'
const WARNING_COLOR = '#8a6a05'
const INPUT_COLOR = '#c0292b'
const OUTPUT_COLOR = '#0e5a36'

interface AirQualityChartProps {
  title: string
  metric: MetricKey
  measurements: Measurement[]
  unit?: string
  isLoading?: boolean
  isRefreshing?: boolean
  error?: string | null
}

export function AirQualityChart({
  title,
  metric,
  measurements,
  unit,
  isLoading = false,
  isRefreshing = false,
  error = null,
}: AirQualityChartProps) {
  const thresholds = QUALITY_THRESHOLDS[metric]
  const axisUnit = unit ?? thresholds.unit
  const hasData = measurements.length > 0

  if (error && !hasData) {
    return (
      <div className="air-chart">
        <h4>{title}</h4>
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (isLoading && !hasData) {
    return (
      <div className="air-chart">
        <h4>{title}</h4>
        <Spinner label="Cargando serie..." />
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="air-chart">
        <h4>{title}</h4>
        <EmptyState
          title="Sin datos en esta ventana"
          description="No hay lecturas dentro del periodo seleccionado."
        />
      </div>
    )
  }

  const data = measurements.map((measurement) => ({
    timestamp: new Date(measurement.timestamp).getTime(),
    entrada: measurement.entrada[metric],
    salida: measurement.salida[metric],
  }))

  const goodBoundaries =
    thresholds.bandKind === 'lowerIsBetter'
      ? [
          { value: thresholds.good.max, label: 'Bueno', color: GOOD_COLOR },
          { value: thresholds.warning.max, label: 'Normal máx.', color: WARNING_COLOR },
        ]
      : [
          { value: thresholds.good.min, label: 'Bueno', color: GOOD_COLOR },
          { value: thresholds.good.max, label: 'Bueno', color: GOOD_COLOR },
          { value: thresholds.warning.min, label: 'Normal', color: WARNING_COLOR },
          { value: thresholds.warning.max, label: 'Normal', color: WARNING_COLOR },
        ]

  return (
    <div className="air-chart">
      <div className="air-chart__header">
        <h4>{title}</h4>
        {isRefreshing ? <span className="air-chart__live">Actualizando...</span> : null}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="timestamp"
            domain={['dataMin', 'dataMax']}
            tickFormatter={timeTick}
            tick={{ fontSize: 11 }}
            minTickGap={45}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(value: number) => formatNumber(value, 0)}
            unit={axisUnit.length > 0 ? axisUnit : undefined}
            width={58}
            domain={['auto', 'auto']}
          />
          <Tooltip
            labelFormatter={(value) => formatDate(new Date(Number(value)).toISOString())}
            formatter={(value) => formatNumber(typeof value === 'number' ? value : null)}
          />
          <Legend />
          {goodBoundaries.map((boundary) => (
            <ReferenceLine
              key={`${boundary.value}-${boundary.label}`}
              y={boundary.value}
              stroke={boundary.color}
              strokeDasharray="5 4"
              label={{ value: boundary.label, position: 'insideTopLeft', fontSize: 10, fill: boundary.color }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="entrada"
            name="Entrada (abajo)"
            stroke={INPUT_COLOR}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="salida"
            name="Salida (arriba)"
            stroke={OUTPUT_COLOR}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="air-chart__legend-note">
        Líneas punteadas: límites del estándar de calidad (verde = muy bueno, amarillo = normal).
      </p>
    </div>
  )
}
