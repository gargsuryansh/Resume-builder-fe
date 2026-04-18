import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@components/layout/AppShell'
import { Dashboard } from '@pages/Dashboard'
import { ResumeBuilder } from '@pages/ResumeBuilder'
import { Tailor } from '@pages/Tailor'
import { AIAnalyzer } from '@pages/AIAnalyzer'
import { JobSearch } from '@pages/JobSearch'
import { CoverLetter } from '@pages/CoverLetter'
import { InterviewPrep } from '@pages/InterviewPrep'
import { Results } from '@pages/Results'
import { History } from '@pages/History'
import { JobScraper } from '@pages/JobScraper'
import { Settings } from '@pages/Settings'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder" element={<ResumeBuilder />} />
        <Route path="/tailor" element={<Tailor />} />
        <Route path="/analyzer" element={<AIAnalyzer />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/results/:sessionId" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/scraper" element={<JobScraper />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
