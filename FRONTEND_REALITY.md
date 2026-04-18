# FRONTEND REALITY: ResumeForge Pro

This document provides a factual, point-in-time audit of the current state of the frontend codebase.

## Section 1: Quick Facts

- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.4
- **Styling:** Tailwind CSS 3.4.19 + Radix UI + Framer Motion
- **State Management:** Zustand 4.5.7 (with Persistence)
- **Dev Server:** `npm run dev` starts successfully on `http://localhost:5173/`

## Section 2: How to Run

### Commands
- **Navigate to folder:** `cd C:\Users\rajra\Desktop\KriyetaBack\web-frontend-v2`
- **Install dependencies:** `npm install`
- **Set up .env:**
  - `VITE_API_URL=http://localhost:8000`
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`

### Verification Results
- **`npm install`:** Completed successfully. 1 high severity vulnerability reported in dependencies.
- **`npm run dev`:** Server starts in ~1.7s. No console errors on startup.
- **`npm run build`:** Success. Build completed in 4.29s with **zero TypeScript errors**.
- **Bundle Size:** index.js (~715 kB), index.css (~44 kB).

## Section 3: Routing & Pages

All routes are defined in `src/App.tsx`. All pages use `AppShell` for layout.

### Route: `/`
**Component:** `Dashboard`
**File:** `src/pages/Dashboard.tsx`
**Status:** ✅ Implemented
**Lines of code:** 225
**Purpose:** Overview of resumes, tailoring history, and profile completion.
**State accessed:** `useResumeStore`, `useTailorStore`.

### Route: `/builder`
**Component:** `ResumeBuilder`
**File:** `src/pages/ResumeBuilder.tsx`
**Status:** ✅ Implemented
**Lines of code:** 295
**Purpose:** Interactive resume editor with multiple sections.
**State accessed:** `useResumeStore`.

### Route: `/tailor`
**Component:** `Tailor`
**File:** `src/pages/Tailor.tsx`
**Status:** ✅ Implemented
**Lines of code:** 192
**Purpose:** Form to input job description and trigger AI tailoring.
**API calls made:** `tailorResume` from `src/lib/api.ts`.

### Route: `/analyzer`
**Component:** `AIAnalyzer`
**File:** `src/pages/AIAnalyzer.tsx`
**Status:** ✅ Implemented
**Lines of code:** 239
**Purpose:** Comprehensive resume scoring and improvement suggestions.
**API calls made:** `analyzeResume` from `src/lib/api.ts`.

### Route: `/jobs`
**Component:** `JobSearch`
**File:** `src/pages/JobSearch.tsx`
**Status:** ✅ Implemented
**Lines of code:** 218
**Purpose:** Specialized job search aggregator with AI match scores.
**API calls made:** `searchJobs` from `src/lib/api.ts`.
**State accessed:** `useJobSearchStore`.

### Route: `/cover-letter`
**Component:** `CoverLetter`
**File:** `src/pages/CoverLetter.tsx`
**Status:** ✅ Implemented
**Lines of code:** 248
**Purpose:** AI-driven cover letter generation based on resume and job.
**API calls made:** `generateCoverLetter` from `src/lib/api.ts`.

### Route: `/interview-prep`
**Component:** `InterviewPrep`
**File:** `src/pages/InterviewPrep.tsx`
**Status:** ✅ Implemented
**Lines of code:** 278
**Purpose:** AI-generated interview questions and preparation tips.
**API calls made:** `generateInterviewQuestions` from `src/lib/api.ts`.

### Route: `/results/:sessionId`
**Component:** `Results`
**File:** `src/pages/Results.tsx`
**Status:** ✅ Implemented
**Lines of code:** 122
**Purpose:** Displays the outcome of a tailoring session.
**State accessed:** `useTailorStore`.

### Route: `/history`
**Component:** `History`
**File:** `src/pages/History.tsx`
**Status:** ✅ Implemented
**Lines of code:** 88
**Purpose:** List of past tailoring sessions.
**State accessed:** `useTailorStore`.

### Route: `/scraper`
**Component:** `JobScraper`
**File:** `src/pages/JobScraper.tsx`
**Status:** ⚠️ Stub / Utility
**Lines of code:** 96
**Purpose:** Helper to extract job data from URLs.
**API calls made:** `scrapeJob` from `src/lib/api.ts`.

### Route: `/settings`
**Component:** `Settings`
**File:** `src/pages/Settings.tsx`
**Status:** ✅ Implemented
**Lines of code:** 106
**Purpose:** Backend URL configuration and UI preferences.
**State accessed:** `useSettingsStore`.

## Section 4: API Integration Layer

**File:** `src/lib/api.ts`

### Base Configuration
**Backend URL source:** Determined by `useSettingsStore.getState().backendUrl` (defaults to `http://localhost:8000` or `.env` `VITE_API_URL`).
**Default URL:** `http://localhost:8000`
**Timeout:** 60 seconds
**Auth headers:** None (Standard JSON/Multipart headers used)

