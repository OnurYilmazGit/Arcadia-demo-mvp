"use client"

import type React from "react"
import { motion } from "framer-motion"
import { MapPin, Star, CheckSquare, Square } from "lucide-react"
import { candidateService } from "@/lib/candidate-service"

interface CandidateCardProps {
  candidate: {
    id: string
    name: string
    title: string
    avatar?: string
    matchPercentage: number
    location?: string
    experience?: string
    skills: string[]
    salary?: string
  }
  onClick: () => void
  isSelected: boolean
  matchedSkills?: string[]
  delay?: number
  rank?: number
  onToggleCompare: (candidateId: string) => void
  isComparing: boolean
}

export function CandidateCard({
  candidate,
  onClick,
  isSelected,
  matchedSkills,
  delay = 0,
  rank = 1,
  onToggleCompare,
  isComparing,
}: CandidateCardProps) {
  const isShortlisted = candidateService.shortlistManager.isShortlisted(candidate.id)

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    candidateService.shortlistManager.toggleShortlist(candidate.id)
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCompare(candidate.id)
  }

  const avatarUrl = candidate.avatar || "/professional-person.png"

  const getMatchLabel = (rank: number): string => {
    if (rank === 1) return "Top Match"
    if (rank <= 3) return "Excellent Match"
    if (rank <= 5) return "Great Match"
    return "Good Match"
  }

  const getMatchLabelColor = (rank: number): string => {
    if (rank === 1) return "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold)]/80 text-white"
    if (rank <= 3) return "bg-gradient-to-r from-[var(--success-green)] to-[var(--success-green)]/80 text-white"
    if (rank <= 5) return "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue)]/80 text-white"
    return "bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-secondary)]/80 text-white"
  }

  return (
    <motion.div
      className={`relative glass-card p-6 cursor-pointer transition-all overflow-hidden group border ${
        isSelected ? "border-[var(--accent-blue)] shadow-lg" : "border-transparent"
      } ${isComparing ? "ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] ring-[var(--accent-primary)]" : ""}`}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <motion.div
          className="absolute w-48 h-48 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{ x: [-150, 450] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "linear" }}
        />
      </div>

      <button
        onClick={handleShortlistClick}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
          isShortlisted
            ? "bg-[var(--accent-gold)] text-white shadow-md"
            : "bg-white/10 text-[var(--text-secondary)] hover:bg-white/20"
        }`}
        aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
      >
        <Star className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`} />
      </button>

      {/* Redesigned Compare Button */}
      <button
        onClick={handleCompareClick}
        className={`absolute top-3 left-3 p-1.5 rounded-full z-10 transition-all duration-200 ${
          isComparing
            ? "bg-[var(--accent-primary)]/80 text-white"
            : "bg-transparent text-transparent group-hover:bg-black/20 group-hover:text-[var(--text-primary)]"
        }`}
        aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
      >
        {isComparing ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
      </button>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5 shadow-sm">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={`${candidate.name} avatar`}
                className="w-full h-full rounded-full bg-[var(--bg-secondary)] object-cover"
                onError={(e) => (e.currentTarget.src = "/professional-person.png")}
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{candidate.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{candidate.title}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getMatchLabelColor(rank)}`}>
          {getMatchLabel(rank)}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {candidate.location || "Not specified"}
        </div>
        <span>•</span>
        <span>{candidate.experience || "N/A"}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {candidate.skills.slice(0, 3).map((skill) => {
          const isMatched = matchedSkills?.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
          return (
            <span
              key={skill}
              className={`skill-tag text-xs px-2 py-0.5 ${
                isMatched
                  ? "bg-[var(--success-green)]/20 text-[var(--success-green)] border-[var(--success-green)]/30"
                  : "bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)]"
              }`}
            >
              {skill}
            </span>
          )
        })}
        {candidate.skills.length > 3 && (
          <span className="skill-tag text-xs px-2 py-0.5 bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)]">
            +{candidate.skills.length - 3} more
          </span>
        )}
      </div>
      <div className="text-sm font-medium text-[var(--text-primary)]">{candidate.salary || "Not specified"}</div>
    </motion.div>
  )
}
