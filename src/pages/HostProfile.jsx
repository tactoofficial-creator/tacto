import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Award, Shield, UserPlus, Flag } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Stars } from '@/components/ui/Stars'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ExperienceCardHorizontal } from '@/components/experience/ExperienceCard'
import { mockHosts, mockExperiences } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'

export default function HostProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const host = mockHosts.find(h => h.id === id) ?? mockHosts[0]
  const experiences = mockExperiences.filter(e => e.host.id === id || e.host.id === 'h1').slice(0, 3)

  return (
    <div className="flex flex-col bg-white min-h-screen-safe">
      {/* Header */}
      <div className="relative">
        {/* Background image */}
        <div
          className="h-48 bg-warm-200"
          style={{
            background: 'linear-gradient(135deg, #F5F5F3 0%, #D8ECEB 100%)'
          }}
        />

        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-[calc(env(safe-area-inset-top)+12px)] left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </motion.button>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-5">
          <Avatar
            src={host.avatar_url}
            name={host.full_name}
            size="2xl"
            verified={host.is_verified}
            className="ring-4 ring-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="px-5 pt-12 pb-8">
          {/* Name + actions */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-charcoal">{host.full_name}</h1>
              <p className="text-sm text-charcoal-400 mt-0.5">{host.city}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-warm border border-charcoal-100"
              >
                <UserPlus className="w-4 h-4 text-charcoal" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-warm border border-charcoal-100"
              >
                <Flag className="w-4 h-4 text-charcoal-400" />
              </motion.button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-4">
            {host.is_verified && (
              <Badge variant="sage">
                <Shield className="w-3 h-3" /> Identità verificata
              </Badge>
            )}
            <Badge variant="amber">
              <Star className="w-3 h-3" /> Host dal {host.joined}
            </Badge>
            {host.experience_count > 20 && (
              <Badge variant="default">
                <Award className="w-3 h-3" /> Superhost
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Valutazione', value: host.rating?.toFixed(1) ?? '—', icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> },
              { label: 'Esperienze', value: host.experience_count, icon: <Award className="w-4 h-4 text-sage" /> },
              { label: 'Completate', value: host.experience_count, icon: <Shield className="w-4 h-4 text-charcoal-400" /> },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center p-3 bg-warm rounded-2xl gap-1">
                {stat.icon}
                <span className="text-xl font-bold text-charcoal">{stat.value}</span>
                <span className="text-xs text-charcoal-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-charcoal mb-2">Chi sono</h2>
            <p className="text-base text-charcoal-500 leading-relaxed">{host.bio}</p>
          </div>

          <div className="h-px bg-charcoal-100 mb-5" />

          {/* Experiences */}
          <div>
            <h2 className="text-base font-semibold text-charcoal mb-3">
              Le mie esperienze
            </h2>
            <div className="space-y-3">
              {experiences.map(exp => (
                <ExperienceCardHorizontal key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
