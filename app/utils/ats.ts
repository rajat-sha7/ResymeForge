import { ResumeData, ATSScore, ATSWarning, Skill } from '../types/resume';
import {
  SUMMARY_SUGGESTIONS_BY_TEMPLATE,
  SKILL_SUGGESTIONS_BY_TEMPLATE,
} from './fieldSuggestions';

// ATS-safe fonts
export const ATS_SAFE_FONTS = ['Arial', 'Calibri', 'Times New Roman', 'Georgia', 'Helvetica', 'Verdana'];

// Common action verbs for resume bullets
export const ACTION_VERBS = [
  'Accelerated', 'Achieved', 'Administered', 'Advanced', 'Analyzed', 'Appointed',
  'Architected', 'Automated', 'Boosted', 'Built', 'Centralized', 'Championed',
  'Clarified', 'Collaborated', 'Composed', 'Conceptualized', 'Configured', 'Conducted',
  'Consolidated', 'Constructed', 'Converted', 'Coordinated', 'Crafted', 'Created',
  'Customized', 'Debugged', 'Decreased', 'Delivered', 'Deployed', 'Designed',
  'Developed', 'Devised', 'Diagnosed', 'Directed', 'Discovered', 'Documented',
  'Drafted', 'Engineered', 'Enhanced', 'Established', 'Evaluated', 'Executed',
  'Expanded', 'Expedited', 'Facilitated', 'Formulated', 'Generated', 'Guided',
  'Identified', 'Implemented', 'Improved', 'Increased', 'Initiated', 'Innovated',
  'Installed', 'Instituted', 'Integrated', 'Introduced', 'Investigated', 'Launched',
  'Led', 'Leveraged', 'Maintained', 'Managed', 'Mapped', 'Maximized', 'Mediated',
  'Mentored', 'Migrated', 'Minimized', 'Modernized', 'Monitored', 'Negotiated',
  'Operated', 'Optimized', 'Orchestrated', 'Organized', 'Overhauled', 'Pioneered',
  'Planned', 'Prepared', 'Presented', 'Programmed', 'Proposed', 'Published',
  'Rebuilt', 'Redesigned', 'Reduced', 'Refactored', 'Regulated', 'Reorganized',
  'Resolved', 'Restructured', 'Reviewed', 'Revamped', 'Scaled', 'Scheduled',
  'Secured', 'Simplified', 'Solved', 'Spearheaded', 'Standardized', 'Streamlined',
  'Strengthened', 'Supervised', 'Synthesized', 'Targeted', 'Tested', 'Tracked',
  'Trained', 'Transformed', 'Troubleshot', 'Unified', 'Updated', 'Upgraded', 'Validated',
];

const ACTION_VERBS_SET = new Set(
  ACTION_VERBS.map((v) => v.toLowerCase()).concat([
    'accelerate', 'achieve', 'administer', 'analyze', 'architect', 'automate',
    'boost', 'build', 'collaborate', 'configure', 'create', 'debug', 'deliver',
    'deploy', 'design', 'develop', 'engineer', 'enhance', 'establish', 'execute',
    'expand', 'facilitate', 'generate', 'implement', 'improve', 'increase',
    'integrate', 'launch', 'lead', 'maintain', 'manage', 'mentor', 'migrate',
    'modernize', 'monitor', 'optimize', 'orchestrate', 'pioneer', 'plan',
    'rebuild', 'reduce', 'refactor', 'resolve', 'scale', 'simplify',
    'spearhead', 'streamline', 'supervise', 'test', 'train', 'transform',
    'troubleshoot', 'update', 'upgrade',
  ])
);

// Common buzzwords / clichés to avoid
export const BUZZWORDS = [
  'synergy', 'leverage', 'paradigm', 'proactive', 'guru',
  'ninja', 'rockstar', 'wizard', 'passionate', 'dynamic',
  'results-driven', 'team player', 'self-starter', 'go-getter',
  'thought leader', 'visionary', 'game-changer', 'disruptive',
  'hard worker', 'detail-oriented', 'think outside the box',
  'strategic thinker', 'fast learner',
];

