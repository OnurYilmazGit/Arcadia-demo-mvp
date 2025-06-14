import { matchCandidates, type CandidateSkills } from "./skill-matcher"
import type { Candidate } from "@/types/candidate"

export interface JobFormData {
  title: string
  description: string
  salaryRange: [number, number]
  workType: "remote" | "onsite" | "hybrid"
}

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

// Shortlist management
class ShortlistManager {
  private shortlist: Set<string> = new Set()
  private notes: Map<string, string> = new Map()

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

  loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const shortlistData = localStorage.getItem("arcadia_shortlist")
        const notesData = localStorage.getItem("arcadia_notes")

        if (shortlistData) {
          this.shortlist = new Set(JSON.parse(shortlistData))
        }

        if (notesData) {
          this.notes = new Map(Object.entries(JSON.parse(notesData)))
        }
      } catch (error) {
        console.error("Error loading shortlist data:", error)
      }
    }
  }
}

class CandidateService {
  private candidateSkills: CandidateSkills[] | null = null
  private isClient = typeof window !== "undefined"
  public shortlistManager = new ShortlistManager()

  constructor() {
    if (this.isClient) {
      this.shortlistManager.loadFromStorage()
    }
  }

  async loadCandidateSkills(): Promise<CandidateSkills[]> {
    if (this.candidateSkills) {
      return this.candidateSkills
    }

    console.log("Using fallback candidate skills data")
    this.candidateSkills = this.getFallbackCandidateSkills()
    return this.candidateSkills
  }

  private getFallbackCandidateSkills(): CandidateSkills[] {
    // Based on the actual file structure in your data folder
    return [
      {
        id: "candidate_a1",
        skills: [
          "Python",
          "PyTorch",
          "TensorFlow",
          "Hugging Face",
          "Transformers",
          "AWS SageMaker",
          "GCP",
          "Vertex AI",
          "Apache Airflow",
          "Kubernetes",
          "Docker",
          "SQL",
          "MLOps",
          "Machine Learning",
          "Deep Learning",
          "Natural Language Processing",
          "Computer Vision",
          "Data Science",
        ],
      },
      {
        id: "candidate_a2",
        skills: [
          "Python",
          "XGBoost",
          "LightGBM",
          "CatBoost",
          "TensorFlow",
          "Keras",
          "GCP",
          "Vertex AI",
          "Apache Beam",
          "BigQuery",
          "Dataflow",
          "Terraform",
          "SQL",
          "CI/CD",
          "MLOps",
          "Feature Engineering",
          "Model Deployment",
          "A/B Testing",
          "Statistical Analysis",
        ],
      },
      {
        id: "candidate_a3",
        skills: [
          "Python",
          "R",
          "TensorFlow",
          "PyTorch",
          "Scikit-learn",
          "Pandas",
          "NumPy",
          "Matplotlib",
          "Seaborn",
          "Jupyter",
          "AWS",
          "Azure",
          "Machine Learning",
          "Deep Learning",
          "Statistics",
          "Data Visualization",
          "Feature Engineering",
          "Model Optimization",
          "Time Series Analysis",
        ],
      },
      {
        id: "full_stack_candidate_a1",
        skills: [
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "PostgreSQL",
          "MongoDB",
          "AWS",
          "Docker",
          "Kubernetes",
          "CI/CD",
          "REST API",
          "GraphQL",
          "Redux",
          "Tailwind CSS",
          "Jest",
          "Cypress",
        ],
      },
      {
        id: "devops_candidate_a1",
        skills: [
          "Terraform",
          "Ansible",
          "Kubernetes",
          "Docker",
          "AWS",
          "GCP",
          "Jenkins",
          "GitLab CI",
          "Prometheus",
          "Grafana",
          "ELK Stack",
          "Python",
          "Bash",
          "Infrastructure as Code",
          "Monitoring",
          "Alerting",
        ],
      },
      {
        id: "dataeng_candidate_a1",
        skills: [
          "Apache Kafka",
          "Apache Spark",
          "Delta Lake",
          "Apache Airflow",
          "BigQuery",
          "Looker",
          "Apache Nifi",
          "Python",
          "Scala",
          "SQL",
          "ETL",
          "Data Pipeline",
          "Data Governance",
          "Data Quality",
        ],
      },
    ]
  }

  async loadCandidateDetails(candidateId: string): Promise<any> {
    console.log(`Generating mock data for candidate: ${candidateId}`)
    return this.generateDetailedMockData(candidateId)
  }

  getResumeUrl(candidateId: string): string {
    return `/api/download-resume/${candidateId}`
  }

  private getGermanCities(): string[] {
    return [
      "Munich, Germany",
      "Berlin, Germany",
      "Hamburg, Germany",
      "Frankfurt, Germany",
      "Cologne, Germany",
      "Stuttgart, Germany",
      "Düsseldorf, Germany",
      "Dortmund, Germany",
      "Essen, Germany",
      "Leipzig, Germany",
    ]
  }

  private generateGermanSalary(): string {
    const min = Math.floor(Math.random() * (85000 - 70000) + 70000)
    const max = Math.floor(Math.random() * (110000 - 95000) + 95000)
    return `€${min.toLocaleString()} - €${max.toLocaleString()}`
  }

