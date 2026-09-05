import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SeoMetadata from './components/seo/SeoMetadata'
import HomePage from './pages/HomePage'

const AdminRouteBoundary = lazy(() => import('./pages/admin/AdminRouteBoundary'))
const PasswordResetPage = lazy(() => import('./features/auth/PasswordResetPage'))
const AcceptInvitationPage = lazy(() => import('./features/auth/AcceptInvitationPage'))
const ConfirmEmailPage = lazy(() => import('./features/auth/ConfirmEmailPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const loading = <div className="route-loader">Loading…</div>

function PrivateRoute({ children }: { children: ReactNode }) {
  return <><SeoMetadata noIndex title="Admin | BBW Tech Innovations" />{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><SeoMetadata /><HomePage /></>} />
      <Route path="/admin" element={<PrivateRoute><Suspense fallback={loading}><AdminRouteBoundary /></Suspense></PrivateRoute>} />
      <Route path="/admin/account" element={<PrivateRoute><Suspense fallback={loading}><AdminRouteBoundary /></Suspense></PrivateRoute>} />
      <Route path="/admin/reset-password" element={<PrivateRoute><Suspense fallback={loading}><PasswordResetPage /></Suspense></PrivateRoute>} />
      <Route path="/admin/accept-invite" element={<PrivateRoute><Suspense fallback={loading}><AcceptInvitationPage /></Suspense></PrivateRoute>} />
      <Route path="/admin/confirm-email" element={<PrivateRoute><Suspense fallback={loading}><ConfirmEmailPage /></Suspense></PrivateRoute>} />
      <Route path="/privacy" element={<><SeoMetadata path="/privacy" title="Privacy Policy | BBW Tech Innovations" description="Read the BBW Tech Innovations Privacy Policy." /><Suspense fallback={loading}><PrivacyPolicyPage /></Suspense></>} />
      <Route path="/cms" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
