import { useState } from 'react'
import { getMusicUrl, saveMusicUrl } from '../../data/store'

export default function MusicManager({ onSaved }: { onSaved: (message: string) => void }) {
  const [musicUrl, setMusicUrl] = useState(getMusicUrl)
  return (
    <section className="admin-music-panel">
      <div className="admin-section-heading"><p className="eyebrow">Site audio</p><h2>Background music</h2><span>Set a direct MP3 or OGG URL for the optional ambient player.</span></div>
      <label className="admin-project-field"><span>Music URL</span><input inputMode="url" value={musicUrl} onChange={event => setMusicUrl(event.target.value)} placeholder="https://example.com/ambient.mp3" /></label>
      <p>Use a direct audio file URL that permits cross-origin playback.</p>
      <button type="button" className="btn-primary" onClick={() => { saveMusicUrl(musicUrl.trim()); onSaved('Music URL saved.') }}>Save music URL</button>
    </section>
  )
}
