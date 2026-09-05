import type { Dispatch, SetStateAction } from 'react'

interface Props { items: string[]; setItems: Dispatch<SetStateAction<string[]>>; onSave: (items: string[]) => Promise<void>; onSaved: (message: string) => void }

export default function TechnologyManager({ items, setItems, onSave, onSaved }: Props) {
  const move = (index: number, direction: -1 | 1) => setItems(current => {
    const target = index + direction
    if (target < 0 || target >= current.length) return current
    const next = [...current]; [next[index], next[target]] = [next[target], next[index]
    ]; return next
  })
  const save = async () => {
    const cleaned = items.map(item => item.trim()).filter(Boolean)
    try { await onSave(cleaned); onSaved('Technologies saved to Supabase.') } catch { onSaved('Could not save technologies. Please try again.') }
  }
  return <section>
    <div className="admin-section-heading"><p className="eyebrow">Marketplace</p><h2>Technologies we work with</h2><span>Maintain the technology labels shown in the public website section.</span></div>
    <div className="admin-marquee-list">{items.map((item, index) => <div className="admin-marquee-row" key={`${item}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><input value={item} aria-label={`Technology ${index + 1}`} onChange={event => setItems(current => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} /><div><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button><button type="button" className="is-danger" onClick={() => setItems(current => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></div>)}</div>
    <div className="admin-marquee-actions"><button type="button" className="admin-secondary-button" onClick={() => setItems(current => [...current, 'New technology'])}>+ Add technology</button><button type="button" className="btn-primary" onClick={() => void save()}>Save technologies</button></div>
  </section>
}
