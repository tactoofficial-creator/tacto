import { cn } from '@/lib/utils'

const sizes = {
  xs:  'w-6 h-6 text-xs',
  sm:  'w-8 h-8 text-sm',
  md:  'w-10 h-10 text-base',
  lg:  'w-14 h-14 text-xl',
  xl:  'w-20 h-20 text-2xl',
  '2xl': 'w-28 h-28 text-3xl',
}

export function Avatar({ src, name, size = 'md', className, verified }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div className={cn(
        'rounded-full overflow-hidden bg-warm-200 flex items-center justify-center',
        'ring-2 ring-white',
        sizes[size]
      )}>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-semibold text-charcoal-400 select-none">
            {initials}
          </span>
        )}
      </div>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-sage shadow-sm">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10.28 2.28L4.5 8.06 1.72 5.28a1 1 0 00-1.44 1.44l3.5 3.5a1 1 0 001.44 0l6.5-6.5a1 1 0 00-1.44-1.44z"/>
          </svg>
        </span>
      )}
    </div>
  )
}
