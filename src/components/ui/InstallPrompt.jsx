import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share, X, Plus } from 'lucide-react'
import { Button } from './Button'
import { useStore } from '@/store/useStore'

export function InstallPrompt() {
  const installPrompt = useStore(s => s.installPrompt)
  const setInstall    = useStore(s => s.setInstallPrompt)
  const [show, setShow]   = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('install-dismissed') === '1'
  )

  useEffect(() => {
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsIOS(ios)

    // Show iOS prompt after 30s if not installed and not dismissed
    if (ios && !standalone && !dismissed) {
      const t = setTimeout(() => setShow(true), 30_000)
      return () => clearTimeout(t)
    }
  }, [dismissed])

  useEffect(() => {
    // Show Android/Chrome prompt if available and not dismissed
    if (installPrompt && !dismissed) {
      const t = setTimeout(() => setShow(true), 5_000)
      return () => clearTimeout(t)
    }
  }, [installPrompt, dismissed])

  const dismiss = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('install-dismissed', '1')
  }

  const install = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt()
      if (result.outcome === 'accepted') {
        setInstall(null)
      }
    }
    dismiss()
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white rounded-t-[28px] shadow-modal px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+24px)]"
          >
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-charcoal-200" />
            </div>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-warm"
            >
              <X className="w-4 h-4 text-charcoal" />
            </button>

            {/* Icon */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-charcoal flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-sage" style={{ letterSpacing: '-0.04em' }}>T</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal">Aggiungi Tacto</h3>
                <p className="text-sm text-charcoal-400 mt-0.5">alla schermata Home per accesso rapido</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 bg-warm rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Share className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      1. Tocca <strong>Condividi</strong>
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Tasto in basso nella barra Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-warm rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-charcoal flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      2. Scorri e tocca <strong>"Aggiungi a Home"</strong>
                    </p>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Trovi l'opzione nel foglio di condivisione
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="w-full py-3 text-sm text-charcoal-400 text-center"
                >
                  Forse dopo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="sage" size="xl" fullWidth onClick={install}>
                  Installa l'app
                </Button>
                <button
                  onClick={dismiss}
                  className="w-full py-2 text-sm text-charcoal-400 text-center"
                >
                  Forse dopo
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
