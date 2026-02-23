import './index.css'

type InputProps = {
  label?: string,
  name?: string,
  type?: string,
  text?: string,
  placeholder?: string,
  errorMessage?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TextField({label, name, type, text, placeholder, errorMessage, onChange, onBlur, onKeyDown}:InputProps) {
  return (
    <div className={`textField ${errorMessage ? 'error' : ''}`}>
      {label ?? (<label>{label}</label>)}
      <input name={name} type={type} value={text ? text : ''} placeholder={placeholder} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
      {errorMessage ?? (<span>{errorMessage}</span>)}
    </div>
  )
}
