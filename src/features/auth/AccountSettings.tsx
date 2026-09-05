import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AdminIdentity } from './types'
import { supabase } from '../../lib/supabase'
import VerificationCodeInput from './VerificationCodeInput'
import PasskeySettings from './PasskeySettings'

export default function AccountSettings({ identity }: { identity: AdminIdentity }) {
  const navigate = useNavigate()
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [awaitingCode, setAwaitingCode] = useState(false)
  const [message, setMessage] = useState('')

  const requestChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase || !identity.user.email) return
    const signIn = await supabase.auth.signInWithPassword({ email: identity.user.email, password })
    if (signIn.error) return setMessage('Your current password is incorrect.')
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    if (error) return setMessage('We could not send an email-change code. Try again.')
    setAwaitingCode(true); setMessage('A six-digit code was sent to the new email address.')
  }

  const verifyChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    const { error } = await supabase.auth.verifyOtp({ email: newEmail.trim(), token: code, type: 'email_change' })
    if (error) return setMessage('That code is invalid or expired.')
    await supabase.auth.refreshSession(); navigate('/admin', { replace: true })
  }

  return <main className="admin-auth-page"><section className="admin-auth-card"><p className="eyebrow">Account settings</p><h1>Security and email</h1><p className="admin-auth-copy">Signed in as {identity.user.email}.</p>
    {!awaitingCode ? <form onSubmit={requestChange}><label>New email<input type="email" value={newEmail} onChange={event => setNewEmail(event.target.value)} required /></label><label>Current password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button type="submit" className="admin-auth-submit">Send verification code</button></form> : <form onSubmit={verifyChange}><VerificationCodeInput value={code} onChange={setCode} label="Code sent to new email" /><button type="submit" className="admin-auth-submit">Confirm new email</button></form>}
    {message && <p className="admin-auth-message" role="status">{message}</p>}<Link className="admin-auth-link" to="/admin/reset-password">Change password with a code</Link><Link className="admin-auth-link" to="/admin">Back to admin</Link>
    <PasskeySettings />
  </section></main>
}
