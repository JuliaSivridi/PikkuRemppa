export interface Room {
  id: string
  name: string
  colorIndex?: number
}

export interface Status {
  id: string
  name: string
}

export interface Priority {
  id: string
  name: string
}

export type Executor = 'self' | 'service'

export type FieldType = 'text' | 'number'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
}

export interface MaterialCategory {
  id: string
  name: string
  fields: FieldDef[]
}

export interface Repair {
  id: string
  date: string // ISO date, yyyy-mm-dd
  roomId: string
  statusId: string
  priorityId?: string
  executor?: Executor
  description: string
  cost: number
}

export interface Material {
  id: string
  repairId: string
  categoryId: string
  name: string
  quantity?: number
  unit?: string
  price?: number
  storeUrl?: string
  fieldValues: Record<string, string>
  // Whether this material's price counts toward the repair's total cost. Defaults to true
  // when unset, so a person can e.g. leave the repair's own labor cost at 0 for DIY work
  // and still get a meaningful total made up of materials only.
  includeInTotal?: boolean
}

export type DraftMaterial = Omit<Material, 'id' | 'repairId'>

// DraftMaterial plus a client-only stable id used for React list keys while editing a form.
export type DraftMaterialRow = DraftMaterial & { _key: string }

export interface PersistedData {
  version: 2
  rooms: Room[]
  statuses: Status[]
  priorities: Priority[]
  materialCategories: MaterialCategory[]
  repairs: Repair[]
  materials: Material[]
}
