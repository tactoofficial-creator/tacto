import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronRight, Shield, CreditCard, Moon, LogOut,
  Bell, Edit3, Award, Check, Camera, X, Upload,
  Copy, Share2, UserPlus, Wallet, TrendingUp
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Sheet } from '@/components/ui/Sheet'
import { useAuthStore } from '@/store/useAuthStore'
import { useStore } from '@/store/useStore'
import { mockWalletTransactions } from '@/lib/mockData'
import { calculateTrustScore, trustScoreLabel, trustScoreColor, getTier } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function Profile() {
  const navigate       = useNavigate()
  const user           = useAuthStore(s => s.user)
  const updateProfile  = useAuthStore(s => s.updateProfile)
  const signOut        = useAuthStore(s => s.signOut)
  const darkMode       = useStore(s => s.darkMode)
  const toggleDark     = useStore(s => s.toggleDark)

  const [editOpen, setEditOpen]       = useState(false)
  const [verifyOpen, setVerifyOpen]   = useState(false)
  const [referralOpen, setReferral]   = useState(false)
  const [loggingOut, setLogOut]       = useState(false)
  const [editData, setEditData]       = useState({
    full_name: user?.full_name ?? '',
    bio: user?.bio ?? '',
    city: user?.city ?? '',
  })
  const [saving, setSaving] = useState(false)

  const trustScore = calculateTrustScore(user)
  const tiers      = (user?.reputation_tiers ?? []).map(t => getTier(t)).filter(Boolean)

  const saveEdit = async () => {
    setSaving(true)
    await updateProfile(editData)
    setSaving(false)
    setEditOpen(false)
    toast.success('Profilo aggiornato')
  }

  const handleLogout = async () => {
    setLogOut(true)
    await signOut()
    navigate('/auth', { replace: true })
  }

  const accountItems = [
    { icon: <Edit3 className="w-4 h-4" />, label: 'Modifica profilo', action: () => setEditOpen(true) },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Verifica identità',
      sublabel: "Carica documento d'identità",
      right: user?.is_verified
        ? <Badge variant="sage"><Check className="w-3 h-3" /> Verificato</Badge>
        : <Badge variant="amber">Non verificato</Badge>,
      action: () => setVerifyOpen(true),
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Metodi di pagamento',
      sublabel: 'Gestito da Stripe',
      action: () => toast('Stripe portal — configura VITE_STRIPE_PUBLISHABLE_KEY'),
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: 'Diventa host',
      sublabel: 'Configura Stripe Connect per ricevere pagamenti',
      action: () => toast('Stripe Connect — da configurare in produzione'),
    },
  ]

  const prefItems = [
    { icon: <Bell className="w-4 h-4" />, label: 'Notifiche', action: () => toast('Push notification settings') },
    {
      icon: <Moon className="w-4 h-4" />,
      label: 'Modalità scura',
      right: (
        <div
          onClick={e => { e.stopPropagation(); toggleDark() }}
          className={`w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${darkMode ? 'bg-sage' : 'bg-charcoal-200'}`}
        >
          <motion.div
            animate={{ x: darkMode ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-4 h-4 rounded-full bg-white shadow-sm"
          />
        </div>
      ),
      action: toggleDark,
    },
  ]

  return (
    <div className="flex flex-col bg-warm-50 min-h-full pb-10">
      {/* Profile header */}
      <div className="bg-white px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" verified={user?.is_verified} />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-charcoal flex items-center justify-center shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-charcoal">{user?.full_name ?? 'Utente'}</h1>
            <p className="text-sm text-charcoal-400 mt-0.5">{user?.city ?? '—'}</p>
            {user?.bio && (
              <p className="text-sm text-charcoal-500 mt-2 leading-relaxed line-clamp-2">{user.bio}</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-warm border border-charcoal-100 flex-shrink-0"
          >
            <Edit3 className="w-4 h-4 text-charcoal" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Prenotazioni', value: '3', emoji: '🎯' },
            { label: 'Completate', value: user?.completed_bookings ?? '1', emoji: '✅' },
            { label: 'Stelle', value: user?.rating ? user.rating.toFixed(1) : '—', emoji: '⭐' },
          ].map(s => (
            <div key={s.label} className="flex-1 flex flex-col items-center p-3 bg-warm rounded-2xl gap-0.5">
              <span className="text-base">{s.emoji}</span>
              <span className="text-lg font-bold text-charcoal">{s.value}</span>
              <span className="text-[11px] text-charcoal-400">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Trust Score */}
        <TrustScoreBar score={trustScore} isVerified={user?.is_verified} />

        {!user?.is_verified && (
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setVerifyOpen(true)}
            className="mt-3 flex items-center gap-3 p-3.5 bg-amber-50 rounded-2xl cursor-pointer"
          >
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-charcoal">Verifica la tua identità</p>
              <p className="text-xs text-charcoal-400 mt-0.5">Ottieni il badge e aumenta la fiducia +40 punti</p>
            </div>
            <ChevronRight className="w-4 h-4 text-charcoal-300 flex-shrink-0" />
          </motion.div>
        )}
      </div>

      <div className="px-4 mt-4 space-y-4">
        {tiers.length > 0 && <ReputationTiersCard tiers={tiers} />}

        <SocialWalletCard
          balance={user?.social_wallet_balance ?? 0}
          transactions={mockWalletTransactions}
          onReferral={() => setReferral(true)}
        />

        <SettingsCard title="Account" items={accountItems} />
        <SettingsCard title="Preferenze" items={prefItems} />

        <Button
          variant="danger"
          size="lg"
          fullWidth
          loading={loggingOut}
          onClick={handleLogout}
          icon={<LogOut className="w-4 h-4" />}
        >
          Esci dall'account
        </Button>

        <p className="text-xs text-charcoal-300 text-center pb-2">Tacto v1.0.0 · Fatto con ❤️ in Italia</p>
      </div>

      {/* Sheets */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Modifica profilo">
        <div className="px-6 pb-10 space-y-4">
          <Input
            label="Nome e cognome"
            value={editData.full_name}
            onChange={e => setEditData(d => ({ ...d, full_name: e.target.value }))}
          />
          <Input
            label="Città"
            value={editData.city}
            onChange={e => setEditData(d => ({ ...d, city: e.target.value }))}
            placeholder="Milano"
          />
          <Textarea
            label="Bio"
            value={editData.bio}
            onChange={e => setEditData(d => ({ ...d, bio: e.target.value.slice(0, 500) }))}
            placeholder="Racconta chi sei..."
            rows={4}
            hint={`${editData.bio.length} / 500`}
          />
          <Button variant="sage" size="xl" fullWidth loading={saving} onClick={saveEdit}>
            Salva modifiche
          </Button>
        </div>
      </Sheet>

      <Sheet open={verifyOpen} onClose={() => setVerifyOpen(false)} title="Verifica identità">
        <VerifyIdentityContent onClose={() => setVerifyOpen(false)} />
      </Sheet>

      <ReferralSheet
        open={referralOpen}
        onClose={() => setReferral(false)}
        code={user?.referral_code ?? 'TACTO24'}
      />
    </div>
  )
}

function TrustScoreBar({ score, isVerified }) {
  const color = trustScoreColor(score)
  const label = trustScoreLabel(score)
  return (
    <div className="mt-4 p-4 bg-warm rounded-2xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-charcoal-400" />
          <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Trust Score</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {score}
          <span className="text-charcoal-300 font-normal">/100</span>
          <span className="ml-1.5 text-xs" style={{ color }}>· {label}</span>
        </span>
      </div>
      <div className="h-2 bg-charcoal-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      {score < 80 && (
        <p className="text-[11px] text-charcoal-400 mt-2">
          {!isVerified ? '→ Verifica identità per +40 punti' : '→ Completa più esperienze per salire di livello'}
        </p>
      )}
    </div>
  )
}

function ReputationTiersCard({ tiers }) {
  return (
    <div className="bg-white rounded-3xl shadow-card">
      <div className="px-4 pt-4 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-300 mb-3">
          Identità Sociale
        </p>
        <div className="flex flex-wrap gap-2">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border ${tier.bgClass} ${tier.borderClass}`}
            >
              <span className="text-lg leading-none">{tier.emoji}</span>
              <div>
                <p className={`text-xs font-semibold leading-tight ${tier.colorClass}`}>{tier.label}</p>
                <p className="text-[10px] text-charcoal-400 leading-snug mt-0.5 max-w-[150px]">{tier.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SocialWalletCard({ balance, transactions, onReferral }) {
  return (
    <div className="bg-charcoal rounded-3xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-white/40" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Social Wallet</span>
          </div>
          <span className="text-[10px] text-white/25 uppercase tracking-wider">Tacto Credits</span>
        </div>
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-5xl font-bold text-white tracking-tight">{balance}</span>
          <span className="text-xl text-white/30 mb-0.5">cr</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReferral}
          className="w-full flex items-center justify-center gap-2 h-11 bg-white/10 rounded-2xl text-sm font-semibold text-white"
        >
          <UserPlus className="w-4 h-4" />
          Invita un amico · +50 crediti
        </motion.button>
      </div>

      {transactions.length > 0 && (
        <div className="border-t border-white/10 px-5 py-4 space-y-3">
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="flex items-center justify-between">
              <span className="text-xs text-white/40 truncate pr-3">{tx.label}</span>
              <span className={`text-xs font-bold flex-shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-white/25'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} cr
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingsCard({ title, items }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-300">{title}</p>
      </div>
      {items.map((item, i) => (
        <motion.button
          key={item.label}
          whileTap={{ backgroundColor: '#F5F5F3' }}
          onClick={item.action}
          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${i < items.length - 1 ? 'border-b border-charcoal-50' : ''}`}
        >
          <div className="w-8 h-8 rounded-xl bg-warm flex items-center justify-center text-charcoal flex-shrink-0">
            {item.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{item.label}</p>
            {item.sublabel && <p className="text-xs text-charcoal-400 mt-0.5">{item.sublabel}</p>}
          </div>
          {item.right ?? <ChevronRight className="w-4 h-4 text-charcoal-200 flex-shrink-0" />}
        </motion.button>
      ))}
    </div>
  )
}

function ReferralSheet({ open, onClose, code }) {
  const link = `https://tacto.app/invite/${code}`

  const copy = () => {
    navigator.clipboard?.writeText(link)
    toast.success('Link copiato!')
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: 'Unisciti a Tacto', text: 'Vivi esperienze vere, con persone vere.', url: link })
    } else {
      copy()
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Invita amici">
      <div className="px-6 pb-10 space-y-5">
        <p className="text-sm text-charcoal-500 leading-relaxed">
          Per ogni amico che si registra e completa la sua prima esperienza, tu guadagni{' '}
          <strong className="text-charcoal">50 crediti</strong> e lui riceve uno{' '}
          <strong className="text-charcoal">sconto di 10€</strong>.
        </p>

        <div className="p-4 bg-warm rounded-2xl">
          <p className="text-xs text-charcoal-400 mb-1.5">Il tuo codice invito</p>
          <p className="text-2xl font-bold text-charcoal tracking-widest">{code}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="sage" size="xl" fullWidth onClick={copy} icon={<Copy className="w-4 h-4" />}>
            Copia link
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={share} icon={<Share2 className="w-4 h-4" />}>
            Condividi
          </Button>
        </div>

        <p className="text-xs text-charcoal-300 text-center leading-relaxed">
          I crediti vengono accreditati entro 48h dalla prima esperienza completata dall'amico.
        </p>
      </div>
    </Sheet>
  )
}

function VerifyIdentityContent({ onClose }) {
  const fileRef   = useRef(null)
  const [file, setFile]         = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone]         = useState(false)

  const handleFile = e => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const submit = async () => {
    if (!file) { toast.error('Carica un documento'); return }
    setUploading(true)
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    setDone(true)
  }

  if (done) return (
    <div className="px-6 pb-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mt-4 mb-4">
        <Check className="w-8 h-8 text-sage" />
      </div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Documento inviato!</h3>
      <p className="text-sm text-charcoal-400 mb-6 max-w-xs">
        Il tuo documento è in revisione. Ti notificheremo entro 24 ore.
      </p>
      <Button variant="outline" onClick={onClose}>Chiudi</Button>
    </div>
  )

  return (
    <div className="px-6 pb-10 space-y-5">
      <p className="text-sm text-charcoal-500 leading-relaxed">
        Carica una foto del tuo documento d'identità (carta d'identità o passaporto). Il documento
        viene archiviato in modo sicuro e non è visibile ad altri utenti.
      </p>

      <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />

      {file ? (
        <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-sage" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal">{file.name}</p>
            <p className="text-xs text-charcoal-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <button onClick={() => setFile(null)}>
            <X className="w-4 h-4 text-charcoal-400" />
          </button>
        </div>
      ) : (
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-3 p-8 bg-warm rounded-2xl border-2 border-dashed border-charcoal-200 cursor-pointer hover:border-sage transition-colors"
        >
          <Upload className="w-8 h-8 text-charcoal-300" />
          <p className="text-sm font-medium text-charcoal-400">Carica documento</p>
          <p className="text-xs text-charcoal-300">JPG, PNG, PDF · max 10MB</p>
        </motion.div>
      )}

      <Button variant="sage" size="xl" fullWidth loading={uploading} disabled={!file} onClick={submit}>
        Invia per revisione
      </Button>

      <p className="text-xs text-charcoal-300 text-center leading-relaxed">
        I dati sono protetti e conformi al GDPR. Non condividiamo le tue informazioni con terze parti.
      </p>
    </div>
  )
}
