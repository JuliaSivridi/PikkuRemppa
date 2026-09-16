import { useMemo } from 'react'
import { useStore } from '../store/store'
import type { Material, MaterialCategory, Repair, Room } from '../types'

export interface MaterialWithContext extends Material {
  repair: Repair | undefined
  room: Room | undefined
  category: MaterialCategory | undefined
}

export function useMaterialsFlat(): MaterialWithContext[] {
  const materials = useStore((s) => s.materials)
  const repairs = useStore((s) => s.repairs)
  const rooms = useStore((s) => s.rooms)
  const materialCategories = useStore((s) => s.materialCategories)

  return useMemo(() => {
    const repairsById = new Map(repairs.map((r) => [r.id, r]))
    const roomsById = new Map(rooms.map((r) => [r.id, r]))
    const categoriesById = new Map(materialCategories.map((c) => [c.id, c]))

    return materials
      .map((material) => {
        const repair = repairsById.get(material.repairId)
        return {
          ...material,
          repair,
          room: repair ? roomsById.get(repair.roomId) : undefined,
          category: categoriesById.get(material.categoryId),
        }
      })
      .sort((a, b) => (b.repair?.date ?? '').localeCompare(a.repair?.date ?? ''))
  }, [materials, repairs, rooms, materialCategories])
}
