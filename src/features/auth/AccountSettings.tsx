import { type ChangeEvent, type FormEvent, useState } from 'react'
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
  const [fullName, setFullName] = useState(identity.fullName)
  const [jobTitle, setJobTitle] = useState(identity.jobTitle)
  const [avatarUrl, setAvatarUrl] = useState(identity.avatarUrl ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !supabase) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setMessage('Use a JPG, PNG, or WebP image under 5 MB.'); return }
    const extension = file.type.split('/')[1] || 'jpg'
    const path = `${identity.user.id}/avatar.${extension}`
    const { error } = await supabase.storage.from('profile-avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (error) { setMessage('Could not upload profile photo. Run the latest CMS migration first.'); return }
    const { data } = supabase.storage.from('profile-avatars').getPublicUrl(path)
    setAvatarUrl(`${data.publicUrl}?v=${Date.now()}`)
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setSavingProfile(true)
    const profile = { full_name: fullName.trim(), job_title: jobTitle.trim(), avatar_url: avatarUrl || null }
    const [profileResult, authResult] = await Promise.all([
      supabase.from('profiles').update(profile).eq('user_id', identity.user.id),
      supabase.auth.updateUser({ data: { full_name: profile.full_name, job_title: profile.job_title } }),
    ])
    setSavingProfile(false)
    if (profileResult.error || authResult.error) { setMessage('Could not save your profile. Please try again.'); return }
    setMessage('Profile saved. Refresh the page to update the header photo and name.')
  }

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

  return <section className="admin-account-settings"><div className="admin-section-heading"><p className="eyebrow">Settings</p><h2>Account</h2><span>Manage your profile, sign-in email, password, and passkeys.</span></div>
    <div className="admin-account-grid"><form className="admin-account-card" onSubmit={saveProfile}><h3>Profile</h3><p>Shown in the Admin header only.</p><div className="admin-avatar-editor">{avatarUrl ? <img src={avatarUrl} alt="Your profile" /> : <span>{fullName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'BB'}</span>}<label>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} /></label></div><label>Full name<input required value={fullName} onChange={event => setFullName(event.target.value)} /></label><label>Job title<input value={jobTitle} onChange={event => setJobTitle(event.target.value)} placeholder="CEO" /></label><button type="submit" className="btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</button></form>
      <div className="admin-account-card"><h3>Sign-in email</h3><p>Signed in as {identity.user.email}.</p>{!awaitingCode ? <form onSubmit={requestChange}><label>New email<input type="email" value={newEmail} onChange={event => setNewEmail(event.target.value)} required /></label><label>Current password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button type="submit" className="btn-primary">Send verification code</button></form> : <form onSubmit={verifyChange}><VerificationCodeInput value={code} onChange={setCode} label="Code sent to new email" /><button type="submit" className="btn-primary">Confirm new email</button></form>}<Link className="admin-auth-link" to="/admin/reset-password">Change password with a code</Link><PasskeySettings /></div>
    </div>{message && <p className="admin-auth-message" role="status">{message}</p>}
  </section>
}
