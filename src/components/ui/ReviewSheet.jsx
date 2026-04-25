import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button } from './Button'
import { Textarea } from './Input'
import { Avatar } from './Avatar'
import toast from 'react-hot-toast'

export function ReviewSheet({ open, onClose, booking }) {
  const [rating, setRating]   = useState(0)
  const [hover, setHover]     = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving]   = useState(false)

  const host = booking?.experience?.host
  const charLeft = 280 - comment.length

  const submit = async () => {
    if (!rating) { toast.error('Dai una valutazione'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    toast.success('Recensione inviata! Grazie 🙏')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Lascia una recensione">
      <div className="px-6 pb-10 space-y-6">
        {/* Host card */}
        {host && (
          <div className="flex items-center gap-3 p-4 bg-warm rounded-2xl">
            <Avatar src={host.avatar_url} name={host.full_name} size="md" />
            <div>
              <p className="font-semibold text-charcoal text-sm">{host.full_name}</p>
              <p className="text-xs text-charcoal-400 mt-0.5 line-clamp-1">
                {booking?.experience?.title}
              </p>
            </div>
          </div>
        )}

        {/* Stars */}
        <div>
          <p className="text-sm font-medium text-charcoal mb-3 text-center">Com'è stata l'esperienza?</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button
                key={star}
                whileTap={{ scale: 0.85 }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className="w-10 h-10 transition-all duration-150"
                  fill={star <= (hover || rating) ? '#FBBF24' : 'none'}
                  color={star <= (hover || rating) ? '#FBBF24' : '#D4D4D4'}
                  strokeWidth={1.5}
                />
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {(hover || rating) > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-charcoal-400 mt-2"
              >
                {['', 'Non mi è piaciuta', 'Così così', 'Bella', 'Molto bella', 'Eccezionale!'][hover || rating]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <div>
          <Textarea
            label="Racconta la tua esperienza (opzionale)"
            value={comment}
            onChange={e => comment.length < 280 || e.target.value.length < comment.length
              ? setComment(e.target.value) : null}
            placeholder="Cosa ti ha sorpreso? Cosa ricorderai?"
            rows={4}
            hint={`${charLeft} caratteri rimanenti`}
          />
        </div>

        <Button
          variant="sage"
          size="xl"
          fullWidth
          loading={saving}
          disabled={!rating}
          onClick={submit}
        >
          Pubblica recensione
        </Button>

        <p className="text-xs text-charcoal-300 text-center">
          Le recensioni non possono essere eliminate e sono visibili a tutti.
        </p>
      </div>
    </Sheet>
  )
}
