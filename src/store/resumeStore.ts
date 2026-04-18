import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Resume } from '@lib/types'

const defaultResume = (): Resume => ({
  id: uuidv4(),
  name: 'My Resume',
  personalInfo: {
    name: '',
    email: '',
    phone: null,
    location: null,
    linkedin: null,
    github: null,
    website: null,
    summary: null,
  },
  education: [],
  experience: [],
  skills: {},
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

interface ResumeStore {
  resumes: Resume[]
  activeResumeId: string | null
  getActiveResume: () => Resume | null
  setActiveResume: (id: string) => void
  addResume: () => string
  updateResume: (id: string, updates: Partial<Resume>) => void
  deleteResume: (id: string) => void
  duplicateResume: (id: string) => void
  getProfileCompletion: (resume: Resume) => number
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [defaultResume()],
      activeResumeId: null,

      getActiveResume: () => {
        const { resumes, activeResumeId } = get()
        if (!activeResumeId) return resumes[0] ?? null
        return resumes.find((r) => r.id === activeResumeId) ?? resumes[0] ?? null
      },

      setActiveResume: (id) => set({ activeResumeId: id }),

      addResume: () => {
        const newResume = defaultResume()
        set((state) => ({
          resumes: [...state.resumes, newResume],
          activeResumeId: newResume.id,
        }))
        return newResume.id
      },

      updateResume: (id, updates) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id
              ? { ...r, ...updates, updatedAt: new Date().toISOString() }
              : r
          ),
        })),

      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          activeResumeId:
            state.activeResumeId === id
              ? state.resumes.find((r) => r.id !== id)?.id ?? null
              : state.activeResumeId,
        })),

      duplicateResume: (id) => {
        const resume = get().resumes.find((r) => r.id === id)
        if (!resume) return
        const duplicate = { ...resume, id: uuidv4(), name: `${resume.name} (Copy)` }
        set((state) => ({ resumes: [...state.resumes, duplicate] }))
      },

      getProfileCompletion: (resume) => {
        let score = 0
        if (resume.personalInfo.name) score += 20
        if (resume.personalInfo.email) score += 10
        if (resume.personalInfo.summary) score += 10
        if (resume.experience.length > 0) score += 25
        if (resume.education.length > 0) score += 15
        const skillCount = Array.isArray(resume.skills)
          ? resume.skills.length
          : Object.values(resume.skills).flat().length
        if (skillCount > 0) score += 10
        if (resume.projects.length > 0) score += 10
        return Math.min(score, 100)
      },
    }),
    { name: 'resumeforge-resumes' }
  )
)
