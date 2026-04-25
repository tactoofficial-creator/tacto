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
    <div className="flex flex-col bg-white min-h-full">
      {/* Search header */}
      <div className="bg-white px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-4 sticky top-0 z-20">
        <h1 className="text-[26px] font-bold text-charcoal tracking-tight mb-4">Esplora</h1>
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca esperienze..."
            className="w-full h-12 rounded-2xl bg-warm-100 pl-11 pr-10 text-[15px] text-charcoal placeholder:text-charcoal-300 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white mb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-none px-5 py-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setCat(null)}
            className={`flex-shrink-0 h-9 px-4 rounded-full text-[13px] font-semibold transition-all ${
              !catFilter ? 'bg-charcoal text-white' : 'bg-warm-100 text-charcoal-500'
            }`}
          >
            Tutte
          </motion.button>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCat(catFilter === cat.id ? null : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-semibold transition-all ${
                catFilter === cat.id ? 'bg-charcoal text-white' : 'bg-warm-100 text-charcoal-500'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 py-2">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-charcoal-300 mb-4">
          {filtered.length} {filtered.length === 1 ? 'esperienza' : 'esperienze'}
        </p>
        <div className="space-y-4">
          {filtered.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-base font-bold text-charcoal">Nessun risultato</p>
            <p className="text-sm text-charcoal-400 mt-1.5">Prova con un termine diverso</p>
          </div>
        )}
      </div>
    </div>
  )
}
