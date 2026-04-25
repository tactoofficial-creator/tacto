import { cn } from '@/lib/utils'

export function Input({
  label,
  error,
  hint,
  icon,
  className,
  wrapperClassName,
  type = 'text',
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            'w-full h-12 rounded-2xl border bg-white text-charcoal text-base',
            'placeholder:text-charcoal-300',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-charcoal-100 hover:border-charcoal-200',
            icon ? 'pl-10 pr-4' : 'px-4',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-charcoal-300">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, error, hint, className, wrapperClassName, rows = 4, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-charcoal">{label}</label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'w-full rounded-2xl border bg-white text-charcoal text-base',
          'placeholder:text-charcoal-300',
          'px-4 py-3 resize-none',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
            : 'border-charcoal-100 hover:border-charcoal-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-charcoal-300">{hint}</p>}
    </div>
  )
}
