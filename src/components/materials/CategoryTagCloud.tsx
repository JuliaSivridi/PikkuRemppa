import type { MaterialCategory } from '../../types'

interface CategoryTagCloudProps {
  categories: MaterialCategory[]
  selected: Set<string>
  onToggle: (id: string) => void
  onClear: () => void
}

export function CategoryTagCloud({ categories, selected, onToggle, onClear }: CategoryTagCloudProps) {
  if (categories.length === 0) return null

  return (
    <aside className="tag-cloud">
      <button
        type="button"
        className="button button--secondary repair-filters__reset"
        disabled={selected.size === 0}
        onClick={onClear}
      >
        Nollaa suodattimet
      </button>
      <span className="tag-cloud__title">Suodata tyypin mukaan</span>
      <div className="tag-cloud__tags">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`tag tag--toggle ${selected.has(c.id) ? 'tag--selected' : ''}`}
            onClick={() => onToggle(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </aside>
  )
}
