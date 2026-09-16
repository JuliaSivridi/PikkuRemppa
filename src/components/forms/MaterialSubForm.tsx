import type { DraftMaterial, DraftMaterialRow, MaterialCategory } from '../../types'
import { generateId } from '../../utils/id'
import { MaterialFieldRow } from './MaterialFieldRow'

interface MaterialSubFormProps {
  materials: DraftMaterialRow[]
  categories: MaterialCategory[]
  onChange: (materials: DraftMaterialRow[]) => void
}

function emptyMaterial(): DraftMaterialRow {
  return { _key: generateId(), categoryId: '', name: '', fieldValues: {} }
}

export function MaterialSubForm({ materials, categories, onChange }: MaterialSubFormProps) {
  function addRow() {
    onChange([...materials, emptyMaterial()])
  }

  function updateRow(index: number, patch: Partial<DraftMaterial>) {
    onChange(materials.map((m, i) => (i === index ? { ...m, ...patch } : m)))
  }

  function removeRow(index: number) {
    onChange(materials.filter((_, i) => i !== index))
  }

  return (
    <div className="material-sub-form">
      <div className="material-sub-form__header">
        <span className="field__label">Materiaalit</span>
        <button type="button" className="button button--secondary" onClick={addRow}>
          + Materiaali
        </button>
      </div>

      {materials.length === 0 && <p className="empty-state empty-state--inline">Materiaaleja ei ole lisätty</p>}

      {materials.map((material, index) => (
        <MaterialFieldRow
          key={material._key}
          material={material}
          categories={categories}
          onChange={(patch) => updateRow(index, patch)}
          onRemove={() => removeRow(index)}
        />
      ))}
    </div>
  )
}
