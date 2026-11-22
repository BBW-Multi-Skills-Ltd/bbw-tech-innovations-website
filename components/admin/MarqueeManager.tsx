import type { Dispatch, SetStateAction } from 'react'

export default function MarqueeManager({ items, setItems, onSave, onSaved }: { items: string[]; setItems: Dispatch<SetStateAction<string[]>>; onSave: (items: string[]) => Promise<void>; onSaved: (message: string) => void }) {
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    setItems(current => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }
  const save = async () => {
    const cleaned = items.map(item => item.trim()).filter(Boolean)
    try { await onSave(cleaned); setItems(cleaned); onSaved('Scrolling strip saved to Supabase.') }
    catch { onSaved('Could not save scrolling strip. Please try again.') }
  }
  return (
    <section>
      <div className="admin-section-heading"><p className="eyebrow">Homepage strip</p><h2>Scrolling strip</h2><span>Add, rename, reorder, or remove the labels that scroll horizontally below the hero.</span></div>
      <div className="admin-marquee-list">
        {items.map((item, index) => (
          <div key={index} className="admin-marquee-row">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <input value={item} aria-label={`Scrolling label ${index + 1}`} onChange={event => setItems(current => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} />
            <div>
              <button type="button" aria-label={`Move ${item} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
              <button type="button" aria-label={`Move ${item} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button>
              <button type="button" className="is-danger" aria-label={`Remove ${item}`} onClick={() => setItems(current => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-marquee-actions"><button type="button" className="admin-secondary-button" onClick={() => setItems(current => [...current, 'New item'])}>+ Add item</button><button type="button" className="btn-primary" onClick={save}>Save scrolling strip</button></div>
    </section>
  )
}
