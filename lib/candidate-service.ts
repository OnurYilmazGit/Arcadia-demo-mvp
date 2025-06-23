import { matchCandidates, type CandidateSkills } from "./skill-matcher"
import type { Candidate } from "@/types/candidate"

export interface MatchedCandidate {
  id: string
  name: string
  title: string
  avatar?: string
  matchPercentage: number
  location?: string
  experience?: string
  skills: string[]
  salary?: string
  email?: string
  phone?: string
  bio?: string
  summary?: string
  about?: string
  matchedSkills: string[]
  missingSkills: string[]
  notes?: string
}

class ShortlistManager {
  private shortlist: Set<string> = new Set()
  private notes: Map<string, string> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  toggleShortlist(candidateId: string) {
    if (this.isShortlisted(candidateId)) {
      this.removeFromShortlist(candidateId)
    } else {
      this.addToShortlist(candidateId)
    }
    window.dispatchEvent(new CustomEvent("shortlistUpdated"))
  }

  addToShortlist(candidateId: string) {
    this.shortlist.add(candidateId)
    this.saveToStorage()
  }

  removeFromShortlist(candidateId: string) {
    this.shortlist.delete(candidateId)
    this.notes.delete(candidateId)
    this.saveToStorage()
  }

  isShortlisted(candidateId: string): boolean {
    return this.shortlist.has(candidateId)
  }

  getShortlistedIds(): string[] {
    return Array.from(this.shortlist)
  }

  setNotes(candidateId: string, notes: string) {
    this.notes.set(candidateId, notes)
    this.saveToStorage()
  }

  getNotes(candidateId: string): string {
    return this.notes.get(candidateId) || ""
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("arcadia_shortlist", JSON.stringify(Array.from(this.shortlist)))
      localStorage.setItem("arcadia_notes", JSON.stringify(Object.fromEntries(this.notes)))
    }
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const shortlistData = localStorage.getItem("arcadia_shortlist")
        const notesData = localStorage.getItem("arcadia_notes")
        if (shortlistData) this.shortlist = new Set(JSON.parse(shortlistData))
        if (notesData) this.notes = new Map(Object.entries(JSON.parse(notesData)))
      } catch (error) {
        console.error("Error loading shortlist data:", error)
      }
    }
  }
}

class CandidateService {
  private candidateSkillsData: CandidateSkills[] | null = null
  public shortlistManager = new ShortlistManager()

  // PDF file mapping for Vercel Blob Storage
  private readonly PDF_FILE_MAPPING: Record<string, string> = {
    // AI/ML Engineers
    candidate_a1: "Candidate_A1_AI_ML_Engineer_Final.pdf",
    candidate_a2: "Candidate_A2_AI_ML_Engineer_Fintech.pdf",
    candidate_a3: "candidate_a3.pdf",
    candidate_a4: "candidate_a4.pdf",
    candidate_a5: "candidate_a5.pdf",
    candidate_a6: "candidate_a6.pdf",

    // Data Engineers
    dataeng_candidate_a1: "dataeng_candidate_a1.pdf",
    dataeng_candidate_a2: "dataeng_candidate_a2.pdf",
    dataeng_candidate_a3: "dataeng_candidate_a3.pdf",
    dataeng_candidate_a4: "dataeng_candidate_a4.pdf",
    dataeng_candidate_a5: "dataeng_candidate_a5.pdf",
    dataeng_candidate_a6: "dataeng_candidate_a6.pdf",

    // DevOps Engineers
    devops_candidate_a1: "devops_candidate_a1.pdf",
    devops_candidate_a2: "devops_candidate_a2.pdf",
    devops_candidate_a3: "devops_candidate_a3.pdf",
    devops_candidate_a4: "devops_candidate_a4.pdf",
    devops_candidate_a5: "devops_candidate_a5.pdf",
    devops_candidate_a6: "devops_candidate_a6.pdf",

    // Embedded Engineers
    embedded_candidate_a1: "embedded_candidate_a1.pdf",
    embedded_candidate_a2: "embedded_candidate_a2.pdf",
    embedded_candidate_a3: "embedded_candidate_a3.pdf",
    embedded_candidate_a4: "embedded_candidate_a4.pdf",
    embedded_candidate_a5: "embedded_candidate_a5.pdf",
    embedded_candidate_a6: "embedded_candidate_a6.pdf",

    // Full Stack Engineers
    full_stack_candidate_a1: "full_stack_candidate_a1.pdf",
    full_stack_candidate_a2: "full_stack_candidate_a2.pdf",
    full_stack_candidate_a3: "full_stack_candidate_a3.pdf",
    full_stack_candidate_a4: "full_stack_candidate_a4.pdf",
    full_stack_candidate_a5: "full_stack_candidate_a5.pdf",
    full_stack_candidate_a6: "full_stack_candidate_a6.pdf",

    // Security Engineers
    security_candidate_a1: "security_candidate_a1.pdf",
    security_candidate_a2: "security_candidate_a2.pdf",
    security_candidate_a3: "security_candidate_a3.pdf",
  }

