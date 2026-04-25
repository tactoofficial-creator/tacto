import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ExperienceCard } from '@/components/experience/ExperienceCard'
import { mockExperiences } from '@/lib/mockData'
import { CATEGORIES, getCategoryEmoji } from '@/lib/utils'

export default function Explore() {
  const [query, setQuery]   = useState('')
  const [catFilter, setCat] = useState(null)
  const navigate = useNavigate()

  const filtered = mockExperiences.filter(e => {
    const matchQ = !query || e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description?.toLowerCase().includes(query.toLowerCase())
    const matchC = !catFilter || e.category === catFilter
    return matchQ && matchC
  })

  return (
    <div className="flex flex-col bg-warm-50 min-h-full">
      {/* Search header */}
      <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-4 sticky top-0 z-20 shadow-sm">
        <h1 className="text-2xl font-bold text-charcoal mb-4">Esplora</h1>
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca esperienze..."
            className="w-full h-11 rounded-2xl bg-warm pl-10 pr-10 text-sm text-charcoal placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-sage/30 border border-transparent focus:border-sage/30"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-charcoal-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCat(null)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
              !catFilter
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white text-charcoal-400 border-charcoal-100'
            }`}
          >
            Tutte
          </motion.button>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCat(catFilter === cat.id ? null : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                catFilter === cat.id
                  ? 'bg-sage text-white border-sage'
                  : 'bg-white text-charcoal-500 border-charcoal-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <p className="text-sm text-charcoal-400 mb-4">
          {filtered.length} esperienz{filtered.length === 1 ? 'a' : 'e'}
          {catFilter && ` · ${getCategoryEmoji(catFilter)} ${catFilter}`}
        </p>
        <div className="space-y-4">
          {filtered.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-base font-medium text-charcoal">Nessun risultato</p>
            <p className="text-sm text-charcoal-400 mt-1">Prova con un termine diverso</p>
          </div>
        )}
      </div>
    </div>
  )
}
