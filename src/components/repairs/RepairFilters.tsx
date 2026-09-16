import type { useRepairFilters } from '../../hooks/useRepairFilters'
import { TagFilterGroup } from '../common/TagFilterGroup'

type Filters = ReturnType<typeof useRepairFilters>

export function RepairFilters(filters: Filters) {
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
          placeholder="Kuvauksesta tai materiaaleista…"
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
        />
      </label>

      <div className="repair-filters__cost">
        <span className="field__label">Kustannus, €</span>
        <div className="repair-filters__cost-row">
          <input
            className="field__input"
            type="number"
            min={0}
            step="any"
            placeholder="alkaen"
            value={filters.costMin ?? ''}
            onChange={(e) => filters.setCostMin(e.target.value === '' ? undefined : Number(e.target.value))}
          />
          <span className="repair-filters__cost-sep">–</span>
          <input
            className="field__input"
            type="number"
            min={0}
            step="any"
            placeholder="asti"
            value={filters.costMax ?? ''}
            onChange={(e) => filters.setCostMax(e.target.value === '' ? undefined : Number(e.target.value))}
          />
        </div>
      </div>

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
