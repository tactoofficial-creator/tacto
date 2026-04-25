import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { RotateCw } from 'lucide-react'

const THRESHOLD = 72

export function PullToRefresh({ onRefresh, children }) {
  const [refreshing, setRefreshing] = useState(false)
  const startY   = useRef(null)
  const pullY    = useMotionValue(0)
  const opacity  = useTransform(pullY, [0, THRESHOLD], [0, 1])
  const rotate   = useTransform(pullY, [0, THRESHOLD], [0, 180])
  const scale    = useTransform(pullY, [0, THRESHOLD], [0.5, 1])

  const onTouchStart = (e) => {
    if (refreshing) return
    const el = e.currentTarget
    if (el.scrollTop > 0) return
    startY.current = e.touches[0].clientY
  }

  const onTouchMove = (e) => {
    if (startY.current === null || refreshing) return
    const delta = e.touches[0].clientY - startY.current
    if (delta < 0) return
    const dampened = Math.min(delta * 0.45, THRESHOLD + 20)
    pullY.set(dampened)
  }

  const onTouchEnd = async () => {
    const current = pullY.get()
    startY.current = null
    if (current >= THRESHOLD && !refreshing) {
      setRefreshing(true)
      await onRefresh?.()
      setRefreshing(false)
    }
    pullY.set(0)
  }

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Refresh indicator */}
      <div className="flex justify-center overflow-hidden" style={{ height: 0, position: 'relative' }}>
        <motion.div
          style={{ y: pullY, opacity, scale }}
          className="absolute top-2 w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <motion.div style={{ rotate }}>
            <RotateCw
              className={`w-4 h-4 transition-colors ${refreshing ? 'text-sage animate-spin' : 'text-charcoal-400'}`}
            />
          </motion.div>
        </motion.div>
      </div>
      <motion.div style={{ y: refreshing ? 48 : pullY }}>
        {children}
      </motion.div>
    </div>
  )
}
