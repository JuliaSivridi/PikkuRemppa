import { useState } from 'react'
import { useRepairsWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { useRepairFilters } from '../../hooks/useRepairFilters'
import { RepairFilters } from './RepairFilters'
import { RepairCard } from './RepairCard'
import { RepairsTable } from './RepairsTable'
import { FilterButton } from '../common/FilterButton'
import { Modal } from '../common/Modal'

interface RepairsListProps {
  onAdd: () => void
}

export function RepairsList({ onAdd }: RepairsListProps) {
  const repairs = useRepairsWithMaterials()
  const filters = useRepairFilters(repairs)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="list-view">
      <div className="list-view__toolbar">
        <button type="button" className="button button--primary list-view__add-button" onClick={onAdd}>
          Lisää remontti
        </button>
        {repairs.length > 0 && (
          <FilterButton activeCount={filters.activeCount} onClick={() => setShowFilters(true)} />
        )}
      </div>

      {repairs.length === 0 ? (
        <p className="empty-state">Yhtään remonttia ei ole vielä lisätty.</p>
      ) : filters.filtered.length === 0 ? (
        <p className="empty-state">Ei suodattimiin sopivia remontteja.</p>
      ) : (
        <>
          <div className="repairs-list repairs-list--mobile">
            {filters.filtered.map((repair) => (
              <RepairCard key={repair.id} repair={repair} />
            ))}
          </div>
          <div className="repairs-table-wrap">
            <RepairsTable repairs={filters.filtered} />
          </div>
        </>
      )}

      {showFilters && (
        <Modal title="Suodattimet" onClose={() => setShowFilters(false)}>
          <RepairFilters {...filters} />
        </Modal>
      )}
    </div>
  )
}
