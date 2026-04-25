import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X } from 'lucide-react'
import { Button } from './Button'

export function GeolocationGate({ children }) {
  const [asked, setAsked] = useState(
    () => localStorage.getItem('geo-asked') === '1'
  )
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (asked) return
    // Show after 3s on first visit
    const t = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(t)
  }, [asked])

  const allow = () => {
    navigator.geolocation?.getCurrentPosition(
      () => {},
      () => {},
      { enableHighAccuracy: false }
    )
    localStorage.setItem('geo-asked', '1')
    setAsked(true)
    setShow(false)
  }

  const skip = () => {
    localStorage.setItem('geo-asked', '1')
    setAsked(true)
    setShow(false)
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
              onClick={skip}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white rounded-t-[28px] shadow-modal px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+28px)]"
            >
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 rounded-full bg-charcoal-200" />
              </div>

              <button onClick={skip} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-warm">
                <X className="w-4 h-4 text-charcoal" />
              </button>

              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-sage" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-charcoal text-center mb-2">
                Esperienze vicino a te
              </h3>
              <p className="text-sm text-charcoal-400 text-center leading-relaxed mb-6 max-w-xs mx-auto">
                Usiamo la tua posizione solo per mostrarti le esperienze più vicine, in ordine di distanza. Non la condividiamo con nessuno.
              </p>

              <div className="space-y-3">
                <Button variant="sage" size="xl" fullWidth onClick={allow}
                  icon={<MapPin className="w-5 h-5" />}>
                  Usa la mia posizione
                </Button>
                <button onClick={skip} className="w-full py-2 text-sm text-charcoal-400 text-center">
                  Non adesso
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
