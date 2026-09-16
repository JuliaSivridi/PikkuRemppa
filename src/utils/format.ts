export function formatCurrency(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(value)
}

export function formatQuantity(quantity: number | undefined, unit: string | undefined): string {
  if (quantity === undefined) return unit ?? ''
  return `${quantity}${unit ? ' ' + unit : ''}`
}
