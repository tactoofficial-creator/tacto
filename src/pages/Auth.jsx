import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

export default function Auth() {
  const [mode, setMode]       = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const { signIn, signUp } = useAuthStore()
  const redirectTo = location.state?.from ?? '/'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        navigate(redirectTo, { replace: true })
      } else {
        await signUp(email, password, name)
        toast.success('Controlla la tua email per confermare l\'account')
        navigate('/', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Errore durante l\'accesso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen-safe flex flex-col bg-white px-6 pt-safe-top">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-warm hover:bg-warm-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </motion.button>
      </div>

      {/* Logo mark */}
      <div className="flex items-center justify-center mt-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-charcoal flex items-center justify-center">
          <span className="text-3xl font-bold text-sage" style={{ letterSpacing: '-0.04em' }}>T</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            {mode === 'signin' ? 'Bentornato' : 'Crea account'}
          </h1>
          <p className="text-charcoal-400 mb-8">
            {mode === 'signin'
              ? 'Accedi per continuare.'
              : 'Inizia a vivere esperienze vere.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Nome e cognome"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Il tuo nome"
                icon={<User className="w-4 h-4" />}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@esempio.it"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                hint={mode === 'signup' ? 'Almeno 8 caratteri' : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 bottom-3 text-charcoal-300"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="sage"
                size="xl"
                fullWidth
                loading={loading}
              >
                {mode === 'signin' ? 'Accedi' : 'Crea account'}
              </Button>
            </div>
          </form>

          {mode === 'signup' && (
            <p className="text-xs text-charcoal-300 text-center mt-4 leading-relaxed">
              Registrandoti accetti i{' '}
              <span className="text-charcoal underline">Termini di servizio</span>{' '}
              e la{' '}
              <span className="text-charcoal underline">Privacy policy</span>.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex-1" />

      {/* Switch mode */}
      <div className="flex items-center justify-center gap-2 py-8 pb-safe-bottom">
        <span className="text-sm text-charcoal-400">
          {mode === 'signin' ? 'Non hai un account?' : 'Hai già un account?'}
        </span>
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm font-semibold text-charcoal"
        >
          {mode === 'signin' ? 'Registrati' : 'Accedi'}
        </button>
      </div>
    </div>
  )
}
