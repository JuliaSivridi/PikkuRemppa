export type View = 'repairs' | 'materials'

interface ViewToggleProps {
  view: View
  onChange: (view: View) => void
}

const OPTIONS: { value: View; label: string }[] = [
  { value: 'repairs', label: 'Remontit' },
  { value: 'materials', label: 'Materiaalit' },
]

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`view-toggle__button ${view === opt.value ? 'view-toggle__button--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
