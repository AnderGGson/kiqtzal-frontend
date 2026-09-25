export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function formatNumber(value: number | null, digits = 2): string {
  return value === null || !Number.isFinite(value) ? '—' : value.toFixed(digits)
}

export function formatValue(value: number | null, unit = ''): string {
  if (value === null || !Number.isFinite(value)) return '—'
  return unit.length > 0 ? `${formatNumber(value)} ${unit}` : formatNumber(value)
}

export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function timeTick(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(iso: string | Date): string {
  const then = typeof iso === 'string' ? new Date(iso).getTime() : iso.getTime()
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 10) return 'hace instantes'
  if (seconds < 60) return `hace ${seconds} s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}
