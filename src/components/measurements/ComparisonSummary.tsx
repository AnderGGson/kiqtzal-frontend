import { EmptyState } from '../common/EmptyState'
import { ErrorBanner } from '../common/ErrorBanner'
import { Spinner } from '../common/Spinner'
import { QualityTrafficLight } from './QualityTrafficLight'
import { assessMetric, overallLevel, QUALITY_LABELS } from '../../utils/quality'
import { formatValue } from '../../utils/format'
import type { Measurement, MetricKey, QualityAssessment, QualityLevel, Zone } from '../../types'
import { ZONE_LABELS } from '../../types'

const METRICS: MetricKey[] = ['temperature', 'humidity', 'gasRaw']
const ZONES: Zone[] = ['entrada', 'salida']

interface ComparisonSummaryProps {
  measurement: Measurement | null
  isLoading: boolean
  error: string | null
  isStale: boolean
}

function assessWithFreshness(
  metric: MetricKey,
  value: number | null,
  isStale: boolean,
): QualityAssessment {
  const assessment = assessMetric(metric, value)
  if (!isStale) return assessment
  return { ...assessment, level: 'unknown' as QualityLevel, reason: 'Sin señal reciente del sensor' }
}

function worstReason(assessments: QualityAssessment[]): string {
  const worst = assessments.find((item) => item.level === 'critical') ??
    assessments.find((item) => item.level === 'warning') ??
    assessments.find((item) => item.level === 'good')
  if (!worst) return 'Esperando lecturas de los sensores'
  return `${worst.label}: ${formatValue(worst.value, worst.unit)} — ${worst.reason}`
}

export function ComparisonSummary({ measurement, isLoading, error, isStale }: ComparisonSummaryProps) {
  if (isLoading) {
    return (
      <div className="summary-grid summary-grid--empty">
        <Spinner label="Consultando mediciones..." />
      </div>
    )
  }

  if (error && !measurement) return <ErrorBanner message={error} />

  if (!measurement) {
    return (
      <EmptyState
        title="Sin mediciones registradas"
        description="La API todavía no tiene lecturas. Aparecerán aquí cuando el Collector envíe datos."
      />
    )
  }

  const assessments = ZONES.flatMap((zone) =>
    METRICS.map((metric) => assessWithFreshness(metric, measurement[zone][metric], isStale)),
  )
  const overall = overallLevel(assessments.map((assessment) => assessment.level))

  return (
    <div className="summary-grid">
      <section className="summary-card summary-card--overall" aria-live="polite">
        <h4>Estado general del sistema</h4>
        <p className={`overall-status overall-status--${overall}`}>
          <span className="overall-status__bulb" aria-hidden="true" />
          {QUALITY_LABELS[overall]}
        </p>
        <p className="summary__detail">{worstReason(assessments)}</p>
        {isStale ? (
          <p className="summary__detail summary__detail--warning">
            La última lectura es antigua: el semáforo queda en estado desconocido.
          </p>
        ) : null}
      </section>

      {ZONES.map((zone) => (
        <section key={zone} className={`summary-card summary-card--${zone}`}>
          <h4>{ZONE_LABELS[zone]}</h4>
          {METRICS.map((metric) => (
            <QualityTrafficLight
              key={metric}
              assessment={assessWithFreshness(metric, measurement[zone][metric], isStale)}
            />
          ))}
        </section>
      ))}
    </div>
  )
}
