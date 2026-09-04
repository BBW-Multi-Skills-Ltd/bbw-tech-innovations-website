import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import VerificationCodeInput from './VerificationCodeInput'

type Step = 'request' | 'verify' | 'password'

export default function PasswordResetPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setMessage(''); setIsSubmitting(true)
    if (step === 'request') {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      setIsSubmitting(false)
      if (error) return setMessage('We could not send a code. Please try again.')
      return setStep('verify')
    }
    if (step === 'verify') {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' })
      setIsSubmitting(false)
      if (error) return setMessage('That code is invalid or expired. Request a new code.')
      return setStep('password')
    }
    if (password.length < 12) { setIsSubmitting(false); return setMessage('Use at least 12 characters for your new password.') }
    if (password !== confirmPassword) { setIsSubmitting(false); return setMessage('The passwords do not match.') }
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)
    if (error) return setMessage('We could not update your password. Request a new code.')
    navigate('/admin', { replace: true })
  }

  const heading = step === 'request' ? 'Reset your password' : step === 'verify' ? 'Enter your code' : 'Set a new password'
  return (
    <main className="admin-auth-page"><form className="admin-auth-card" onSubmit={submit}>
      <p className="eyebrow">Account security</p><h1>{heading}</h1>
      <p className="admin-auth-copy">{step === 'request' ? 'We will send a six-digit code to your work email.' : step === 'verify' ? `Enter the code sent to ${email}.` : 'Choose a unique password with at least 12 characters.'}</p>
      {step === 'request' && <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label>}
      {step === 'verify' && <VerificationCodeInput value={code} onChange={setCode} />}
      {step === 'password' && <><label>New password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" required /></label><label>Confirm new password<input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" required /></label></>}
      {message && <p className="admin-auth-message" role="status">{message}</p>}
      <button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : step === 'request' ? 'Send code' : step === 'verify' ? 'Verify code' : 'Update password'}</button>
      <Link className="admin-auth-link" to="/admin">Back to sign in</Link>
    </form></main>
  )
}
