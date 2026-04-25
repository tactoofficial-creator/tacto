import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-charcoal text-white hover:bg-charcoal-600 active:bg-charcoal-700',
  sage:    'bg-sage text-white hover:bg-sage-600 active:bg-sage-dark',
  outline: 'border border-charcoal-200 text-charcoal bg-white hover:bg-warm active:bg-warm-200',
  ghost:   'text-charcoal hover:bg-warm active:bg-warm-200',
  danger:  'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200',
}

const sizes = {
  sm: 'h-9 px-4 text-sm rounded-xl gap-1.5',
  md: 'h-12 px-5 text-base rounded-2xl gap-2',
  lg: 'h-14 px-6 text-lg rounded-2xl gap-2',
  xl: 'h-16 px-8 text-lg rounded-3xl gap-2.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  icon,
  fullWidth,
  disabled,
  onClick,
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ duration: 0.1 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none',
        'disabled:opacity-40 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
