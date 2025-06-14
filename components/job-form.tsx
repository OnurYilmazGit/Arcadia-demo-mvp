"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Info } from "lucide-react"
import type { JobFormData } from "@/lib/candidate-service" // Ensure this type is correctly imported or defined

// Define common tech keywords for insights
const COMMON_TECH_KEYWORDS = [
  "react",
  "angular",
  "vue",
  "javascript",
  "typescript",
  "node.js",
  "python",
  "java",
  "c#",
  ".net",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "sql",
  "nosql",
  "mongodb",
  "postgresql",
  "machine learning",
  "ai",
  "data science",
  "api",
  "rest",
  "graphql",
  "agile",
  "scrum",
  "devops",
  "ci/cd",
  "terraform",
  "ansible",
  "cybersecurity",
  "ux/ui",
  "figma",
  "sketch",
]

export function JobForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: JobFormData) => void
  initialData?: Partial<JobFormData>
}) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [targetSalary, setTargetSalary] = useState(initialData?.salaryRange ? initialData.salaryRange[1] : 110000)
  const [workType, setWorkType] = useState<"remote" | "onsite" | "hybrid">(initialData?.workType || "hybrid")
  const [descriptionInsights, setDescriptionInsights] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const salaryMin = Math.max(30000, targetSalary - 20000) // Example range derivation
    const salaryMax = targetSalary + 20000
    onSubmit({ title, description, salaryRange: [salaryMin, salaryMax], workType })
  }

  const handlePasteExample = () => {
    const exampleDesc = `We are seeking a Senior Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience in modern web technologies and a passion for building scalable applications.

Key Responsibilities:
• Develop and maintain web applications using React, Node.js, and TypeScript
• Design and implement RESTful APIs and GraphQL endpoints
• Work with cloud platforms (AWS, GCP) for deployment and scaling
• Collaborate with cross-functional teams using Agile methodologies
• Implement CI/CD pipelines and DevOps practices
• Ensure code quality through testing and code reviews

Required Skills:
• 5+ years of experience in full-stack development
• Proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with databases (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, GCP, Azure)
• Familiarity with Docker and Kubernetes
• Experience with version control (Git) and CI/CD
• Strong problem-solving and communication skills

Preferred Skills:
• Experience with microservices architecture
• Knowledge of GraphQL and REST API design
• Familiarity with testing frameworks (Jest, Cypress)
• Experience with monitoring and observability tools`

    setTitle("Senior Full Stack Developer")
    setDescription(exampleDesc)
    setTargetSalary(120000)
    setWorkType("hybrid")
    analyzeDescription(exampleDesc) // Analyze pasted example
  }

  const analyzeDescription = (text: string) => {
    if (!text.trim()) {
      setDescriptionInsights(null)
      return
    }
    const words = text.toLowerCase().split(/\s+/)
    const wordCount = words.length
    const foundKeywords = COMMON_TECH_KEYWORDS.filter((kw) => text.toLowerCase().includes(kw))

    let insights = `Word count: ${wordCount}. `
    if (foundKeywords.length > 0) {
      insights += `Found ${foundKeywords.length} tech keywords (e.g., ${foundKeywords.slice(0, 2).join(", ")}).`
    } else {
      insights += "Consider adding specific tech keywords for better matching."
    }
    setDescriptionInsights(insights)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    // Optionally, analyze on change (can be performance intensive for long texts)
    // analyzeDescription(e.target.value);
  }

  const handleDescriptionBlur = () => {
    analyzeDescription(description)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)]">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            Find Your Perfect <span className="gradient-text">Candidates</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Describe your ideal role and watch as we surface the best-fit candidates in real-time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-[var(--text-primary)] mb-3">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full p-4 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] text-lg focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-lg font-medium text-[var(--text-primary)]">Job Description</label>
              <button
                type="button"
                onClick={handlePasteExample}
                className="text-sm px-3 py-1 rounded-md bg-[var(--accent-primary)] text-white hover:opacity-80 transition-opacity"
              >
                Use Example
              </button>
            </div>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              placeholder="Paste your job description here... Include required skills, experience level, and key responsibilities."
              rows={8}
              className="w-full p-4 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              required
            />
            {descriptionInsights && (
              <div className="mt-2 p-3 glass-card border border-[var(--accent-blue)]/50 text-sm text-[var(--text-secondary)] flex items-start">
                <Info className="w-5 h-5 mr-2 mt-0.5 text-[var(--accent-blue)] shrink-0" />
                <span>{descriptionInsights}</span>
              </div>
            )}
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              💡 Tip: Include specific skills and technologies for better matching. The more detailed, the better!
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-[var(--text-primary)]">Target Salary (EUR)</label>
              <span className="text-2xl font-bold gradient-text">€{targetSalary.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="30000"
              max="200000"
              step="5000"
              value={targetSalary}
              onChange={(e) => setTargetSalary(Number.parseInt(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer accent-[var(--accent-blue)] bg-[var(--glass-border)] slider-thumb"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-[var(--text-primary)] mb-4">Work Arrangement</label>
            <div className="flex gap-4">
              {["On-site", "Hybrid", "Remote"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkType(type.toLowerCase() as "remote" | "onsite" | "hybrid")}
                  className={`flex-1 py-3 px-6 rounded-full font-medium transition-all text-base ${
                    workType === type.toLowerCase()
                      ? "gradient-button text-white"
                      : "glass-button text-[var(--text-secondary)] hover:bg-white/5"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-4 px-8 gradient-button text-xl font-semibold flex items-center justify-center gap-3 text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-6 h-6" />
            Find Matches
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
