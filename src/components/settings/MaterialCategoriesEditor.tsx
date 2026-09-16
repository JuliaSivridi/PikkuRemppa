import { useState } from 'react'
import { useStore } from '../../store/store'
import { FieldDefEditor } from './FieldDefEditor'

export function MaterialCategoriesEditor() {
  const categories = useStore((s) => s.materialCategories)
  const addCategory = useStore((s) => s.addCategory)
  const removeCategory = useStore((s) => s.removeCategory)
  const updateCategoryFields = useStore((s) => s.updateCategoryFields)

  const [name, setName] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addCategory(trimmed)
    setName('')
  }

  return (
    <section className="settings-section">
      <h3>Materiaalikategoriat</h3>
      <ul className="settings-list">
        {categories.map((category) => (
          <li key={category.id} className="settings-list__item settings-list__item--stacked">
            <div className="settings-list__row">
              <button
                type="button"
                className="settings-list__expand"
                onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
              >
                {expandedId === category.id ? '▾' : '▸'} {category.name}
              </button>
              <button
                type="button"
                className="icon-button icon-button--danger"
                aria-label="Poista kategoria"
                onClick={() => removeCategory(category.id)}
              >
                ×
              </button>
            </div>
            {expandedId === category.id && (
              <FieldDefEditor
                fields={category.fields}
                onChange={(fields) => updateCategoryFields(category.id, fields)}
              />
            )}
          </li>
        ))}
        {categories.length === 0 && <li className="empty-state empty-state--inline">Kategorioita ei ole</li>}
      </ul>
      <div className="settings-add-row">
        <input
          className="field__input"
          type="text"
          placeholder="Kategorian nimi (esim. Lauta)"
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
