import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseExperience(experienceString?: string): number {
  if (!experienceString) return 0
  const match = experienceString.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 0
}

// Helper to get a list of unique German cities from candidates
export function getUniqueLocations(candidates: { location?: string }[]): string[] {
  const locations = new Set<string>()
  candidates.forEach((candidate) => {
    if (candidate.location && candidate.location.includes(",")) {
      // Assuming "City, Country" format
      locations.add(candidate.location.split(",")[0].trim())
    } else if (candidate.location) {
      locations.add(candidate.location.trim())
    }
  })
  return Array.from(locations).sort()
}
