import { QUALITY_THRESHOLDS } from '../config/qualityThresholds'
import { formatNumber } from './format'
import type { MetricKey, MetricThresholds, QualityAssessment, QualityBand, QualityLevel } from '../types'

export const QUALITY_LABELS: Record<QualityLevel, string> = {
  good: 'Muy bueno',
  warning: 'Normal',
  critical: 'Peligroso',
  unknown: 'Sin datos',
}

function isWithin(value: number, band: QualityBand): boolean {
  const aboveMin = band.min === undefined || value >= band.min
  const belowMax = band.max === undefined || value <= band.max
  return aboveMin && belowMax
}

function describeBand(band: QualityBand, unit: string): string {
  const suffix = unit.length > 0 ? ` ${unit}` : ''
  if (band.min !== undefined && band.max !== undefined) {
    return `${formatNumber(band.min)}–${formatNumber(band.max)}${suffix}`
  }
  if (band.max !== undefined) return `≤ ${formatNumber(band.max)}${suffix}`
  if (band.min !== undefined) return `≥ ${formatNumber(band.min)}${suffix}`
  return 'sin límite'
}

function buildReason(level: QualityLevel, thresholds: MetricThresholds): string {
  const good = describeBand(thresholds.good, thresholds.unit)
  const warning = describeBand(thresholds.warning, thresholds.unit)

  if (level === 'good') {
    return thresholds.bandKind === 'lowerIsBetter'
      ? `Dentro del límite bueno (${good})`
      : `Dentro del rango bueno (${good})`
  }
  if (level === 'warning') {
    return thresholds.bandKind === 'lowerIsBetter'
      ? `Entre el límite bueno (${good}) y ${warning}`
      : `Fuera del rango bueno, dentro de ${warning}`
  }
  return thresholds.bandKind === 'lowerIsBetter'
    ? `Supera el límite normal (${warning})`
    : `Fuera del rango normal (${warning})`
}

export function assessMetric(metric: MetricKey, value: number | null): QualityAssessment {
  const thresholds = QUALITY_THRESHOLDS[metric]
  const label = thresholds.label

  if (value === null || !Number.isFinite(value)) {
    return { level: 'unknown', label, unit: thresholds.unit, value: null, reason: 'Lectura no disponible' }
  }

  let level: QualityLevel = 'critical'
  if (isWithin(value, thresholds.good)) level = 'good'
  else if (isWithin(value, thresholds.warning)) level = 'warning'

  return { level, label, unit: thresholds.unit, value, reason: buildReason(level, thresholds) }
}

export function overallLevel(levels: QualityLevel[]): QualityLevel {
  const known = levels.filter((level) => level !== 'unknown')
  if (known.length === 0) return 'unknown'
  if (known.includes('critical')) return 'critical'
  if (known.includes('warning')) return 'warning'
  return 'good'
}
