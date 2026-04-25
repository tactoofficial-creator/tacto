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
