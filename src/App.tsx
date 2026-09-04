import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

const AdminRouteBoundary = lazy(() => import('./pages/admin/AdminRouteBoundary'))
const PasswordResetPage = lazy(() => import('./features/auth/PasswordResetPage'))
const loading = <div className="route-loader">Loading…</div>

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<Suspense fallback={loading}><AdminRouteBoundary /></Suspense>} />
      <Route path="/admin/reset-password" element={<Suspense fallback={loading}><PasswordResetPage /></Suspense>} />
      <Route path="/cms" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
