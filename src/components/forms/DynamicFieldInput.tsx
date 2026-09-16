import type { FieldDef } from '../../types'

interface DynamicFieldInputProps {
  def: FieldDef
  value: string
  onChange: (value: string) => void
}

export function DynamicFieldInput({ def, value, onChange }: DynamicFieldInputProps) {
  return (
    <label className="field field--compact">
      <span className="field__label">{def.label}</span>
      <input
        className="field__input"
        type={def.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
