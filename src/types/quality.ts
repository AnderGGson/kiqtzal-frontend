export type QualityLevel = 'good' | 'warning' | 'critical' | 'unknown'

export interface QualityBand {
  min?: number
  max?: number
}

export interface MetricThresholds {
  label: string
  unit: string
  bandKind: 'inRange' | 'lowerIsBetter'
  good: QualityBand
  warning: QualityBand
}

export interface QualityAssessment {
  level: QualityLevel
  label: string
  unit: string
  value: number | null
  reason: string
}
