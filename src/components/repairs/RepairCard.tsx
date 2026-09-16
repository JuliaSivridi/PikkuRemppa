import { useStore } from '../../store/store'
import type { RepairWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { formatDate } from '../../utils/date'
import { formatCurrency } from '../../utils/format'
import { MaterialRow } from '../materials/MaterialRow'

interface RepairCardProps {
  repair: RepairWithMaterials
}

export function RepairCard({ repair }: RepairCardProps) {
  const materialCategories = useStore((s) => s.materialCategories)
  const removeRepair = useStore((s) => s.removeRepair)
  const categoriesById = new Map(materialCategories.map((c) => [c.id, c]))

  return (
    <article className="repair-card">
      <div className="repair-card__header">
        <div>
          <div className="repair-card__meta">
            <span className="repair-card__date">{formatDate(repair.date)}</span>
            <span className="tag tag--static">{repair.room?.name ?? '—'}</span>
          </div>
          <p className="repair-card__description">{repair.description}</p>
        </div>
        <div className="repair-card__header-right">
          <span className="repair-card__cost">{formatCurrency(repair.cost)}</span>
          <button
            type="button"
            className="icon-button icon-button--danger"
            aria-label="Удалить ремонт"
            title="Удалить ремонт"
            onClick={() => {
              if (confirm('Удалить этот ремонт вместе с материалами?')) removeRepair(repair.id)
            }}
          >
            ×
          </button>
        </div>
      </div>

      {repair.materials.length > 0 && (
        <div className="repair-card__materials">
          {repair.materials.map((m) => (
            <MaterialRow key={m.id} material={m} category={categoriesById.get(m.categoryId)} mode="compact" />
          ))}
        </div>
      )}
    </article>
  )
}
