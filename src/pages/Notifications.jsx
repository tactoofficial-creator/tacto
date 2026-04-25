import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bell, MessageCircle, Star, Calendar, Check } from 'lucide-react'
import { mockNotifications } from '@/lib/mockData'
import { formatRelative } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const typeIcons = {
  booking_confirmed: <Calendar className="w-4 h-4" />,
  booking_request:   <Calendar className="w-4 h-4" />,
  new_message:       <MessageCircle className="w-4 h-4" />,
  review_received:   <Star className="w-4 h-4 fill-amber-400 text-amber-400" />,
  booking_cancelled: <Calendar className="w-4 h-4" />,
}

const typeBg = {
  booking_confirmed: 'bg-sage-50 text-sage',
  booking_request:   'bg-blue-50 text-blue-500',
  new_message:       'bg-charcoal-50 text-charcoal',
  review_received:   'bg-amber-50 text-amber-500',
  booking_cancelled: 'bg-red-50 text-red-500',
}

export default function Notifications() {
  const navigate = useNavigate()
  const setUnread = useStore(s => s.setUnreadCount)
  const [notifications, setNotifs] = useState(mockNotifications)

  const markAllRead = () => {
    setNotifs(n => n.map(x => ({ ...x, is_read: true })))
    setUnread(0)
  }

  const markRead = (id) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="flex flex-col bg-warm-50 min-h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 sticky top-0 z-20 border-b border-charcoal-100">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-warm"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </motion.button>
          <h1 className="text-xl font-bold text-charcoal flex-1">Notifiche</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-medium text-sage"
            >
              <Check className="w-4 h-4" />
              Segna tutte lette
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="w-10 h-10 text-charcoal-200 mb-4" />
            <h3 className="text-lg font-semibold text-charcoal">Nessuna notifica</h3>
            <p className="text-sm text-charcoal-400 mt-2">Ti avviseremo di nuove prenotazioni e messaggi.</p>
          </div>
        ) : (
          notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-colors ${
                notif.is_read ? 'bg-white' : 'bg-white border-l-2 border-sage shadow-sm'
              }`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                typeBg[notif.type] ?? 'bg-warm text-charcoal'
              }`}>
                {typeIcons[notif.type] ?? <Bell className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-charcoal ${notif.is_read ? '' : 'font-semibold'}`}>
                  {notif.title}
                </p>
                <p className="text-sm text-charcoal-400 mt-0.5 line-clamp-2">
                  {notif.body}
                </p>
                <p className="text-xs text-charcoal-300 mt-1.5">
                  {formatRelative(notif.created_at)}
                </p>
              </div>

              {/* Unread dot */}
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full bg-sage flex-shrink-0 mt-1.5" />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
