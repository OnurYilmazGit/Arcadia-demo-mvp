"use client"

import { motion } from "framer-motion"
import { Mail, Calendar, Download, MapPin, Phone, Star } from "lucide-react"
import { MatchScore } from "./ui/match-score"

interface CandidateProfileProps {
  candidate: {
    id: string
    name: string
    title: string
    avatar: string
    matchPercentage: number
    location: string
    experience: string
    email: string
    phone: string
    bio: string
    salary: string
  }
  onShortlist: () => void
  isShortlisted: boolean
}

export function CandidateProfile({ candidate, onShortlist, isShortlisted }: CandidateProfileProps) {
  return (
    <motion.div
      className="glass-card p-6 sticky top-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5">
            <img
              src={candidate.avatar || "/placeholder.svg"}
              alt={candidate.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--success-green)] rounded-full border-2 border-[var(--bg-primary)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{candidate.name}</h2>
          <p className="text-[var(--text-secondary)]">{candidate.title}</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="flex items-center gap-4 mb-6">
        <MatchScore percentage={candidate.matchPercentage} size="md" />
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Match Score</p>
          <p className="text-lg font-semibold text-[var(--text-primary)]">Excellent Fit</p>
        </div>
      </div>

      {/* Shortlist Button */}
      <button
        onClick={onShortlist}
        className={`w-full py-3 px-6 rounded-full font-medium mb-6 flex items-center justify-center gap-2 transition-all ${
          isShortlisted
            ? "bg-[var(--accent-gold)] text-[var(--bg-primary)]"
            : "glass-button text-[var(--text-secondary)]"
        }`}
      >
        <Star className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`} />
        {isShortlisted ? "Shortlisted" : "Shortlist"}
      </button>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Schedule
        </button>
        <button className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Resume
        </button>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">About</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{candidate.bio}</p>
      </div>

      {/* Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
            <Mail className="w-4 h-4 text-[var(--accent-blue)]" />
            {candidate.email}
          </div>
          <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
            <Phone className="w-4 h-4 text-[var(--accent-blue)]" />
            {candidate.phone}
          </div>
          <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
            <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
            {candidate.location}
          </div>
        </div>
      </div>

      {/* Salary Expectation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Salary Expectation</h3>
        <p className="text-[var(--accent-gold)] font-medium">{candidate.salary}</p>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
        <textarea
          placeholder="Add your notes about this candidate..."
          className="w-full h-20 p-3 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
        />
      </div>
    </motion.div>
  )
}
