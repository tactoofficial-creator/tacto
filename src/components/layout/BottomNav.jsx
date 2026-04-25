import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, Plus, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const tabs = [
  { path: '/',             icon: Home,     label: 'Home' },
  { path: '/explore',      icon: Search,   label: 'Esplora' },
  { path: '/create',       icon: Plus,     label: 'Crea',   primary: true },
  { path: '/bookings',     icon: BookOpen, label: 'Booking' },
  { path: '/profile',      icon: User,     label: 'Profilo' },
]

export function BottomNav() {
  const unread = useStore(s => s.unreadCount)
  const navigate = useNavigate()

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-30',
      'bg-white/90 glass border-t border-charcoal-100',
      'pb-[env(safe-area-inset-bottom)]'
    )}>
      <div className="flex items-end h-[60px]">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) => cn(
              'flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all duration-200 select-none no-tap',
              tab.primary ? '-mt-4' : ''
            )}
          >
            {({ isActive }) => (
              tab.primary ? (
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center shadow-card-hover',
                    isActive ? 'bg-sage' : 'bg-charcoal'
                  )}
                >
                  <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div className="relative">
                    <tab.icon
                      className={cn(
                        'w-5.5 h-5.5 transition-all duration-200',
                        isActive ? 'text-sage' : 'text-charcoal-300'
                      )}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      style={{ width: 22, height: 22 }}
                    />
                    {tab.path === '/bookings' && unread > 0 && (
                      <AnimatePresence>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-sage text-white text-[9px] font-bold px-0.5"
                        >
                          {unread > 9 ? '9+' : unread}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium transition-all duration-200',
                    isActive ? 'text-sage opacity-100' : 'text-charcoal-300 opacity-0 translate-y-1'
                  )}>
                    {tab.label}
                  </span>
                </motion.div>
              )
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