// Comprehensive stop words for cleaner keyword extraction
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Common job posting noise words
  'job', 'role', 'work', 'working', 'company', 'candidate', 'position', 'requirements',
  'responsibilities', 'opportunity', 'team', 'ability', 'experience', 'years', 'skills',
  'preferred', 'plus', 'must', 'help', 'looking', 'join', 'ideal', 'apply', 'including',
  'across', 'will', 'well', 'daily', 'environment', 'strong', 'demonstrated', 'familiarity',
  'knowledge', 'good', 'great', 'high', 'level', 'based', 'using', 'related', 'degree',
]);

// Benchmark industry keywords by template
export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  software: [
    'typescript', 'javascript', 'python', 'react', 'next.js', 'node.js', 'sql', 'postgresql',
    'mongodb', 'graphql', 'rest api', 'docker', 'kubernetes', 'aws', 'cloud', 'ci/cd',
    'microservices', 'git', 'testing', 'system design', 'architecture', 'redis', 'agile',
    'linux', 'scalability', 'performance optimization',
  ],
  management: [
    'strategic planning', 'stakeholder management', 'agile', 'scrum', 'roadmapping',
    'cross-functional leadership', 'kpis', 'okrs', 'budgeting', 'resource allocation',
    'product lifecycle', 'process improvement', 'risk management', 'vendor management',
    'delivery', 'operations', 'governance', 'change management',
  ],
  sales: [
    'sales pipeline', 'crm', 'salesforce', 'lead generation', 'b2b', 'revenue growth',
    'quota attainment', 'account management', 'prospecting', 'negotiation', 'client acquisition',
    'closing', 'upselling', 'customer retention', 'forecasting', 'contracts', 'outbound',
  ],
  healthcare: [
    'patient care', 'clinical', 'hipaa', 'electronic health records', 'ehr', 'diagnosis',
    'treatment planning', 'patient safety', 'vital signs', 'triage', 'pharmacology',
    'medical records', 'compliance', 'protocols', 'patient advocacy', 'documentation',
  ],
  creative: [
    'ui/ux', 'figma', 'adobe creative suite', 'design systems', 'wireframing', 'prototyping',
    'user research', 'visual design', 'typography', 'interaction design', 'responsive design',
    'branding', 'storyboarding', 'usability testing', 'information architecture',
  ],
  academic: [
    'research', 'publication', 'peer review', 'methodology', 'data analysis', 'grant writing',
    'curriculum development', 'teaching', 'statistical analysis', 'literature review',
    'academic advising', 'presentations', 'conference', 'qualitative', 'quantitative',
  ],
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/;

// LinkedIn URL validation
export const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+\/?$/;

// GitHub URL validation
export const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

export const validateLinkedIn = (url: string): boolean => {
  if (!url) return true;
  return LINKEDIN_REGEX.test(url.trim());
};

