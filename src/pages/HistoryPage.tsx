import { useState } from 'react'
import { useHistory } from '../hooks/useHistory'
import { MeasurementsTable } from '../components/measurements/MeasurementsTable'
import { TimeWindowSelector } from '../components/common/TimeWindowSelector'
import {
  DEFAULT_TIME_WINDOW_MS,
  HISTORY_PAGE_SIZE,
  HISTORY_TIME_WINDOWS,
} from '../utils/constants'
import type { Measurement } from '../types'

const PAGE_SIZES = [25, 50, 100]

export function HistoryPage() {
  const [windowMs, setWindowMs] = useState(DEFAULT_TIME_WINDOW_MS)
  const [pageSize, setPageSize] = useState(HISTORY_PAGE_SIZE)
  const history = useHistory(windowMs, pageSize)

  const rows: Measurement[] = history.data ? history.data.slice().reverse() : []

  return (
    <section className="history-page">
      <div className="dashboard__header">
        <h1>Historial de mediciones</h1>
      </div>

      <div className="history-page__toolbar">
        <TimeWindowSelector
          id="history-time-window"
          label="Intervalo"
          options={HISTORY_TIME_WINDOWS}
          value={windowMs}
          onChange={(value) => {
            setWindowMs(value)
            history.setPage(0)
          }}
        />

        <label className="time-window__label" htmlFor="history-page-size">
          Filas por página
        </label>
        <select
          id="history-page-size"
          className="time-window__select"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value))
            history.setPage(0)
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span className="history-page__meta">
          Página {history.page + 1} · del más reciente al más antiguo
        </span>
      </div>

      <MeasurementsTable
        measurements={rows}
        isLoading={history.isLoading}
        error={history.error}
      />

      <nav className="pagination" aria-label="Paginación del historial">
        <button
          type="button"
          className="button"
          disabled={!history.hasPrevious}
          onClick={() => history.setPage((page) => Math.max(0, page - 1))}
        >
          Anterior
        </button>
        <button
          type="button"
          className="button"
          disabled={!history.hasNext}
          onClick={() => history.setPage((page) => page + 1)}
        >
          Siguiente
        </button>
      </nav>
    </section>
  )
}
