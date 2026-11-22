interface Props {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function VerificationCodeInput({ value, onChange, label = 'Six-digit code' }: Props) {
  return (
    <label>
      {label}
      <input
        className="auth-code-input"
        value={value}
        onChange={event => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="000000"
        required
      />
    </label>
  )
}
