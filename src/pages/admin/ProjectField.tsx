import type { ReactNode } from 'react'

export default function ProjectField({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={full ? 'admin-project-field admin-project-field-full' : 'admin-project-field'}><span>{label}</span>{children}</label>
}
