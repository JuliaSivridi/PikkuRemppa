import { useStore } from '../../store/store'
import type { RepairWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { formatDate } from '../../utils/date'
import { formatCurrency } from '../../utils/format'
import { MaterialRow } from '../materials/MaterialRow'
import { Tag } from '../common/Tag'

interface RepairCardProps {
  repair: RepairWithMaterials
}

const EXECUTOR_LABEL: Record<string, string> = {
  self: 'Itse',
  service: 'Palveluntarjoaja',
}

export function RepairCard({ repair }: RepairCardProps) {
  const materialCategories = useStore((s) => s.materialCategories)
  const removeRepair = useStore((s) => s.removeRepair)
  const categoriesById = new Map(materialCategories.map((c) => [c.id, c]))

  return (
    <article className="repair-card">
      <div className="repair-card__header">
        <div className="repair-card__header-left">
          <div className="repair-card__meta">
            <span className="repair-card__date">{formatDate(repair.date)}</span>
            <Tag color={repair.roomColor}>{repair.room?.name ?? '—'}</Tag>
            {repair.status && <Tag color={repair.statusColor}>{repair.status.name}</Tag>}
            {repair.priority && <Tag color={repair.priorityColor}>{repair.priority.name}</Tag>}
            {repair.executor && <Tag>{EXECUTOR_LABEL[repair.executor]}</Tag>}
          </div>
          <p className="repair-card__description">{repair.description}</p>
        </div>
        <div className="repair-card__header-right">
          <span className="repair-card__cost">{formatCurrency(repair.total)}</span>
          <button
            type="button"
            className="icon-button icon-button--danger"
            aria-label="Poista remontti"
            title="Poista remontti"
            onClick={() => {
              if (confirm('Poistetaanko tämä remontti ja siihen liittyvät materiaalit?')) removeRepair(repair.id)
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
