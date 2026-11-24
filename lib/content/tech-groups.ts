/**
 * Technologies grouped by what they do for a client (approved by the owner,
 * Nov 2026). The admin keeps one flat list of words (Admin → Technologies);
 * this sorts them into groups. A word that isn't listed here goes to a last
 * "More tools" group, so nothing added in the admin disappears; "And more"
 * stays at the very end.
 */
const GROUPS: { label: string; items: string[] }[] = [
  { label: 'Mobile apps', items: ['React Native', 'Firebase'] },
  { label: 'Websites & web apps', items: ['React', 'Next.js', 'TypeScript', 'Vite', 'Tailwind CSS', 'DaisyUI'] },
  { label: 'Backend & data', items: ['Node.js', 'Express', 'Python', 'MongoDB', 'Supabase', 'BullMQ'] },
  { label: 'Cloud & hosting', items: ['Vercel', 'AWS', 'Render', 'Cloudinary', 'GitHub'] },
  { label: 'Payments, messaging & automation', items: ['Paystack', 'Stripe', 'WhatsApp', 'Resend', 'n8n', 'Zapier'] },
  { label: 'Design', items: ['Figma', 'Relume'] },
]

const key = (word: string) => word.trim().toLowerCase()
const isAndMore = (word: string) => key(word) === 'and more'

/** The admin's technologies as groups, in the groups' order (empty groups left out). */
export function groupTechnologies(technologies: string[]) {
  const words = technologies.map(word => word.trim()).filter(Boolean)
  const placed = new Set<string>()
  const groups = GROUPS.map(group => {
    const items = group.items.filter(item => words.some(word => key(word) === key(item)))
    items.forEach(item => placed.add(key(item)))
    return { label: group.label, items }
  }).filter(group => group.items.length)
  const others = words.filter(word => !placed.has(key(word)) && !isAndMore(word))
  if (others.length) groups.push({ label: 'More tools', items: others })
  return { groups, andMore: words.some(isAndMore) }
}
