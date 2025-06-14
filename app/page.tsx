"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JobForm } from "@/components/job-form"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { CandidateProfile } from "@/components/candidate-profile"
import { CandidateCard } from "@/components/candidate-card"

const mockCandidates = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Full Stack Engineer",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 99,
    location: "San Francisco, CA",
    experience: "6 years",
    skills: ["React", "Node.js", "TypeScript"],
    salary: "$140,000 - 150,000",
    email: "sarah.chen@email.com",
    phone: "+1 (352) 125-4567",
    bio: "Passionate frontend developer with 3+ years of experience building scalable web applications. Specialized in React and JavaScript frameworks, led multiple high-impact projects and developers.",
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    title: "UI/UX Developer",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 94,
    location: "Remote",
    experience: "6 years",
    skills: ["React", "Figma", "AI"],
    salary: "$123,000 - 145,000",
    email: "elena.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    bio: "UI/UX developer with a passion for creating beautiful and functional user interfaces.",
  },
  {
    id: "3",
    name: "David Kim",
    title: "Frontend Architect",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 95,
    location: "Seattle, WA",
    experience: "8 years",
    skills: ["React", "Vue.js", "TypeScript"],
    salary: "$150,000 - 190,000",
    email: "david.kim@email.com",
    phone: "+1 (555) 345-6789",
    bio: "Frontend architect with extensive experience in large-scale application development.",
  },
  {
    id: "4",
    name: "Priya Patel",
    title: "React Developer",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 84,
    location: "Remote",
    experience: "3 years",
    skills: ["React", "Redux", "JavaScript"],
    salary: "$150,000 - 130,000",
    email: "priya.patel@email.com",
    phone: "+1 (555) 456-7890",
    bio: "React developer focused on building responsive and accessible web applications.",
  },
  {
    id: "5",
    name: "Marcus Johnson",
    title: "React Developer",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 98,
    location: "Remote",
    experience: "5 years",
    skills: ["React", "Angular", "Fusion"],
    salary: "$150,000 - 130,000",
    email: "marcus.johnson@email.com",
    phone: "+1 (555) 567-8901",
    bio: "React developer focused on building responsive and accessible web applications.",
  },
  {
    id: "6",
    name: "Alex Thompson",
    title: "Frontend Lead",
    avatar: "/placeholder.svg?height=64&width=64",
    matchPercentage: 98,
    location: "Remote",
    experience: "7 years",
    skills: ["React", "Angular", "Leadership"],
    salary: "$130,000 - 170,000",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 678-9012",
    bio: "Frontend lead with strong technical and leadership skills, experienced in team management.",
  },
]

type AppState = "form" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("form")
  const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0])
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Set<string>>(new Set())

  const handleJobSubmit = () => {
    setAppState("loading")
  }

  const handleLoadingComplete = () => {
    setAppState("results")
  }

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const handleShortlist = (candidateId: string) => {
    setShortlistedCandidates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId)
      } else {
        newSet.add(candidateId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AnimatePresence mode="wait">
        {appState === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <JobForm onSubmit={handleJobSubmit} />
          </motion.div>
        )}

        {appState === "loading" && <LoadingScreen key="loading" onComplete={handleLoadingComplete} />}

        {appState === "results" && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Perfect Matches Found</h1>
              <p className="text-[var(--text-secondary)]">6 candidates match your requirements</p>
            </div>

            {/* Layout */}
            <div className="flex gap-6 lg:flex-row flex-col">
              {/* Left Column - Candidate Profile */}
              <div className="w-full lg:w-[400px]">
                <CandidateProfile
                  candidate={selectedCandidate}
                  onShortlist={() => handleShortlist(selectedCandidate.id)}
                  isShortlisted={shortlistedCandidates.has(selectedCandidate.id)}
                />
              </div>

              {/* Right Column - Results Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onClick={() => handleCandidateSelect(candidate)}
                      isSelected={selectedCandidate.id === candidate.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
