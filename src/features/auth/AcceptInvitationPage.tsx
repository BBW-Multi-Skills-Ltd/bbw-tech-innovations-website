import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import VerificationCodeInput from './VerificationCodeInput'

export default function AcceptInvitationPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'code' | 'password'>('code')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setMessage(''); setIsSubmitting(true)
    if (step === 'code') {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'invite' })
      setIsSubmitting(false)
      if (error) return setMessage('That invitation code is invalid or expired.')
      return setStep('password')
    }
    if (password.length < 12) { setIsSubmitting(false); return setMessage('Use at least 12 characters for your password.') }
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)
    if (error) return setMessage('Could not finish account setup. Try a new invitation code.')
    navigate('/admin', { replace: true })
  }

  return <main className="admin-auth-page"><form className="admin-auth-card" onSubmit={submit}>
    <p className="eyebrow">BBW Team</p><h1>{step === 'code' ? 'Accept invitation' : 'Create your password'}</h1>
    <p className="admin-auth-copy">{step === 'code' ? 'Enter the email and six-digit code from your invitation email.' : 'Create a secure password for your BBW CMS account.'}</p>
    {step === 'code' && <><label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><VerificationCodeInput value={code} onChange={setCode} /></>}
    {step === 'password' && <label>New password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" required /></label>}
    {message && <p className="admin-auth-message" role="status">{message}</p>}
    <button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : step === 'code' ? 'Verify code' : 'Finish setup'}</button>
    <Link className="admin-auth-link" to="/admin">Back to sign in</Link>
  </form></main>
}
