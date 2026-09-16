import type { FilterTagItem } from '../../hooks/useRepairFilters'

interface TagFilterGroupProps {
  label: string
  items: FilterTagItem[]
  selected: Set<string>
  onToggle: (id: string) => void
}

export function TagFilterGroup({ label, items, selected, onToggle }: TagFilterGroupProps) {
  if (items.length === 0) return null

  return (
    <div className="tag-filter-group">
      <span className="tag-filter-group__label">{label}</span>
      <div className="tag-filter-group__tags">
        {items.map((item) => {
          const isSelected = selected.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              className={`tag tag--toggle ${isSelected ? 'tag--selected' : ''}`}
              style={isSelected ? undefined : { background: item.color.bg, color: item.color.text }}
              onClick={() => onToggle(item.id)}
            >
              {item.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
