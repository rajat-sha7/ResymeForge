# ResumeForge - Copilot Instructions

## Project Overview
This is a Next.js 16 application for building ATS-friendly resumes with a toolbox-style interface.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Animations**: GSAP
- **Drag & Drop**: @dnd-kit
- **PDF Export**: jsPDF, html2canvas
- **DOCX Export**: docx library

## Code Conventions

### Components
- Use functional components with TypeScript interfaces
- Place form components in `app/components/forms/`
- Use `'use client'` directive for client-side components
- Follow the existing pattern of useEffect for local state sync

### State Management
- Use `useResumeStore` hook for all resume state
- Call `saveToHistory()` before making changes for undo support
- Access current resume via `currentResumeId` and `resumes[currentResumeId]`

### Types
- All interfaces are in `app/types/resume.ts`
- `professionalSummary` can be `string | ProfessionalSummary`
- `skills` can contain `string | Skill` items
- Use type guards when accessing union types

### ATS Utilities
- ATS functions are in `app/utils/ats.ts`
- Always handle union types properly in ATS calculations
- Scoring uses three metrics: formatting, completeness, keywords

### Templates
- Templates are in `app/templates/`
- Template types: 'software' | 'management' | 'creative' | 'academic' | 'sales' | 'healthcare'
- All templates should be ATS-friendly (no tables, simple formatting)

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## File Structure
```
app/
├── components/forms/   # Section form components
├── components/         # Main UI components
├── templates/          # Resume templates
├── store/             # Zustand store
├── types/             # TypeScript interfaces
├── utils/             # Utility functions (ATS, etc.)
├── toolbox/           # Dashboard page
└── page.tsx           # Main builder page
```