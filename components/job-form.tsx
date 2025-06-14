"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface JobFormProps {
  onSubmit: (data: any) => void
}

export function JobForm({ onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salaryRange: 150000,
    workType: "hybrid",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePasteExample = () => {
    setFormData({
      title: "Senior Full Stack Developer",
      description: `We are seeking a Senior Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience in modern web technologies and a passion for building scalable applications.

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
• Experience with monitoring and observability tools`,
      salaryRange: 150000,
      workType: "hybrid",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            Find Your Perfect <span className="gradient-text">Candidates</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Describe your ideal role and watch as we surface the best-fit candidates in real-time
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Title */}
          <div>
            <label className="block text-lg font-medium text-[var(--text-primary)] mb-3">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full p-4 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] text-lg focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              required
            />
          </div>

          {/* Job Description */}
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
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Paste your job description here... Include required skills, experience level, and key responsibilities."
              rows={8}
              className="w-full p-4 glass-card text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              required
            />
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              💡 Tip: Include specific skills and technologies for better matching
            </p>
          </div>

          {/* Salary Range */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-[var(--text-primary)]">Salary Range</label>
              <span className="text-2xl font-bold gradient-text">${formData.salaryRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="300000"
              step="5000"
              value={formData.salaryRange}
              onChange={(e) => setFormData((prev) => ({ ...prev, salaryRange: Number.parseInt(e.target.value) }))}
              className="w-full h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-lg font-medium text-[var(--text-primary)] mb-4">Work Arrangement</label>
            <div className="flex gap-4">
              {["On-site", "Hybrid", "Remote"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, workType: type.toLowerCase() }))}
                  className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
                    formData.workType === type.toLowerCase()
                      ? "gradient-button"
                      : "glass-button text-[var(--text-secondary)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-4 px-8 gradient-button text-xl font-semibold flex items-center justify-center gap-3"
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
