import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, ChevronRight, Check, X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { MapView } from '@/components/ui/MapView'
import { CATEGORIES } from '@/lib/utils'
import toast from 'react-hot-toast'

const STEPS = ['Foto', 'Titolo', 'Categoria', 'Descrizione', 'Dettagli', 'Prezzi', 'Luogo', 'Date']
const TOTAL = STEPS.length

export default function CreateExperience() {
  const navigate  = useNavigate()
  const [step, setStep]   = useState(0)
  const [saving, setSave] = useState(false)
  const [data, setData]   = useState({
    photos: [],
    title: '',
    category: '',
    description: '',
    duration: 60,
    max_participants: 2,
    price: '',
    city: '',
    neighborhood: '',
    lat: 45.4642,
    lng: 9.1900,
    dates: [],
  })

  const update  = (key, val) => setData(d => ({ ...d, [key]: val }))
  const progress = ((step + 1) / TOTAL) * 100

  const canNext = () => {
    switch (step) {
      case 0: return true
      case 1: return data.title.trim().length >= 10
      case 2: return !!data.category
      case 3: return data.description.trim().length >= 50
      case 4: return data.duration > 0 && data.max_participants > 0
      case 5: return Number(data.price) > 0
      case 6: return !!data.city
      case 7: return data.dates.length > 0
      default: return true
    }
  }

  const next = () => step < TOTAL - 1 ? setStep(s => s + 1) : handleSubmit()
  const back = () => step > 0 ? setStep(s => s - 1) : navigate(-1)

  const handleSubmit = async () => {
    setSave(true)
    await new Promise(r => setTimeout(r, 1600))
    setSave(false)
    toast.success('Esperienza pubblicata! 🎉')
    navigate('/')
  }

  return (
    <div className="flex flex-col bg-white min-h-screen-safe">
      {/* Top bar */}
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-3 flex items-center gap-3 bg-white sticky top-0 z-10 border-b border-charcoal-100">
        <motion.button whileTap={{ scale: 0.9 }} onClick={back}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-warm">
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </motion.button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-charcoal-400 font-medium">{STEPS[step]}</p>
            <p className="text-xs text-charcoal-400">{step + 1} / {TOTAL}</p>
          </div>
          <div className="h-1 bg-warm-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-5 py-6"
          >
            {step === 0 && <StepPhoto data={data} update={update} />}
            {step === 1 && <StepTitle data={data} update={update} />}
            {step === 2 && <StepCategory data={data} update={update} />}
            {step === 3 && <StepDescription data={data} update={update} />}
            {step === 4 && <StepDetails data={data} update={update} />}
            {step === 5 && <StepPrice data={data} update={update} />}
            {step === 6 && <StepLocation data={data} update={update} />}
            {step === 7 && <StepDates data={data} update={update} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/90 glass border-t border-charcoal-100 px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <Button
          variant="sage" size="xl" fullWidth loading={saving}
          disabled={!canNext()} onClick={next}
          icon={step < TOTAL - 1 ? <ChevronRight className="w-5 h-5" /> : <Check className="w-5 h-5" />}
        >
          {step < TOTAL - 1 ? 'Continua' : 'Pubblica'}
        </Button>
      </div>
    </div>
  )
}

// ── Steps ──────────────────────────────────────────────

function StepPhoto({ data, update }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map(f => URL.createObjectURL(f))
    update('photos', [...data.photos, ...urls].slice(0, 5))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Aggiungi le foto</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Una foto bella cattura l'essenza. Max 5 foto.</p>

      {data.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {data.photos.map((src, i) => (
            <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => update('photos', data.photos.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white bg-sage rounded px-1">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
      <motion.div whileTap={{ scale: 0.98 }} onClick={() => fileRef.current?.click()}
        className="w-full aspect-[4/3] rounded-3xl bg-warm-200 border-2 border-dashed border-charcoal-200 flex flex-col items-center justify-center cursor-pointer hover:border-sage hover:bg-sage-50 transition-colors">
        <Camera className="w-10 h-10 text-charcoal-300 mb-3" />
        <p className="text-sm font-medium text-charcoal-400">Tocca per aggiungere foto</p>
        <p className="text-xs text-charcoal-300 mt-1">JPG, PNG · max 10MB · max 5 foto</p>
      </motion.div>
    </div>
  )
}

function StepTitle({ data, update }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Un titolo che cattura</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Sii specifico e umano. Cosa farete insieme?</p>
      <Textarea
        value={data.title}
        onChange={e => update('title', e.target.value.slice(0, 100))}
        placeholder="es. Aperitivo al tramonto sulla mia terrazza con vista Duomo"
        rows={3}
        hint={`${data.title.length} / 100 caratteri (min. 10)`}
      />
    </div>
  )
}

function StepCategory({ data, update }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Che tipo di esperienza?</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Scegli la categoria più vicina.</p>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <motion.button key={cat.id} whileTap={{ scale: 0.96 }}
            onClick={() => update('category', cat.id)}
            className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
              data.category === cat.id
                ? 'border-sage bg-sage-50 shadow-sm'
                : 'border-charcoal-100 bg-white'
            }`}>
            <span className="text-2xl mb-2">{cat.emoji}</span>
            <span className={`text-sm font-semibold ${data.category === cat.id ? 'text-sage-700' : 'text-charcoal'}`}>
              {cat.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepDescription({ data, update }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Descrivi l'esperienza</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Cosa succede? Dove? Cosa portare? Sii autentico.</p>
      <Textarea
        value={data.description}
        onChange={e => update('description', e.target.value)}
        placeholder="Descrivi l'atmosfera, cosa aspettarsi, cosa portare..."
        rows={8}
        hint={`${data.description.length} caratteri (min. 50)`}
      />
    </div>
  )
}

function StepDetails({ data, update }) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Durata e partecipanti</h2>
        <p className="text-charcoal-400 mb-6 text-sm">Quanto dura? Quante persone puoi ospitare?</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">Durata</p>
        <div className="flex gap-2 flex-wrap">
          {[30, 60, 90, 120, 180, 240].map(min => (
            <button key={min} onClick={() => update('duration', min)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                data.duration === min ? 'bg-sage text-white border-sage' : 'bg-white text-charcoal border-charcoal-100'
              }`}>
              {min < 60 ? `${min}min` : `${min / 60}h`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">Max partecipanti</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <button key={n} onClick={() => update('max_participants', n)}
              className={`w-11 h-11 rounded-xl border text-sm font-bold transition-all ${
                data.max_participants === n ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-charcoal border-charcoal-100'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepPrice({ data, update }) {
  const price = Number(data.price)
  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Quanto costa?</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Prezzo per persona. Ricevi l'85% — Tacto trattiene il 15%.</p>
      <Input
        label="Prezzo per persona (€)"
        type="number"
        value={data.price}
        onChange={e => update('price', e.target.value)}
        placeholder="25"
        min={1} max={500}
      />
      {price > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-warm rounded-2xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-400">Prezzo acquirente</span>
            <span className="font-medium">€{price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-400">Commissione Tacto (15%)</span>
            <span className="text-charcoal-400">−€{(price * 0.15).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-charcoal-100">
            <span>Guadagni</span>
            <span className="text-sage">€{(price * 0.85).toFixed(2)}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function StepLocation({ data, update }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Dove si svolge?</h2>
      <p className="text-charcoal-400 mb-6 text-sm">
        Mostriamo solo il quartiere agli utenti. Il punto esatto viene condiviso dopo la prenotazione.
      </p>
      <div className="space-y-4 mb-5">
        <Input
          label="Città"
          value={data.city}
          onChange={e => update('city', e.target.value)}
          placeholder="Milano"
          icon={<MapPin className="w-4 h-4" />}
        />
        <Input
          label="Quartiere"
          value={data.neighborhood}
          onChange={e => update('neighborhood', e.target.value)}
          placeholder="Porta Venezia"
        />
      </div>
      <MapView lat={data.lat} lng={data.lng} blurred height={200} className="w-full" />
    </div>
  )
}

function StepDates({ data, update }) {
  const toggleDate = (d) => {
    const next = data.dates.includes(d) ? data.dates.filter(x => x !== d) : [...data.dates, d]
    update('dates', next)
  }

  const upcoming = Array.from({ length: 21 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().split('T')[0]
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">Quando sei disponibile?</h2>
      <p className="text-charcoal-400 mb-6 text-sm">Seleziona i giorni in cui offrirai l'esperienza.</p>
      <div className="grid grid-cols-3 gap-2">
        {upcoming.map(d => {
          const date = new Date(d)
          const sel  = data.dates.includes(d)
          return (
            <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => toggleDate(d)}
              className={`flex flex-col items-center py-3 rounded-2xl border transition-all ${
                sel ? 'bg-sage text-white border-sage shadow-sm' : 'bg-white text-charcoal border-charcoal-100'
              }`}>
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${sel ? 'text-white/80' : 'text-charcoal-300'}`}>
                {date.toLocaleDateString('it-IT', { weekday: 'short' })}
              </span>
              <span className="text-xl font-bold leading-tight">{date.getDate()}</span>
              <span className={`text-[11px] ${sel ? 'text-white/80' : 'text-charcoal-400'}`}>
                {date.toLocaleDateString('it-IT', { month: 'short' })}
              </span>
            </motion.button>
          )
        })}
      </div>
      {data.dates.length > 0 && (
        <p className="text-sm text-sage font-medium mt-4 text-center">
          {data.dates.length} data{data.dates.length > 1 ? 'e' : ''} selezionata{data.dates.length > 1 ? 'e' : ''}
        </p>
      )}
    </div>
  )
}
