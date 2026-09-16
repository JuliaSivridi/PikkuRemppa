import { useMemo, useState } from 'react'
import { useStore } from '../store/store'
import type { RepairWithMaterials } from './useRepairsWithMaterials'
import { priorityColor, roomColor, statusColor, type TagColor } from '../utils/colors'

export interface FilterTagItem {
  id: string
  name: string
  color: TagColor
}

function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function useRepairFilters(repairs: RepairWithMaterials[]) {
  const rooms = useStore((s) => s.rooms)
  const statuses = useStore((s) => s.statuses)
  const priorities = useStore((s) => s.priorities)

  const [search, setSearch] = useState('')
  const [roomIds, setRoomIds] = useState<Set<string>>(new Set())
  const [statusIds, setStatusIds] = useState<Set<string>>(new Set())
  const [priorityIds, setPriorityIds] = useState<Set<string>>(new Set())
  const [costMin, setCostMin] = useState<number | undefined>(undefined)
  const [costMax, setCostMax] = useState<number | undefined>(undefined)

  const presentRooms: FilterTagItem[] = useMemo(() => {
    const ids = new Set(repairs.map((r) => r.roomId))
    return rooms.filter((r) => ids.has(r.id)).map((r) => ({ id: r.id, name: r.name, color: roomColor(r.colorIndex) }))
  }, [repairs, rooms])

  const presentStatuses: FilterTagItem[] = useMemo(() => {
    const ids = new Set(repairs.map((r) => r.statusId))
    return statuses
      .map((s, i) => ({ id: s.id, name: s.name, color: statusColor(i) }))
      .filter((s) => ids.has(s.id))
  }, [repairs, statuses])

  const presentPriorities: FilterTagItem[] = useMemo(() => {
    const ids = new Set(repairs.map((r) => r.priorityId).filter((id): id is string => Boolean(id)))
    return priorities
      .map((p, i) => ({ id: p.id, name: p.name, color: priorityColor(i, priorities.length) }))
      .filter((p) => ids.has(p.id))
  }, [repairs, priorities])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return repairs.filter((repair) => {
      if (roomIds.size > 0 && !roomIds.has(repair.roomId)) return false
      if (statusIds.size > 0 && !statusIds.has(repair.statusId)) return false
      if (priorityIds.size > 0 && (!repair.priorityId || !priorityIds.has(repair.priorityId))) return false
      if (costMin !== undefined && repair.cost < costMin) return false
      if (costMax !== undefined && repair.cost > costMax) return false
      if (needle) {
        const inDescription = repair.description.toLowerCase().includes(needle)
        const inMaterials = repair.materials.some((m) => m.name.toLowerCase().includes(needle))
        if (!inDescription && !inMaterials) return false
      }
      return true
    })
  }, [repairs, search, roomIds, statusIds, priorityIds, costMin, costMax])

  const hasActiveFilters =
    search !== '' ||
    roomIds.size > 0 ||
    statusIds.size > 0 ||
    priorityIds.size > 0 ||
    costMin !== undefined ||
    costMax !== undefined

  function reset() {
    setSearch('')
    setRoomIds(new Set())
    setStatusIds(new Set())
    setPriorityIds(new Set())
    setCostMin(undefined)
    setCostMax(undefined)
  }

  return {
    filtered,
    search,
    setSearch,
    costMin,
    setCostMin,
    costMax,
    setCostMax,
    presentRooms,
    presentStatuses,
    presentPriorities,
    roomIds,
    statusIds,
    priorityIds,
    toggleRoom: (id: string) => setRoomIds((prev) => toggleInSet(prev, id)),
    toggleStatus: (id: string) => setStatusIds((prev) => toggleInSet(prev, id)),
    togglePriority: (id: string) => setPriorityIds((prev) => toggleInSet(prev, id)),
    hasActiveFilters,
    reset,
  }
}
