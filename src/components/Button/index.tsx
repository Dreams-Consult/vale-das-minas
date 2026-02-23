import './index.css'

type ButtonProps = {
  fullWidth?: boolean,
  text: string,
  disabled?: boolean,
  onClick(): void
}

function Button({fullWidth = false, text, disabled = false, onClick}:ButtonProps) {

  return (
    <button className='button' style={{width: `${fullWidth ? '100%' : ''}`}} onClick={onClick} disabled={disabled}>{text}</button>
  )
}

export { Button }
