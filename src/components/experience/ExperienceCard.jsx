import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Stars } from '@/components/ui/Stars'
import { formatPrice, formatDistance, formatDuration, getCategoryEmoji } from '@/lib/utils'

export function ExperienceCard({ experience, index = 0 }) {
  const navigate = useNavigate()
  const { id, title, category, photos, host, price, distance, duration, rating, review_count } = experience

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/experiences/${id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-card cursor-pointer select-none"
    >
      {/* Photo */}
      <div className="relative w-full h-56 overflow-hidden bg-warm-200">
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-charcoal shadow-sm">
            <span>{getCategoryEmoji(category)}</span>
            <span className="capitalize">{category}</span>
          </span>
        </div>
        {/* Price */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-charcoal/80 backdrop-blur-sm text-white text-sm font-semibold">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-charcoal leading-snug mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Host row */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar src={host.avatar_url} name={host.full_name} size="sm" verified={host.is_verified} />
          <span className="text-sm text-charcoal-400 font-medium">{host.full_name.split(' ')[0]}</span>
          {rating && (
            <div className="ml-auto">
              <Stars rating={rating} count={review_count} size="xs" />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-charcoal-300">
          {distance !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(distance)}
            </span>
          )}
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(duration)}
            </span>
          )}
          {experience.max_participants && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              max {experience.max_participants}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ExperienceCardHorizontal({ experience }) {
  const navigate = useNavigate()
  const { id, title, photos, host, price, distance, rating } = experience

  return (
    <motion.article
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/experiences/${id}`)}
      className="flex gap-3 bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer select-none p-3"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-warm-200">
        <img src={photos[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-charcoal line-clamp-2 mb-1">{title}</h4>
        <p className="text-xs text-charcoal-400">{host.full_name.split(' ')[0]}</p>
        <div className="flex items-center justify-between mt-1.5">
          <Stars rating={rating} size="xs" />
          <span className="text-sm font-semibold text-charcoal">{formatPrice(price)}</span>
        </div>
      </div>
    </motion.article>
  )
}
