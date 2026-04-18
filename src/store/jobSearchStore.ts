import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JobListing, JobSearchFilters } from '@lib/types'

interface JobSearchStore {
  recentSearches: JobSearchFilters[]
  savedJobs: JobListing[]
  selectedJob: JobListing | null
  filters: JobSearchFilters
  setFilters: (filters: Partial<JobSearchFilters>) => void
  setSelectedJob: (job: JobListing | null) => void
  saveJob: (job: JobListing) => void
  removeSavedJob: (jobId: string) => void
  isJobSaved: (jobId: string) => boolean
  addRecentSearch: (filters: JobSearchFilters) => void
  clearRecentSearches: () => void
}

export const useJobSearchStore = create<JobSearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      savedJobs: [],
      selectedJob: null,
      filters: {},

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      setSelectedJob: (job) => set({ selectedJob: job }),

      saveJob: (job) =>
        set((state) => ({
          savedJobs: state.savedJobs.find((j) => j.id === job.id)
            ? state.savedJobs
            : [job, ...state.savedJobs].slice(0, 50),
        })),

      removeSavedJob: (jobId) =>
        set((state) => ({
          savedJobs: state.savedJobs.filter((j) => j.id !== jobId),
        })),

      isJobSaved: (jobId) =>
        get().savedJobs.some((j) => j.id === jobId),

      addRecentSearch: (filters) =>
        set((state) => ({
          recentSearches: [
            filters,
            ...state.recentSearches.filter(
              (s) => JSON.stringify(s) !== JSON.stringify(filters)
            ),
          ].slice(0, 10),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'resumeforge-job-search' }
  )
)
