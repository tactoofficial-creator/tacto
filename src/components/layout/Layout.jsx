import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { GeolocationGate } from '@/components/ui/GeolocationGate'

const NO_NAV = ['/onboarding', '/auth', '/bookings/', '/experiences/']

export function Layout() {
  const { pathname } = useLocation()
  const showNav = !NO_NAV.some(p => pathname.startsWith(p))

  return (
    <GeolocationGate>
      <div className="flex flex-col h-screen-safe bg-warm-50 max-w-[430px] mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname.split('/')[1] || 'home'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-1 min-h-0 overflow-y-auto scrollbar-none"
            style={{ paddingBottom: showNav ? 'calc(68px + env(safe-area-inset-bottom))' : 0 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        {showNav && <BottomNav />}
      </div>
    </GeolocationGate>
  )
}
