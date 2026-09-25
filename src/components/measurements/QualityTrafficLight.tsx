import { formatValue } from '../../utils/format'
import { QUALITY_LABELS } from '../../utils/quality'
import type { QualityAssessment, QualityLevel } from '../../types'

interface QualityTrafficLightProps {
  label?: string
  assessment: QualityAssessment
}

export function QualityTrafficLight({ label, assessment }: QualityTrafficLightProps) {
  const state = QUALITY_LABELS[assessment.level]
  const value = formatValue(assessment.value, assessment.unit)

  return (
    <div
      className={`quality-light quality-light--${assessment.level}`}
      role="group"
      aria-label={`${assessment.label}: ${value}. Estado: ${state}. ${assessment.reason}.`}
    >
      <span className="quality-light__bulb" aria-hidden="true" />
      <div className="quality-light__body">
        <span className="quality-light__label">{label ?? assessment.label}</span>
        <strong className="quality-light__value">{value}</strong>
        <span className="quality-light__state">{state}</span>
        <span className="quality-light__reason">{assessment.reason}</span>
      </div>
    </div>
  )
}

interface QualityDotProps {
  level: QualityLevel
  label: string
}

export function QualityDot({ level, label }: QualityDotProps) {
  return (
    <span
      className={`quality-dot quality-dot--${level}`}
      role="img"
      aria-label={`${label}: ${QUALITY_LABELS[level]}`}
      title={`${label}: ${QUALITY_LABELS[level]}`}
    />
  )
}
