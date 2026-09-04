import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setMessage(''); setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)
    setMessage(error ? 'Email or password is incorrect, or your email is not confirmed.' : '')
  }

  return (
    <main className="admin-auth-page"><form className="admin-auth-card" onSubmit={signIn}>
      <img src="/logos/bbwlogo.png" alt="BBW" className="admin-auth-logo" />
      <p className="eyebrow">BBW Tech Innovations</p><h1>Admin sign in</h1>
      <p className="admin-auth-copy">Use your assigned work email. Access is managed by the BBW owner.</p>
      <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label>
      <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>
      {message && <p className="admin-auth-message" role="status">{message}</p>}
      <button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Sign in'}</button>
      <Link className="admin-auth-link" to="/admin/reset-password">Forgot password?</Link>
      <Link className="admin-auth-link" to="/admin/accept-invite">Accept invitation</Link>
    </form></main>
  )
}
