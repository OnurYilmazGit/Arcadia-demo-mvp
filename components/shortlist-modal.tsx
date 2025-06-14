"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Save, Calendar, Download, Mail } from "lucide-react"
import { candidateService, type MatchedCandidate } from "@/lib/candidate-service"

interface ShortlistModalProps {
  isOpen: boolean
  onClose: () => void
  allCandidates: MatchedCandidate[]
}

export function ShortlistModal({ isOpen, onClose, allCandidates }: ShortlistModalProps) {
  const [shortlistedCandidates, setShortlistedCandidates] = useState<MatchedCandidate[]>([])
  const [notes, setNotes] = useState<{ [key: string]: string }>({})
  const [saveAnimations, setSaveAnimations] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (isOpen) {
      const shortlistedIds = candidateService.shortlistManager.getShortlistedIds()
      const shortlisted = allCandidates.filter((candidate) => shortlistedIds.includes(candidate.id))
      setShortlistedCandidates(shortlisted)

      // Load existing notes
      const existingNotes: { [key: string]: string } = {}
      shortlistedIds.forEach((id) => {
        existingNotes[id] = candidateService.shortlistManager.getNotes(id)
      })
      setNotes(existingNotes)
    }
  }, [isOpen, allCandidates])

  const handleSaveNotes = (candidateId: string) => {
    candidateService.shortlistManager.setNotes(candidateId, notes[candidateId] || "")
    setSaveAnimations((prev) => ({ ...prev, [candidateId]: true }))
    setTimeout(() => {
      setSaveAnimations((prev) => ({ ...prev, [candidateId]: false }))
    }, 1000)
  }

  const handleScheduleClick = () => {
    window.open("http://cal.com/arcadia/30min", "_blank")
  }

  const handleDownloadResume = (candidateId: string) => {
    const link = document.createElement("a")
    link.href = `/api/download-resume/${candidateId}`
    link.download = `${candidateId}_resume.docx`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-[var(--accent-gold)] fill-current" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Shortlisted Candidates ({shortlistedCandidates.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--text-secondary)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {shortlistedCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No candidates shortlisted yet</h3>
                <p className="text-[var(--text-secondary)]">
                  Click the star icon on candidate cards to add them to your shortlist.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {shortlistedCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    className="glass-card p-6 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Subtle light effect */}
                    <div className="absolute inset-0 opacity-20">
                      <motion.div
                        className="absolute w-32 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                        animate={{
                          x: [-100, 400],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 8,
                          ease: "linear",
                        }}
                      />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start gap-6">
                        {/* Left: Candidate Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5">
                              <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center text-3xl">
                                {getGenderIcon(candidate.name)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">{candidate.name}</h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchLabelColor(
                                    index + 1,
                                  )}`}
                                >
                                  {getMatchLabel(index + 1)}
                                </span>
                              </div>
                              <p className="text-[var(--text-secondary)] mb-2">{candidate.title}</p>
                              <p className="text-sm text-[var(--text-muted)]">
                                {candidate.location} • {candidate.experience}
                              </p>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {candidate.matchedSkills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 text-xs bg-[var(--success-green)]/20 text-[var(--success-green)] rounded-full border border-[var(--success-green)]/30"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.matchedSkills.length > 4 && (
                                <span className="px-2 py-1 text-xs text-[var(--text-muted)] rounded-full">
                                  +{candidate.matchedSkills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => window.open(`mailto:${candidate.email}`, "_blank")}
                              className="flex items-center gap-2 px-4 py-2 glass-button text-sm text-[var(--text-secondary)]"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </button>
                            <button
                              onClick={handleScheduleClick}
                              className="flex items-center gap-2 px-4 py-2 glass-button text-sm text-[var(--text-secondary)]"
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule
                            </button>
                            <button
                              onClick={() => handleDownloadResume(candidate.id)}
                              className="flex items-center gap-2 px-4 py-2 glass-button text-sm text-[var(--text-secondary)]"
                            >
                              <Download className="w-4 h-4" />
                              Resume
                            </button>
                          </div>
                        </div>

                        {/* Right: Notes */}
                        <div className="w-80 relative">
                          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Notes</h4>
                          <textarea
                            value={notes[candidate.id] || ""}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [candidate.id]: e.target.value }))}
                            placeholder="Add your notes about this candidate..."
                            className="w-full h-24 p-3 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                          />
                          <button
                            onClick={() => handleSaveNotes(candidate.id)}
                            className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${
                              saveAnimations[candidate.id]
                                ? "bg-[var(--success-green)] text-white scale-110"
                                : "bg-white/20 text-[var(--text-secondary)] hover:bg-white/30"
                            }`}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
