import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export function FilterBar() {
  const { filters, setFilter, clearFilters } = useStore()
  const hasActive = filters.category || filters.maxPrice || filters.date || filters.maxDistance < 10

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-4 py-2">
      {/* All filter button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => hasActive && clearFilters()}
        className={cn(
          'flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium',
          'transition-colors duration-150 border',
          hasActive
            ? 'bg-charcoal text-white border-charcoal'
            : 'bg-white text-charcoal-400 border-charcoal-100'
        )}
      >
        {hasActive ? (
          <>
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </>
        ) : (
          <>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtri</span>
          </>
        )}
      </motion.button>

      {/* Category pills */}
      {CATEGORIES.map(cat => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setFilter('category', filters.category === cat.id ? null : cat.id)
          }
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium',
            'transition-all duration-150 border',
            filters.category === cat.id
              ? 'bg-sage text-white border-sage shadow-sm'
              : 'bg-white text-charcoal-500 border-charcoal-100 hover:border-charcoal-200'
          )}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
