import { useEffect, useRef, useState } from 'react'
import AdminContent from './admin/AdminContent'
import AdminHeader from './admin/AdminHeader'
import AdminTabs from './admin/AdminTabs'
import type { AdminTab } from './admin/adminTabConfig'
import useAdminData from './admin/useAdminData'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('apps')
  const [savedMessage, setSavedMessage] = useState('')
  const toastTimer = useRef<number | null>(null)
  const data = useAdminData()

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  const showSaved = (message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setSavedMessage(message)
    toastTimer.current = window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <main className="admin-cms">
      <AdminHeader />
      <div className="admin-cms-body">
        <header className="admin-cms-heading">
          <p className="eyebrow">Content Manager</p>
          <h1>Website content</h1>
          <p>Manage products, client work, reviews, company information, the scrolling strip, and ambient music.</p>
        </header>
        <AdminTabs active={activeTab} onChange={setActiveTab} />
        <div className="admin-tab-panel"><AdminContent tab={activeTab} data={data} onSaved={showSaved} /></div>
        <span className="admin-saved-toast" role="status" aria-live="polite">{savedMessage}</span>
      </div>
    </main>
  )
}
