interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Cargando...' }: SpinnerProps) {
  return (
    <p className="spinner" role="status" aria-live="polite">
      {label}
    </p>
  )
}