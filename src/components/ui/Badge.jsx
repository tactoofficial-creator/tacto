import { cn } from '@/lib/utils'

const variants = {
  default:  'bg-warm text-charcoal-400',
  sage:     'bg-sage-50 text-sage-700',
  charcoal: 'bg-charcoal text-white',
  green:    'bg-green-50 text-green-700',
  amber:    'bg-amber-50 text-amber-700',
  red:      'bg-red-50 text-red-600',
  blue:     'bg-blue-50 text-blue-700',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'In attesa', variant: 'amber' },
    confirmed: { label: 'Confermato', variant: 'green' },
    completed: { label: 'Completato', variant: 'sage' },
    cancelled: { label: 'Annullato', variant: 'red' },
    refunded:  { label: 'Rimborsato', variant: 'blue' },
  }
  const { label, variant } = map[status] ?? { label: status, variant: 'default' }
  return <Badge variant={variant}>{label}</Badge>
}
