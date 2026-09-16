import { useStore } from '../../store/store'
import { useMaterialsFlat } from '../../hooks/useMaterialsFlat'
import { useCategoryFilter } from '../../hooks/useCategoryFilter'
import { CategoryTagCloud } from './CategoryTagCloud'
import { MaterialRow } from './MaterialRow'

export function MaterialsView() {
  const materials = useMaterialsFlat()
  const materialCategories = useStore((s) => s.materialCategories)
  const { presentCategories, selected, toggle, clear, filtered } = useCategoryFilter(materials, materialCategories)

  return (
    <div className="materials-view">
      <CategoryTagCloud categories={presentCategories} selected={selected} onToggle={toggle} onClear={clear} />
      <div className="materials-view__list">
        {filtered.length === 0 ? (
          <p className="empty-state">Материалов пока нет.</p>
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
    </div>
  )
}
