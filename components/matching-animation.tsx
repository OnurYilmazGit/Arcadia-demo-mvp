"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MatchingAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

const STAGES = [
  { key: "scanning", message: "Analyzing 50,000+ candidate profiles...", duration: 1000 },
  { key: "analyzing", message: "Matching skills & experience requirements...", duration: 800 },
  { key: "matching", message: "Ranking candidates by compatibility...", duration: 700 },
] as const

export function MatchingAnimation({ isVisible, onComplete }: MatchingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), [])

  useEffect(() => {
    if (!isVisible) return

    let stageTimer: NodeJS.Timeout
    let progressTimer: NodeJS.Timeout

    const runStages = async () => {
      for (let i = 0; i < STAGES.length; i++) {
        setCurrentStage(i)
        await new Promise((resolve) => {
          stageTimer = setTimeout(resolve, STAGES[i].duration)
        })
      }
      onComplete()
    }

    const updateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }

    runStages()
    progressTimer = setInterval(updateProgress, 50)

    return () => {
      clearTimeout(stageTimer)
      clearInterval(progressTimer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="text-center space-y-8">
          {/* Particle Animation */}
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#5E8BFF]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-[#FFC15E]/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {particles.map((particle) => (
              <motion.div
                key={particle}
                className="absolute w-2 h-2 bg-gradient-to-r from-[#5E8BFF] to-[#FFC15E] rounded-full"
                style={{ left: "50%", top: "50%" }}
                animate={{
                  x: [0, Math.cos(particle * 0.314) * 60],
                  y: [0, Math.sin(particle * 0.314) * 60],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: particle * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Central Orb */}
            <motion.div
              className="absolute inset-6 rounded-full bg-gradient-to-r from-[#5E8BFF] to-[#FFC15E]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>

          {/* Progress Text */}
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">{STAGES[currentStage]?.message}</h2>
            <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
              <motion.div
                className="bg-gradient-to-r from-[#5E8BFF] to-[#FFC15E] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-gray-400">{Math.min(progress, 100)}% complete</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
