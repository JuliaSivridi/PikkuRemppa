interface FabProps {
  onClick: () => void
  label?: string
}

export function Fab({ onClick, label = 'Lisää' }: FabProps) {
  return (
    <button type="button" className="fab" onClick={onClick} aria-label={label} title={label}>
      +
    </button>
  )
}
