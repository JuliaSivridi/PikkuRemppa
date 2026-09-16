import { useMemo } from 'react'
import { useStore } from '../store/store'
import type { Material, Priority, Repair, Room, Status } from '../types'
import { priorityColor, roomColor, statusColor, type TagColor } from '../utils/colors'

export interface RepairWithMaterials extends Repair {
  room: Room | undefined
  roomColor: TagColor | undefined
  status: Status | undefined
  statusColor: TagColor | undefined
  priority: Priority | undefined
  priorityColor: TagColor | undefined
  materials: Material[]
}

export function useRepairsWithMaterials(): RepairWithMaterials[] {
  const repairs = useStore((s) => s.repairs)
  const materials = useStore((s) => s.materials)
  const rooms = useStore((s) => s.rooms)
  const statuses = useStore((s) => s.statuses)
  const priorities = useStore((s) => s.priorities)

  return useMemo(() => {
    const roomsById = new Map(rooms.map((r) => [r.id, r]))
    const statusesById = new Map(statuses.map((s, i) => [s.id, { status: s, index: i }]))
    const prioritiesById = new Map(priorities.map((p, i) => [p.id, { priority: p, index: i }]))

    return [...repairs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((repair) => {
        const room = roomsById.get(repair.roomId)
        const statusEntry = statusesById.get(repair.statusId)
        const priorityEntry = repair.priorityId ? prioritiesById.get(repair.priorityId) : undefined

        return {
          ...repair,
          room,
          roomColor: room ? roomColor(room.colorIndex) : undefined,
          status: statusEntry?.status,
          statusColor: statusEntry ? statusColor(statusEntry.index) : undefined,
          priority: priorityEntry?.priority,
          priorityColor: priorityEntry ? priorityColor(priorityEntry.index, priorities.length) : undefined,
          materials: materials.filter((m) => m.repairId === repair.id),
        }
      })
  }, [repairs, materials, rooms, statuses, priorities])
}
