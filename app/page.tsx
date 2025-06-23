"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Users, ArrowUpDown, Filter, SearchIcon } from "lucide-react" // Renamed Search to SearchIcon
import { JobForm } from "@/components/job-form"
// import { LoadingScreen } from "@/components/ui/loading-screen"; // We'll use MatchingAnimation directly
import { MatchingAnimation } from "@/components/matching-animation"
import { CandidateProfile } from "@/components/candidate-profile"
import { CandidateCard } from "@/components/candidate-card"
import { ShortlistModal } from "@/components/shortlist-modal"
import { CompareCandidatesModal } from "@/components/compare-candidates-modal"
import { candidateService, type MatchedCandidate } from "@/lib/candidate-service"
import type { Candidate } from "@/types/candidate"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { parseExperience, getUniqueLocations } from "@/lib/utils"

type AppState = "form" | "loading" | "results" | "error"

interface JobData {
  title: string
  description: string
  salaryRange: [number, number]
  workType: "remote" | "onsite" | "hybrid"
}

type SortByType = "matchQuality" | "nameAZ" | "nameZA" | "expLowHigh" | "expHighLow"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("form")
  const [rawCandidatesData, setRawCandidatesData] = useState<MatchedCandidate[]>([])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedCandidateRank, setSelectedCandidateRank] = useState<number>(1)
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Set<string>>(new Set())
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showShortlistModal, setShowShortlistModal] = useState(false)

  const [locationFilter, setLocationFilter] = useState<string>("Any")
  const [sortBy, setSortBy] = useState<SortByType>("matchQuality")
  const [candidatesToCompare, setCandidatesToCompare] = useState<Set<string>>(new Set())
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [availableLocations, setAvailableLocations] = useState<string[]>([])

  useEffect(() => {
    const handleShortlistUpdate = () => {
      setShortlistedCandidates(new Set(candidateService.shortlistManager.getShortlistedIds()))
    }
    window.addEventListener("shortlistUpdated", handleShortlistUpdate)
    handleShortlistUpdate()
    return () => window.removeEventListener("shortlistUpdated", handleShortlistUpdate)
  }, [])

  const handleJobSubmit = async (data: JobData) => {
    setJobData(data)
    setAppState("loading")
    setError(null)
    setRawCandidatesData([]) // Clear previous results
    try {
      // Simulate API call delay for animation
      // await new Promise(resolve => setTimeout(resolve, 3500)); // Keep this if MatchingAnimation handles its own timing
      const matchedCandidates = await candidateService.matchCandidatesWithJob(data.description, 20)
      if (matchedCandidates.length === 0) {
        setError("No candidates found matching your criteria.")
        // setAppState("error"); // Let onComplete handle this
        setRawCandidatesData([]) // Ensure it's empty
      } else {
        setRawCandidatesData(matchedCandidates)
        setAvailableLocations(getUniqueLocations(matchedCandidates))
      }
      // setAppState("results"); // Transition handled by onComplete from MatchingAnimation
    } catch (err) {
      console.error("Failed to match candidates:", err)
      setError("Failed to load candidate data. Please try again.")
      setRawCandidatesData([]) // Ensure it's empty
      // setAppState("error"); // Transition handled by onComplete
    }
  }

  const handleLoadingComplete = () => {
    if (rawCandidatesData.length > 0) {
      setAppState("results")
    } else {
      // If error was set during fetch, it will be used. Otherwise, set a generic one.
      if (!error) setError("No candidates found after processing.")
      setAppState("error")
    }
  }

  const filteredAndSortedCandidates = useMemo(() => {
    let processed = [...rawCandidatesData]
    if (locationFilter !== "Any") {
      processed = processed.filter((c) => c.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    }
    switch (sortBy) {
      case "nameAZ":
        processed.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "nameZA":
        processed.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "expLowHigh":
        processed.sort((a, b) => parseExperience(a.experience) - parseExperience(b.experience))
        break
      case "expHighLow":
        processed.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience))
        break
      default:
        processed.sort((a, b) => b.matchPercentage - a.matchPercentage)
        break
    }
    return processed
  }, [rawCandidatesData, locationFilter, sortBy])

  const displayCandidates = useMemo(() => {
    return filteredAndSortedCandidates.slice(0, 6).map((mc) => candidateService.convertToUIFormat(mc))
  }, [filteredAndSortedCandidates])

  useEffect(() => {
    if (appState === "results" && displayCandidates.length > 0) {
      setSelectedCandidate(displayCandidates[0])
      setSelectedCandidateRank(1)
    } else if (appState === "results" && displayCandidates.length === 0) {
      setSelectedCandidate(null)
    }
  }, [displayCandidates, appState])

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    const displayIndex = displayCandidates.findIndex((c) => c.id === candidate.id)
    setSelectedCandidateRank(displayIndex + 1)
  }

  const handleShortlistToggle = (candidateId: string) => {
    candidateService.shortlistManager.toggleShortlist(candidateId)
  }

  const handleDownloadResume = (candidateId: string) => {
    const resumeUrl = candidateService.getResumeUrl(candidateId)
    if (resumeUrl === "#") {
      console.error(`No resume found for candidate: ${candidateId}`)
      return
    }

    // Open PDF in new tab for download
    window.open(resumeUrl, "_blank")
  }

  const getMatchedCandidateDetails = (candidateId: string): MatchedCandidate | undefined => {
    return rawCandidatesData.find((mc) => mc.id === candidateId)
  }

  const handleToggleCompare = (candidateId: string) => {
    setCandidatesToCompare((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) newSet.delete(candidateId)
      else newSet.add(candidateId)
      return newSet
    })
  }

  const compareModalCandidates = useMemo(() => {
    return rawCandidatesData.filter((c) => candidatesToCompare.has(c.id))
  }, [rawCandidatesData, candidatesToCompare])

  const handleRetry = () => {
    setAppState("form")
    setError(null)
    setRawCandidatesData([])
    setSelectedCandidate(null)
    setCandidatesToCompare(new Set())
    setLocationFilter("Any")
    setSortBy("matchQuality")
  }

  const getSortLabel = (sortKey: SortByType) => {
    const labels: Record<SortByType, string> = {
      matchQuality: "Match Quality",
      nameAZ: "Name (A-Z)",
      nameZA: "Name (Z-A)",
      expLowHigh: "Exp. (Low-High)",
      expHighLow: "Exp. (High-Low)",
    }
    return labels[sortKey]
  }

  const glassButtonClasses =
    "text-sm py-2 px-3 border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-hover)] text-[var(--text-primary)] rounded-lg transition-colors flex items-center gap-2"

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-gold)]/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[var(--accent-gold)]/20 to-[var(--accent-blue)]/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {appState === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <JobForm onSubmit={handleJobSubmit} />
            </motion.div>
          )}

          {appState === "loading" && (
            <MatchingAnimation key="loading" isVisible={true} onComplete={handleLoadingComplete} />
          )}

          {appState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center p-8 glass-card max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Oops! Something went wrong</h2>
                <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                <Button onClick={handleRetry} className="gradient-button text-white px-6 py-2">
                  Try Again
                </Button>
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
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Perfect Matches Found</h1>
                    <p className="text-[var(--text-secondary)]">
                      Showing top {displayCandidates.length} of {filteredAndSortedCandidates.length} candidates for "
                      {jobData?.title}"
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {candidatesToCompare.size >= 2 && (
                      <Button onClick={() => setShowCompareModal(true)} className={glassButtonClasses}>
                        <Users className="w-4 h-4" /> Compare ({candidatesToCompare.size})
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowShortlistModal(true)}
                      className={`${glassButtonClasses} ${
                        shortlistedCandidates.size > 0
                          ? "bg-[var(--accent-gold)] text-white hover:bg-[var(--accent-gold)]/90"
                          : ""
                      }`}
                    >
                      <Star className={`w-4 h-4 ${shortlistedCandidates.size > 0 ? "fill-current" : ""}`} /> Shortlist (
                      {shortlistedCandidates.size})
                    </Button>
                    <Button onClick={handleRetry} className={glassButtonClasses}>
                      <SearchIcon className="w-4 h-4" /> New Search
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className={glassButtonClasses}>
                        <Filter className="w-4 h-4" /> Location: {locationFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="bg-[var(--bg-modal)] border-[var(--glass-border)] text-[var(--text-primary)]"
                    >
                      <DropdownMenuItem onClick={() => setLocationFilter("Any")}>Any</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[var(--glass-border)]" />
                      {availableLocations.map((loc) => (
                        <DropdownMenuItem key={loc} onClick={() => setLocationFilter(loc)}>
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className={glassButtonClasses}>
                        <ArrowUpDown className="w-4 h-4" /> Sort By: {getSortLabel(sortBy)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="bg-[var(--bg-modal)] border-[var(--glass-border)] text-[var(--text-primary)]"
                    >
                      <DropdownMenuItem onClick={() => setSortBy("matchQuality")}>Match Quality</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("nameAZ")}>Name (A-Z)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("nameZA")}>Name (Z-A)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("expLowHigh")}>Exp. (Low-High)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("expHighLow")}>Exp. (High-Low)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {displayCandidates.length > 0 ? (
                <div className="flex gap-6 lg:flex-row flex-col">
                  <div className="w-full lg:w-[400px] sticky top-6 self-start">
                    {selectedCandidate && (
                      <CandidateProfile
                        candidate={selectedCandidate}
                        onShortlist={() => handleShortlistToggle(selectedCandidate.id)}
                        isShortlisted={shortlistedCandidates.has(selectedCandidate.id)}
                        onDownloadResume={() => handleDownloadResume(selectedCandidate.id)}
                        matchedSkills={getMatchedCandidateDetails(selectedCandidate.id)?.matchedSkills || []}
                        missingSkills={getMatchedCandidateDetails(selectedCandidate.id)?.missingSkills || []}
                        rank={selectedCandidateRank}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayCandidates.map((candidate, index) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => handleCandidateSelect(candidate)}
                          isSelected={selectedCandidate?.id === candidate.id}
                          matchedSkills={getMatchedCandidateDetails(candidate.id)?.matchedSkills || []}
                          delay={index * 0.05}
                          rank={filteredAndSortedCandidates.findIndex((c) => c.id === candidate.id) + 1} // Rank from overall filtered list
                          onToggleCompare={handleToggleCompare}
                          isComparing={candidatesToCompare.has(candidate.id)}
                        />
                      ))}
                    </div>
                    {filteredAndSortedCandidates.length === 0 && appState === "results" && (
                      <p className="text-center text-[var(--text-secondary)] mt-8">
                        No candidates match the current filters.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)] text-lg">
                    {rawCandidatesData.length > 0
                      ? "No candidates match the current filters."
                      : "No candidates found for your search."}
                  </p>
                  <Button onClick={handleRetry} className="mt-4 gradient-button text-white px-6 py-2">
                    Try Again
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShortlistModal
        isOpen={showShortlistModal}
        onClose={() => setShowShortlistModal(false)}
        allCandidates={rawCandidatesData.filter((c) => shortlistedCandidates.has(c.id))}
      />
      <CompareCandidatesModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        candidates={compareModalCandidates}
      />
    </div>
  )
}
