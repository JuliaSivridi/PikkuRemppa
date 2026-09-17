import { useState } from 'react'
import { useStore } from '../../store/store'
import { FieldDefEditor } from './FieldDefEditor'

export function MaterialCategoriesEditor() {
  const categories = useStore((s) => s.materialCategories)
  const materials = useStore((s) => s.materials)
  const addCategory = useStore((s) => s.addCategory)
  const removeCategory = useStore((s) => s.removeCategory)
  const updateCategoryFields = useStore((s) => s.updateCategoryFields)
  const mergeCategories = useStore((s) => s.mergeCategories)

  const [name, setName] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sourceId, setSourceId] = useState('')
  const [targetId, setTargetId] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addCategory(trimmed)
    setName('')
  }

  function handleMerge() {
    if (!sourceId || !targetId || sourceId === targetId) return
    const source = categories.find((c) => c.id === sourceId)
    const target = categories.find((c) => c.id === targetId)
    if (!source || !target) return
    const count = materials.filter((m) => m.categoryId === sourceId).length
    if (
      confirm(
        `Siirretään ${count} materiaalia kategoriasta "${source.name}" kategoriaan "${target.name}". Kategoria "${source.name}" poistetaan. Jatketaanko?`,
      )
    ) {
      mergeCategories(sourceId, targetId)
      setSourceId('')
      setTargetId('')
    }
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

      {categories.length > 1 && (
        <div className="category-merge">
          <span className="field__label">Yhdistä kaksi kategoriaa samaksi</span>
          <p className="field__hint">
            Kaikki materiaalit siirtyvät valitusta kategoriasta kohteeseen, ja alkuperäinen kategoria poistetaan.
          </p>
          <div className="category-merge__row">
            <select className="field__input" value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
              <option value="">Mistä kategoriasta</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === targetId}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="category-merge__arrow">→</span>
            <select className="field__input" value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              <option value="">Mihin kategoriaan</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === sourceId}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="button button--secondary"
              disabled={!sourceId || !targetId || sourceId === targetId}
              onClick={handleMerge}
            >
              Yhdistä
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
