import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Enquiry = { id: string; kind: 'message' | 'video'; name: string; email: string; phone: string; message: string | null; video_path: string | null; status: 'new' | 'reviewing' | 'contacted' | 'archived'; created_at: string }

const statuses: Enquiry['status'][] = ['new', 'reviewing', 'contacted', 'archived']

export default function EnquiriesManager({ onSaved }: { onSaved: (message: string) => void }) {
  const [items, setItems] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    void supabase.from('enquiries').select('id,kind,name,email,phone,message,video_path,status,created_at').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) onSaved('Could not load enquiries.')
      else setItems((data ?? []) as Enquiry[])
      setLoading(false)
    })
  }, [onSaved])

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    if (!supabase) return
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
    if (error) { onSaved('Could not update this enquiry.'); return }
    setItems(current => current.map(item => item.id === id ? { ...item, status } : item))
    onSaved('Enquiry status updated.')
  }

  const viewVideo = async (path: string) => {
    if (!supabase) return
    const { data, error } = await supabase.storage.from('enquiry-videos').createSignedUrl(path, 60 * 10)
    if (error || !data?.signedUrl) { onSaved('Could not open the private video.'); return }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section>
      <div className="admin-section-heading"><p className="eyebrow">Inbox</p><h2>Website enquiries</h2><span>Messages and video pitches submitted through the website. Videos remain private and their viewing link expires after 10 minutes.</span></div>
      {loading ? <p className="admin-empty-state">Loading enquiries…</p> : items.length === 0 ? <p className="admin-empty-state">No enquiries yet.</p> : <div className="admin-enquiry-list">{items.map(item => <article className="admin-enquiry-card" key={item.id}>
        <div className="admin-enquiry-meta"><strong>{item.name}</strong><span>{new Date(item.created_at).toLocaleString()}</span><span>{item.email} · {item.phone}</span></div>
        <p>{item.kind === 'message' ? item.message : 'Video enquiry submitted.'}</p>
        <div className="admin-enquiry-actions">{item.video_path && <button className="btn-secondary" type="button" onClick={() => void viewVideo(item.video_path!)}>View private video</button>}<label>Status<select value={item.status} onChange={event => void updateStatus(item.id, event.target.value as Enquiry['status'])}>{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select></label></div>
      </article>)}</div>}
    </section>
  )
}
