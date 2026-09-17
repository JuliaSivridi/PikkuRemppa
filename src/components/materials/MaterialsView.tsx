import { useState } from 'react'
import { useMaterialsFlat } from '../../hooks/useMaterialsFlat'
import { useMaterialFilters } from '../../hooks/useMaterialFilters'
import { MaterialFilters } from './MaterialFilters'
import { MaterialRow } from './MaterialRow'
import { FilterButton } from '../common/FilterButton'
import { Modal } from '../common/Modal'

export function MaterialsView() {
  const materials = useMaterialsFlat()
  const filters = useMaterialFilters(materials)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="list-view">
      <div className="list-view__toolbar">
        <FilterButton activeCount={filters.activeCount} onClick={() => setShowFilters(true)} />
      </div>

      <div className="materials-view__list">
        {filters.filtered.length === 0 ? (
          <p className="empty-state">Materiaaleja ei ole vielä lisätty.</p>
        ) : (
          filters.filtered.map((m) => (
            <MaterialRow
              key={m.id}
              material={m}
              category={m.category}
              mode="detailed"
              room={m.room}
              repairDate={m.repair?.date}
            />
          ))
        )}
      </div>

      {showFilters && (
        <Modal title="Suodattimet" onClose={() => setShowFilters(false)}>
          <MaterialFilters {...filters} />
        </Modal>
      )}
    </div>
  )
}
