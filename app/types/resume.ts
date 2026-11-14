export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  title?: string;
  city?: string;
  country?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ProfessionalSummary {
  summary: string;
  enabled: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'tools' | 'soft';
  priority: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link?: string;
  githubLink?: string;
  liveLink?: string;
  startDate?: string;
  endDate?: string;
  relevanceScore?: number;
  highlights?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  showGpa?: boolean;
  coursework?: string[];
  honors?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string;
  impact?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
  link?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
  content?: string;
  type?: 'text' | 'bullets';
  bullets?: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  template: TemplateType;
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary | string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  customSections?: CustomSection[];
}

export type TemplateType = 
  | 'software'
  | 'management'
  | 'creative'
  | 'academic'
  | 'sales'
  | 'healthcare';

export type SectionType = 
  | 'personalInfo'
  | 'professionalSummary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements'
  | string; // Allow custom section IDs

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  completeness: number;
  warnings: ATSWarning[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  actionVerbScore?: number;
  metricsScore?: number;
}

export interface ATSWarning {
  type: 'missing-keyword' | 'buzzword' | 'long-paragraph' | 'font' | 'incomplete' | 'metrics' | 'action-verb' | 'duplicate';
  message: string;
  section: string;
  severity: 'low' | 'medium' | 'high';
}

export interface JobDescription {
  title: string;
  content: string;
  keywords: string[];
}

export interface HistoryState {
  past: ResumeData[];
  present: ResumeData | null;
  future: ResumeData[];
}