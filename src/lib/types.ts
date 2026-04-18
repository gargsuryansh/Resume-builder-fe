// ─── Resume Types ──────────────────────────────────────────

export interface PersonalInfo {
  name: string
  email: string
  phone?: string | null
  location?: string | null
  linkedin?: string | null
  github?: string | null
  website?: string | null
  summary?: string | null
}

export interface Education {
  institution: string
  degree: string
  field?: string | null
  startDate: string
  endDate: string
  gpa?: string | null
  achievements: string[]
}

export interface Experience {
  company: string
  position: string
  location?: string | null
  startDate: string
  endDate: string
  description: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string | null
  highlights: string[]
  startDate?: string | null
  endDate?: string | null
}

export interface Certification {
  name: string
  issuer: string
  date: string
  credentialId?: string | null
  url?: string | null
}

export type Skills = Record<string, string[]> | string[]

export interface Resume {
  id: string
  name: string
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skills
  projects: Project[]
  certifications: Certification[]
  createdAt?: string | null
  updatedAt?: string | null
  accentColor?: string | null
}

// ─── API Response Types ────────────────────────────────────

export interface TailorRequest {
  resume: Resume
  jobDescription: string
  targetRole?: string | null
}

export interface TailorResponse {
  tailoredResume: Resume
  atsScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  changes: string[]
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  timestamp: string
  services: {
    api: { status: string }
    llm_providers: {
      status: string
      configured_count: number
      total_providers: number
      providers: Record<string, ProviderStatus>
    }
    speech_providers: {
      status: string
      configured_count: number
      providers: Record<string, ProviderStatus>
    }
    document_engines: {
      pdf: { status: 'available' | 'unavailable'; engine: string }
      docx: { status: 'available' | 'unavailable'; engine: string }
    }
    mock_mode: {
      enabled: boolean
      warning: string | null
    }
  }
}

export interface ProviderStatus {
  configured: boolean
  model: string | null
  role: string
  circuit_state: 'closed' | 'open' | 'half_open'
  consecutive_failures?: number
}

export interface ScrapeResponse {
  title: string | null
  company: string | null
  description: string
  source: string
  url: string
}

export interface TranscriptResult {
  transcript: string
  language: string
  confidence: number | null
  duration_seconds: number | null
  provider_used: string | null
  word_count: number | null
}

export interface ApiError {
  error: boolean
  error_type: string
  message: string
  retryable: boolean
  details?: Record<string, unknown>
}

// ─── Session Types ─────────────────────────────────────────

export interface TailorSession {
  sessionId: string
  tailoredAt: string
  targetRole: string | null
  resumeName: string
  atsScoreBefore: number
  atsScoreAfter: number
  improvement: number
  matchedKeywords: string[]
  missingKeywords: string[]
  tailoredResume: Resume
  suggestions: string[]
  changes: string[]
}

// ─── AI Analyzer Types ─────────────────────────────────────

export interface AnalyzerScores {
  ats_compatibility: number
  content_quality: number
  structure: number
  keyword_density: number
}

export interface ImprovementSuggestion {
  category: 'structure' | 'content' | 'keywords' | 'formatting'
  priority: 'high' | 'medium' | 'low'
  suggestion: string
  impact_estimate: string
}

export interface AnalyzerResponse {
  overallScore: number
  scores: AnalyzerScores
  strengths: string[]
  weaknesses: string[]
  missingSections: string[]
  improvementSuggestions: ImprovementSuggestion[]
  wordCount: number
  readabilityScore: number
  passiveVoicePercentage: number
}

// ─── Job Search Types ──────────────────────────────────────

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary_range: string | null
  experience_required: string
  posted_date: string
  url: string
  source: 'LinkedIn' | 'Indeed' | 'Naukri' | 'Glassdoor' | 'Other'
  description_preview: string
  skills_required: string[]
  match_score: number
}

export interface JobSearchFilters {
  role?: string
  location?: string
  experience?: string
  source?: string
}

export interface JobSearchResponse {
  results: JobListing[]
  total: number
  filters_applied: JobSearchFilters
}

// ─── Cover Letter Types ────────────────────────────────────

export type CoverLetterTone = 'professional' | 'friendly' | 'enthusiastic' | 'concise'

export interface CoverLetterRequest {
  resume: Resume
  jobDescription: string
  tone: CoverLetterTone
  companyName?: string | null
  hiringManagerName?: string | null
}

export interface CoverLetterResponse {
  coverLetter: string
  wordCount: number
  estimatedReadTime: number
  tone: CoverLetterTone
  providerUsed: string
}

// ─── Interview Prep Types ──────────────────────────────────

export type QuestionCategory = 'behavioral' | 'technical' | 'situational' | 'cultural_fit'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface InterviewQuestion {
  id: string
  question: string
  category: QuestionCategory
  difficulty: QuestionDifficulty
  linked_bullet: string | null
  suggested_answer_framework: string
  preparation_tips: string[]
  common_followups: string[]
}

export interface InterviewPrepRequest {
  resume: Resume
  jobDescription: string
  questionCount?: number
  categories?: QuestionCategory[]
}

export interface InterviewPrepResponse {
  questions: InterviewQuestion[]
  total: number
  providerUsed: string
}
