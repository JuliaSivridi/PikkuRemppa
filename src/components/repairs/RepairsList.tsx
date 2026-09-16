import { useRepairsWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { useRepairFilters } from '../../hooks/useRepairFilters'
import { RepairFilters } from './RepairFilters'
import { RepairCard } from './RepairCard'

export function RepairsList() {
  const repairs = useRepairsWithMaterials()
  const filters = useRepairFilters(repairs)

  if (repairs.length === 0) {
    return <p className="empty-state">Yhtään remonttia ei ole vielä lisätty. Paina «+» lisätäksesi ensimmäisen.</p>
  }

  return (
    <div className="repairs-view">
      <RepairFilters {...filters} />
      <div className="repairs-view__list">
        {filters.filtered.length === 0 ? (
          <p className="empty-state">Ei suodattimiin sopivia remontteja.</p>
        ) : (
          filters.filtered.map((repair) => <RepairCard key={repair.id} repair={repair} />)
        )}
      </div>
    </div>
  )
}
