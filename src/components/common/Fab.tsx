interface FabProps {
  onClick: () => void
  label?: string
}

export function Fab({ onClick, label = 'Добавить' }: FabProps) {
  return (
    <button type="button" className="fab" onClick={onClick} aria-label={label} title={label}>
      +
    </button>
  )
}
