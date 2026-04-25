import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Heart, Share2, MapPin, Clock, Users,
  Calendar, ChevronRight, Star, Shield, AlertCircle, ChevronDown
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { MapView } from '@/components/ui/MapView'
import { useAuthStore } from '@/store/useAuthStore'
import { mockExperiences } from '@/lib/mockData'
import {
  formatPrice, formatDuration, formatDistance,
  getCategoryEmoji, getCategoryLabel, formatDate
} from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ExperienceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)

  const experience = mockExperiences.find(e => e.id === id) ?? mockExperiences[0]
  const {
    title, category, description, photos, host, price,
    distance, duration, max_participants, city, neighborhood,
    rating, review_count, reviews, available_dates, lat, lng
  } = experience

  const [saved, setSaved]             = useState(false)
  const [photoIdx, setPhotoIdx]       = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedDate, setDate]       = useState(null)
  const [participants, setPartic]     = useState(1)
  const [paying, setPaying]           = useState(false)
  const [descExpanded, setDescExp]    = useState(false)
  const DESC_LIMIT = 200

  const totalPrice  = price * participants
  const platformFee = +(totalPrice * 0.15).toFixed(2)

  const handleBook = async () => {
    if (!user) {
      navigate('/auth', { state: { from: `/experiences/${id}` } })
      return
    }
    if (!selectedDate) { toast.error('Scegli una data'); return }
    setPaying(true)
    await new Promise(r => setTimeout(r, 2000))
    setPaying(false)
    setBookingOpen(false)
    toast.success('Prenotazione confermata! 🎉')
    navigate('/bookings')
  }

  const isLongDesc = description?.length > DESC_LIMIT

  return (
    <div className="flex flex-col bg-white min-h-screen-safe">
      {/* Hero photos */}
      <div className="relative overflow-hidden bg-warm-200" style={{ height: '46vh' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={photoIdx}
            src={photos[photoIdx]}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Back + actions */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)]">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-dark">
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => navigator.share?.({ title, url: window.location.href })}
              className="w-10 h-10 flex items-center justify-center rounded-full glass-dark">
              <Share2 className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSaved(v => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-full glass-dark">
              <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-red-400 text-red-400' : 'text-white'}`} />
            </motion.button>
          </div>
        </div>

        {/* Photo dots + category */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <Badge variant="charcoal" className="text-sm">
            {getCategoryEmoji(category)} {getCategoryLabel(category)}
          </Badge>
          {photos.length > 1 && (
            <div className="flex gap-1.5">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className={`rounded-full transition-all duration-200 ${i === photoIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-32">
        <div className="px-5 pt-5">
          <h1 className="text-2xl font-bold text-charcoal leading-snug mb-3">{title}</h1>

          <div className="flex items-center gap-3 mb-5 text-sm text-charcoal-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sage" />
              {neighborhood}, {city}{distance ? ` · ${formatDistance(distance)}` : ''}
            </span>
            {rating && <Stars rating={rating} count={review_count} size="sm" />}
          </div>

          {/* Pill stats */}
          <div className="flex gap-2 flex-wrap mb-6">
            <PillStat icon={<Clock className="w-3.5 h-3.5" />} label={formatDuration(duration)} />
            <PillStat icon={<Users className="w-3.5 h-3.5" />} label={`max ${max_participants}`} />
            <PillStat
              icon={<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
              label={`${rating?.toFixed(1)} (${review_count} rec.)`}
            />
          </div>

          <Divider />

          {/* Host */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            className="flex items-start gap-4 mb-6 cursor-pointer"
            onClick={() => navigate(`/hosts/${host.id}`)}
          >
            <Avatar src={host.avatar_url} name={host.full_name} size="lg" verified={host.is_verified} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-charcoal">{host.full_name}</span>
                {host.is_verified && (
                  <Badge variant="sage" className="text-xs"><Shield className="w-3 h-3" /> Verificato</Badge>
                )}
              </div>
              <Stars rating={host.rating} count={`${host.experience_count} esperienze`} size="xs" className="mb-2" />
              <p className="text-sm text-charcoal-400 leading-relaxed line-clamp-2">{host.bio}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-300 mt-1 flex-shrink-0" />
          </motion.div>

          <Divider />

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-charcoal mb-3">L'esperienza</h2>
            <div className="relative">
              <p className={`text-base text-charcoal-500 leading-relaxed whitespace-pre-line ${!descExpanded && isLongDesc ? 'line-clamp-4' : ''}`}>
                {description}
              </p>
              {isLongDesc && !descExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
            {isLongDesc && (
              <button
                onClick={() => setDescExp(v => !v)}
                className="flex items-center gap-1 text-sm font-medium text-charcoal mt-2"
              >
                {descExpanded ? 'Mostra meno' : 'Leggi tutto'}
                <ChevronDown className={`w-4 h-4 transition-transform ${descExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Map — approximate area */}
          {lat && lng && (
            <>
              <Divider />
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-charcoal mb-3">Zona dell'esperienza</h2>
                <MapView lat={lat} lng={lng} blurred height={200} className="w-full" />
              </div>
            </>
          )}

          {/* Available dates */}
          {available_dates?.length > 0 && (
            <>
              <Divider />
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-charcoal mb-3">Date disponibili</h2>
                <div className="flex gap-2 flex-wrap">
                  {available_dates.map(d => (
                    <button key={d} onClick={() => setDate(d)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        selectedDate === d
                          ? 'bg-sage text-white border-sage shadow-sm'
                          : 'bg-white text-charcoal border-charcoal-100'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />{formatDate(d)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Reviews */}
          {reviews?.length > 0 && (
            <>
              <Divider />
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-charcoal">Recensioni</h2>
                  <Stars rating={rating} count={review_count} />
                </div>
                <div className="space-y-5">
                  {reviews.map(review => (
                    <div key={review.id} className="flex gap-3">
                      <Avatar src={review.reviewer.avatar} name={review.reviewer.name} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-charcoal">{review.reviewer.name}</span>
                          <Stars rating={review.rating} size="xs" />
                          <span className="text-xs text-charcoal-300 ml-auto">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-sm text-charcoal-500 leading-relaxed">"{review.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Safety */}
          <div className="flex items-start gap-3 p-4 bg-warm rounded-2xl mb-4">
            <Shield className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
            <p className="text-sm text-charcoal-400 leading-relaxed">
              Il punto d'incontro esatto viene condiviso solo dopo la conferma. Pagamenti sicuri via Stripe — niente contanti.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-20">
        <div className="bg-white/90 glass border-t border-charcoal-100 px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-charcoal">{formatPrice(price)}</span>
              <span className="text-sm text-charcoal-400 ml-1">/ persona</span>
            </div>
            {rating && <Stars rating={rating} count={review_count} />}
          </div>
          <Button variant="sage" size="xl" fullWidth onClick={() => setBookingOpen(true)}>
            Prenota questo momento
          </Button>
        </div>
      </div>

      {/* Booking sheet */}
      <Sheet open={bookingOpen} onClose={() => setBookingOpen(false)} title="Conferma prenotazione">
        <div className="px-6 pb-10 space-y-6">
          {/* Experience mini */}
          <div className="flex gap-3 p-3 bg-warm rounded-2xl">
            <img src={photos[0]} alt={title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-charcoal line-clamp-2">{title}</p>
              <p className="text-xs text-charcoal-400 mt-0.5">con {host.full_name.split(' ')[0]}</p>
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-2">Scegli la data</p>
            <div className="flex gap-2 flex-wrap">
              {available_dates?.map(d => (
                <button key={d} onClick={() => setDate(d)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                    selectedDate === d ? 'bg-sage text-white border-sage' : 'bg-white text-charcoal border-charcoal-100'
                  }`}
                >
                  {formatDate(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-2">Partecipanti</p>
            <div className="flex items-center gap-5">
              <button onClick={() => setPartic(p => Math.max(1, p - 1))} disabled={participants <= 1}
                className="w-10 h-10 rounded-full border border-charcoal-100 text-xl font-light disabled:opacity-30 flex items-center justify-center">
                −
              </button>
              <span className="text-xl font-bold text-charcoal w-6 text-center">{participants}</span>
              <button onClick={() => setPartic(p => Math.min(max_participants, p + 1))} disabled={participants >= max_participants}
                className="w-10 h-10 rounded-full border border-charcoal-100 text-xl font-light disabled:opacity-30 flex items-center justify-center">
                +
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 pt-2 border-t border-charcoal-100">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">{formatPrice(price)} × {participants}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Commissione Tacto (15%)</span>
              <span>{formatPrice(platformFee)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-charcoal-100">
              <span>Totale</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {!selectedDate && (
            <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">Seleziona una data per procedere</p>
            </div>
          )}

          <Button variant="sage" size="xl" fullWidth loading={paying} disabled={!selectedDate} onClick={handleBook}>
            {paying ? 'Pagamento in corso...' : `Paga ${formatPrice(totalPrice)}`}
          </Button>

          <p className="text-xs text-charcoal-300 text-center leading-relaxed">
            Pagamento sicuro via Stripe · Apple Pay e Google Pay supportati ·
            Rimborso completo se annulli entro 24h
          </p>
        </div>
      </Sheet>
    </div>
  )
}

function PillStat({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warm rounded-full">
      <span className="text-charcoal-400">{icon}</span>
      <span className="text-sm text-charcoal-500">{label}</span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-charcoal-100 mb-5" />
}
