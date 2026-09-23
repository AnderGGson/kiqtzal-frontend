interface ChartPlaceholderProps {
  title: string
}

export function ChartPlaceholder({ title }: ChartPlaceholderProps) {
  return (
    <div className="chart-placeholder">
      <h4>{title}</h4>
      <p>Las gráficas se integrarán próximamente en esta sección.</p>
    </div>
  )
}