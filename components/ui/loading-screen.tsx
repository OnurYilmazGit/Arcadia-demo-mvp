"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)

  const stages = [
    "Analyzing 50,000+ candidate profiles...",
    "Matching skills & experience requirements...",
    "Ranking candidates by compatibility...",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }

        // Update stage based on progress
        const newStage = Math.floor(prev / 33.33)
        if (newStage !== stage && newStage < stages.length) {
          setStage(newStage)
        }

        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete, stage, stages.length])

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Orbital Loading Animation */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-blue)]/30 orbital-ring" />

          {/* Inner Ring */}
          <div className="absolute inset-4 rounded-full border-2 border-[var(--accent-gold)]/30 orbital-ring-reverse" />

          {/* Floating Particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 3) * 50],
                y: [0, Math.sin((i * Math.PI) / 3) * 50],
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Central Orb */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] pulse-glow" />
        </div>

        {/* Progress Text */}
        <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">{stages[stage]}</h2>

          {/* Progress Bar */}
          <div className="w-80 h-2 bg-[var(--bg-secondary)] rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <p className="text-[var(--text-secondary)] mt-4 text-lg">{progress}% complete</p>
        </motion.div>
      </div>
    </div>
  )
}
