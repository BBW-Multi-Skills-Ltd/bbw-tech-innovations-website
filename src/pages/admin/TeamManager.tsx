import { type FormEvent, useCallback, useEffect, useState } from 'react'
import type { CmsRole } from '../../features/auth/types'
import { supabase } from '../../lib/supabase'

type Member = { userId: string; fullName: string; jobTitle: string; role: CmsRole }
const assignableRoles: Exclude<CmsRole, 'owner'>[] = ['admin', 'editor', 'viewer']

export default function TeamManager({ onSaved }: { onSaved: (message: string) => void }) {
  const [members, setMembers] = useState<Member[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [form, setForm] = useState({ fullName: '', jobTitle: '', email: '', role: 'editor' as Exclude<CmsRole, 'owner'> })

  const load = useCallback(async () => {
    if (!supabase) return
    const [profiles, roles] = await Promise.all([
      supabase.from('profiles').select('user_id, full_name, job_title'),
      supabase.from('cms_user_roles').select('user_id, role'),
    ])
    if (profiles.error || roles.error) return onSaved('Could not load team members.')
    const roleById = new Map((roles.data as { user_id: string; role: CmsRole }[]).map(item => [item.user_id, item.role]))
    setMembers((profiles.data as { user_id: string; full_name: string; job_title: string }[])
      .flatMap(profile => roleById.has(profile.user_id) ? [{ userId: profile.user_id, fullName: profile.full_name, jobTitle: profile.job_title, role: roleById.get(profile.user_id)! }] : []))
  }, [onSaved])

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer) }, [load])

  const updateRole = async (member: Member, role: Exclude<CmsRole, 'owner'>) => {
    if (!supabase) return
    const { error } = await supabase.from('cms_user_roles').upsert({ user_id: member.userId, role })
    if (error) return onSaved('Could not update the role.')
    await load(); onSaved(`${member.fullName || 'Team member'} is now ${role}.`)
  }

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setIsSending(true)
    const { error } = await supabase.functions.invoke('invite-cms-user', { body: form })
    setIsSending(false)
    if (error) return onSaved('Invitation could not be sent. Configure SMTP before inviting external staff.')
    setForm({ fullName: '', jobTitle: '', email: '', role: 'editor' }); setShowInvite(false)
    await load(); onSaved('Invitation sent and access role assigned.')
  }

  return (
    <section>
      <div className="admin-section-heading"><p className="eyebrow">Owner controls</p><h2>Team access</h2><span>Invite staff, then choose what level of CMS access they receive. Passwords are never visible or managed here.</span></div>
      <button type="button" className="btn-primary" onClick={() => setShowInvite(value => !value)}>{showInvite ? 'Close invitation' : '+ Invite team member'}</button>
      {showInvite && <form className="admin-project-form admin-team-invite" onSubmit={invite}>
        <label><span>Full name</span><input required value={form.fullName} onChange={event => setForm({ ...form, fullName: event.target.value })} /></label>
        <label><span>Job title</span><input required value={form.jobTitle} onChange={event => setForm({ ...form, jobTitle: event.target.value })} /></label>
        <label><span>Email</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
        <label><span>Access role</span><select value={form.role} onChange={event => setForm({ ...form, role: event.target.value as Exclude<CmsRole, 'owner'> })}>{assignableRoles.map(role => <option key={role} value={role}>{role}</option>)}</select></label>
        <button type="submit" className="btn-primary" disabled={isSending}>{isSending ? 'Sending…' : 'Send invitation'}</button>
      </form>}
      <div className="admin-team-list">{members.map(member => <article key={member.userId} className="admin-team-member"><div><strong>{member.fullName || 'Unnamed team member'}</strong><span>{member.jobTitle || 'No job title'}</span></div>{member.role === 'owner' ? <span className="admin-local-badge">Owner</span> : <select value={member.role} onChange={event => void updateRole(member, event.target.value as Exclude<CmsRole, 'owner'>)}>{assignableRoles.map(role => <option key={role} value={role}>{role}</option>)}</select>}</article>)}</div>
    </section>
  )
}
