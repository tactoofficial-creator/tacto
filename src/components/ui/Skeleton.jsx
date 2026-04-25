import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return (
    <div className={cn('skeleton rounded-2xl', className)} />
  )
}

export function ExperienceCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card">
      <Skeleton className="w-full h-56" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
