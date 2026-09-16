import { useState } from 'react'
import type { FieldDef, FieldType } from '../../types'

interface FieldDefEditorProps {
  fields: FieldDef[]
  onChange: (fields: FieldDef[]) => void
}

function slugify(label: string, existingKeys: string[]): string {
  const base =
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-ZäöåÄÖÅ0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'field'
  let key = base
  let i = 2
  while (existingKeys.includes(key)) {
    key = `${base}-${i}`
    i += 1
  }
  return key
}

export function FieldDefEditor({ fields, onChange }: FieldDefEditorProps) {
  const [label, setLabel] = useState('')
  const [type, setType] = useState<FieldType>('text')

  function handleAdd() {
    const trimmed = label.trim()
    if (!trimmed) return
    const key = slugify(
      trimmed,
      fields.map((f) => f.key),
    )
    onChange([...fields, { key, label: trimmed, type }])
    setLabel('')
    setType('text')
  }

  function handleRemove(key: string) {
    onChange(fields.filter((f) => f.key !== key))
  }

  return (
    <div className="field-def-editor">
      <ul className="settings-list settings-list--nested">
        {fields.map((f) => (
          <li key={f.key} className="settings-list__item">
            <span>
              {f.label} <span className="settings-list__hint">({f.type === 'number' ? 'numero' : 'teksti'})</span>
            </span>
            <button
              type="button"
              className="icon-button icon-button--danger"
              aria-label="Poista kenttä"
              onClick={() => handleRemove(f.key)}
            >
              ×
            </button>
          </li>
        ))}
        {fields.length === 0 && <li className="empty-state empty-state--inline">Kenttiä ei ole</li>}
      </ul>
      <div className="settings-add-row">
        <input
          className="field__input"
          type="text"
          placeholder="Kentän nimi (esim. Mitat)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <select className="field__input" value={type} onChange={(e) => setType(e.target.value as FieldType)}>
          <option value="text">Teksti</option>
          <option value="number">Numero</option>
        </select>
        <button type="button" className="button button--secondary" onClick={handleAdd}>
          + Kenttä
        </button>
      </div>
    </div>
  )
}
