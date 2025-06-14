"use client"

import { motion } from "framer-motion"

interface MatchScoreProps {
  percentage: number
  size?: "sm" | "md" | "lg"
}

export function MatchScore({ percentage, size = "md" }: MatchScoreProps) {
  const sizes = {
    sm: { width: 60, height: 60, strokeWidth: 3, fontSize: "text-sm" },
    md: { width: 80, height: 80, strokeWidth: 4, fontSize: "text-lg" },
    lg: { width: 100, height: 100, strokeWidth: 5, fontSize: "text-xl" },
  }

  const { width, height, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width, height }}>
      <svg className="progress-ring" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <motion.circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-blue)" />
            <stop offset="100%" stopColor="var(--accent-gold)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-[var(--text-primary)] ${fontSize}`}>{percentage}%</span>
      </div>
    </div>
  )
}
