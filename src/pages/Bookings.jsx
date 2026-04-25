import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Calendar, Clock, Star } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapView } from '@/components/ui/MapView'
import { ReviewSheet } from '@/components/ui/ReviewSheet'
import { Sheet } from '@/components/ui/Sheet'
import { mockBookings } from '@/lib/mockData'
import { formatPrice, formatDateTime, formatDuration } from '@/lib/utils'

const tabs = ['In corso', 'Passate']

export default function Bookings() {
  const [tab, setTab]             = useState(0)
  const [reviewTarget, setReview] = useState(null)
  const [mapTarget, setMapTarget] = useState(null)
  const navigate = useNavigate()

  const upcoming = mockBookings.filter(b => ['pending', 'confirmed'].includes(b.status))
  const past     = mockBookings.filter(b => ['completed', 'cancelled'].includes(b.status))
  const list     = tab === 0 ? upcoming : past

  return (
    <div className="flex flex-col bg-warm-50 min-h-full">
      {/* Header */}
      <div className="bg-white px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-0 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-charcoal mb-4">Prenotazioni</h1>
        <div className="flex border-b border-charcoal-100">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${tab === i ? 'text-charcoal' : 'text-charcoal-400'}`}>
              {t}
              {tab === i && (
                <motion.div layoutId="booking-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-charcoal rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3">
        {list.length === 0 ? (
          <EmptyBookings tab={tab} navigate={navigate} />
        ) : (
          list.map((booking, i) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              index={i}
              navigate={navigate}
              onReview={() => setReview(booking)}
              onMap={() => setMapTarget(booking)}
            />
          ))
        )}
      </div>

      {/* Review sheet */}
      <ReviewSheet
        open={!!reviewTarget}
        onClose={() => setReview(null)}
        booking={reviewTarget}
      />

      {/* Meeting point map sheet */}
      <Sheet
        open={!!mapTarget}
        onClose={() => setMapTarget(null)}
        title="Punto d'incontro"
      >
        {mapTarget && (
          <div className="px-5 pb-8 space-y-4">
            <MapView
              lat={mapTarget.meeting_lat ?? mapTarget.experience.lat}
              lng={mapTarget.meeting_lng ?? mapTarget.experience.lng}
              blurred={false}
              zoom={16}
              height={280}
              markerLabel={mapTarget.meeting_point}
            />
            <div className="flex items-start gap-3 p-4 bg-warm rounded-2xl">
              <MapPin className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-charcoal mb-0.5">Punto d'incontro</p>
                <p className="text-sm text-charcoal-400">
                  {mapTarget.meeting_point ?? 'Verrà comunicato dal host'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function BookingCard({ booking, index, navigate, onReview, onMap }) {
  const { id, experience, status, starts_at, participants, total_price, unread_messages } = booking
  const hasMap = status === 'confirmed' && (booking.meeting_lat || experience.lat)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card"
    >
      {/* Photo */}
      <div className="relative h-32 overflow-hidden bg-warm-200">
        <img src={experience.photos[0]} alt={experience.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3"><StatusBadge status={status} /></div>
        {unread_messages > 0 && status === 'confirmed' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-sage rounded-full">
            <MessageCircle className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-bold">{unread_messages}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-charcoal mb-2 line-clamp-1">{experience.title}</h3>

        <div className="flex items-center gap-4 text-xs text-charcoal-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />{formatDateTime(starts_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />{formatDuration(experience.duration)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Avatar src={experience.host.avatar_url} name={experience.host.full_name} size="xs" />
          <span className="text-sm text-charcoal-400">{experience.host.full_name.split(' ')[0]}</span>
          <span className="ml-auto text-base font-bold text-charcoal">{formatPrice(total_price)}</span>
        </div>

        {/* Actions */}
        {status === 'confirmed' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1"
              onClick={() => navigate(`/bookings/${id}/chat`)}
              icon={<MessageCircle className="w-4 h-4" />}
            >
              Chat {unread_messages > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-sage text-white text-[10px] font-bold flex items-center justify-center">
                  {unread_messages}
                </span>
              )}
            </Button>
            {hasMap && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onMap}
                icon={<MapPin className="w-4 h-4" />}>
                Mappa
              </Button>
            )}
          </div>
        )}

        {status === 'completed' && (
          <Button variant="outline" size="sm" fullWidth onClick={onReview}
            icon={<Star className="w-4 h-4" />}>
            Lascia una recensione
          </Button>
        )}

        {status === 'pending' && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2.5 text-center">
            In attesa di conferma dal host
          </p>
        )}
      </div>
    </motion.div>
  )
}

function EmptyBookings({ tab, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <span className="text-5xl mb-4">{tab === 0 ? '📅' : '🗂'}</span>
      <h3 className="text-lg font-semibold text-charcoal mb-2">
        {tab === 0 ? 'Nessuna prenotazione' : 'Nessuna esperienza passata'}
      </h3>
      <p className="text-sm text-charcoal-400 mb-6 max-w-xs">
        {tab === 0 ? 'Esplora esperienze vicino a te.' : 'Le tue esperienze completate appariranno qui.'}
      </p>
      {tab === 0 && <Button variant="sage" onClick={() => navigate('/')}>Esplora esperienze</Button>}
    </motion.div>
  )
}
