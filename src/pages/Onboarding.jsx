import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Compass, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'

const slides = [
  {
    id: 0,
    emoji: '🌆',
    eyebrow: 'Benvenuto su Tacto',
    title: 'Momenti veri.\nPersone vere.',
    body: 'Non servizi. Non turismo. Solo connessione umana autentica — con qualcuno nella tua città.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1000&fit=crop&auto=format&q=80',
  },
  {
    id: 1,
    emoji: '🍹',
    eyebrow: 'Scopri esperienze',
    title: 'Aperitivi, corse,\nletture, cinema.',
    body: 'Persone reali che aprono la loro quotidianità per condividerla con qualcuno di nuovo.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&auto=format&q=80',
  },
  {
    id: 2,
    emoji: '✨',
    eyebrow: 'Scegli il tuo ruolo',
    title: 'Offri o vivi\nun\'esperienza.',
    body: 'Puoi fare entrambe le cose. Cambia ruolo quando vuoi dal tuo profilo.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=1000&fit=crop&auto=format&q=80',
    isLast: true,
  },
]

const swipe = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [dir, setDir]   = useState(1)
  const navigate = useNavigate()
  const setOnboarded = useAuthStore(s => s.setOnboarded)

  const current = slides[step]

  const next = () => {
    if (step < slides.length - 1) {
      setDir(1)
      setStep(s => s + 1)
    }
  }

  const finish = (role) => {
    setOnboarded()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen-safe flex flex-col bg-white overflow-hidden">
      {/* Hero image */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={swipe}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full flex-none"
          style={{ height: '55dvh' }}
        >
          <img
            src={current.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          {/* Emoji */}
          <div className="absolute bottom-6 left-6 text-4xl">{current.emoji}</div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-2 pb-safe-bottom">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={swipe}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-sage mb-2">
              {current.eyebrow}
            </p>
            <h1 className="text-3xl font-bold text-charcoal leading-tight mb-4" style={{ whiteSpace: 'pre-line' }}>
              {current.title}
            </h1>
            <p className="text-base text-charcoal-400 leading-relaxed">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 my-6">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === step ? 20 : 6, opacity: i === step ? 1 : 0.3 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-1.5 rounded-full bg-charcoal"
            />
          ))}
        </div>

        {/* CTAs */}
        {current.isLast ? (
          <div className="space-y-3">
            <Button
              variant="sage"
              size="xl"
              fullWidth
              onClick={() => finish('buyer')}
              icon={<Compass className="w-5 h-5" />}
            >
              Voglio vivere un'esperienza
            </Button>
            <Button
              variant="outline"
              size="xl"
              fullWidth
              onClick={() => finish('seller')}
              icon={<Sparkles className="w-5 h-5" />}
            >
              Voglio offrire un'esperienza
            </Button>
            <button
              onClick={() => navigate('/auth')}
              className="w-full text-center text-sm text-charcoal-300 py-2"
            >
              Ho già un account — <span className="text-charcoal font-medium">Accedi</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={next}
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Continua
            </Button>
            <button
              onClick={() => finish()}
              className="w-full text-center text-sm text-charcoal-300 py-2"
            >
              Salta
            </button>
          </div>
        )}

        <div className="pb-6" />
      </div>
    </div>
  )
}
