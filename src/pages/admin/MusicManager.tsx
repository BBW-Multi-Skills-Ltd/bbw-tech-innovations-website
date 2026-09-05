import { useState } from 'react'
import CloudinaryMediaUpload from './CloudinaryMediaUpload'

interface Props {
  value: string
  onSave: (url: string) => Promise<void>
  onSaved: (message: string) => void
}

export default function MusicManager({ value, onSave, onSaved }: Props) {
  const [musicUrl, setMusicUrl] = useState(value)
  const save = async () => {
    try { await onSave(musicUrl.trim()); onSaved('Music URL saved to Supabase.') }
    catch { onSaved('Could not save music URL. Please try again.') }
  }
  return (
    <section className="admin-music-panel">
      <div className="admin-section-heading"><p className="eyebrow">Site audio</p><h2>Background music</h2><span>Set a direct MP3 or OGG URL for the optional ambient player.</span></div>
      <label className="admin-project-field"><span>Music URL</span><input inputMode="url" value={musicUrl} onChange={event => setMusicUrl(event.target.value)} placeholder="https://example.com/ambient.mp3" /></label>
      <CloudinaryMediaUpload assetType="audio" value={musicUrl} onChange={setMusicUrl} />
      <p>Use a licensed MP3 or OGG file. Cloudinary upload creates a direct URL that works for visitors.</p>
      <button type="button" className="btn-primary" onClick={() => void save()}>Save music URL</button>
    </section>
  )
}
