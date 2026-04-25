import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { InstallPrompt } from '@/components/ui/InstallPrompt'
import { useAuthStore } from '@/store/useAuthStore'
import { useStore } from '@/store/useStore'

// Pages
import Auth              from '@/pages/Auth'
import Home              from '@/pages/Home'
import Explore           from '@/pages/Explore'
import ExperienceDetail  from '@/pages/ExperienceDetail'
import HostProfile       from '@/pages/HostProfile'
import CreateExperience  from '@/pages/CreateExperience'
import Bookings          from '@/pages/Bookings'
import ChatRoom          from '@/pages/ChatRoom'
import Notifications     from '@/pages/Notifications'
import Profile           from '@/pages/Profile'

function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const init    = useAuthStore(s => s.init)
  const loading = useAuthStore(s => s.loading)
  const setInstall    = useStore(s => s.setInstallPrompt)
  const darkMode      = useStore(s => s.darkMode)

  useEffect(() => {
    // Sync dark mode with DOM on mount
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstall(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [setInstall])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen-safe bg-white dark:bg-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-charcoal dark:bg-white flex items-center justify-center shadow-card">
            <span className="text-3xl font-bold text-sage" style={{ letterSpacing: '-0.04em' }}>T</span>
          </div>
          <div className="w-5 h-5 border-2 border-charcoal dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 500,
              padding: '12px 16px',
              maxWidth: '360px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
            success: { iconTheme: { primary: '#4A7C6F', secondary: '#FFFFFF' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } },
          }}
        />
        <InstallPrompt />

        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore"           element={<Explore />} />
            <Route path="/experiences/:id"   element={<ExperienceDetail />} />
            <Route path="/hosts/:id"         element={<HostProfile />} />
            <Route path="/create"            element={<ProtectedRoute><CreateExperience /></ProtectedRoute>} />
            <Route path="/bookings"          element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/bookings/:id/chat" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
            <Route path="/notifications"     element={<Notifications />} />
            <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"                  element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
