import { useRepairsWithMaterials } from '../../hooks/useRepairsWithMaterials'
import { RepairCard } from './RepairCard'

export function RepairsList() {
  const repairs = useRepairsWithMaterials()

  if (repairs.length === 0) {
    return <p className="empty-state">Пока нет ни одного ремонта. Нажмите «+», чтобы добавить первый.</p>
  }

  return (
    <div className="repairs-list">
      {repairs.map((repair) => (
        <RepairCard key={repair.id} repair={repair} />
      ))}
    </div>
  )
}
