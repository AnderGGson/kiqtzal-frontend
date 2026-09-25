import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { timeLabel } from '../../utils/format'
import type { Measurement, SensorReading } from '../../types'

export type MetricKey = keyof SensorReading

interface AirQualityChartProps {
  title: string
  metric: MetricKey
  measurements: Measurement[]
  unit?: string
}

export function AirQualityChart({
  title,
  metric,
  measurements,
  unit = '',
}: AirQualityChartProps) {
  const data = measurements.map((measurement) => ({
    time: timeLabel(measurement.timestamp),
    dirty: measurement.dirtyAir[metric],
    clean: measurement.cleanAir[metric],
  }))

  return (
    <div className="air-chart">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis tick={{ fontSize: 11 }} unit={unit} width={48} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="dirty"
            name="Entrada (sucio)"
            stroke="#e5484d"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="clean"
            name="Salida (limpio)"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}