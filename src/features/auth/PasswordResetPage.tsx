import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function PasswordResetPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    if (password.length < 12) return setMessage('Use at least 12 characters for your new password.')
    if (password !== confirmPassword) return setMessage('The passwords do not match.')
    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)
    if (error) return setMessage('This reset link is invalid or has expired. Request another one.')
    navigate('/admin', { replace: true })
  }

  return (
    <main className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={updatePassword}>
        <p className="eyebrow">Account security</p>
        <h1>Set a new password</h1>
        <p className="admin-auth-copy">Choose a unique password with at least 12 characters.</p>
        <label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></label>
        <label>Confirm new password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required /></label>
        {message && <p className="admin-auth-message" role="status">{message}</p>}
        <button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Updating…' : 'Update password'}</button>
        <Link className="admin-auth-link" to="/admin">Back to sign in</Link>
      </form>
    </main>
  )
}
