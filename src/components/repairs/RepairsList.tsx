import { useState } from 'react'
import { useRepairsWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { useRepairFilters } from '../../hooks/useRepairFilters'
import { RepairFilters } from './RepairFilters'
import { RepairCard } from './RepairCard'
import { FilterButton } from '../common/FilterButton'
import { Modal } from '../common/Modal'

export function RepairsList() {
  const repairs = useRepairsWithMaterials()
  const filters = useRepairFilters(repairs)
  const [showFilters, setShowFilters] = useState(false)

  if (repairs.length === 0) {
    return <p className="empty-state">Yhtään remonttia ei ole vielä lisätty. Paina «+» lisätäksesi ensimmäisen.</p>
  }

  return (
    <div className="list-view">
      <div className="list-view__toolbar">
        <FilterButton activeCount={filters.activeCount} onClick={() => setShowFilters(true)} />
      </div>

      {filters.filtered.length === 0 ? (
        <p className="empty-state">Ei suodattimiin sopivia remontteja.</p>
      ) : (
        <div className="repairs-list">
          {filters.filtered.map((repair) => (
            <RepairCard key={repair.id} repair={repair} />
          ))}
        </div>
      )}

      {showFilters && (
        <Modal title="Suodattimet" onClose={() => setShowFilters(false)}>
          <RepairFilters {...filters} />
        </Modal>
      )}
    </div>
  )
}
