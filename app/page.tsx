"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import { JobForm } from "@/components/job-form"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { CandidateProfile } from "@/components/candidate-profile"
import { CandidateCard } from "@/components/candidate-card"
import { ShortlistModal } from "@/components/shortlist-modal"
import { candidateService, type MatchedCandidate } from "@/lib/candidate-service"
import type { Candidate } from "@/types/candidate"

type AppState = "form" | "loading" | "results" | "error"

interface JobData {
  title: string
  description: string
  salaryRange: [number, number]
  workType: "remote" | "onsite" | "hybrid"
}

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("form")
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedCandidateRank, setSelectedCandidateRank] = useState<number>(1)
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Set<string>>(new Set())
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [matchedCandidatesData, setMatchedCandidatesData] = useState<MatchedCandidate[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showShortlistModal, setShowShortlistModal] = useState(false)

  // Listen for shortlist updates
  useEffect(() => {
    const handleShortlistUpdate = () => {
      const shortlistedIds = candidateService.shortlistManager.getShortlistedIds()
      setShortlistedCandidates(new Set(shortlistedIds))
    }

    window.addEventListener("shortlistUpdated", handleShortlistUpdate)
    handleShortlistUpdate() // Initial load

    return () => {
      window.removeEventListener("shortlistUpdated", handleShortlistUpdate)
    }
  }, [])

  const handleJobSubmit = async (data: JobData) => {
    console.log("Job submitted:", data)
    setJobData(data)
    setAppState("loading")
    setError(null)

    try {
      console.log("Starting candidate matching...")
      const matchedCandidates = await candidateService.matchCandidatesWithJob(data.description, 6)

      console.log("Matched candidates:", matchedCandidates)

      if (matchedCandidates.length === 0) {
        setError("No candidates found matching your criteria. Please try a different job description.")
        setAppState("error")
        return
      }

      setMatchedCandidatesData(matchedCandidates)
      const uiCandidates = matchedCandidates.map((mc) => candidateService.convertToUIFormat(mc))

      setCandidates(uiCandidates)
      setSelectedCandidate(uiCandidates[0] || null)
      setSelectedCandidateRank(1)

      console.log("UI candidates prepared:", uiCandidates.length)
    } catch (error) {
      console.error("Failed to match candidates:", error)
      setError("Failed to load candidate data. Please try again.")
      setAppState("error")
    }
  }

  const handleLoadingComplete = () => {
    if (candidates.length > 0) {
      setAppState("results")
    } else {
      setAppState("error")
    }
  }

  const handleCandidateSelect = (candidate: Candidate, rank: number) => {
    setSelectedCandidate(candidate)
    setSelectedCandidateRank(rank)
  }

  const handleShortlist = (candidateId: string) => {
    if (candidateService.shortlistManager.isShortlisted(candidateId)) {
      candidateService.shortlistManager.removeFromShortlist(candidateId)
    } else {
      candidateService.shortlistManager.addToShortlist(candidateId)
    }

    const shortlistedIds = candidateService.shortlistManager.getShortlistedIds()
    setShortlistedCandidates(new Set(shortlistedIds))
  }

  const handleDownloadResume = (candidateId: string) => {
    const resumeUrl = candidateService.getResumeUrl(candidateId)
    const link = document.createElement("a")
    link.href = resumeUrl
    link.download = `${candidateId}_resume.docx`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getMatchedCandidateData = (candidateId: string): MatchedCandidate | undefined => {
    return matchedCandidatesData.find((mc) => mc.id === candidateId)
  }

  const handleRetry = () => {
    setAppState("form")
    setError(null)
    setCandidates([])
    setSelectedCandidate(null)
    setMatchedCandidatesData([])
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Subtle background light effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-gold)]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[var(--accent-gold)]/20 to-[var(--accent-blue)]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {appState === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <JobForm onSubmit={handleJobSubmit} />
            </motion.div>
          )}

          {appState === "loading" && <LoadingScreen key="loading" onComplete={handleLoadingComplete} />}

          {appState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Oops! Something went wrong</h2>
                <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {appState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="container mx-auto p-6"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Perfect Matches Found</h1>
                    <p className="text-[var(--text-secondary)]">
                      {candidates.length} candidates match your requirements for "{jobData?.title}"
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowShortlistModal(true)}
                      className="px-4 py-2 text-sm bg-[var(--accent-gold)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      Shortlist ({shortlistedCandidates.size})
                    </button>
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-colors"
                    >
                      New Search
                    </button>
                  </div>
                </div>
              </div>

              {candidates.length > 0 ? (
                <div className="flex gap-6 lg:flex-row flex-col">
                  {/* Left Column - Candidate Profile */}
                  <div className="w-full lg:w-[400px]">
                    {selectedCandidate && (
                      <CandidateProfile
                        candidate={selectedCandidate}
                        onShortlist={() => handleShortlist(selectedCandidate.id)}
                        isShortlisted={shortlistedCandidates.has(selectedCandidate.id)}
                        onDownloadResume={() => handleDownloadResume(selectedCandidate.id)}
                        matchedSkills={getMatchedCandidateData(selectedCandidate.id)?.matchedSkills || []}
                        missingSkills={getMatchedCandidateData(selectedCandidate.id)?.missingSkills || []}
                        rank={selectedCandidateRank}
                      />
                    )}
                  </div>

                  {/* Right Column - Results Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {candidates.map((candidate, index) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => handleCandidateSelect(candidate, index + 1)}
                          isSelected={selectedCandidate?.id === candidate.id}
                          matchedSkills={getMatchedCandidateData(candidate.id)?.matchedSkills || []}
                          delay={index * 0.1}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)] text-lg">
                    No candidates found matching your criteria. Try adjusting your job description.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shortlist Modal */}
      <ShortlistModal
        isOpen={showShortlistModal}
        onClose={() => setShowShortlistModal(false)}
        allCandidates={matchedCandidatesData}
      />
    </div>
  )
}
