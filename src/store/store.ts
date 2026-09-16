import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DraftMaterial, FieldDef, Material, MaterialCategory, Priority, Repair, Room, Status } from '../types'
import { buildSeedData } from '../data/seed'
import { generateId } from '../utils/id'
import { ROOM_PALETTE } from '../utils/colors'

interface AppState {
  version: 2
  rooms: Room[]
  statuses: Status[]
  priorities: Priority[]
  materialCategories: MaterialCategory[]
  repairs: Repair[]
  materials: Material[]

  addRoom: (name: string) => void
  removeRoom: (id: string) => void
  cycleRoomColor: (id: string) => void

  addStatus: (name: string) => void
  removeStatus: (id: string) => void

  addPriority: (name: string) => void
  removePriority: (id: string) => void

  addCategory: (name: string) => string
  renameCategory: (id: string, name: string) => void
  updateCategoryFields: (categoryId: string, fields: FieldDef[]) => void
  removeCategory: (id: string) => void

  addRepair: (input: Omit<Repair, 'id'>, materials: DraftMaterial[]) => void
  removeRepair: (id: string) => void

  updateMaterial: (id: string, patch: Partial<Material>) => void
  removeMaterial: (id: string) => void

  resetToSeed: () => void
}

const STORAGE_KEY = 'pikkuremppa-data'

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...buildSeedData(),

      addRoom: (name) =>
        set((state) => ({
          rooms: [...state.rooms, { id: generateId(), name, colorIndex: state.rooms.length % ROOM_PALETTE.length }],
        })),

      removeRoom: (id) =>
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) })),

      cycleRoomColor: (id) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === id ? { ...r, colorIndex: ((r.colorIndex ?? 0) + 1) % ROOM_PALETTE.length } : r,
          ),
        })),

      addStatus: (name) =>
        set((state) => ({ statuses: [...state.statuses, { id: generateId(), name }] })),

      removeStatus: (id) =>
        set((state) => ({ statuses: state.statuses.filter((s) => s.id !== id) })),

      addPriority: (name) =>
        set((state) => ({ priorities: [...state.priorities, { id: generateId(), name }] })),

      removePriority: (id) =>
        set((state) => ({ priorities: state.priorities.filter((p) => p.id !== id) })),

      addCategory: (name) => {
        const id = generateId()
        set((state) => ({
          materialCategories: [...state.materialCategories, { id, name, fields: [] }],
        }))
        return id
      },

      renameCategory: (id, name) =>
        set((state) => ({
          materialCategories: state.materialCategories.map((c) => (c.id === id ? { ...c, name } : c)),
        })),

      updateCategoryFields: (categoryId, fields) =>
        set((state) => ({
          materialCategories: state.materialCategories.map((c) =>
            c.id === categoryId ? { ...c, fields } : c,
          ),
        })),

      removeCategory: (id) =>
        set((state) => ({
          materialCategories: state.materialCategories.filter((c) => c.id !== id),
        })),

      addRepair: (input, draftMaterials) =>
        set((state) => {
          const repairId = generateId()
          const repair: Repair = { ...input, id: repairId }
          const newMaterials: Material[] = draftMaterials.map((m) => ({
            ...m,
            id: generateId(),
            repairId,
          }))
          return {
            repairs: [...state.repairs, repair],
            materials: [...state.materials, ...newMaterials],
          }
        }),

      removeRepair: (id) =>
        set((state) => ({
          repairs: state.repairs.filter((r) => r.id !== id),
          materials: state.materials.filter((m) => m.repairId !== id),
        })),

      updateMaterial: (id, patch) =>
        set((state) => ({
          materials: state.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      removeMaterial: (id) =>
        set((state) => ({ materials: state.materials.filter((m) => m.id !== id) })),

      resetToSeed: () => set(() => ({ ...buildSeedData() })),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      partialize: (state) => ({
        version: state.version,
        rooms: state.rooms,
        statuses: state.statuses,
        priorities: state.priorities,
        materialCategories: state.materialCategories,
        repairs: state.repairs,
        materials: state.materials,
      }),
      migrate: (persisted) => {
        const state = persisted as Partial<ReturnType<typeof buildSeedData>>
        const seed = buildSeedData()
        return {
          ...state,
          version: 2,
          statuses: state.statuses ?? seed.statuses,
          priorities: state.priorities ?? seed.priorities,
          repairs: (state.repairs ?? []).map((r) => ({
            ...r,
            statusId: r.statusId ?? seed.statuses[1].id,
          })),
        }
      },
    },
  ),
)
