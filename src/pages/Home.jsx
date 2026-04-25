import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MapPin, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ExperienceCard } from '@/components/experience/ExperienceCard'
import { FilterBar } from '@/components/experience/FilterBar'
import { ExperienceCardSkeleton } from '@/components/ui/Skeleton'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/useAuthStore'
import { useStore } from '@/store/useStore'
import { mockExperiences } from '@/lib/mockData'

export default function Home() {
  const user      = useAuthStore(s => s.user)
  const filters   = useStore(s => s.filters)
  const clearFilters = useStore(s => s.clearFilters)
  const unread    = useStore(s => s.unreadCount)
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buongiorno'
    if (h < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }

  const filtered = useMemo(() => {
    let list = [...mockExperiences]
    if (filters.category) list = list.filter(e => e.category === filters.category)
    if (filters.maxPrice)  list = list.filter(e => e.price <= filters.maxPrice)
    if (filters.maxDistance < 10) list = list.filter(e => (e.distance ?? 0) <= filters.maxDistance)
    return list.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99))
  }, [filters, refreshKey])

  const handleRefresh = () => {
    setLoading(true)
    return new Promise(r => setTimeout(() => { setLoading(false); setRefreshKey(k => k + 1); r() }, 1200))
  }

  return (
    <div className="flex flex-col min-h-full bg-warm-50">
      {/* Sticky header */}
      <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sage">
              {greeting()}
            </p>
            <h1 className="text-2xl font-bold text-charcoal mt-0.5">
              {user?.full_name?.split(' ')[0] ?? 'Ciao'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-warm hover:bg-warm-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-charcoal" strokeWidth={1.8} />
              <AnimatePresence>
                {unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-sage ring-2 ring-white"
                  />
                )}
              </AnimatePresence>
            </motion.button>
            <Avatar
              src={user?.avatar_url}
              name={user?.full_name}
              size="sm"
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Location chip */}
        <div className="flex items-center gap-1.5 text-sm text-charcoal-400 pb-3">
          <MapPin className="w-3.5 h-3.5 text-sage flex-shrink-0" />
          <span className="font-medium text-charcoal">{user?.city ?? 'Milano'}</span>
          <span className="text-charcoal-200">·</span>
          <span>nelle vicinanze</span>
        </div>

        {/* Filter bar */}
        <div className="border-t border-charcoal-100">
          <FilterBar />
        </div>
      </div>

      {/* Feed with pull-to-refresh */}
      <div className="flex-1 px-4 py-4">
        {/* Pull to refresh hint */}
        <div
          className="flex items-center gap-2 text-xs text-charcoal-300 mb-4 cursor-pointer select-none"
          onClick={handleRefresh}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-sage' : ''}`} />
          <span>{filters.category
            ? `${filtered.length} esperienz${filtered.length === 1 ? 'a' : 'e'} · ${filters.category}`
            : `${filtered.length} esperienze vicino a te`}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <ExperienceCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <motion.div layout className="space-y-4">
            {filtered.map((exp, i) => (
              <ExperienceCard key={exp.id} experience={exp} index={i} />
            ))}
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="text-lg font-semibold text-charcoal mb-2">Nessuna esperienza trovata</h3>
      <p className="text-sm text-charcoal-400 mb-6 max-w-xs">
        Prova a modificare i filtri o espandere la distanza.
      </p>
      <button onClick={onClear} className="text-sm font-semibold text-sage underline">
        Rimuovi filtri
      </button>
    </motion.div>
  )
}
