import type { MetricKey, MetricThresholds } from '../types'

export const QUALITY_THRESHOLDS: Record<MetricKey, MetricThresholds> = {
  temperature: {
    label: 'Temperatura',
    unit: '°C',
    bandKind: 'inRange',
    good: { min: 18, max: 26 },
    warning: { min: 14, max: 30 },
  },
  humidity: {
    label: 'Humedad',
    unit: '%',
    bandKind: 'inRange',
    good: { min: 30, max: 60 },
    warning: { min: 20, max: 70 },
  },
  gasRaw: {
    label: 'Gas (sensor MQ, lectura cruda)',
    unit: '',
    bandKind: 'lowerIsBetter',
    good: { max: 300 },
    warning: { max: 600 },
  },
}

export const STALE_AFTER_MS = 60_000
