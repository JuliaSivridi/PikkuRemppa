export function today(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function formatDate(iso: string): string {
  const [yyyy, mm, dd] = iso.split('-')
  if (!yyyy || !mm || !dd) return iso
  return `${dd}.${mm}.${yyyy}`
}
