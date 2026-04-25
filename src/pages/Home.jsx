import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ExperienceCard, ExperienceCardHero } from '@/components/experience/ExperienceCard'
import { ExperienceCardSkeleton } from '@/components/ui/Skeleton'
import { useStore } from '@/store/useStore'
import { mockExperiences } from '@/lib/mockData'
import { CATEGORIES } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Home() {
  const unread   = useStore(s => s.unreadCount)
  const navigate = useNavigate()
  const [loading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  const featured = mockExperiences[0]
  const nearby   = useMemo(() => {
    const rest = mockExperiences.slice(1)
    if (!activeCategory) return rest
    return rest.filter(e => e.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="bg-white min-h-full">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-5 pt-[calc(env(safe-area-inset-top)+14px)] pb-3">
        <div className="flex items-center justify-between">
          <span
            className="text-[24px] font-bold text-charcoal"
            style={{ letterSpacing: '-0.04em' }}
          >
            tacto
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-warm-100"
            >
              <Bell className="w-[18px] h-[18px] text-charcoal" strokeWidth={1.7} />
              <AnimatePresence>
                {unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sage ring-2 ring-white"
                  />
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/explore')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-100"
            >
              <Search className="w-[18px] h-[18px] text-charcoal" strokeWidth={1.7} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hero featured */}
      <div className="mb-6">
        {loading
          ? <div className="mx-4"><ExperienceCardSkeleton size="lg" /></div>
          : <ExperienceCardHero experience={featured} />
        }
      </div>

      {/* Category pills */}
      <div className="mb-5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-5 pb-1">
          <CategoryPill
            label="Tutti"
            active={!activeCategory}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.id}
              label={cat.label}
              emoji={cat.emoji}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(c => c === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-charcoal-300">
            {activeCategory
              ? CATEGORIES.find(c => c.id === activeCategory)?.label
              : 'Vicino a te'}
          </h2>
          <span className="text-[11px] text-charcoal-300 font-medium">
            {nearby.length} {nearby.length === 1 ? 'esperienza' : 'esperienze'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => <ExperienceCardSkeleton key={i} size="sm" />)}
          </div>
        ) : nearby.length === 0 ? (
          <EmptyState onClear={() => setActiveCategory(null)} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {nearby.map((exp, i) => (
              <ExperienceCard key={exp.id} experience={exp} index={i} size="sm" />
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}

function CategoryPill({ label, emoji, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        'flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-semibold transition-all duration-150',
        active ? 'bg-charcoal text-white' : 'bg-warm-100 text-charcoal-500'
      )}
    >
      {emoji && <span className="text-sm leading-none">{emoji}</span>}
      <span>{label}</span>
    </motion.button>
  )
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="text-base font-bold text-charcoal mb-1.5">Nessuna esperienza</h3>
      <p className="text-sm text-charcoal-400 mb-5 max-w-[220px] leading-relaxed">
        Nessuna esperienza in questa categoria nelle vicinanze.
      </p>
      <button onClick={onClear} className="text-sm font-semibold text-sage">
        Vedi tutte
      </button>
    </motion.div>
  )
}
