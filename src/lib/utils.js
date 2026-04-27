import { format, formatDistanceToNow, differenceInHours } from 'date-fns'
import { it } from 'date-fns/locale'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(amount, currency = 'EUR') {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`
  if (km < 10) return `${km.toFixed(1)}km`
  return `${Math.round(km)}km`
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export function formatDate(date) {
  return format(new Date(date), 'd MMM', { locale: it })
}

export function formatDateTime(date) {
  return format(new Date(date), 'd MMM · HH:mm', { locale: it })
}

export function formatRelative(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: it })
}

export function formatMessageTime(date) {
  const d = new Date(date)
  const diffH = differenceInHours(new Date(), d)
  if (diffH < 24) return format(d, 'HH:mm')
  return format(d, 'd MMM')
}

export const CATEGORIES = [
  { id: 'aperitivo', label: 'Aperitivo',  emoji: '🍹' },
  { id: 'cinema',    label: 'Cinema',     emoji: '🎬' },
  { id: 'run',       label: 'Running',    emoji: '🏃' },
  { id: 'walk',      label: 'Walk',       emoji: '🚶' },
  { id: 'reading',   label: 'Reading',    emoji: '📖' },
  { id: 'music',     label: 'Music',      emoji: '🎵' },
  { id: 'cooking',   label: 'Cooking',    emoji: '🍳' },
  { id: 'other',     label: 'Other',      emoji: '✨' },
]

export function getCategoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label ?? id
}

export function getCategoryEmoji(id) {
  return CATEGORIES.find(c => c.id === id)?.emoji ?? '✨'
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Reputation tiers ────────────────────────────────────────────────────────

export const REPUTATION_TIERS = [
  {
    id: 'founding_member',
    label: 'Founding Member',
    emoji: '🏛️',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    description: 'Tra i primi 100 membri di Tacto in Italia — parte della storia.',
  },
  {
    id: 'top_host',
    label: 'Top Host',
    emoji: '⭐',
    colorClass: 'text-sage',
    bgClass: 'bg-sage-50',
    borderClass: 'border-sage-200',
    description: 'Host con valutazione media ≥4.7 e almeno 10 esperienze completate.',
  },
  {
    id: 'trusted_explorer',
    label: 'Trusted Explorer',
    emoji: '🧭',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    description: 'Ha completato 5+ esperienze con feedback positivi costanti.',
  },
  {
    id: 'elite_connector',
    label: 'Elite Connector',
    emoji: '🔗',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    description: 'Connettore di riferimento — ha invitato amici e fatto crescere la community.',
  },
  {
    id: 'city_leader',
    label: 'Milan Social Leader',
    emoji: '🏙️',
    colorClass: 'text-charcoal',
    bgClass: 'bg-warm-100',
    borderClass: 'border-charcoal-200',
    description: 'Tra le persone più attive e rispettate della community di Milano.',
  },
]

export function getTier(tierId) {
  return REPUTATION_TIERS.find(t => t.id === tierId) ?? null
}

// ─── Trust score (0-100) ─────────────────────────────────────────────────────

export function calculateTrustScore(user) {
  if (!user) return 0
  let score = 0
  if (user.is_verified)                         score += 40
  if (user.bio && user.bio.length > 20)         score += 10
  if (user.avatar_url)                          score += 5
  if (user.email)                               score += 5
  score += Math.min(20, (user.completed_bookings ?? 0) * 4)
  if ((user.rating ?? 0) >= 4.5)               score += 10
  score += Math.min(10, (user.experience_count ?? 0))
  return Math.min(100, score)
}

export function trustScoreLabel(score) {
  if (score >= 80) return 'Eccellente'
  if (score >= 60) return 'Buono'
  if (score >= 40) return 'In crescita'
  return 'Nuovo'
}

export function trustScoreColor(score) {
  if (score >= 80) return '#4A7C6F'  // sage
  if (score >= 60) return '#F59E0B'  // amber
  return '#9CA3AF'                   // gray
}

// ─── Cities ──────────────────────────────────────────────────────────────────

export const CITIES = [
  { id: 'Milano',     label: 'Milano',      flag: '🇮🇹', active: true },
  { id: 'Barcellona', label: 'Barcellona',  flag: '🇪🇸', active: false },
  { id: 'Lisbona',    label: 'Lisbona',     flag: '🇵🇹', active: false },
]

// ─── Anti-bypass detection ───────────────────────────────────────────────────

const BYPASS_PATTERNS = [
  /\b(\+?[\d][\s\d\-\(\)\.]{7,}[\d])\b/,
  /@[\w.]{2,}/,
  /instagram|ig\s*[:=]/i,
  /whatsapp|wa[.\-]?me\b|wapp/i,
  /telegram|t[.\-]me\b/i,
  /\b[\w.+%-]{2,}@[\w-]+\.[a-z]{2,}\b/i,
  /\bsignal\b/i,
  /facebook|fb[.\-]com/i,
  /snapchat/i,
  /tiktok/i,
  /discord\.gg/i,
]

export function detectBypass(text) {
  return BYPASS_PATTERNS.some(rx => rx.test(text))
}
