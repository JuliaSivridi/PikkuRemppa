import { useMemo } from 'react'
import { useStore } from '../store/store'
import type { Material, Repair, Room } from '../types'

export interface RepairWithMaterials extends Repair {
  room: Room | undefined
  materials: Material[]
}

export function useRepairsWithMaterials(): RepairWithMaterials[] {
  const repairs = useStore((s) => s.repairs)
  const materials = useStore((s) => s.materials)
  const rooms = useStore((s) => s.rooms)

  return useMemo(() => {
    const roomsById = new Map(rooms.map((r) => [r.id, r]))
    return [...repairs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((repair) => ({
        ...repair,
        room: roomsById.get(repair.roomId),
        materials: materials.filter((m) => m.repairId === repair.id),
      }))
  }, [repairs, materials, rooms])
}
