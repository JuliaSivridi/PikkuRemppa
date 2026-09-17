import { useMemo, useState } from 'react'
import { useStore } from '../store/store'
import type { MaterialWithContext } from './useMaterialsFlat'
import { priorityColor, roomColor, statusColor } from '../utils/colors'
import { toggleInSet, type FilterTagItem } from './filterTypes'

export function useMaterialFilters(materials: MaterialWithContext[]) {
  const materialCategories = useStore((s) => s.materialCategories)
  const rooms = useStore((s) => s.rooms)
  const statuses = useStore((s) => s.statuses)
  const priorities = useStore((s) => s.priorities)

  const [search, setSearch] = useState('')
  const [categoryIds, setCategoryIds] = useState<Set<string>>(new Set())
  const [roomIds, setRoomIds] = useState<Set<string>>(new Set())
  const [statusIds, setStatusIds] = useState<Set<string>>(new Set())
  const [priorityIds, setPriorityIds] = useState<Set<string>>(new Set())

  const presentCategories: FilterTagItem[] = useMemo(() => {
    const ids = new Set(materials.map((m) => m.categoryId))
    return materialCategories.filter((c) => ids.has(c.id)).map((c) => ({ id: c.id, name: c.name }))
  }, [materials, materialCategories])

  const presentRooms: FilterTagItem[] = useMemo(() => {
    const ids = new Set(materials.map((m) => m.room?.id).filter((id): id is string => Boolean(id)))
    return rooms.filter((r) => ids.has(r.id)).map((r) => ({ id: r.id, name: r.name, color: roomColor(r.colorIndex) }))
  }, [materials, rooms])

  const presentStatuses: FilterTagItem[] = useMemo(() => {
    const ids = new Set(materials.map((m) => m.repair?.statusId).filter((id): id is string => Boolean(id)))
    return statuses
      .map((s, i) => ({ id: s.id, name: s.name, color: statusColor(i) }))
      .filter((s) => ids.has(s.id))
  }, [materials, statuses])

  const presentPriorities: FilterTagItem[] = useMemo(() => {
    const ids = new Set(materials.map((m) => m.repair?.priorityId).filter((id): id is string => Boolean(id)))
    return priorities
      .map((p, i) => ({ id: p.id, name: p.name, color: priorityColor(i, priorities.length) }))
      .filter((p) => ids.has(p.id))
  }, [materials, priorities])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return materials.filter((m) => {
      if (categoryIds.size > 0 && !categoryIds.has(m.categoryId)) return false
      if (roomIds.size > 0 && (!m.room || !roomIds.has(m.room.id))) return false
      if (statusIds.size > 0 && (!m.repair || !statusIds.has(m.repair.statusId))) return false
      if (priorityIds.size > 0 && (!m.repair?.priorityId || !priorityIds.has(m.repair.priorityId))) return false
      if (needle && !m.name.toLowerCase().includes(needle)) return false
      return true
    })
  }, [materials, search, categoryIds, roomIds, statusIds, priorityIds])

  const activeCount =
    (search !== '' ? 1 : 0) + categoryIds.size + roomIds.size + statusIds.size + priorityIds.size

  const hasActiveFilters = activeCount > 0

  function reset() {
    setSearch('')
    setCategoryIds(new Set())
    setRoomIds(new Set())
    setStatusIds(new Set())
    setPriorityIds(new Set())
  }

  return {
    filtered,
    search,
    setSearch,
    presentCategories,
    presentRooms,
    presentStatuses,
    presentPriorities,
    categoryIds,
    roomIds,
    statusIds,
    priorityIds,
    toggleCategory: (id: string) => setCategoryIds((prev) => toggleInSet(prev, id)),
    toggleRoom: (id: string) => setRoomIds((prev) => toggleInSet(prev, id)),
    toggleStatus: (id: string) => setStatusIds((prev) => toggleInSet(prev, id)),
    togglePriority: (id: string) => setPriorityIds((prev) => toggleInSet(prev, id)),
    activeCount,
    hasActiveFilters,
    reset,
  }
}
