interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

export function Select({ label, value, onChange, options, placeholder, required }: SelectProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select
        className="field__input"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
