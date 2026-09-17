import type { Material, Repair } from '../types'

export function materialCost(material: Material): number {
  if (material.includeInTotal === false) return 0
  return material.price ?? 0
}

export function repairTotal(repair: Repair, materials: Material[]): number {
  return repair.cost + materials.reduce((sum, m) => sum + materialCost(m), 0)
}
