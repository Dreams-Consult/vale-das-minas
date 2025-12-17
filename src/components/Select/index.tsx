import './index.css'

type SelectProps = {
  label?: string,
  name?: string,
  value?: string,
  placeholder?: string,
  errorMessage?: string,
  options: { value: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

export function Select({label, name, value, placeholder, errorMessage, options, onChange, onBlur}: SelectProps) {
  return (
    <div className={`selectField ${errorMessage ? 'error' : ''}`}>
      {label && (<label>{label}</label>)}
      <select name={name} value={value} onChange={onChange} onBlur={onBlur}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (<span className="error">{errorMessage}</span>)}
    </div>
  )
}
