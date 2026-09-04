import { type FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setMessage('')
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)
    setMessage(error ? 'Email or password is incorrect, or your email is not confirmed.' : '')
  }

  const resetPassword = async () => {
    if (!supabase || !email) return setMessage('Enter your email address first, then select Forgot password.')
    setIsSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    setIsSubmitting(false)
    setMessage(error ? 'We could not send a reset email. Please try again.' : 'Password reset email sent. Check your inbox.')
  }

  return (
    <main className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={signIn}>
        <img src="/logos/bbwlogo.png" alt="BBW" className="admin-auth-logo" />
        <p className="eyebrow">BBW Tech Innovations</p>
        <h1>Admin sign in</h1>
        <p className="admin-auth-copy">Use your assigned work email. Access is managed by the BBW owner.</p>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {message && <p className="admin-auth-message" role="status">{message}</p>}
        <button type="submit" className="admin-auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Sign in'}</button>
        <button type="button" className="admin-auth-link" onClick={() => void resetPassword()} disabled={isSubmitting}>Forgot password?</button>
      </form>
    </main>
  )
}
