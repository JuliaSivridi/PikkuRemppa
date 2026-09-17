import type { useMaterialFilters } from '../../hooks/useMaterialFilters'
import { TagFilterGroup } from '../common/TagFilterGroup'

type Filters = ReturnType<typeof useMaterialFilters>

export function MaterialFilters(filters: Filters) {
  return (
    <div className="filter-panel">
      <button
        type="button"
        className="button button--secondary filter-panel__reset"
        disabled={!filters.hasActiveFilters}
        onClick={filters.reset}
      >
        Nollaa suodattimet
      </button>

      <label className="field">
        <span className="field__label">Haku</span>
        <input
          className="field__input"
          type="text"
          placeholder="Materiaalin nimestä…"
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
        />
      </label>

      <TagFilterGroup
        label="Tyyppi"
        items={filters.presentCategories}
        selected={filters.categoryIds}
        onToggle={filters.toggleCategory}
      />
      <TagFilterGroup label="Kohde" items={filters.presentRooms} selected={filters.roomIds} onToggle={filters.toggleRoom} />
      <TagFilterGroup
        label="Tilanne"
        items={filters.presentStatuses}
        selected={filters.statusIds}
        onToggle={filters.toggleStatus}
      />
      <TagFilterGroup
        label="Prioriteetti"
        items={filters.presentPriorities}
        selected={filters.priorityIds}
        onToggle={filters.togglePriority}
      />
    </div>
  )
}
