import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Star, MapPin, Clock } from 'lucide-react'
import { formatPrice, formatDistance, formatDuration, getCategoryEmoji } from '@/lib/utils'

// ── Full-bleed photo card (vertical, premium) ───────────────────────────────
export function ExperienceCard({ experience, index = 0, size = 'md' }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const { id, title, category, photos, host, price, distance, duration, rating, review_count } = experience

  const heights = { sm: 'h-52', md: 'h-80', lg: 'h-96' }
  const isSmall = size === 'sm'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/experiences/${id}`)}
      className={`relative ${heights[size]} rounded-3xl overflow-hidden cursor-pointer select-none w-full`}
    >
      <img src={photos[0]} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Top */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
          {getCategoryEmoji(category)}
          {!isSmall && <span className="capitalize ml-0.5">{category}</span>}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={e => { e.stopPropagation(); setSaved(v => !v) }}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10"
        >
          <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${saved ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
        </motion.button>
      </div>

      {/* Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'p-3' : 'p-4'}`}>
        {!isSmall && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {formatPrice(price)}
              <span className="text-sm font-normal text-white/70 ml-1">/ p.</span>
            </span>
            {rating && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        <h3 className={`font-semibold text-white leading-snug line-clamp-2 ${isSmall ? 'text-sm mb-1.5' : 'text-base mb-3'}`}>
          {title}
        </h3>

        {isSmall ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{formatPrice(price)}</span>
            {rating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-white/90">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={host.avatar_url} alt={host.full_name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/30" />
              <span className="text-sm text-white/80 font-medium">{host.full_name.split(' ')[0]}</span>
            </div>
            <div className="ml-auto flex items-center gap-3 text-white/60 text-xs">
              {distance !== undefined && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{formatDistance(distance)}</span>
              )}
              {duration && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(duration)}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}

// ── Hero card (wide, cinematic — for featured slot) ─────────────────────────
export function ExperienceCardHero({ experience }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const { id, title, category, photos, host, price, rating, review_count, city, neighborhood } = experience

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.985 }}
      onClick={() => navigate(`/experiences/${id}`)}
      className="relative h-[52vh] min-h-[320px] rounded-3xl overflow-hidden cursor-pointer select-none mx-4"
    >
      <img src={photos[0]} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Top */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span>{getCategoryEmoji(category)}</span>
          <span className="text-white text-xs font-semibold capitalize">{category}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={e => { e.stopPropagation(); setSaved(v => !v) }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10"
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
        </motion.button>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-3 h-3 text-sage-300" />
          <span className="text-xs text-white/60 font-medium">{neighborhood}, {city}</span>
          {rating && (
            <>
              <span className="text-white/30">·</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-white/70 font-medium">{rating.toFixed(1)}</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-white leading-snug mb-4 max-w-[85%]">{title}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={host.avatar_url}
              alt={host.full_name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
            />
            <div>
              <p className="text-xs text-white/50">con</p>
              <p className="text-sm font-semibold text-white leading-tight">{host.full_name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">da</p>
            <p className="text-2xl font-bold text-white tracking-tight">{formatPrice(price)}</p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ── Horizontal compact card (for category rows) ──────────────────────────────
export function ExperienceCardHorizontal({ experience }) {
  const navigate = useNavigate()
  const { id, title, photos, host, price, rating } = experience

  return (
    <motion.article
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/experiences/${id}`)}
      className="flex gap-3 p-3 bg-white rounded-2xl shadow-card cursor-pointer select-none"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-warm-200">
        <img src={photos[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="text-sm font-semibold text-charcoal line-clamp-2 mb-1 leading-snug">{title}</h4>
        <p className="text-xs text-charcoal-400">{host.full_name.split(' ')[0]}</p>
        <div className="flex items-center justify-between mt-2">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-charcoal">{rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-sm font-bold text-charcoal ml-auto">{formatPrice(price)}</span>
        </div>
      </div>
    </motion.article>
  )
}
