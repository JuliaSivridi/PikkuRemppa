import { useState } from 'react'

interface SimpleListEditorProps {
  title: string
  items: { id: string; name: string }[]
  placeholder: string
  emptyLabel: string
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export function SimpleListEditor({ title, items, placeholder, emptyLabel, onAdd, onRemove }: SimpleListEditorProps) {
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <section className="settings-section">
      <h3>{title}</h3>
      <ul className="settings-list">
        {items.map((item) => (
          <li key={item.id} className="settings-list__item">
            <span>{item.name}</span>
            <button
              type="button"
              className="icon-button icon-button--danger"
              aria-label="Poista"
              onClick={() => onRemove(item.id)}
            >
              ×
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="empty-state empty-state--inline">{emptyLabel}</li>}
      </ul>
      <div className="settings-add-row">
        <input
          className="field__input"
          type="text"
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button type="button" className="button button--secondary" onClick={handleAdd}>
          Lisää
        </button>
      </div>
    </section>
  )
}
