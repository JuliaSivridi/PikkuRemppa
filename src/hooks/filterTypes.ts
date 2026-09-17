import type { TagColor } from '../utils/colors'

export interface FilterTagItem {
  id: string
  name: string
  // Omitted for tag groups that don't have a dedicated color family (e.g. material
  // categories), which just fall back to the default tag styling.
  color?: TagColor
}

export function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}
