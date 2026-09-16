interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'date' | 'url'
  required?: boolean
}

export function TextField({ label, value, onChange, placeholder, type = 'text', required }: TextFieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="field__input"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
