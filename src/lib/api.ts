import axios from 'axios'
import { useSettingsStore } from '@store/settingsStore'
import type {
  HealthResponse,
  TailorRequest,
  TailorResponse,
  ScrapeResponse,
  TranscriptResult,
  Resume,
  AnalyzerResponse,
  JobSearchResponse,
  JobSearchFilters,
  CoverLetterRequest,
  CoverLetterResponse,
  InterviewPrepRequest,
  InterviewPrepResponse,
} from './types'

const getBaseUrl = () => {
  return useSettingsStore.getState().backendUrl || 'http://localhost:8000'
}

export const apiClient = axios.create({
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl()
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || error.response?.data?.detail?.message
      || error.message
      || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// Health
export const checkHealth = async (): Promise<HealthResponse> => {
  const { data } = await apiClient.get<HealthResponse>('/api/health')
  return data
}

export const ping = async (): Promise<boolean> => {
  try {
    await apiClient.get('/api/ping')
    return true
  } catch {
    return false
  }
}

// Tailor
export const tailorResume = async (payload: TailorRequest): Promise<TailorResponse> => {
  const { data } = await apiClient.post<TailorResponse>('/api/tailor', payload)
  return data
}

// Export — handles binary responses
export const generatePdf = async (resume: Resume): Promise<Blob> => {
  const { data } = await apiClient.post(
    '/api/generate-pdf',
    { resume, template: 'default' },
    { responseType: 'blob' }
  )
  return data
}

export const generateDocx = async (resume: Resume): Promise<Blob> => {
  const { data } = await apiClient.post(
    '/api/generate-docx',
    { resume, template: 'default' },
    { responseType: 'blob' }
  )
  return data
}

// Helper to trigger browser download
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Scraper
export const scrapeJob = async (url: string): Promise<ScrapeResponse> => {
  const { data } = await apiClient.post<ScrapeResponse>('/api/scrape-job', { url })
  return data
}

// Speech
export const transcribeAudio = async (
  audioFile: File,
  language: string = 'en-IN'
): Promise<TranscriptResult> => {
  const formData = new FormData()
  formData.append('audio_file', audioFile)
  formData.append('language', language)
  const { data } = await apiClient.post<{ data: TranscriptResult }>(
    '/api/speech/transcribe',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}

// AI Analyzer
export const analyzeResume = async (
  resume: Resume,
  targetRole?: string | null
): Promise<AnalyzerResponse> => {
  const { data } = await apiClient.post<AnalyzerResponse>('/api/analyze-resume', {
    resume,
    targetRole: targetRole ?? null,
  })
  return data
}

// Job Search
export const searchJobs = async (
  filters: JobSearchFilters
): Promise<JobSearchResponse> => {
  const { data } = await apiClient.get<JobSearchResponse>('/api/jobs/search', {
    params: filters,
  })
  return data
}

// Cover Letter
export const generateCoverLetter = async (
  payload: CoverLetterRequest
): Promise<CoverLetterResponse> => {
  const { data } = await apiClient.post<CoverLetterResponse>(
    '/api/generate-cover-letter',
    payload
  )
  return data
}

// Interview Prep
export const generateInterviewQuestions = async (
  payload: InterviewPrepRequest
): Promise<InterviewPrepResponse> => {
  const { data } = await apiClient.post<InterviewPrepResponse>(
    '/api/interview/generate-questions',
    payload
  )
  return data
}
