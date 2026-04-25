import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return (
    <div className={cn('skeleton rounded-2xl', className)} />
  )
}

export function ExperienceCardSkeleton({ size = 'md' }) {
  const heights = { sm: 'h-64', md: 'h-80', lg: 'h-96' }
  return (
    <div className={`${heights[size]} w-full rounded-3xl overflow-hidden`}>
      <Skeleton className="w-full h-full rounded-3xl" />
    </div>
  )
}
