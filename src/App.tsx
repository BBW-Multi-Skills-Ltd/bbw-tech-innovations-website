import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

const AdminRouteBoundary = lazy(() => import('./pages/admin/AdminRouteBoundary'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<Suspense fallback={<div className="route-loader">Loading admin…</div>}><AdminRouteBoundary /></Suspense>} />
      <Route path="/cms" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
