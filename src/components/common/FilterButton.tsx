interface FilterButtonProps {
  activeCount: number
  onClick: () => void
}

export function FilterButton({ activeCount, onClick }: FilterButtonProps) {
  return (
    <button type="button" className="filter-button" onClick={onClick}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <circle cx="9" cy="6" r="2.2" fill="currentColor" stroke="none" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="7" cy="18" r="2.2" fill="currentColor" stroke="none" />
      </svg>
      Suodattimet
      {activeCount > 0 && <span className="filter-button__badge">{activeCount}</span>}
    </button>
  )
}
