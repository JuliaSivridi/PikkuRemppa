import { useState } from 'react'
import { useStore } from '../../store/store'
import { useMaterialsFlat } from '../../hooks/useMaterialsFlat'
import { useCategoryFilter } from '../../hooks/useCategoryFilter'
import { CategoryTagCloud } from './CategoryTagCloud'
import { MaterialRow } from './MaterialRow'
import { FilterButton } from '../common/FilterButton'
import { Modal } from '../common/Modal'

export function MaterialsView() {
  const materials = useMaterialsFlat()
  const materialCategories = useStore((s) => s.materialCategories)
  const { presentCategories, selected, toggle, clear, filtered } = useCategoryFilter(materials, materialCategories)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="list-view">
      <div className="list-view__toolbar">
        <FilterButton activeCount={selected.size} onClick={() => setShowFilters(true)} />
      </div>

      <div className="materials-view__list">
        {filtered.length === 0 ? (
          <p className="empty-state">Materiaaleja ei ole vielä lisätty.</p>
        ) : (
          filtered.map((m) => (
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
          <CategoryTagCloud categories={presentCategories} selected={selected} onToggle={toggle} onClear={clear} />
        </Modal>
      )}
    </div>
  )
}
