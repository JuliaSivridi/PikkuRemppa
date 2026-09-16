interface NumberFieldProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
  min?: number
  step?: number
}

export function NumberField({ label, value, onChange, placeholder, min = 0, step = 'any' as unknown as number }: NumberFieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="field__input"
        type="number"
        value={value ?? ''}
        placeholder={placeholder}
        min={min}
        step={step}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw === '' ? undefined : Number(raw))
        }}
      />
    </label>
  )
}