### Defined API Functions

| Function Name | HTTP Method | Endpoint | Returns Type |
|---------------|-------------|----------|--------------|
| `checkHealth` | GET | `/api/health` | `HealthResponse` |
| `ping` | GET | `/api/ping` | `boolean` |
| `tailorResume` | POST | `/api/tailor` | `TailorResponse` |
| `generatePdf` | POST | `/api/generate-pdf` | `Blob` |
| `generateDocx` | POST | `/api/generate-docx` | `Blob` |
| `scrapeJob` | POST | `/api/scrape-job` | `ScrapeResponse` |
| `transcribeAudio` | POST | `/api/speech/transcribe` | `TranscriptResult` |
| `analyzeResume` | POST | `/api/analyze-resume` | `AnalyzerResponse` |
| `searchJobs` | GET | `/api/jobs/search` | `JobSearchResponse` |
| `generateCoverLetter` | POST | `/api/generate-cover-letter` | `CoverLetterResponse` |
| `generateInterviewQuestions`| POST | `/api/interview/generate-questions` | `InterviewPrepResponse`|

- **Error Handling:** Centralized interceptor returns `Promise.reject(new Error(message))` using details from backend response.
- **Binary Responses:** `generatePdf` and `generateDocx` correctly handle `responseType: 'blob'`.

## Section 5: Type Definitions

**File:** `src/lib/types.ts`

### `Resume`
**File:** `src/lib/types.ts:53`
```typescript
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
```
**Used by:** `resumeStore`, `Tailor.tsx`, `api.ts` (all resume endpoints).

### `TailorResponse`
**File:** `src/lib/types.ts:75`
```typescript
export interface TailorResponse {
  tailoredResume: Resume
  atsScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  changes: string[]
}
```
**Used by:** `tailorResume` API function and `Tailor.tsx`.

## Section 6: State Management

### Store: `useResumeStore`
**File:** `src/store/resumeStore.ts`
**Persistence:** `localStorage` (`resumeforge-resumes`)

**State Shape:**
```typescript
{
  resumes: Resume[]
  activeResumeId: string | null
}
```
**Actions:** `setActiveResume`, `addResume`, `updateResume`, `deleteResume`, `duplicateResume`.

### Store: `useTailorStore`
**File:** `src/store/tailorStore.ts`
**Persistence:** `localStorage` (`resumeforge-tailor`)

**State Shape:**
```typescript
{
  sessions: TailorSession[]
  currentSession: TailorSession | null
}
```
**Actions:** `addSession`, `setCurrentSession`, `clearHistory`.

### Store: `useJobSearchStore`
**File:** `src/store/jobSearchStore.ts`
**Persistence:** `localStorage` (`resumeforge-jobs`)

**State Shape:**
```typescript
{
  results: JobListing[]
  lastFilters: JobSearchFilters
  isLoading: boolean
}
```

## Section 7: Component Inventory

### `components/layout/`
- `AppShell.tsx` — Main wrapper with Framer Motion transitions.
- `Sidebar.tsx` — Navigation items: Dashboard, Builder, Tailor, Analyzer, Jobs, Cover Letter, Interview Prep, History, Scraper, Settings.
- `Topbar.tsx` — Displays page titles and status.

### `components/ui/`
- `GlassCard.tsx` — Glassmorphism container. Used by: `Dashboard`, `Tailor`, `Results`.
- `ScoreRing.tsx` — Animated circular score display. Used by: `Dashboard`, `Results`, `AIAnalyzer`.
- `MagneticButton.tsx` — Interactive hover-magnetic button.
- `SpotlightCard.tsx` — Card with mouse-following hover glow.
- `CursorGlow.tsx` — Custom cursor effect.