export const validateGitHub = (url: string): boolean => {
  if (!url) return true;
  return GITHUB_REGEX.test(url.trim());
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Extracts high-signal keywords and 2-word keyphrases from text (e.g. Job Description).
 * Filters out common English stop words and punctuation.
 */
export const extractKeywords = (text: string): string[] => {
  if (!text || !text.trim()) return [];
  const clean = text.toLowerCase().replace(/['’]/g, '');

  // 1. Check for common multi-word technical/domain phrases
  const commonPhrases = [
    'machine learning', 'deep learning', 'artificial intelligence', 'data science',
    'rest api', 'rest apis', 'ci/cd', 'continuous integration', 'continuous delivery',
    'cloud computing', 'project management', 'product management', 'unit testing',
    'front end', 'frontend', 'back end', 'backend', 'full stack', 'fullstack',
    'system design', 'microservices architecture', 'react native', 'cyber security',
    'cybersecurity', 'agile scrum', 'object oriented', 'cross functional', 'b2b sales',
    'patient care', 'user experience', 'design systems', 'responsive design',
    'electronic health records', 'quality assurance', 'test driven development',
  ];

  const foundPhrases: string[] = [];
  commonPhrases.forEach((phrase) => {
    const rx = new RegExp(`(^|[^a-zA-Z0-9_#+])${escapeRegex(phrase)}([^a-zA-Z0-9_#+]|$)`, 'i');
    if (rx.test(clean)) {
      foundPhrases.push(phrase);
    }
  });

  // 2. Tokenize words (handle dots in node.js, c++, c#, .net)
  const tokens = clean
    .replace(/[^\w\s+#.-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, '').trim())
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  const freq: Record<string, number> = {};
  tokens.forEach((t) => {
    freq[t] = (freq[t] || 0) + 1;
  });

  // Sort by frequency and length
  const singleKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 35)
    .map(([word]) => word);

  // Combine phrases first, followed by unique single keywords
  const combined = Array.from(new Set([...foundPhrases, ...singleKeywords]));
  return combined.slice(0, 30);
};

/**
 * Checks for token / word-boundary matches in resume text.
 * Avoids false positive substring matches (e.g. 'cat' in 'communication').
 */
export const findMatchingKeywords = (resumeText: string, jdKeywords: string[]): string[] => {
  if (!resumeText || !jdKeywords || jdKeywords.length === 0) return [];
  const text = resumeText.toLowerCase();

  return jdKeywords.filter((kw) => {
    const escaped = escapeRegex(kw.toLowerCase());
    const rx = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
    return rx.test(text);
  });
};

export const findMissingKeywords = (resumeText: string, jdKeywords: string[]): string[] => {
  const matched = new Set(findMatchingKeywords(resumeText, jdKeywords));
  return jdKeywords.filter((kw) => !matched.has(kw));
};

export const checkDuplicateSkills = (skills: (Skill | string)[]): string[] => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  skills.forEach((skill) => {
    const name = typeof skill === 'string' ? skill : skill.name;
    const lower = (name || '').trim().toLowerCase();
    if (!lower) return;
    if (seen.has(lower)) {
      duplicates.push(name.trim());
    }
    seen.add(lower);
  });

  return duplicates;
};

export const checkBuzzwords = (text: string): string[] => {
  if (!text) return [];
  const textLower = text.toLowerCase();
  const found: string[] = [];

  BUZZWORDS.forEach((buzzword) => {
    const escaped = escapeRegex(buzzword.toLowerCase());
    const rx = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
    if (rx.test(textLower)) {
      found.push(buzzword);
    }
  });

  return found;
};

export const checkLongParagraphs = (text: string | undefined, maxLength: number = 350): boolean => {
  if (!text) return false;
  const paragraphs = text.split('\n').filter((p) => p.trim());
  return paragraphs.some((p) => p.length > maxLength);
};

/**
 * Compiles plain text of the entire resume including all sections,
 * highlights, coursework, honors, and custom items.
 */
export const getResumeText = (resume: ResumeData): string => {
  if (!resume) return '';
  const parts: string[] = [];

  if (resume.personalInfo) {
    if (resume.personalInfo.name) parts.push(resume.personalInfo.name);
    if (resume.personalInfo.title) parts.push(resume.personalInfo.title);
    if (resume.personalInfo.location) parts.push(resume.personalInfo.location);
    if (resume.personalInfo.city) parts.push(resume.personalInfo.city);
    if (resume.personalInfo.country) parts.push(resume.personalInfo.country);
  }

  const summaryText = typeof resume.professionalSummary === 'string'
    ? resume.professionalSummary
    : resume.professionalSummary?.summary || '';
  if (summaryText) parts.push(summaryText);

  if (Array.isArray(resume.skills)) {
    parts.push(resume.skills.map((s) => (typeof s === 'string' ? s : s.name || '')).join(' '));
  }

  if (Array.isArray(resume.experience)) {
    resume.experience.forEach((exp) => {
      if (exp.position) parts.push(exp.position);
      if (exp.company) parts.push(exp.company);
      if (exp.description) parts.push(exp.description);
      if (Array.isArray(exp.achievements)) {
        parts.push(exp.achievements.join(' '));
      }
    });
  }

  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((proj) => {
      if (proj.name) parts.push(proj.name);
      if (proj.role) parts.push(proj.role);
      if (proj.description) parts.push(proj.description);
      if (Array.isArray(proj.technologies)) {
        parts.push(proj.technologies.join(' '));
      }
      if (Array.isArray(proj.highlights)) {
        parts.push(proj.highlights.join(' '));
      }
    });
  }

  if (Array.isArray(resume.education)) {
    resume.education.forEach((edu) => {
      if (edu.degree) parts.push(edu.degree);
      if (edu.field) parts.push(edu.field);
      if (edu.institution) parts.push(edu.institution);
      if (Array.isArray(edu.coursework)) parts.push(edu.coursework.join(' '));
      if (Array.isArray(edu.honors)) parts.push(edu.honors.join(' '));
    });
  }

  if (Array.isArray(resume.certifications)) {
    resume.certifications.forEach((cert) => {
      if (cert.name) parts.push(cert.name);
      if (cert.issuer) parts.push(cert.issuer);
    });
  }

  if (Array.isArray(resume.achievements)) {
    resume.achievements.forEach((ach) => {
      if (ach.title) parts.push(ach.title);
      if (ach.description) parts.push(ach.description);
      if (ach.impact) parts.push(ach.impact);
    });
  }

  if (Array.isArray(resume.customSections)) {
    resume.customSections.forEach((cs) => {
      if (cs.title) parts.push(cs.title);
      if (Array.isArray(cs.items)) {
        cs.items.forEach((item) => {
          if (item.title) parts.push(item.title);
          if (item.subtitle) parts.push(item.subtitle);
          if (item.description) parts.push(item.description);
          if (Array.isArray(item.bullets)) parts.push(item.bullets.join(' '));
        });
      }
    });
  }

  return parts.join(' ');
};

/**
 * Checks whether bullet text starts with a recognized active verb.
 */
export const startsWithActionVerb = (bullet: string): boolean => {
  if (!bullet || !bullet.trim()) return false;
  const words = bullet.trim().split(/\s+/);
  if (words.length === 0) return false;
  const firstWord = words[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
  return ACTION_VERBS_SET.has(firstWord);
};

/**
 * Checks whether text contains measurable metrics, percentages, dollar amounts, or scale.
 */
export const containsQuantifiableMetrics = (text: string): boolean => {
  if (!text || !text.trim()) return false;
  const rx = /(\d+(\.\d+)?%|\$[0-9]+(\.[0-9]+)?[kmbKMB]?|\b[0-9]+(\.[0-9]+)?x\b|\b\d+\+?\s*(users|clients|customers|accounts|engineers|team members|projects|days|hours|minutes|queries|requests|transactions)\b|\b[1-9]\d{2,}\b)/;
  return rx.test(text);
};

/**
 * Comprehensive ATS Scoring Engine
 * Evaluates Completeness (35%), Formatting & Impact (35%), and Keyword Match (30%).
 */
export const calculateATSScore = (resume: ResumeData, jobDescription: string = ''): ATSScore => {
  const warnings: ATSWarning[] = [];
  const resumeText = getResumeText(resume);

  // ==========================================
  // 1. COMPLETENESS SCORING (Max 100 points)
  // ==========================================
  let completenessScore = 0;
  const pi = resume.personalInfo || ({} as any);

  // Full Name (10 pts)
  if (pi.name && pi.name.trim().length > 0) {
    completenessScore += 10;
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Full Name is missing (critical for ATS indexing)',
      section: 'Personal Info',
      severity: 'high',
    });
  }

  // Email (10 pts)
  if (pi.email && pi.email.trim().length > 0) {
    if (validateEmail(pi.email)) {
      completenessScore += 10;
    } else {
      completenessScore += 4;
      warnings.push({
        type: 'incomplete',
        message: 'Email address appears malformed',
        section: 'Personal Info',
        severity: 'medium',
      });
    }
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Email address is missing',
      section: 'Personal Info',
      severity: 'high',
    });
  }

  // Phone (8 pts)
  if (pi.phone && pi.phone.trim().length > 0) {
    if (validatePhone(pi.phone)) {
      completenessScore += 8;
    } else {
      completenessScore += 4;
      warnings.push({
        type: 'incomplete',
        message: 'Phone format may not be standardized for international ATS parsers',
        section: 'Personal Info',
        severity: 'low',
      });
    }
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Phone number is missing',
      section: 'Personal Info',
      severity: 'high',
    });
  }

  // Location (4 pts)
  if (pi.location || pi.city) {
    completenessScore += 4;
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Location (City, State/Country) is missing; ATS filters candidates by location',
      section: 'Personal Info',
      severity: 'medium',
    });
  }

  // Professional Links (3 pts)
  if (pi.linkedin || pi.github || pi.portfolio) {
    completenessScore += 3;
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Adding a LinkedIn or Portfolio link increases recruiter engagement by 40%',
      section: 'Personal Info',
      severity: 'low',
    });
  }

  // Professional Summary (15 pts)
  const summaryObj = typeof resume.professionalSummary === 'string'
    ? { summary: resume.professionalSummary, enabled: true }
    : resume.professionalSummary || { summary: '', enabled: true };
  const summaryText = (summaryObj.summary || '').trim();

  if (summaryObj.enabled && summaryText.length > 0) {
    if (summaryText.length < 50) {
      completenessScore += 8;
      warnings.push({
        type: 'incomplete',
        message: 'Professional summary is very brief; aim for 2-4 sentences describing your focus and achievements',
        section: 'Summary',
        severity: 'low',
      });
    } else {
      completenessScore += 15;
    }
  } else if (!summaryObj.enabled) {
    completenessScore += 10; // Summary optional if disabled intentionally
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'Professional summary is empty; a targeted summary gives recruiters immediate context',
      section: 'Summary',
      severity: 'medium',
    });
  }

  // Work Experience (25 pts)
  const experiences = resume.experience || [];
  if (experiences.length > 0) {
    completenessScore += 15;
    if (experiences.length >= 2) completenessScore += 5;

    const hasCompleteEntries = experiences.every((exp) => exp.position && exp.company);
    if (hasCompleteEntries) {
      completenessScore += 5;
    } else {
      warnings.push({
        type: 'incomplete',
        message: 'Some work experience entries are missing job title or company name',
        section: 'Experience',
        severity: 'high',
      });
    }
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'No work experience added; ATS requires chronological employment history',
      section: 'Experience',
      severity: 'high',
    });
  }

  // Education (15 pts)
  const educations = resume.education || [];
  if (educations.length > 0) {
    completenessScore += 10;
    const hasCompleteEdu = educations.every((edu) => edu.institution && edu.degree);
    if (hasCompleteEdu) {
      completenessScore += 5;
    } else {
      warnings.push({
        type: 'incomplete',
        message: 'Education entry is missing degree or institution name',
        section: 'Education',
        severity: 'medium',
      });
    }
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'No education history listed; ATS filters frequently require education credentials',
      section: 'Education',
      severity: 'medium',
    });
  }

  // Skills (10 pts)
  const skills = resume.skills || [];
  if (skills.length >= 5) {
    completenessScore += 10;
  } else if (skills.length > 0) {
    completenessScore += 5;
    warnings.push({
      type: 'incomplete',
      message: `Only ${skills.length} skill${skills.length === 1 ? '' : 's'} listed; aim for at least 6-10 skills to match search queries`,
      section: 'Skills',
      severity: 'medium',
    });
  } else {
    warnings.push({
      type: 'incomplete',
      message: 'No skills listed; ATS keyword match cannot index your qualifications',
      section: 'Skills',
      severity: 'high',
    });
  }

  completenessScore = Math.min(100, Math.max(0, completenessScore));

  // ==========================================
  // 2. FORMATTING & IMPACT SCORING (Max 100 points)
  // ==========================================
  let formattingScore = 0;

  // Collect all bullets across experience and projects
  const allBullets: string[] = [];
  experiences.forEach((exp) => {
    if (Array.isArray(exp.achievements)) {
      exp.achievements.forEach((ach) => ach && allBullets.push(ach.trim()));
    }
  });
  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((proj) => {
      if (Array.isArray(proj.highlights)) {
        proj.highlights.forEach((hl) => hl && allBullets.push(hl.trim()));
      }
    });
  }

  // A. Action Verbs Usage (Max 30 pts)
  let actionVerbScore = 0;
  if (allBullets.length > 0) {
    const actionVerbsCount = allBullets.filter((b) => startsWithActionVerb(b)).length;
    const actionRatio = actionVerbsCount / allBullets.length;

    if (actionRatio >= 0.7) {
      actionVerbScore = 30;
    } else if (actionRatio >= 0.4) {
      actionVerbScore = 20;
      warnings.push({
        type: 'action-verb',
        message: 'Strengthen bullet points: Begin more bullets with direct action verbs (e.g. Architected, Accelerated, Spearheaded)',
        section: 'Experience',
        severity: 'low',
      });
    } else {
      actionVerbScore = 10;
      warnings.push({
        type: 'action-verb',
        message: 'Most bullets do not start with action verbs; start bullets with strong verbs to show ownership',
        section: 'Experience',
        severity: 'medium',
      });
    }
  } else if (experiences.length > 0) {
    actionVerbScore = 5;
    warnings.push({
      type: 'action-verb',
      message: 'Format experience as bullet points instead of narrative paragraphs for better ATS parsing',
      section: 'Experience',
      severity: 'medium',
    });
  } else {
    actionVerbScore = 0;
  }
  formattingScore += actionVerbScore;

  // B. Quantifiable Metrics & Measurable Impact (Max 25 pts)
  let metricsScore = 0;
  if (allBullets.length > 0) {
    const metricsCount = allBullets.filter((b) => containsQuantifiableMetrics(b)).length;
    if (metricsCount >= 3) {
      metricsScore = 25;
    } else if (metricsCount >= 1) {
      metricsScore = 18;
      warnings.push({
        type: 'metrics',
        message: 'Add more quantifiable metrics: Resumes with multiple metrics (% improvements, revenue, scale) rank in the top tier',
        section: 'Experience',
        severity: 'low',
      });
    } else {
      metricsScore = 6;
      warnings.push({
        type: 'metrics',
        message: 'No quantifiable metrics detected; include numbers (e.g. "reduced latency by 40%", "managed 5 engineers") to prove impact',
        section: 'Experience',
        severity: 'medium',
      });
    }
  } else {
    metricsScore = 0;
  }
  formattingScore += metricsScore;

  // C. Bullet Length & Readability (Max 20 pts)
  let readabilityScore = 20;
  if (allBullets.length > 0) {
    const tooLong = allBullets.filter((b) => b.length > 250).length;
    const tooShort = allBullets.filter((b) => b.length < 15).length;

    if (tooLong > 0) {
      readabilityScore -= Math.min(10, tooLong * 4);
      warnings.push({
        type: 'long-paragraph',
        message: `${tooLong} bullet point${tooLong !== 1 ? 's are' : ' is'} over 250 characters; keep bullets punchy and under 220 characters`,
        section: 'Formatting',
        severity: 'low',
      });
    }
    if (tooShort > 0) {
      readabilityScore -= Math.min(6, tooShort * 3);
      warnings.push({
        type: 'incomplete',
        message: 'Some bullet points are too brief to explain your actual scope or achievement',
        section: 'Formatting',
        severity: 'low',
      });
    }
  } else {
    readabilityScore = 8;
  }
  formattingScore += Math.max(0, readabilityScore);

  // D. Buzzwords Check (Max 15 pts, deductions)
  let buzzwordScore = 15;
  const foundBuzzwords = checkBuzzwords(resumeText);
  if (foundBuzzwords.length > 0) {
    buzzwordScore = Math.max(0, 15 - foundBuzzwords.length * 4);
    warnings.push({
      type: 'buzzword',
      message: `Replace generic buzzwords (${foundBuzzwords.slice(0, 4).join(', ')}) with concrete facts and data`,
      section: 'General',
      severity: 'low',
    });
  }
  formattingScore += buzzwordScore;

  // E. Cleanliness: Duplicates & Paragraph Walls (Max 10 pts)
  let cleanlinessScore = 10;
  const duplicateSkills = checkDuplicateSkills(skills);
  if (duplicateSkills.length > 0) {
    cleanlinessScore -= 5;
    warnings.push({
      type: 'duplicate',
      message: `Duplicate skills found: ${duplicateSkills.join(', ')}`,
      section: 'Skills',
      severity: 'low',
    });
  }

  // Check long narrative blocks in experience
  let hasLongParagraphs = false;
  experiences.forEach((exp, idx) => {
    if (checkLongParagraphs(exp.description, 350)) {
      hasLongParagraphs = true;
      warnings.push({
        type: 'long-paragraph',
        message: `Experience #${idx + 1} (${exp.company || 'Role'}) has large paragraph text; convert to bullets for ATS clarity`,
        section: 'Experience',
        severity: 'low',
      });
    }
  });
  if (hasLongParagraphs) cleanlinessScore -= 5;

  formattingScore += Math.max(0, cleanlinessScore);
  formattingScore = Math.min(100, Math.max(0, formattingScore));

  // ==========================================
  // 3. KEYWORD MATCH & RELEVANCE (Max 100 points)
  // ==========================================
  let keywordScore = 0;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  const hasJD = jobDescription && jobDescription.trim().length > 15;

  if (hasJD) {
    // Mode A: Tested against custom Job Description
    const jdKeywords = extractKeywords(jobDescription);
    if (jdKeywords.length > 0) {
      matchedKeywords = findMatchingKeywords(resumeText, jdKeywords);
      missingKeywords = findMissingKeywords(resumeText, jdKeywords);

      const ratio = matchedKeywords.length / jdKeywords.length;
      keywordScore = Math.min(100, Math.round(ratio * 100));

      if (missingKeywords.length > 0) {
        warnings.push({
          type: 'missing-keyword',
          message: `Key job requirements missing in your resume: ${missingKeywords.slice(0, 6).join(', ')}`,
          section: 'Keywords',
          severity: ratio < 0.5 ? 'high' : 'medium',
        });
      }
    } else {
      keywordScore = 50;
    }
  } else {
    // Mode B: General ATS Benchmark based on selected template & industry competencies
    const templateKey = (resume.template || 'software').toLowerCase();
    const benchmarkKeywords = DOMAIN_KEYWORDS[templateKey] || DOMAIN_KEYWORDS.software;

    matchedKeywords = findMatchingKeywords(resumeText, benchmarkKeywords);
    missingKeywords = findMissingKeywords(resumeText, benchmarkKeywords);

    // 1. Domain keyword coverage (up to 55 pts)
    const domainRatio = matchedKeywords.length / benchmarkKeywords.length;
    const domainScore = Math.round(domainRatio * 55);

    // 2. Skill list depth & quality (up to 30 pts)
    let skillBreadthScore = 0;
    if (skills.length >= 10) skillBreadthScore = 30;
    else if (skills.length >= 6) skillBreadthScore = 22;
    else if (skills.length >= 3) skillBreadthScore = 14;
    else if (skills.length > 0) skillBreadthScore = 6;

    // 3. Action and technical phrasing density (up to 15 pts)
    const actionBonus = Math.round((actionVerbScore / 30) * 15);

    keywordScore = Math.min(100, domainScore + skillBreadthScore + actionBonus);

    if (skills.length < 5) {
      warnings.push({
        type: 'missing-keyword',
        message: 'Add more core technical skills and tools to increase your resume searchability',
        section: 'Keywords',
        severity: 'medium',
      });
    }
  }

  keywordScore = Math.min(100, Math.max(0, keywordScore));

  // ==========================================
  // 4. OVERALL BLENDED SCORE (0 - 100)
  // ==========================================
  // Completeness: 35%, Formatting & Impact: 35%, Keyword Match: 30%
  const overall = Math.round(
    (completenessScore * 0.35) +
    (formattingScore * 0.35) +
    (keywordScore * 0.30)
  );

  // Sort warnings: high severity first, then medium, then low
  const severityRank = { high: 0, medium: 1, low: 2 };
  warnings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    overall: Math.max(0, Math.min(100, overall)),
    keywordMatch: keywordScore,
    formatting: formattingScore,
    completeness: completenessScore,
    warnings,
    matchedKeywords,
    missingKeywords,
    actionVerbScore,
    metricsScore,
  };
};

