export type Zone = 'entrada' | 'salida'

export type MetricKey = 'temperature' | 'humidity' | 'gasRaw'

export const ZONE_LABELS: Record<Zone, string> = {
  entrada: 'Entrada (abajo) — aire sin tratar',
  salida: 'Salida (arriba) — aire tratado',
}

export interface ZoneReading {
  temperature: number | null
  humidity: number | null
  gasRaw: number | null
}

export interface Measurement {
  id: number
  timestamp: string
  entrada: ZoneReading
  salida: ZoneReading
}

export interface ApiMeasurement {
  id: number
  temp_abajo: number
  hum_abajo: number
  mq_abajo_raw: number
  temp_arriba: number
  hum_arriba: number
  mq_arriba_raw: number
  created_at: string
}
