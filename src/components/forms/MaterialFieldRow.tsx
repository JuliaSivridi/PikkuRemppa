import { useState } from 'react'
import type { DraftMaterial, DraftMaterialRow, MaterialCategory } from '../../types'
import { parseProductUrl } from '../../lib/linkParser'
import { useStore } from '../../store/store'
import { DynamicFieldInput } from './DynamicFieldInput'

interface MaterialFieldRowProps {
  material: DraftMaterialRow
  categories: MaterialCategory[]
  onChange: (patch: Partial<DraftMaterial>) => void
  onRemove: () => void
}

type ParseStatus = 'idle' | 'loading' | 'success' | 'error'

export function MaterialFieldRow({ material, categories, onChange, onRemove }: MaterialFieldRowProps) {
  const [parseStatus, setParseStatus] = useState<ParseStatus>('idle')
  const [parseMessage, setParseMessage] = useState<string>('')
  const addCategory = useStore((s) => s.addCategory)

  const category = categories.find((c) => c.id === material.categoryId)

  function handleCategoryChange(categoryId: string) {
    onChange({ categoryId, fieldValues: {} })
  }

  function handleFieldValueChange(key: string, value: string) {
    onChange({ fieldValues: { ...material.fieldValues, [key]: value } })
  }

  async function handleParse() {
    if (!material.storeUrl) return
    setParseStatus('loading')
    setParseMessage('')
    const result = await parseProductUrl(material.storeUrl)
    if (result.ok) {
      const patch: Partial<DraftMaterial> = {}
      if (!material.name && result.data.name) patch.name = result.data.name
      if (material.price === undefined && result.data.price !== undefined) patch.price = result.data.price

      let categoryCreated = false
      if (!material.categoryId && result.data.suggestedCategory) {
        const existing = categories.find(
          (c) => c.name.toLowerCase() === result.data.suggestedCategory!.toLowerCase(),
        )
        if (existing) {
          patch.categoryId = existing.id
        } else {
          patch.categoryId = addCategory(result.data.suggestedCategory)
          patch.fieldValues = {}
          categoryCreated = true
        }
      }

      onChange(patch)
      setParseStatus('success')
      setParseMessage(
        categoryCreated
          ? `Tiedot täytetty automaattisesti. Loimme uuden kategorian "${result.data.suggestedCategory}" — muokkaa sen kenttiä asetuksissa tarvittaessa.`
          : 'Tiedot täytetty automaattisesti (tarkista ennen tallennusta)',
      )
    } else {
      setParseStatus('error')
      setParseMessage('Tuotesivun hakeminen epäonnistui — täytä tiedot käsin')
    }
  }

  return (
    <div className="material-field-row">
      <div className="material-field-row__top">
        <label className="field">
          <span className="field__label">Kategoria</span>
          <select
            className="field__input"
            value={material.categoryId}
            required
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Valitse kategoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="icon-button icon-button--danger" onClick={onRemove} aria-label="Poista materiaali">
          ×
        </button>
      </div>

      <div className="material-field-row__grid">
        <label className="field">
          <span className="field__label">Nimi</span>
          <input
            className="field__input"
            type="text"
            value={material.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </label>
        <label className="field field--compact">
          <span className="field__label">Määrä</span>
          <input
            className="field__input"
            type="number"
            min={0}
            step="any"
            value={material.quantity ?? ''}
            onChange={(e) => onChange({ quantity: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
        </label>
        <label className="field field--compact">
          <span className="field__label">Yksikkö</span>
          <input
            className="field__input"
            type="text"
            placeholder="kpl, l, m²"
            value={material.unit ?? ''}
            onChange={(e) => onChange({ unit: e.target.value })}
          />
        </label>
        <label className="field field--compact">
          <span className="field__label">Hinta, €</span>
          <input
            className="field__input"
            type="number"
            min={0}
            step="any"
            value={material.price ?? ''}
            onChange={(e) => onChange({ price: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
        </label>
      </div>

      {category && category.fields.length > 0 && (
        <div className="material-field-row__grid">
          {category.fields.map((def) => (
            <DynamicFieldInput
              key={def.key}
              def={def}
              value={material.fieldValues[def.key] ?? ''}
              onChange={(value) => handleFieldValueChange(def.key, value)}
            />
          ))}
        </div>
      )}

      <div className="material-field-row__store">
        <label className="field">
          <span className="field__label">Linkki kauppaan</span>
          <input
            className="field__input"
            type="url"
            placeholder="https://www.k-rauta.fi/..."
            value={material.storeUrl ?? ''}
            onChange={(e) => onChange({ storeUrl: e.target.value })}
          />
        </label>
        <button
          type="button"
          className="button button--secondary"
          disabled={!material.storeUrl || parseStatus === 'loading'}
          onClick={handleParse}
        >
          {parseStatus === 'loading' ? 'Haetaan…' : 'Hae tiedot'}
        </button>
      </div>
      {parseMessage && (
        <p className={`material-field-row__parse-message material-field-row__parse-message--${parseStatus}`}>
          {parseMessage}
        </p>
      )}

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={material.includeInTotal ?? true}
          onChange={(e) => onChange({ includeInTotal: e.target.checked })}
        />
        Sisällytä remontin kokonaishintaan
      </label>
    </div>
  )
}
