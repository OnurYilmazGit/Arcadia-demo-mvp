"use client"

import type React from "react"

import { motion } from "framer-motion"
import { MapPin, Star } from "lucide-react"
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
  matchScore?: number
  matchedSkills?: string[]
  delay?: number
  rank?: number
}

export function CandidateCard({
  candidate,
  onClick,
  isSelected,
  matchScore,
  matchedSkills,
  delay = 0,
  rank = 1,
}: CandidateCardProps) {
  const isShortlisted = candidateService.shortlistManager.isShortlisted(candidate.id)

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isShortlisted) {
      candidateService.shortlistManager.removeFromShortlist(candidate.id)
    } else {
      candidateService.shortlistManager.addToShortlist(candidate.id)
    }
    // Force re-render
    window.dispatchEvent(new CustomEvent("shortlistUpdated"))
  }

  // Generate gender-appropriate icon
  const getGenderIcon = (name: string) => {
    const femaleNames = [
      "sarah",
      "emily",
      "maria",
      "jennifer",
      "lisa",
      "rachel",
      "amanda",
      "michelle",
      "nicole",
      "jessica",
      "stephanie",
      "karen",
      "sandra",
      "donna",
      "melissa",
    ]
    const firstName = name.toLowerCase().split(" ")[0]
    return femaleNames.includes(firstName) ? "👩‍💼" : "👨‍💼"
  }

  const getMatchLabel = (rank: number): string => {
    switch (rank) {
      case 1:
        return "Top Match"
      case 2:
      case 3:
        return "Excellent Match"
      case 4:
        return "Great Match"
      case 5:
      case 6:
        return "Good Match"
      default:
        return "Good Match"
    }
  }

  const getMatchLabelColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold)]/80 text-white"
      case 2:
      case 3:
        return "bg-gradient-to-r from-[var(--success-green)] to-[var(--success-green)]/80 text-white"
      case 4:
        return "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue)]/80 text-white"
      case 5:
      case 6:
        return "bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-secondary)]/80 text-white"
      default:
        return "bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-secondary)]/80 text-white"
    }
  }

  return (
    <motion.div
      className={`relative glass-card p-6 cursor-pointer transition-all overflow-hidden group ${
        isSelected ? "border-[var(--accent-blue)] shadow-lg" : ""
      }`}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Subtle moving light effect */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{
            x: [-100, 400],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 5,
            ease: "linear",
          }}
        />
      </div>

      {/* Shortlist button */}
      <button
        onClick={handleShortlistClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
          isShortlisted
            ? "bg-[var(--accent-gold)] text-white shadow-lg"
            : "bg-white/20 text-[var(--text-secondary)] hover:bg-white/30"
        }`}
      >
        <Star className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`} />
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pr-12">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5">
              <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center text-2xl">
                {getGenderIcon(candidate.name)}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--success-green)] rounded-full border border-[var(--bg-primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{candidate.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{candidate.title}</p>
          </div>
        </div>
        {/* Match Label instead of percentage */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchLabelColor(rank)}`}>
          {getMatchLabel(rank)}
        </div>
      </div>

      {/* Location & Experience */}
      <div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {candidate.location || "Munich, Germany"}
        </div>
        <span>•</span>
        <span>{candidate.experience || "3+ years"}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.slice(0, 3).map((skill) => {
          const isMatched = matchedSkills?.includes(skill.toLowerCase())
          return (
            <span
              key={skill}
              className={`skill-tag ${
                isMatched
                  ? "bg-[var(--success-green)]/20 text-[var(--success-green)] border-[var(--success-green)]/30"
                  : ""
              }`}
            >
              {skill}
            </span>
          )
        })}
        {candidate.skills.length > 3 && (
          <span className="skill-tag bg-[var(--text-muted)]/20 text-[var(--text-muted)] border-[var(--text-muted)]/30">
            +{candidate.skills.length - 3}
          </span>
        )}
      </div>

      {/* Salary */}
      <div className="text-sm font-medium text-[var(--text-primary)]">{candidate.salary || "€70,000 - €110,000"}</div>
    </motion.div>
  )
}
