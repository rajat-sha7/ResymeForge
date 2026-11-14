import { ResumeData, SectionType } from '../types/resume';

/**
 * Formats a start/end date pair for display, rendering "Present" for current roles
 * and omitting the separator when one side is missing.
 */
export const formatDateRange = (start?: string, end?: string, current?: boolean): string => {
  const s = (start || '').trim();
  const e = current ? 'Present' : (end || '').trim();
  if (s && e) return `${s} – ${e}`;
  return s || e;
};

/** Returns the summary text regardless of whether it is stored as a string or an object. */
export const getSummaryText = (summary: ResumeData['professionalSummary']): string => {
  if (!summary) return '';
  if (typeof summary === 'string') return summary.trim();
  return summary.enabled === false ? '' : (summary.summary || '').trim();
};

/**
 * Produces the exact data the templates should render: sections the user disabled
 * in the toolbox are emptied so the preview, the PDF and the DOCX all agree.
 */
export const prepareResumeForRender = (
  resume: ResumeData,
  enabledSections?: SectionType[]
): ResumeData => {
  const on = (s: SectionType) => !enabledSections || enabledSections.includes(s);
  const summary = on('professionalSummary') ? getSummaryText(resume.professionalSummary) : '';

  return {
    ...resume,
    professionalSummary: summary,
    skills: on('skills') ? resume.skills || [] : [],
    experience: on('experience') ? resume.experience || [] : [],
    projects: on('projects') ? resume.projects || [] : [],
    education: on('education') ? resume.education || [] : [],
    certifications: on('certifications') ? resume.certifications || [] : [],
    achievements: on('achievements') ? resume.achievements || [] : [],
    customSections: (resume.customSections || []).filter((cs) => on(cs.id)),
  };
};

/** Builds a filesystem-safe download name from the candidate's name. */
export const resumeFileName = (resume: ResumeData, ext: 'pdf' | 'docx'): string => {
  const base = (resume.personalInfo?.name || resume.title || 'resume')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);
  return `${base || 'resume'}.${ext}`;
};
