"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MatchingAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

const STAGES = [
  { key: "scanning", message: "Scanning 50,000+ candidate profiles...", duration: 1200 },
  { key: "analyzing", message: "Matching skills & experience requirements...", duration: 1000 },
  { key: "ranking", message: "Ranking candidates by compatibility...", duration: 800 },
  { key: "finalizing", message: "Finalizing top matches...", duration: 500 },
] as const

export function MatchingAnimation({ isVisible, onComplete }: MatchingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const particles = useMemo(() => Array.from({ length: 25 }, (_, i) => i), [])
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
      // Ensure progress reaches 100% before calling onComplete
      setProgress(100)
      setTimeout(onComplete, 200) // Short delay for 100% to show
    }

    const updateProgress = () => {
      overallProgress += 50 // ms per interval
      const currentProgress = Math.min(100, (overallProgress / totalDuration) * 100)
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
      }
    }

    runStages()
    progressInterval = setInterval(updateProgress, 50)

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
        className="fixed inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-[100] flex items-center justify-center"
      >
        <div className="text-center space-y-8">
          <div className="relative w-36 h-36 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[var(--accent-blue)]/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-[var(--accent-gold)]/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {particles.map((particle) => (
              <motion.div
                key={particle}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] rounded-full"
                style={{ left: "50%", top: "50%" }}
                animate={{
                  x: [0, Math.cos(particle * ((2 * Math.PI) / particles.length)) * (60 + Math.random() * 10)],
                  y: [0, Math.sin(particle * ((2 * Math.PI) / particles.length)) * (60 + Math.random() * 10)],
                  scale: [0, 1 + Math.random() * 0.5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle * 0.08,
                  ease: "circOut",
                }}
              />
            ))}
            <motion.div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/70 to-[var(--accent-gold)]/70"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{STAGES[currentStage]?.message}</h2>
            <div className="w-72 bg-[var(--glass-border)] rounded-full h-2.5 mx-auto overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <p className="text-[var(--text-secondary)]">{Math.round(progress)}% complete</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
