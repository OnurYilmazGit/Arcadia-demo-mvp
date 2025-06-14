"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { MatchScore } from "./ui/match-score"

interface CandidateCardProps {
  candidate: {
    id: string
    name: string
    title: string
    avatar: string
    matchPercentage: number
    location: string
    experience: string
    skills: string[]
    salary: string
  }
  onClick: () => void
  isSelected: boolean
}

export function CandidateCard({ candidate, onClick, isSelected }: CandidateCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 cursor-pointer transition-all ${isSelected ? "border-[var(--accent-blue)]" : ""}`}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5">
              <img
                src={candidate.avatar || "/placeholder.svg"}
                alt={candidate.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--success-green)] rounded-full border border-[var(--bg-primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{candidate.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{candidate.title}</p>
          </div>
        </div>
        <MatchScore percentage={candidate.matchPercentage} size="sm" />
      </div>

      {/* Location & Experience */}
      <div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {candidate.location}
        </div>
        <span>•</span>
        <span>{candidate.experience}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 3 && (
          <span className="skill-tag bg-[var(--text-muted)]/20 text-[var(--text-muted)] border-[var(--text-muted)]/30">
            +{candidate.skills.length - 3}
          </span>
        )}
      </div>

      {/* Salary */}
      <div className="text-sm font-medium text-[var(--text-primary)]">{candidate.salary}</div>
    </motion.div>
  )
}