  // Professional profile picture mapping
  private readonly PROFILE_PICTURE_MAPPING: Record<string, string> = {
    candidate_a1: "/candidate-profiles/candidate-a1-profile.png",
    candidate_a2: "/candidate-profiles/candidate-a2-profile.png",
    candidate_a3: "/candidate-profiles/candidate-a3-profile.png",
    candidate_a4: "/candidate-profiles/candidate-a4-profile.png",
    candidate_a5: "/candidate-profiles/candidate-a1-profile.png", // Reuse similar profile
    candidate_a6: "/candidate-profiles/candidate-a3-profile.png", // Reuse similar profile

    dataeng_candidate_a1: "/candidate-profiles/dataeng-candidate-a1-profile.png",
    dataeng_candidate_a2: "/candidate-profiles/dataeng-candidate-a1-profile.png", // Reuse
    dataeng_candidate_a3: "/candidate-profiles/candidate-a3-profile.png", // Reuse
    dataeng_candidate_a4: "/candidate-profiles/candidate-a1-profile.png", // Reuse
    dataeng_candidate_a5: "/candidate-profiles/dataeng-candidate-a1-profile.png", // Reuse
    dataeng_candidate_a6: "/candidate-profiles/candidate-a3-profile.png", // Reuse

    devops_candidate_a1: "/candidate-profiles/devops-candidate-a1-profile.png",
    devops_candidate_a2: "/candidate-profiles/devops-candidate-a1-profile.png", // Reuse
    devops_candidate_a3: "/candidate-profiles/candidate-a2-profile.png", // Reuse
    devops_candidate_a4: "/candidate-profiles/candidate-a4-profile.png", // Reuse
    devops_candidate_a5: "/candidate-profiles/devops-candidate-a1-profile.png", // Reuse
    devops_candidate_a6: "/candidate-profiles/candidate-a2-profile.png", // Reuse

    full_stack_candidate_a1: "/candidate-profiles/fullstack-candidate-a1-profile.png",
    full_stack_candidate_a2: "/candidate-profiles/fullstack-candidate-a1-profile.png", // Reuse
    full_stack_candidate_a3: "/candidate-profiles/candidate-a1-profile.png", // Reuse
    full_stack_candidate_a4: "/candidate-profiles/candidate-a3-profile.png", // Reuse
    full_stack_candidate_a5: "/candidate-profiles/fullstack-candidate-a1-profile.png", // Reuse
    full_stack_candidate_a6: "/candidate-profiles/candidate-a1-profile.png", // Reuse

    security_candidate_a1: "/candidate-profiles/security-candidate-a1-profile.png",
    security_candidate_a2: "/candidate-profiles/security-candidate-a1-profile.png", // Reuse
    security_candidate_a3: "/candidate-profiles/candidate-a2-profile.png", // Reuse

    embedded_candidate_a1: "/candidate-profiles/candidate-a1-profile.png", // Reuse
    embedded_candidate_a2: "/candidate-profiles/candidate-a3-profile.png", // Reuse
    embedded_candidate_a3: "/candidate-profiles/dataeng-candidate-a1-profile.png", // Reuse
    embedded_candidate_a4: "/candidate-profiles/fullstack-candidate-a1-profile.png", // Reuse
    embedded_candidate_a5: "/candidate-profiles/candidate-a1-profile.png", // Reuse
    embedded_candidate_a6: "/candidate-profiles/candidate-a3-profile.png", // Reuse
  }

  private readonly BLOB_BASE_URL = "https://gsm9wndtt34brfr2.public.blob.vercel-storage.com/candidate_cv"

  async loadCandidateSkills(): Promise<CandidateSkills[]> {
    if (this.candidateSkillsData) return this.candidateSkillsData
    this.candidateSkillsData = this.getFallbackCandidateSkills()
    return this.candidateSkillsData
  }