export const getSummarySuggestions = (roleOrTemplate: string): string[] => {
  const key = (roleOrTemplate || '').toLowerCase().trim();
  if (SUMMARY_SUGGESTIONS_BY_TEMPLATE[key]) {
    return SUMMARY_SUGGESTIONS_BY_TEMPLATE[key];
  }

  // Common aliases
  if (key.includes('front')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.software;
  if (key.includes('back')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.software;
  if (key.includes('product') || key.includes('project') || key.includes('manager')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.management;
  if (key.includes('sale') || key.includes('account')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.sales;
  if (key.includes('health') || key.includes('nurse') || key.includes('medic')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.healthcare;
  if (key.includes('design') || key.includes('creative') || key.includes('ui') || key.includes('ux')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.creative;
  if (key.includes('academic') || key.includes('research') || key.includes('professor')) return SUMMARY_SUGGESTIONS_BY_TEMPLATE.academic;

  return SUMMARY_SUGGESTIONS_BY_TEMPLATE.software;
};

export const getSkillSuggestions = (roleOrTemplate: string): { technical: string[]; tools: string[]; soft: string[] } => {
  const key = (roleOrTemplate || '').toLowerCase().trim();
  if (SKILL_SUGGESTIONS_BY_TEMPLATE[key]) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE[key];
  }

  // Common aliases
  if (key.includes('front') || key.includes('back') || key.includes('full') || key.includes('engineer') || key.includes('dev')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.software;
  }
  if (key.includes('product') || key.includes('project') || key.includes('manager') || key.includes('lead')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.management;
  }
  if (key.includes('sale') || key.includes('account') || key.includes('sdr')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.sales;
  }
  if (key.includes('health') || key.includes('nurse') || key.includes('clinic') || key.includes('medic')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.healthcare;
  }
  if (key.includes('design') || key.includes('creative') || key.includes('ui') || key.includes('ux')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.creative;
  }
  if (key.includes('academic') || key.includes('research') || key.includes('teach')) {
    return SKILL_SUGGESTIONS_BY_TEMPLATE.academic;
  }

  return SKILL_SUGGESTIONS_BY_TEMPLATE.software;
};