**Orphan Files (Imported but not used, or unimported):**
- `src/components/ui/progress.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`

## Section 8: Design System

### Colors (from `tailwind.config.js`)
- **Brand Primary:** `#6366F1`
- **Brand Secondary:** `#8B5CF6`
- **Background Primary:** `#0A0E1A`
- **Background Secondary:** `#111827`
- **Text Primary:** `#F9FAFB`

### Typography
- **Fonts:** Inter (Sans), JetBrains Mono (Mono)
- **Type Scale:** Custom `display` (3rem), `heading-xl` (2rem), `heading-lg` (1.5rem), `label` (0.75rem).

### Custom Utility Classes
- `.glass-card` (`globals.css:30`)
- `.btn-primary` (`globals.css:47`)
- `.animate-gradient` (`globals.css:87`)

## Section 9: What's Missing or Broken

- **Job Scraper:** The implementation is functional but lacks a robust UI; it acts more as a developer utility.
- **Speech Integration:** `transcribeAudio` exists in `api.ts` and is used in `InterviewPrep.tsx`, but no visual audio recorder is visible yet—uses file upload.
- **UI Orphans:** Several Radix UI primitive wrappers exist in `src/components/ui` but are not yet integrated into the main pages.
- **Mobile Responsiveness:** Sidebar is fixed at `ml-64` in `AppShell.tsx` (line 49), which will likely break on mobile screens.

## Section 10: Dependencies

### Production Dependencies
| Package | Version | Used For |
|---------|---------|----------|
| react | ^19.2.4 | UI Framework |
| vite | ^8.0.4 | Build Tool |
| axios | 1.6 | API Communication |
| framer-motion | ^11.18.2 | Animations |
| lucide-react| ^1.8.0 | Icons |
| zustand | ^4.5.7 | State Management |
| tailwindcss | ^3.4.19 | Styling |

### Scripts
- `npm run dev` — Starts Vite dev server
- `npm run build` — Runs `tsc -b` and `vite build`
- `npm run lint` — Runs ESLint

## Section 11: File Tree (Real, Current)

```
.env
.eslintrc.json
.gitignore
FRONTEND_REALITY.md
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
public\
src\App.tsx
src\main.tsx
src\vite-env.d.ts
src\components\layout\AppShell.tsx
src\components\layout\Sidebar.tsx
src\components\layout\Topbar.tsx
src\components\onboarding\OnboardingFlow.tsx
src\components\ui\BackgroundParticles.tsx
src\components\ui\CursorGlow.tsx
src\components\ui\GlassCard.tsx
src\components\ui\LoadingSkeleton.tsx
src\components\ui\MagneticButton.tsx
src\components\ui\progress.tsx
src\components\ui\ProgressiveImage.tsx
src\components\ui\ScoreRing.tsx
src\components\ui\scroll-area.tsx
src\components\ui\ScrollProgress.tsx
src\components\ui\SectionHeader.tsx
src\components\ui\select.tsx
src\components\ui\separator.tsx
src\components\ui\sheet.tsx
src\components\ui\skeleton.tsx
src\components\ui\SpotlightCard.tsx
src\components\ui\switch.tsx
src\components\ui\tabs.tsx
src\components\ui\textarea.tsx
src\components\ui\tooltip.tsx
src\lib\api.ts
src\lib\types.ts
src\lib\utils.ts
src\pages\AIAnalyzer.tsx
src\pages\CoverLetter.tsx
src\pages\Dashboard.tsx
src\pages\History.tsx
src\pages\InterviewPrep.tsx
src\pages\JobScraper.tsx
src\pages\JobSearch.tsx
src\pages\Results.tsx
src\pages\Settings.tsx
src\pages\Tailor.tsx
src\store\jobSearchStore.ts
src\store\resumeStore.ts
src\store\settingsStore.ts
src\store\tailorStore.ts
src\styles\globals.css
```

---

## Documentation Verified

- [x] Every route documented exists in App.tsx
- [x] Every API function exists in src/lib/api.ts
- [x] Every Zustand store points to a real file
- [x] npm run dev was tested
- [x] npm run build was tested
- [x] No fictional features documented
- [x] All known issues moved to Section 9

Codebase Path: C:\Users\rajra\Desktop\KriyetaBack\web-frontend-v2\
Generated: 2026-04-18
