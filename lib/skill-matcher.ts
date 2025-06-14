export interface CandidateSkills {
  id: string
  skills: string[]
}

export interface MatchResult {
  id: string
  similarity: number
  matchedSkills: string[]
  missingSkills: string[]
}

/** Normalize an array of skill strings (trim + lower-case + unique). */
export function normalizeSkills(skillArr: string[]): string[] {
  if (!Array.isArray(skillArr)) {
    console.warn("normalizeSkills received non-array:", skillArr)
    return []
  }
  return [...new Set(skillArr.map((s) => String(s).trim().toLowerCase()).filter(Boolean))]
}

/**
 * Extract skills present in a free-text job description.
 * Matches whole words (\bskill\b) to avoid partial hits.
 */
export function extractSkillsFromText(description: string, knownSkills: string[]): string[] {
  if (!description || !Array.isArray(knownSkills)) {
    console.warn("extractSkillsFromText: invalid inputs", {
      description: !!description,
      knownSkills: Array.isArray(knownSkills),
    })
    return []
  }

  const text = description.toLowerCase()
  const hits = new Set<string>()

  knownSkills.forEach((skill) => {
    try {
      // Escape special regex characters
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "i")
      if (regex.test(text)) {
        hits.add(skill)
      }
    } catch (error) {
      console.warn(`Error processing skill "${skill}":`, error)
    }
  })

  return [...hits]
}

/** Jaccard similarity – percentage of intersection / union */
export function jaccard(a: string[], b: string[]): number {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.warn("jaccard: received non-arrays", { a: Array.isArray(a), b: Array.isArray(b) })
    return 0
  }

  const A = new Set(a)
  const B = new Set(b)
  const intersection = [...A].filter((x) => B.has(x)).length
  const union = new Set([...A, ...B]).size
  return union === 0 ? 0 : (intersection / union) * 100
}

/**
 * Main matcher – returns an array of candidate match objects sorted by similarity.
 */
export function matchCandidates(jobDescription: string, candidates: CandidateSkills[], topN = 10): MatchResult[] {
  console.log("matchCandidates called with:", {
    jobDescriptionLength: jobDescription?.length || 0,
    candidatesCount: candidates?.length || 0,
    topN,
  })

  if (!jobDescription || !Array.isArray(candidates)) {
    console.error("matchCandidates: invalid inputs")
    return []
  }

  try {
    // Build the global vocabulary (superset of all skills) once.
    const globalSkills = normalizeSkills(
      candidates.flatMap((c) => {
        if (!c || !Array.isArray(c.skills)) {
          console.warn("Invalid candidate structure:", c)
          return []
        }
        return c.skills
      }),
    )

    console.log(`Built global skills vocabulary: ${globalSkills.length} unique skills`)

    // Skills explicitly mentioned in the JD text.
    const jdSkills = extractSkillsFromText(jobDescription, globalSkills)
    console.log(`Extracted ${jdSkills.length} skills from job description:`, jdSkills)

    const results = candidates
      .filter((c) => c && c.id && Array.isArray(c.skills))
      .map((c) => {
        const candSkills = normalizeSkills(c.skills)
        const similarity = jaccard(candSkills, jdSkills)
        const matched = candSkills.filter((s) => jdSkills.includes(s))
        const missing = jdSkills.filter((s) => !matched.includes(s))

        return {
          id: c.id,
          similarity: Number(similarity.toFixed(2)),
          matchedSkills: matched,
          missingSkills: missing,
        }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN)

    console.log(`Returning ${results.length} matches`)
    return results
  } catch (error) {
    console.error("Error in matchCandidates:", error)
    return []
  }
}
