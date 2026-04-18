import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  backendUrl: string
  defaultExportFormat: 'pdf' | 'docx' | 'both'
  autoSave: boolean
  hasCompletedOnboarding: boolean
  setBackendUrl: (url: string) => void
  setDefaultExportFormat: (format: 'pdf' | 'docx' | 'both') => void
  setAutoSave: (autoSave: boolean) => void
  setHasCompletedOnboarding: (completed: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      backendUrl: 'http://localhost:8000',
      defaultExportFormat: 'pdf',
      autoSave: true,
      hasCompletedOnboarding: false,
      setBackendUrl: (url) => set({ backendUrl: url }),
      setDefaultExportFormat: (format) => set({ defaultExportFormat: format }),
      setAutoSave: (autoSave) => set({ autoSave }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
    }),
    { name: 'resumeforge-settings' }
  )
)
