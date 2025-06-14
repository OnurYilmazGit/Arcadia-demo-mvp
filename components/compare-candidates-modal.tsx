"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MatchedCandidate } from "@/lib/candidate-service"
import { MapPin, Briefcase, Euro } from "lucide-react" // Changed to Euro icon

interface CompareCandidatesModalProps {
  isOpen: boolean
  onClose: () => void
  candidates: MatchedCandidate[]
}

export function CompareCandidatesModal({ isOpen, onClose, candidates }: CompareCandidatesModalProps) {
  if (!isOpen) return null

  const gridColsClass = `md:grid-cols-${Math.min(candidates.length, 3)}`

  const getMatchLabelColor = (percentage: number): string => {
    if (percentage > 85) return "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold)]/80 text-white"
    if (percentage > 70) return "bg-gradient-to-r from-[var(--success-green)] to-[var(--success-green)]/80 text-white"
    if (percentage > 50) return "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue)]/80 text-white"
    return "bg-gradient-to-r from-[var(--text-secondary)] to-[var(--text-secondary)]/80 text-white"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] bg-[var(--bg-modal)] border-[var(--glass-border)] text-[var(--text-primary)] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Compare Candidates</DialogTitle>
          <DialogDescription>Side-by-side comparison of selected candidates.</DialogDescription>
        </DialogHeader>

        <div className={`grid grid-cols-1 ${gridColsClass} gap-4 p-6 pt-0 overflow-x-auto`}>
          {candidates.slice(0, 3).map((candidate) => (
            <div key={candidate.id} className="glass-card p-5 rounded-lg flex flex-col h-full">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-gold)] p-0.5 shadow-sm">
                      <img
                        src={candidate.avatar || "/professional-person.png"}
                        alt={`${candidate.name} avatar`}
                        className="w-full h-full rounded-full bg-[var(--bg-secondary)] object-cover"
                        onError={(e) => (e.currentTarget.src = "/professional-person.png")}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">{candidate.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{candidate.title}</p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getMatchLabelColor(
                    candidate.matchPercentage,
                  )}`}
                >
                  {candidate.matchPercentage}% Match
                </div>
              </div>

              {/* Details Section */}
              <div className="text-sm space-y-1.5 mb-4 flex-grow text-[var(--text-secondary)]">
                <p className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-[var(--accent-blue)]" /> Exp: {candidate.experience}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[var(--accent-green)]" /> Loc: {candidate.location}
                </p>
                <p className="flex items-center">
                  <Euro className="w-4 h-4 mr-2 text-[var(--accent-purple)]" /> Sal: {candidate.salary}
                </p>
              </div>

              {/* Skills Sections */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1.5 text-[var(--text-primary)]">Matched Skills:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.matchedSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="skill-tag text-xs px-2 py-0.5 bg-[var(--success-green)]/20 text-[var(--success-green)] border-[var(--success-green)]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1.5 text-[var(--text-primary)]">Missing Skills:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.missingSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="skill-tag text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {candidates.length > 3 && (
          <p className="text-xs text-center text-[var(--text-muted)] pb-2">
            Displaying first 3 candidates for optimal view. {candidates.length} selected in total.
          </p>
        )}
        <DialogFooter className="p-6 pt-4 bg-black/10 border-t border-[var(--glass-border)]">
          <Button onClick={onClose} className="glass-button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
