import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TailorSession } from '@lib/types'

interface TailorStore {
  sessions: TailorSession[]
  activeSession: TailorSession | null
  jobDescription: string
  targetRole: string
  isLoading: boolean
  setJobDescription: (jd: string) => void
  setTargetRole: (role: string) => void
  setLoading: (loading: boolean) => void
  setActiveSession: (session: TailorSession) => void
  addSession: (session: TailorSession) => void
  deleteSession: (sessionId: string) => void
  clearActiveSession: () => void
}

export const useTailorStore = create<TailorStore>()(
  persist(
    (set) => ({
      sessions: [],
      activeSession: null,
      jobDescription: '',
      targetRole: '',
      isLoading: false,

      setJobDescription: (jd) => set({ jobDescription: jd }),
      setTargetRole: (role) => set({ targetRole: role }),
      setLoading: (loading) => set({ isLoading: loading }),
      setActiveSession: (session) => set({ activeSession: session }),
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, 50),
          activeSession: session,
        })),
      deleteSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.sessionId !== sessionId),
          activeSession:
            state.activeSession?.sessionId === sessionId
              ? null
              : state.activeSession,
        })),
      clearActiveSession: () => set({ activeSession: null }),
    }),
    { name: 'resumeforge-sessions' }
  )
)
