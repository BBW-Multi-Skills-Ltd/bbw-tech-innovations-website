import { useCallback, useEffect, useRef, useState } from 'react'
import AdminContent from './admin/AdminContent'
import AdminHeader from './admin/AdminHeader'
import type { AdminTab } from './admin/adminTabConfig'
import AdminSidebar from './admin/AdminSidebar'
import useAdminData from './admin/useAdminData'
import type { AdminIdentity } from '../features/auth/types'
import useTheme from '../hooks/useTheme'
import MusicPlayer from '../components/MusicPlayer'
import { useLocation } from 'react-router-dom'

interface Props { identity: AdminIdentity; onSignOut: () => void }

export default function AdminPanel({ identity, onSignOut }: Props) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<AdminTab>(() => location.pathname === '/admin/account' ? 'account' : 'home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [savedMessageIsError, setSavedMessageIsError] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const toastTimer = useRef<number | null>(null)
  const data = useAdminData()
  const { dark, toggleTheme } = useTheme()

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current) }, [])

  const showSaved = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setSavedMessageIsError(/\b(could not|failed|error|invalid|requires|only be added)\b/i.test(message))
    setSavedMessage(message)
    toastTimer.current = window.setTimeout(() => setSavedMessage(''), 2500)
  }, [])

  const importCurrentContent = async () => {
    setIsImporting(true)
    try { await data.importCurrentContent(); showSaved('Current website content is now in Supabase.') }
    catch { showSaved('Could not import content. Please try again.') }
    finally { setIsImporting(false) }
  }

  return <main className="admin-cms">
    <AdminHeader identity={identity} onSignOut={onSignOut} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(value => !value)} dark={dark} onToggleTheme={toggleTheme} onOpenAccount={() => setActiveTab('account')} />
    <div className={`admin-cms-shell${sidebarCollapsed ? ' is-collapsed' : ''}`}>
      <AdminSidebar active={activeTab} collapsed={sidebarCollapsed} role={identity.role} onChange={setActiveTab} onToggle={() => setSidebarCollapsed(value => !value)} />
      <div className="admin-cms-body">
        {data.needsInitialImport && <header className="admin-cms-heading"><p className="eyebrow">Migration required</p><h1>Finish moving content to Supabase.</h1><p>Your previous local content is ready to be imported into the CMS.</p><button type="button" className="btn-primary admin-import-button" onClick={() => void importCurrentContent()} disabled={isImporting}>{isImporting ? 'Importing...' : 'Finish import to Supabase'}</button></header>}
        <div className="admin-tab-panel"><AdminContent tab={activeTab} data={data} onSaved={showSaved} identity={identity} onNavigate={setActiveTab} /></div>
      </div>
      <span className={`admin-saved-toast${savedMessageIsError ? ' is-error' : ''}`} role="status" aria-live="polite">{savedMessage}</span>
    </div>
    <MusicPlayer url={data.musicUrl} />
  </main>
}
