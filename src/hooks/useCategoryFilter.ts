import { useMemo, useState } from 'react'
import type { MaterialCategory } from '../types'
import type { MaterialWithContext } from './useMaterialsFlat'

export function useCategoryFilter(materials: MaterialWithContext[], allCategories: MaterialCategory[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const presentCategories = useMemo(() => {
    const presentIds = new Set(materials.map((m) => m.categoryId))
    return allCategories.filter((c) => presentIds.has(c.id))
  }, [materials, allCategories])

  const filtered = useMemo(() => {
    if (selected.size === 0) return materials
    return materials.filter((m) => selected.has(m.categoryId))
  }, [materials, selected])

  function toggle(categoryId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  function clear() {
    setSelected(new Set())
  }

  return { presentCategories, selected, toggle, clear, filtered }
}