  private getFallbackCandidateSkills(): CandidateSkills[] {
    return [
      { id: "candidate_a1", name: "Dr. Sarah Chen", skills: ["Python", "PyTorch", "MLOps"] },
      { id: "candidate_a3", name: "Dr. Emily Watson", skills: ["R", "TensorFlow", "Statistics"] },
      { id: "full_stack_candidate_a2", name: "Maria Garcia", skills: ["Vue.js", "Node.js", "GCP"] },
      { id: "devops_candidate_a2", name: "Amanda Davis", skills: ["AWS", "Lambda", "CI/CD"] },
      { id: "candidate_a2", name: "Michael Rodriguez", skills: ["Python", "XGBoost", "GCP"] },
      { id: "full_stack_candidate_a1", name: "Alex Johnson", skills: ["React", "Node.js", "AWS"] },
      { id: "devops_candidate_a1", name: "Kevin Martinez", skills: ["Terraform", "Kubernetes", "AWS"] },
      { id: "dataeng_candidate_a1", name: "Steven Lewis", skills: ["Spark", "Airflow", "BigQuery"] },
      { id: "candidate_a4", name: "David Kim", skills: ["OpenCV", "YOLO", "Computer Vision"] },
      { id: "candidate_a5", name: "James Wilson", skills: ["Reinforcement Learning", "PyTorch"] },
    ]
  }

  async loadCandidateDetails(candidateId: string): Promise<any> {
    const allSkills = await this.loadCandidateSkills()
    const basicInfo = allSkills.find((c) => c.id === candidateId)
    const name = basicInfo?.name || `Candidate ${candidateId}`
    return this.generateDetailedMockData(candidateId, name)
  }

  getResumeUrl(candidateId: string): string {
    const fileName = this.PDF_FILE_MAPPING[candidateId]
    if (!fileName) {
      console.warn(`No PDF file found for candidate: ${candidateId}`)
      return "#"
    }
    return `${this.BLOB_BASE_URL}/${fileName}`
  }

  private getProfilePicture(candidateId: string): string {
    return this.PROFILE_PICTURE_MAPPING[candidateId] || "/placeholder-user.jpg"
  }

  private getGermanCities(): string[] {
    return ["Munich", "Berlin", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf"]
  }

  private generateDetailedMockData(candidateId: string, name: string) {
    const cities = this.getGermanCities()
    const location = `${cities[Math.floor(Math.random() * cities.length)]}, Germany`
    const experienceYears = Math.floor(Math.random() * 8) + 3
    const titles = [
      "Software Engineer",
      "Senior Engineer",
      "Data Scientist",
      "Product Manager",
      "DevOps Engineer",
      "AI/ML Engineer",
      "Full Stack Developer",
    ]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const minSal = Math.floor(Math.random() * (85 - 70) + 70) * 1000
    const maxSal = Math.floor(Math.random() * (110 - 95) + 95) * 1000

    return {
      id: candidateId,
      name: name,
      title: title,
      location: location,
      experience: `${experienceYears} years`,
      email: "info@arcadianetwork.io",
      phone: "+49 178 603 2 432",
      summary: `Dynamic and results-oriented ${title} with ${experienceYears} years of experience.`,
      skills: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "SQL"],
      salary: `€${minSal.toLocaleString()} - €${maxSal.toLocaleString()}`,
      avatar: this.getProfilePicture(candidateId),
    }
  }

  async matchCandidatesWithJob(jobDescription: string, topN = 20): Promise<MatchedCandidate[]> {
    const allCandidateSkills = await this.loadCandidateSkills()
    const rawMatchResults = matchCandidates(jobDescription, allCandidateSkills, topN)

    const detailedMatchesPromises = rawMatchResults.map(async (match) => {
      const details = await this.loadCandidateDetails(match.id)
      return {
        ...details,
        matchPercentage: Math.round(match.similarity),
        matchedSkills: match.matchedSkills.map((skill) => this.capitalizeSkill(skill)),
        missingSkills: match.missingSkills.map((skill) => this.capitalizeSkill(skill)),
        notes: this.shortlistManager.getNotes(match.id),
      }
    })

    const detailedMatches: MatchedCandidate[] = await Promise.all(detailedMatchesPromises)
    detailedMatches.sort((a, b) => b.matchPercentage - a.matchPercentage)
    return detailedMatches
  }

  private capitalizeSkill(skill: string): string {
    if (!skill) return ""
    return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()
  }

  convertToUIFormat(matchedCandidate: MatchedCandidate): Candidate {
    return {
      id: matchedCandidate.id,
      name: matchedCandidate.name,
      title: matchedCandidate.title,
      avatar: matchedCandidate.avatar,
      matchPercentage: matchedCandidate.matchPercentage,
      location: matchedCandidate.location,
      experience: matchedCandidate.experience,
      skills: matchedCandidate.skills.slice(0, 5),
      salary: matchedCandidate.salary,
      email: matchedCandidate.email,
      phone: matchedCandidate.phone,
      bio: matchedCandidate.summary,
    }
  }
}

export const candidateService = new CandidateService()
