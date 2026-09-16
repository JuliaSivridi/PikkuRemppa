import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DraftMaterial, FieldDef, Material, MaterialCategory, Repair, Room } from '../types'
import { buildSeedData } from '../data/seed'
import { generateId } from '../utils/id'

interface AppState {
  version: 1
  rooms: Room[]
  materialCategories: MaterialCategory[]
  repairs: Repair[]
  materials: Material[]

  addRoom: (name: string) => void
  removeRoom: (id: string) => void

  addCategory: (name: string) => void
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
        set((state) => ({ rooms: [...state.rooms, { id: generateId(), name }] })),

      removeRoom: (id) =>
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) })),

      addCategory: (name) =>
        set((state) => ({
          materialCategories: [...state.materialCategories, { id: generateId(), name, fields: [] }],
        })),

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
      version: 1,
      partialize: (state) => ({
        version: state.version,
        rooms: state.rooms,
        materialCategories: state.materialCategories,
        repairs: state.repairs,
        materials: state.materials,
      }),
    },
  ),
)
