export default function ScrollingStrip({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="overflow-hidden border-y border-bbw-border py-3.5">
      <div className="marquee-track">
        {[...items, ...items].map((label, index) => (
          <span key={`${index}-${label}`} className="mr-12 inline-flex items-center gap-12 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-bbw-muted uppercase">
            {label}<span className="text-[8px] text-bbw-accent opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
