import type { SocialLink } from '../../data/socialLinks'
import { detectSocialPlatform, SOCIAL_PLATFORMS } from '../../data/socialLinks'

interface Props {
  links: SocialLink[]
  setLinks: (links: SocialLink[]) => void
  onSave: (links: SocialLink[]) => Promise<void>
  onSaved: (message: string) => void
}

export default function SocialLinksManager({ links, setLinks, onSave, onSaved }: Props) {
  const update = (id: string, patch: Partial<SocialLink>) => setLinks(links.map(link => link.id === id ? { ...link, ...patch } : link))
  const add = () => setLinks([...links, { id: `social-${Date.now()}`, platform: 'instagram', url: '', isEnabled: true }])
  const save = () => {
    const valid = links.filter(link => link.platform.trim() && link.url.trim())
    void onSave(valid).then(() => onSaved('Social links saved to Supabase.')).catch(error => onSaved(error instanceof Error ? error.message : 'Could not save social links.'))
  }

  return (
    <section>
      <div className="admin-section-heading"><p className="eyebrow">Footer</p><h2>Social links</h2><span>Manage the social profiles displayed in the website footer. The correct brand icon is selected automatically from the platform or URL.</span></div>
      <div className="admin-social-list">
        {links.map(link => <div className="admin-social-row" key={link.id}>
          <select aria-label="Social platform" value={link.platform} onChange={event => update(link.id, { platform: event.target.value })}>{SOCIAL_PLATFORMS.map(platform => <option key={platform} value={platform}>{platform === 'x' ? 'X (Twitter)' : platform[0].toUpperCase() + platform.slice(1)}</option>)}</select>
          <input aria-label={`${link.platform} URL`} type="url" placeholder="https://…" value={link.url} onChange={event => update(link.id, { url: event.target.value, platform: detectSocialPlatform(event.target.value) })} />
          <label><input type="checkbox" checked={link.isEnabled} onChange={event => update(link.id, { isEnabled: event.target.checked })} />Visible</label>
          <button type="button" className="admin-secondary-button" onClick={() => setLinks(links.filter(item => item.id !== link.id))}>Remove</button>
        </div>)}
      </div>
      <div className="admin-social-actions"><button type="button" className="admin-secondary-button" onClick={add}>+ Add platform</button><button type="button" className="btn-primary" onClick={save}>Save social links</button></div>
    </section>
  )
}
