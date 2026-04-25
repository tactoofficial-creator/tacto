import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { GeolocationGate } from '@/components/ui/GeolocationGate'

const NO_NAV = ['/onboarding', '/auth', '/bookings/']

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
}

export function Layout() {
  const { pathname } = useLocation()
  const showNav = !NO_NAV.some(p => pathname.startsWith(p))

  return (
    <GeolocationGate>
      <div className="flex flex-col min-h-screen-safe bg-warm-50 max-w-[430px] mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname.split('/')[1] || 'home'}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 overflow-y-auto scrollbar-none"
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
