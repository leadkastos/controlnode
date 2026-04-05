import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading, isAdmin, isActive, isBanned } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-yellow-500 text-xl">Loading...</div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (isBanned) return <Navigate to="/banned" replace />
  if (!isActive) return <Navigate to="/expired" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />

  return children
}
