"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Calendar, Download, MapPin, Phone, Star, Save, ChevronDown, ChevronUp } from "lucide-react"
import { candidateService } from "@/lib/candidate-service"

interface CandidateProfileProps {
  candidate: {
    id: string
    name: string
    title: string
    avatar?: string
    matchPercentage: number
    location?: string
    experience?: string
    email?: string
    phone?: string
    bio?: string
    salary?: string
    skills?: string[]
    summary?: string
    about?: string
  }
  onShortlist: () => void
  isShortlisted: boolean
  onDownloadResume?: () => void
  matchedSkills?: string[]
  missingSkills?: string[]
  rank?: number
}

export function CandidateProfile({
  candidate,
  onShortlist,
  isShortlisted,
  onDownloadResume,
  matchedSkills = [],
  missingSkills = [],
  rank = 1,
}: CandidateProfileProps) {
  const [notes, setNotes] = useState("")
  const [showAllMatched, setShowAllMatched] = useState(false)
  const [showAllMissing, setShowAllMissing] = useState(false)
  const [saveAnimation, setSaveAnimation] = useState(false)

  useEffect(() => {
    setNotes(candidateService.shortlistManager.getNotes(candidate.id))
  }, [candidate.id])

  const handleSaveNotes = () => {
    candidateService.shortlistManager.setNotes(candidate.id, notes)
    setSaveAnimation(true)
    setTimeout(() => setSaveAnimation(false), 1000)
  }

  const handleScheduleClick = () => {
    window.open("http://cal.com/arcadia/30min", "_blank")
  }

  const handleDownloadResume = () => {
    if (onDownloadResume) {
      onDownloadResume()
    } else {
      // Create a proper resume download
      const link = document.createElement("a")
      link.href = `/api/download-resume/${candidate.id}`
      link.download = `${candidate.name.replace(" ", "_")}_Resume.docx`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

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

  const capitalizeSkill = (skill: string) => {
    return skill.charAt(0).toUpperCase() + skill.slice(1)
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
      className="glass-card p-6 sticky top-8 relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle moving light effect */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{
            x: [-100, 400],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 6,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5">
              <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center text-3xl">
                {getGenderIcon(candidate.name)}
              </div>
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
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getMatchLabelColor(rank)}`}>
            {getMatchLabel(rank)}
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Match Quality</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {rank === 1
                ? "Perfect for this role"
                : rank <= 3
                  ? "Highly recommended"
                  : rank === 4
                    ? "Strong candidate"
                    : "Good potential"}
            </p>
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
          <button
            onClick={() => window.open(`mailto:${candidate.email || "info@arcadianetwork.io"}`, "_blank")}
            className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={handleScheduleClick}
            className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={handleDownloadResume}
            className="glass-button py-3 px-4 text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Resume
          </button>
        </div>

        {/* About */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">About</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
            {candidate.bio ||
              candidate.summary ||
              candidate.about ||
              `Experienced professional with expertise in ${candidate.title || "software development"}.`}
          </p>
        </div>

        {/* Skills Match Analysis */}
        {(matchedSkills.length > 0 || missingSkills.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Skills Analysis</h3>

            {/* Matched Skills */}
            {matchedSkills.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[var(--success-green)]">✓ Matched Skills ({matchedSkills.length})</p>
                  {matchedSkills.length > 6 && (
                    <button
                      onClick={() => setShowAllMatched(!showAllMatched)}
                      className="text-xs text-[var(--accent-blue)] flex items-center gap-1 hover:underline"
                    >
                      {showAllMatched ? "Show Less" : `+${matchedSkills.length - 6} more`}
                      {showAllMatched ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(showAllMatched ? matchedSkills : matchedSkills.slice(0, 6)).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-[var(--success-green)]/20 text-[var(--success-green)] rounded-full border border-[var(--success-green)]/30"
                    >
                      {capitalizeSkill(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills to Develop */}
            {missingSkills.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[var(--text-muted)]">○ Skills to Develop ({missingSkills.length})</p>
                  {missingSkills.length > 4 && (
                    <button
                      onClick={() => setShowAllMissing(!showAllMissing)}
                      className="text-xs text-[var(--accent-blue)] flex items-center gap-1 hover:underline"
                    >
                      {showAllMissing ? "Show Less" : `+${missingSkills.length - 4} more`}
                      {showAllMissing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(showAllMissing ? missingSkills : missingSkills.slice(0, 4)).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-[var(--text-muted)]/20 text-[var(--text-muted)] rounded-full border border-[var(--text-muted)]/30"
                    >
                      {capitalizeSkill(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
              <Mail className="w-4 h-4 text-[var(--accent-blue)]" />
              {candidate.email || "info@arcadianetwork.io"}
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
              <Phone className="w-4 h-4 text-[var(--accent-blue)]" />
              {candidate.phone || "+49 178 603 2 432"}
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
              <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
              {candidate.location || "Munich, Germany"}
            </div>
          </div>
        </div>

        {/* Salary Expectation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Salary Expectation</h3>
          <p className="text-[var(--accent-gold)] font-medium">{candidate.salary || "€70,000 - €110,000"}</p>
        </div>

        {/* Notes */}
        <div className="relative">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes about this candidate..."
            className="w-full h-20 p-3 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
          <button
            onClick={handleSaveNotes}
            className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${
              saveAnimation
                ? "bg-[var(--success-green)] text-white scale-110"
                : "bg-white/20 text-[var(--text-secondary)] hover:bg-white/30"
            }`}
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
