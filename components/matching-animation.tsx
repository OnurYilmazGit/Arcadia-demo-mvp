"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface MatchingAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

const STAGES = [
  { key: "initializing", message: "Initializing matching algorithms...", duration: 600 },
  { key: "scanning", message: "Scanning 50,000+ candidate profiles...", duration: 800 },
  { key: "analyzing", message: "Matching skills & experience requirements...", duration: 700 },
  { key: "ranking", message: "Ranking candidates by compatibility...", duration: 500 },
  { key: "finalizing", message: "Finalizing top matches...", duration: 400 },
] as const

export function MatchingAnimation({ isVisible, onComplete }: MatchingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []) // Reduced from 25 to 20
  const totalDuration = STAGES.reduce((sum, stage) => sum + stage.duration, 0)

  useEffect(() => {
    if (!isVisible) return

    let stageTimer: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout
    let overallProgress = 0

    const runStages = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        setCurrentStage(i)
        await new Promise((resolve) => {
          stageTimer = setTimeout(resolve, STAGES[i].duration)
        })
      }

      // Show success animation
      setProgress(100)
      setShowSuccess(true)

      // Complete after success animation
      setTimeout(onComplete, 800) // Reduced from 1200 to 800
    }

    const updateProgress = () => {
      overallProgress += 40 // Increased from 50 to 40 for faster progress
      const currentProgress = Math.min(100, (overallProgress / totalDuration) * 100)
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
      }
    }

    runStages()
    progressInterval = setInterval(updateProgress, 40) // Reduced from 50 to 40

    return () => {
      clearTimeout(stageTimer)
      clearInterval(progressInterval)
    }
  }, [isVisible, onComplete, totalDuration])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-lg z-[100] flex items-center justify-center"
      >
        <div className="text-center space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            {" "}
            {/* Reduced from w-36 h-36 */}
            {!showSuccess ? (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[var(--accent-blue)]/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Reduced from 4 to 3
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-[var(--accent-gold)]/40"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Reduced from 3 to 2
                />

                {particles.map((particle) => (
                  <motion.div
                    key={particle}
                    className="absolute w-1 h-1 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] rounded-full" // Reduced from w-1.5 h-1.5
                    style={{ left: "50%", top: "50%" }}
                    animate={{
                      x: [0, Math.cos(particle * ((2 * Math.PI) / particles.length)) * (50 + Math.random() * 8)], // Reduced radius
                      y: [0, Math.sin(particle * ((2 * Math.PI) / particles.length)) * (50 + Math.random() * 8)],
                      scale: [0, 1 + Math.random() * 0.3, 0], // Reduced scale variation
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(), // Reduced from 2.5
                      repeat: Number.POSITIVE_INFINITY,
                      delay: particle * 0.06, // Reduced from 0.08
                      ease: "circOut",
                    }}
                  />
                ))}

                <motion.div
                  className="absolute inset-6 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/60 to-[var(--accent-gold)]/60" // Reduced from inset-8
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} // Reduced scale and opacity
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} // Reduced from 1.8
                />
              </>
            ) : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="w-full h-full flex items-center justify-center"
              >
                <CheckCircle className="w-20 h-20 text-green-500" />
              </motion.div>
            )}
          </div>

          <motion.div
            key={showSuccess ? "success" : currentStage}
            initial={{ opacity: 0, y: 15 }} // Reduced from y: 20
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }} // Reduced from 0.3
            className="space-y-3"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {" "}
              {/* Reduced from text-2xl */}
              {showSuccess ? "Perfect matches found!" : STAGES[currentStage]?.message}
            </h2>

            {!showSuccess && (
              <>
                <div className="w-64 bg-[var(--glass-border)] rounded-full h-2 mx-auto overflow-hidden">
                  {" "}
                  {/* Reduced from w-72 and h-2.5 */}
                  <motion.div
                    className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] h-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }} // Reduced from 0.15
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  </motion.div>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{Math.round(progress)}% complete</p>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
