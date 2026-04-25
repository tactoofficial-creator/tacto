import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'

const slides = [
  {
    id: 0,
    label: '01 / 03',
    title: 'Momenti veri.\nPersone vere.',
    body: 'Non servizi. Non turismo. Solo connessione umana autentica con qualcuno nella tua città.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1400&fit=crop&auto=format&q=85',
  },
  {
    id: 1,
    label: '02 / 03',
    title: 'Aperitivi, corse,\nletture, cinema.',
    body: 'Persone reali che aprono la loro quotidianità per condividerla con qualcuno di nuovo.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1400&fit=crop&auto=format&q=85',
  },
  {
    id: 2,
    label: '03 / 03',
    title: 'Offri o vivi\nun\'esperienza.',
    body: 'Puoi fare entrambe le cose. Cambia ruolo quando vuoi dal tuo profilo.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=1400&fit=crop&auto=format&q=85',
    isLast: true,
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const setOnboarded = useAuthStore(s => s.setOnboarded)

  const current = slides[step]

  const next = () => setStep(s => s + 1)
  const finish = () => { setOnboarded(); navigate('/', { replace: true }) }

  return (
    <div className="relative min-h-screen-safe overflow-hidden bg-charcoal">

      {/* Full-bleed photo */}
      <AnimatePresence mode="wait">
        <motion.img
          key={step}
          src={current.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </AnimatePresence>

      {/* Deep gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Tacto wordmark */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+24px)] left-6">
        <span className="text-white/90 text-base font-bold tracking-[0.08em] uppercase">Tacto</span>
      </div>

      {/* Slide counter */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+28px)] right-6">
        <span className="text-white/40 text-xs font-semibold tracking-widest">{current.label}</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(env(safe-area-inset-bottom)+32px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1
              className="text-[36px] font-bold text-white leading-[1.1] tracking-tight mb-4"
              style={{ whiteSpace: 'pre-line' }}
            >
              {current.title}
            </h1>
            <p className="text-[15px] text-white/60 leading-relaxed mb-8 max-w-[300px]">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-7">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === step ? 28 : 6, opacity: i <= step ? 1 : 0.3 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="h-1 rounded-full bg-white"
            />
          ))}
        </div>

        {/* CTAs */}
        {current.isLast ? (
          <div className="space-y-3">
            <Button variant="sage" size="xl" fullWidth onClick={finish}
              icon={<Compass className="w-5 h-5" />}>
              Voglio vivere un'esperienza
            </Button>
            <button
              onClick={finish}
              className="w-full h-14 flex items-center justify-between px-6 rounded-2xl border border-white/25 text-white font-semibold text-[15px]"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5" />
                <span>Voglio offrire un'esperienza</span>
              </div>
            </button>
            <button onClick={() => navigate('/auth')}
              className="w-full text-center text-sm text-white/40 py-2">
              Ho già un account —{' '}
              <span className="text-white/70 font-medium">Accedi</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={next}
              className="w-full h-14 flex items-center justify-between px-6 rounded-2xl bg-white text-charcoal font-semibold text-[15px]"
            >
              <span>Continua</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={finish}
              className="w-full text-center text-sm text-white/40 py-2">
              Salta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
