"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Clock, Star, Mail, Phone, Download, Calendar, Award, Briefcase } from "lucide-react"

interface CandidateProfileDrawerProps {
  candidate: any
  isOpen: boolean
  onClose: () => void
  onShortlist: (candidate: any) => void
  isShortlisted: boolean
}

export function CandidateProfileDrawer({
  candidate,
  isOpen,
  onClose,
  onShortlist,
  isShortlisted,
}: CandidateProfileDrawerProps) {
  const [notes, setNotes] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<"overview" | "experience" | "skills">("overview")

  if (!candidate) return null

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.2 },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  // Enhanced candidate data for the profile
  const enhancedCandidate = {
    id: candidate?.id || "1",
    name: candidate?.name || "Sarah Chen",
    title: candidate?.title || "Senior Frontend Developer",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript frameworks. Led multiple high-impact projects and mentored junior developers.",
    experience: [
      {
        company: "TechCorp Inc.",
        role: "Senior Frontend Developer",
        duration: "2022 - Present",
        description:
          "Led development of customer-facing dashboard serving 100k+ users. Implemented design system and improved performance by 40%.",
      },
      {
        company: "StartupXYZ",
        role: "Frontend Developer",
        duration: "2020 - 2022",
        description:
          "Built responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UIs.",
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "B.S. Computer Science",
        year: "2020",
      },
    ],
    achievements: [
      "Led team of 4 developers on major product launch",
      "Reduced bundle size by 35% through optimization",
      "Mentored 3 junior developers to promotion",
    ],
    skills: candidate?.skills || ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "GraphQL"],
    location: candidate?.location || "San Francisco, CA",
    salary: candidate?.salary || "$140,000 - $160,000",
    matchPercentage: candidate?.matchPercentage || 92,
    avatar: candidate?.avatar || "/placeholder.svg?height=64&width=64",
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Award },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#1C1C1E] border-l border-gray-700 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5E8BFF] to-[#FFC15E] p-0.5">
                    <img
                      src={enhancedCandidate.avatar || "/placeholder.svg?height=64&width=64"}
                      alt={enhancedCandidate.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3DDC97] rounded-full border-2 border-[#1C1C1E] flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{enhancedCandidate.name}</h2>
                  <p className="text-gray-300">{enhancedCandidate.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Match Score & Quick Actions */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      <motion.path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: enhancedCandidate.matchPercentage / 100 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#5E8BFF" />
                          <stop offset="100%" stopColor="#FFC15E" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{enhancedCandidate.matchPercentage}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Match Score</p>
                    <p className="text-lg font-semibold text-white">Excellent Fit</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => onShortlist(candidate)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isShortlisted ? "bg-[#3DDC97] text-gray-900" : "bg-[#FFC15E] hover:bg-[#FFC15E]/80 text-gray-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star className="w-4 h-4 mr-2 inline" />
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Schedule</span>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Resume</span>
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id ? "text-[#5E8BFF]" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5E8BFF]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                      <p className="text-gray-300 leading-relaxed">{enhancedCandidate.bio}</p>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Mail className="w-4 h-4 text-[#5E8BFF]" />
                          {enhancedCandidate.email}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Phone className="w-4 h-4 text-[#5E8BFF]" />
                          {enhancedCandidate.phone}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-4 h-4 text-[#5E8BFF]" />
                          {enhancedCandidate.location}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="w-4 h-4 text-[#5E8BFF]" />
                          {typeof candidate?.experience === "string" ? candidate.experience : "5+ years"}
                        </div>
                      </div>
                    </div>

                    {/* Salary */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Salary Expectation</h3>
                      <p className="text-[#FFC15E] font-medium">{enhancedCandidate.salary}</p>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes about this candidate..."
                        className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#5E8BFF] focus:ring-1 focus:ring-[#5E8BFF] transition-colors resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Work Experience */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Work Experience</h3>
                      <div className="space-y-4">
                        {enhancedCandidate.experience.map((exp, index) => (
                          <div key={index} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-white">{String(exp.role)}</h4>
                                <p className="text-[#5E8BFF]">{String(exp.company)}</p>
                              </div>
                              <span className="text-sm text-gray-400">{String(exp.duration)}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{String(exp.description)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
                      <div className="space-y-3">
                        {enhancedCandidate.education.map((edu, index) => (
                          <div key={index} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-white">{String(edu.degree)}</h4>
                                <p className="text-[#5E8BFF]">{String(edu.school)}</p>
                              </div>
                              <span className="text-sm text-gray-400">{String(edu.year)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Key Achievements</h3>
                      <div className="space-y-2">
                        {enhancedCandidate.achievements.map((achievement: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#3DDC97] rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-300">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Technical Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {enhancedCandidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-[#5E8BFF]/20 text-[#5E8BFF] text-sm rounded-full border border-[#5E8BFF]/30"
                          >
                            {String(skill)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skill Proficiency */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Skill Proficiency</h3>
                      <div className="space-y-4">
                        {[
                          { skill: "React", level: 95 },
                          { skill: "TypeScript", level: 90 },
                          { skill: "Next.js", level: 85 },
                          { skill: "Tailwind CSS", level: 88 },
                          { skill: "GraphQL", level: 75 },
                        ].map((item) => (
                          <div key={item.skill}>
                            <div className="flex justify-between mb-2">
                              <span className="text-white font-medium">{item.skill}</span>
                              <span className="text-gray-400">{item.level}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-[#5E8BFF] to-[#FFC15E] h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.level}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
