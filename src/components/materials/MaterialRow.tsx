import type { Material, MaterialCategory, Room } from '../../types'
import { formatDate } from '../../utils/date'
import { formatCurrency, formatQuantity } from '../../utils/format'

interface MaterialRowProps {
  material: Material
  category: MaterialCategory | undefined
  mode: 'compact' | 'detailed'
  room?: Room | undefined
  repairDate?: string | undefined
}

export function MaterialRow({ material, category, mode, room, repairDate }: MaterialRowProps) {
  const fieldEntries = category?.fields ?? []

  return (
    <div className="material-row">
      <div className="material-row__main">
        <span className="material-row__name">{material.name}</span>
        {category && <span className="tag tag--static">{category.name}</span>}
      </div>
      <div className="material-row__details">
        <span>{formatQuantity(material.quantity, material.unit)}</span>
        <span>{formatCurrency(material.price)}</span>
        {fieldEntries.map((f) => {
          const v = material.fieldValues[f.key]
          if (!v) return null
          return (
            <span key={f.key} className="material-row__field">
              {f.label}: {v}
            </span>
          )
        })}
        {material.storeUrl && (
          <a className="material-row__link" href={material.storeUrl} target="_blank" rel="noreferrer">
            Linkki tuotteeseen
          </a>
        )}
      </div>
      {mode === 'detailed' && (
        <div className="material-row__secondary">
          {room && <span>{room.name}</span>}
          {repairDate && <span>{formatDate(repairDate)}</span>}
        </div>
      )}
    </div>
  )
}
