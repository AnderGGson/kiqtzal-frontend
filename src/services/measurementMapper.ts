import type { Measurement, ZoneReading } from '../types'

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toTimestamp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function toZone(temperature: unknown, humidity: unknown, gasRaw: unknown): ZoneReading {
  return {
    temperature: toNumber(temperature),
    humidity: toNumber(humidity),
    gasRaw: toNumber(gasRaw),
  }
}

export function toMeasurement(value: unknown): Measurement | null {
  if (typeof value !== 'object' || value === null) return null

  const record = value as Record<string, unknown>
  const id = toNumber(record.id)
  const timestamp = toTimestamp(record.created_at)
  if (id === null || timestamp === null) return null

  return {
    id,
    timestamp,
    entrada: toZone(record.temp_abajo, record.hum_abajo, record.mq_abajo_raw),
    salida: toZone(record.temp_arriba, record.hum_arriba, record.mq_arriba_raw),
  }
}

export function toMeasurementList(value: unknown): Measurement[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<number>()
  const measurements: Measurement[] = []

  for (const item of value) {
    const measurement = toMeasurement(item)
    if (measurement === null || seen.has(measurement.id)) continue
    seen.add(measurement.id)
    measurements.push(measurement)
  }

  return measurements.sort((a, b) => {
    const difference = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    return difference !== 0 ? difference : a.id - b.id
  })
}