  private generateDetailedMockData(candidateId: string) {
    const cities = this.getGermanCities()
    const primaryCity = "Munich, Germany" // Emphasis on Munich
    const location = Math.random() < 0.4 ? primaryCity : cities[Math.floor(Math.random() * cities.length)]

    const candidateData = {
      // AI/ML Engineers
      candidate_a1: {
        name: "Dr. Sarah Chen",
        title: "Senior AI/ML Engineer",
        location,
        experience: "7 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary:
          "Experienced AI/ML Engineer specializing in deep learning and computer vision. Led multiple successful ML projects from research to production deployment.",
        skills: ["Python", "PyTorch", "TensorFlow", "Computer Vision", "MLOps", "AWS", "Kubernetes"],
        salary: this.generateGermanSalary(),
      },
      candidate_a2: {
        name: "Michael Rodriguez",
        title: "ML Engineer - Fintech",
        location,
        experience: "5 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary:
          "ML Engineer with expertise in financial modeling and risk assessment. Strong background in feature engineering and model deployment.",
        skills: ["Python", "XGBoost", "GCP", "BigQuery", "MLOps", "Feature Engineering"],
        salary: this.generateGermanSalary(),
      },
      candidate_a3: {
        name: "Dr. Emily Watson",
        title: "Data Scientist & ML Engineer",
        location,
        experience: "6 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary:
          "Data Scientist with strong ML engineering skills. Expert in statistical analysis and predictive modeling.",
        skills: ["Python", "R", "TensorFlow", "Statistics", "Data Science", "Machine Learning"],
        salary: this.generateGermanSalary(),
      },
      full_stack_candidate_a1: {
        name: "Alex Johnson",
        title: "Senior Full Stack Developer",
        location,
        experience: "6 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary:
          "Full Stack Developer with expertise in React and Node.js. Built scalable web applications serving millions of users.",
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
        salary: this.generateGermanSalary(),
      },
      devops_candidate_a1: {
        name: "Kevin Martinez",
        title: "Senior DevOps Engineer",
        location,
        experience: "8 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary:
          "Senior DevOps Engineer with expertise in cloud infrastructure and automation. Led digital transformation initiatives.",
        skills: ["Terraform", "Kubernetes", "AWS", "Jenkins", "Monitoring", "Infrastructure as Code"],
        salary: this.generateGermanSalary(),
      },
      dataeng_candidate_a1: {
        name: "Steven Lewis",
        title: "Senior Data Engineer",
        location,
        experience: "7 years",
        email: "info@arcadianetwork.io",
        phone: "+49 178 603 2 432",
        summary: "Senior Data Engineer with expertise in real-time data processing and data lake architecture.",
        skills: ["Apache Kafka", "Spark", "Airflow", "BigQuery", "Python", "Data Pipeline"],
        salary: this.generateGermanSalary(),
      },
    }

    const defaultData = {
      name: `Candidate ${candidateId}`,
      title: "Software Engineer",
      location,
      experience: "3+ years",
      email: "info@arcadianetwork.io",
      phone: "+49 178 603 2 432",
      summary: "Experienced software engineer with a passion for building scalable applications.",
      skills: ["Programming", "Software Development", "Problem Solving"],
      salary: this.generateGermanSalary(),
    }

    return candidateData[candidateId as keyof typeof candidateData] || defaultData
  }

  async matchCandidatesWithJob(jobDescription: string, topN = 6): Promise<MatchedCandidate[]> {
    console.log("Starting candidate matching process...")

    const candidateSkills = await this.loadCandidateSkills()
    console.log(`Loaded ${candidateSkills.length} candidates with skills`)

    const matchResults = matchCandidates(jobDescription, candidateSkills, topN)
    console.log(`Found ${matchResults.length} matches`)

    const matchedCandidates: MatchedCandidate[] = []

    for (const match of matchResults) {
      console.log(`Processing match: ${match.id} with ${match.similarity}% similarity`)

      const candidateDetails = await this.loadCandidateDetails(match.id)

      const candidate: MatchedCandidate = {
        id: match.id,
        name: candidateDetails.name,
        title: candidateDetails.title,
        matchPercentage: Math.round(match.similarity),
        skills: candidateDetails.skills || [],
        matchedSkills: match.matchedSkills.map((skill) => this.capitalizeSkill(skill)),
        missingSkills: match.missingSkills.map((skill) => this.capitalizeSkill(skill)),
        location: candidateDetails.location,
        experience: candidateDetails.experience,
        email: candidateDetails.email,
        phone: candidateDetails.phone,
        bio: candidateDetails.summary,
        salary: candidateDetails.salary,
        avatar: "/placeholder.svg?height=64&width=64",
        notes: this.shortlistManager.getNotes(match.id),
      }

      matchedCandidates.push(candidate)
    }

    console.log(`Processed ${matchedCandidates.length} matched candidates`)
    return matchedCandidates
  }

  private capitalizeSkill(skill: string): string {
    return skill.charAt(0).toUpperCase() + skill.slice(1)
  }

  convertToUIFormat(matchedCandidate: MatchedCandidate): Candidate {
    return {
      id: matchedCandidate.id,
      name: matchedCandidate.name,
      title: matchedCandidate.title,
      avatar: matchedCandidate.avatar || "/placeholder.svg?height=64&width=64",
      matchPercentage: matchedCandidate.matchPercentage,
      location: matchedCandidate.location || "Munich, Germany",
      experience: matchedCandidate.experience || "3+ years",
      skills: matchedCandidate.skills.slice(0, 5),
      salary: matchedCandidate.salary || "€70,000 - €110,000",
      email: matchedCandidate.email,
      phone: matchedCandidate.phone,
      bio: matchedCandidate.bio,
    }
  }
}

export const candidateService = new CandidateService()
export { ShortlistManager }
