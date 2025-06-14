export interface Candidate {
  id: string
  name: string
  title: string
  avatar: string
  matchPercentage: number
  location: string
  experience: string
  skills: string[]
  salary: string
  email?: string
  phone?: string
  bio?: string
}

export interface JobFormData {
  title: string
  description: string
  salaryRange: [number, number]
  workType: "remote" | "onsite" | "hybrid"
}

export interface ExperienceItem {
  company: string
  role: string
  duration: string
  description: string
}

export interface EducationItem {
  school: string
  degree: string
  year: string
}
