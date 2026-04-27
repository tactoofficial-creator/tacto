import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Info, Shield, Phone } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Sheet } from '@/components/ui/Sheet'
import { mockBookings, mockMessages, mockUser } from '@/lib/mockData'
import { formatMessageTime, formatDateTime, detectBypass } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export default function ChatRoom() {
  const { id } = useParams()
  const navigate = useNavigate()

  const booking = mockBookings.find(b => b.id === id) ?? mockBookings[0]
  const host    = booking.experience.host

  const [msgs, setMsgs]       = useState(mockMessages[booking.id] ?? [])
  const [input, setInput]     = useState('')
  const [infoOpen, setInfo]   = useState(false)
  const [sending, setSend]    = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  // Real-time subscription (active when Supabase is configured)
  useEffect(() => {
    if (USE_MOCK) return

    const channel = supabase
      .channel(`chat:${booking.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${booking.id}`,
      }, (payload) => {
        setMsgs(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [booking.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return

    if (detectBypass(text)) {
      toast.error('Non puoi condividere contatti personali. Usa sempre Tacto per comunicare.', { duration: 4000 })
      return
    }

    const optimistic = {
      id: `opt-${Date.now()}`,
      sender_id: 'me',
      content: text,
      created_at: new Date().toISOString(),
      is_read: false,
    }

    setMsgs(m => [...m, optimistic])
    setInput('')
    setSend(true)
    inputRef.current?.focus()

    if (!USE_MOCK) {
      const { error } = await supabase.from('messages').insert({
        booking_id: booking.id,
        sender_id: mockUser.id,
        content: text,
      })
      if (error) {
        setMsgs(m => m.filter(x => x.id !== optimistic.id))
      }
    } else {
      // Simulate reply in dev
      if (msgs.length % 3 === 0) {
        setTimeout(() => {
          setMsgs(m => [...m, {
            id: `reply-${Date.now()}`,
            sender_id: host.id,
            content: getAutoReply(text),
            created_at: new Date().toISOString(),
            is_read: true,
          }])
        }, 1800)
      }
    }

    setSend(false)
  }, [input, sending, booking.id, msgs.length, host.id])

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const grouped = msgs.reduce((acc, msg) => {
    const key = new Date(msg.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {})

  return (
    <div className="flex flex-col bg-white" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-3 border-b border-charcoal-100 bg-white flex-shrink-0">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-warm">
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </motion.button>

        <motion.div
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => navigate(`/hosts/${host.id}`)}
        >
          <Avatar src={host.avatar_url} name={host.full_name} size="sm" verified={host.is_verified} />
          <div>
            <p className="text-sm font-semibold text-charcoal">{host.full_name.split(' ')[0]}</p>
            <p className="text-xs text-charcoal-400 truncate max-w-[180px]">{booking.experience.title}</p>
          </div>
        </motion.div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setInfo(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-warm">
          <Info className="w-4 h-4 text-charcoal" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-4">
        {/* Notice */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-sage-50 rounded-full">
            <Shield className="w-3 h-3 text-sage" />
            <span className="text-xs text-sage-700 font-medium">Chat disponibile — prenotazione confermata</span>
          </div>
        </div>

        {Object.entries(grouped).map(([date, dayMsgs]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <span className="text-xs text-charcoal-300 bg-warm px-3 py-1 rounded-full">{date}</span>
            </div>

            {dayMsgs.map((msg, i) => {
              const isMe      = msg.sender_id === 'me'
              const showAvatar = !isMe && (i === 0 || dayMsgs[i - 1]?.sender_id !== msg.sender_id)
              const isOptimistic = msg.id?.startsWith('opt-')

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: isOptimistic ? 0.7 : 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="w-7 flex-shrink-0">
                    {showAvatar && !isMe && (
                      <Avatar src={host.avatar_url} name={host.full_name} size="xs" />
                    )}
                  </div>
                  <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-charcoal text-white rounded-br-sm'
                        : 'bg-warm text-charcoal rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-charcoal-300 mt-0.5 px-1">
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-charcoal-100 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+10px)] bg-white flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-warm rounded-2xl px-4 py-2.5 flex items-center min-h-[44px]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Scrivi un messaggio..."
              className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-charcoal-300 resize-none focus:outline-none scrollbar-none"
              rows={1}
              style={{ lineHeight: 1.5 }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sage text-white disabled:opacity-40 flex-shrink-0 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Info sheet */}
      <Sheet open={infoOpen} onClose={() => setInfo(false)} title="Dettagli prenotazione">
        <div className="px-6 pb-10 space-y-4">
          <div className="flex gap-3 p-3 bg-warm rounded-2xl">
            <img src={booking.experience.photos[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-charcoal">{booking.experience.title}</p>
              <p className="text-xs text-charcoal-400 mt-1">{formatDateTime(booking.starts_at)}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl">
            <p className="text-sm font-medium text-amber-800 mb-1">Sicurezza</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Non condividere numero di telefono o contatti personali. Usa sempre questa chat per comunicare con il tuo host.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl cursor-pointer">
            <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 font-medium">Segnala un problema</p>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

function getAutoReply(msg) {
  const replies = [
    'Perfetto, grazie! A presto 😊',
    'Certo, nessun problema!',
    'Ottimo, ci vediamo!',
    'Grazie per il messaggio, rispondo subito.',
    'Sì, confermo. Ti mando i dettagli.',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}
