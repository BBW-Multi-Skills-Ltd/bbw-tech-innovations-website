import { useCallback, useEffect, useRef, useState } from 'react'
import AdminContent from './admin/AdminContent'
import AdminHeader from './admin/AdminHeader'
import AdminTabs from './admin/AdminTabs'
import type { AdminTab } from './admin/adminTabConfig'
import useAdminData from './admin/useAdminData'
import type { AdminIdentity } from '../features/auth/types'

interface Props {
  identity: AdminIdentity
  onSignOut: () => void
}

export default function AdminPanel({ identity, onSignOut }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>('apps')
  const [savedMessage, setSavedMessage] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const toastTimer = useRef<number | null>(null)
  const data = useAdminData()

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  const showSaved = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setSavedMessage(message)
    toastTimer.current = window.setTimeout(() => setSavedMessage(''), 2500)
  }, [])
  const importCurrentContent = async () => {
    setIsImporting(true)
    try { await data.importCurrentContent(); showSaved('Current website content is now in Supabase.') }
    catch { showSaved('Could not import content. Please try again.') }
    finally { setIsImporting(false) }
  }

  return (
    <main className="admin-cms">
      <AdminHeader identity={identity} onSignOut={onSignOut} />
      <div className="admin-cms-body">
        <header className="admin-cms-heading">
          <p className="eyebrow">Content Manager</p>
          <h1>Website content</h1>
          <p>Manage products, client work, reviews, company information, the scrolling strip, and ambient music.</p>
          {data.needsInitialImport && <button type="button" className="btn-primary admin-import-button" onClick={() => void importCurrentContent()} disabled={isImporting}>{isImporting ? 'Importing…' : 'Finish import to Supabase'}</button>}
        </header>
        <AdminTabs active={activeTab} onChange={setActiveTab} isOwner={identity.role === 'owner'} />
        <div className="admin-tab-panel"><AdminContent tab={activeTab} data={data} onSaved={showSaved} /></div>
        <span className="admin-saved-toast" role="status" aria-live="polite">{savedMessage}</span>
      </div>
    </main>
  )
}
