export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits)
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'hace menos de un minuto'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}