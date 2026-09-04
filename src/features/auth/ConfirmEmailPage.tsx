import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import VerificationCodeInput from './VerificationCodeInput'

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setIsSubmitting(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setIsSubmitting(false)
    setMessage(error ? 'That code is invalid or expired.' : 'Email confirmed. You can now sign in.')
  }
  return <main className="admin-auth-page"><form className="admin-auth-card" onSubmit={submit}>
    <p className="eyebrow">BBW Tech Innovations</p><h1>Confirm your email</h1><p className="admin-auth-copy">Enter the six-digit code sent to your email.</p>
    <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><VerificationCodeInput value={code} onChange={setCode} />
    {message && <p className="admin-auth-message" role="status">{message}</p>}<button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Verifying…' : 'Confirm email'}</button><Link className="admin-auth-link" to="/admin">Back to sign in</Link>
  </form></main>
}
