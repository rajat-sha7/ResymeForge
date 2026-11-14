import { ResumeData, SectionType } from '../types/resume';

export const hasHTML = (text: string | undefined): boolean => {
  if (!text) return false;
  return /<[^>]+>/.test(text);
};

export const maxLength = (text: string | undefined, len: number): boolean => {
  if (!text) return true;
  return text.length <= len;
};

export const minLength = (text: string | undefined, len: number): boolean => {
  if (!text) return false;
  return text.trim().length >= len;
};

export const isRequired = (text: string | undefined | null): boolean => {
  return !!(text && text.toString().trim().length > 0);
};

export const isValidURL = (url: string | undefined): boolean => {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  try {
    const formatted = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const u = new URL(formatted);
    // ensure hostname has at least a domain and TLD
    return !!u.hostname && u.hostname.includes('.') && !u.hostname.endsWith('.');
  } catch {
    return false;
  }
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const isValidEmail = (email: string | undefined): boolean => {
  if (!email || !email.trim()) return false;
  return EMAIL_REGEX.test(email.trim());
};

export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{2,4}[-\s\.]?[0-9]{3,6}$/;
export const isValidPhone = (phone: string | undefined): boolean => {
  if (!phone || !phone.trim()) return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // standard phone numbers contain between 7 and 15 digits
  return /^\+?\d{7,15}$/.test(cleaned);
};

export const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_\-.]+\/?$/i;
export const isValidLinkedIn = (url: string | undefined): boolean => {
  if (!url || !url.trim()) return true;
  return LINKEDIN_REGEX.test(url.trim());
};

export const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_\-.]+\/?$/i;
export const isValidGitHub = (url: string | undefined): boolean => {
  if (!url || !url.trim()) return true;
  return GITHUB_REGEX.test(url.trim());
};

export const validateGPA = (gpa: string | undefined): { valid: boolean; message?: string } => {
  if (!gpa || !gpa.trim()) return { valid: true };
  const trimmed = gpa.trim();
  // match patterns like 3.8, 3.8/4.0, 3.8 / 4, 8.5/10, 85%, etc.
  const numericMatch = trimmed.match(/^(\d+(\.\d+)?)\s*(\/\s*(\d+(\.\d+)?))?%?$/);
  if (!numericMatch) {
    return { valid: false, message: 'Enter a valid GPA format (e.g. 3.8 or 3.8/4.0 or 85%)' };
  }
  const score = parseFloat(numericMatch[1]);
  const scale = numericMatch[4] ? parseFloat(numericMatch[4]) : null;
  if (scale && score > scale) {
    return { valid: false, message: `GPA score (${score}) cannot exceed scale (${scale})` };
  }
  if (!scale && score > 100) {
    return { valid: false, message: 'GPA value appears too high' };
  }
  return { valid: true };
};

export const parseDateToYearMonth = (dateStr: string | undefined): { year: number; month: number } | null => {
  if (!dateStr || !dateStr.trim()) return null;
  const trimmed = dateStr.trim().toLowerCase();
  
  // check "present" or "current"
  if (trimmed === 'present' || trimmed === 'current') {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  // Check 4-digit year e.g. "2023"
  const yearOnly = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  const year = yearOnly ? parseInt(yearOnly[1], 10) : null;
  if (!year) return null;

  // Month lookup
  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  let month = 1;
  for (let i = 0; i < monthNames.length; i++) {
    if (trimmed.includes(monthNames[i])) {
      month = i + 1;
      break;
    }
  }

  // Check MM/YYYY format
  const slashMatch = trimmed.match(/(\d{1,2})[\/\-](\d{4})/);
  if (slashMatch) {
    const m = parseInt(slashMatch[1], 10);
    if (m >= 1 && m <= 12) month = m;
  }

  return { year, month };
};

export const validateDateSequence = (
  startDate: string | undefined,
  endDate: string | undefined,
  isCurrent: boolean = false
): { valid: boolean; message?: string } => {
  if (isCurrent || !startDate || !endDate) return { valid: true };
  const start = parseDateToYearMonth(startDate);
  const end = parseDateToYearMonth(endDate);
  if (!start || !end) return { valid: true }; // Could not definitively compare

  if (end.year < start.year || (end.year === start.year && end.month < start.month)) {
    return { valid: false, message: 'End date cannot be earlier than start date' };
  }
  return { valid: true };
};

export const validateBullet = (
  bullet: string | undefined,
  min = 10,
  max = 220
): { valid: boolean; message?: string } => {
  if (!bullet || !bullet.trim()) {
    return { valid: false, message: 'Bullet item cannot be empty' };
  }
  const t = bullet.trim();
  if (hasHTML(t)) {
    return { valid: false, message: 'Bullet points must be plain text without HTML tags' };
  }
  if (t.length < min) {
    return { valid: false, message: `Bullet is too short (min ${min} characters, currently ${t.length})` };
  }
  if (t.length > max) {
    return { valid: false, message: `Bullet exceeds ${max} characters (currently ${t.length})` };
  }
  return { valid: true };
};

export const validateBullets = (
  bullets: (string | undefined)[] | undefined,
  min = 10,
  max = 220
): boolean => {
  if (!bullets || bullets.length === 0) return true;
  for (const b of bullets) {
    const res = validateBullet(b, min, max);
    if (!res.valid) return false;
  }
  return true;
};

export const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/<[^>]+>/g, '').trim();
};

export interface ValidationItem {
  id: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface SectionValidationResult {
  sectionId: string;
  sectionTitle: string;
  isValid: boolean;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

export interface ResumeValidationReport {
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  totalErrors: number;
  totalWarnings: number;
  sections: Record<string, SectionValidationResult>;
}

export const validateResumeData = (
  resume: ResumeData,
  enabledSections: SectionType[]
): ResumeValidationReport => {
  const sections: Record<string, SectionValidationResult> = {};
  let totalErrors = 0;
  let totalWarnings = 0;

  const addResult = (
    sectionId: string,
    sectionTitle: string,
    errors: ValidationItem[],
    warnings: ValidationItem[]
  ) => {
    sections[sectionId] = {
      sectionId,
      sectionTitle,
      isValid: errors.length === 0,
      errors,
      warnings,
    };
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  };

  // 1. Personal Information (always enabled / required)
  const pi = resume.personalInfo || {};
  const piErrors: ValidationItem[] = [];
  const piWarnings: ValidationItem[] = [];

  if (!isRequired(pi.name)) {
    piErrors.push({ id: 'pi-name-req', field: 'name', message: 'Full Name is required', severity: 'error' });
  } else if (!maxLength(pi.name, 80)) {
    piErrors.push({ id: 'pi-name-len', field: 'name', message: 'Full Name exceeds 80 characters', severity: 'error' });
  } else if (hasHTML(pi.name)) {
    piErrors.push({ id: 'pi-name-html', field: 'name', message: 'Full Name cannot contain HTML tags', severity: 'error' });
  }

  if (!isRequired(pi.email)) {
    piErrors.push({ id: 'pi-email-req', field: 'email', message: 'Email address is required', severity: 'error' });
  } else if (!isValidEmail(pi.email)) {
    piErrors.push({ id: 'pi-email-inv', field: 'email', message: 'Enter a valid email address (e.g. name@example.com)', severity: 'error' });
  }

  if (!isRequired(pi.phone)) {
    piErrors.push({ id: 'pi-phone-req', field: 'phone', message: 'Phone number is required', severity: 'error' });
  } else if (!isValidPhone(pi.phone)) {
    piErrors.push({ id: 'pi-phone-inv', field: 'phone', message: 'Enter a valid telephone number with 7-15 digits', severity: 'error' });
  }

  if (pi.linkedin && !isValidLinkedIn(pi.linkedin)) {
    piErrors.push({ id: 'pi-linkedin-inv', field: 'linkedin', message: 'Invalid LinkedIn URL format', severity: 'error' });
  }

  if (pi.github && !isValidGitHub(pi.github)) {
    piErrors.push({ id: 'pi-github-inv', field: 'github', message: 'Invalid GitHub URL format', severity: 'error' });
  }

  if (pi.portfolio && !isValidURL(pi.portfolio)) {
    piErrors.push({ id: 'pi-portfolio-inv', field: 'portfolio', message: 'Invalid Portfolio URL format', severity: 'error' });
  }

  if (!pi.location && !pi.city) {
    piWarnings.push({ id: 'pi-loc-warn', field: 'location', message: 'Adding a location (City, Country) is recommended for ATS', severity: 'warning' });
  }

  addResult('personalInfo', 'Personal Information', piErrors, piWarnings);

  // 2. Professional Summary
  if (enabledSections.includes('professionalSummary')) {
    const summaryErrors: ValidationItem[] = [];
    const summaryWarnings: ValidationItem[] = [];
    const summaryObj = typeof resume.professionalSummary === 'string'
      ? { summary: resume.professionalSummary, enabled: true }
      : resume.professionalSummary || { summary: '', enabled: true };

    if (summaryObj.enabled) {
      if (!isRequired(summaryObj.summary)) {
        summaryWarnings.push({
          id: 'ps-empty',
          field: 'summary',
          message: 'Professional summary is enabled but currently empty',
          severity: 'warning',
        });
      } else {
        if (hasHTML(summaryObj.summary)) {
          summaryErrors.push({
            id: 'ps-html',
            field: 'summary',
            message: 'Avoid HTML formatting in professional summary for ATS compatibility',
            severity: 'error',
          });
        }
        if (summaryObj.summary.length > 500) {
          summaryWarnings.push({
            id: 'ps-len',
            field: 'summary',
            message: `Summary is long (${summaryObj.summary.length}/500 chars). Aim for 2-4 punchy lines`,
            severity: 'warning',
          });
        }
      }
    }
    addResult('professionalSummary', 'Professional Summary', summaryErrors, summaryWarnings);
  }

  // 3. Work Experience
  if (enabledSections.includes('experience')) {
    const expErrors: ValidationItem[] = [];
    const expWarnings: ValidationItem[] = [];
    const experiences = resume.experience || [];

    if (experiences.length === 0) {
      expWarnings.push({
        id: 'exp-empty',
        field: 'experience',
        message: 'No work experience added yet',
        severity: 'warning',
      });
    } else {
      experiences.forEach((exp, idx) => {
        const itemPrefix = `Exp #${idx + 1} (${exp.position || 'Untitled'})`;
        if (!isRequired(exp.position)) {
          expErrors.push({ id: `exp-${exp.id || idx}-pos`, field: 'position', message: `${itemPrefix}: Job title is required`, severity: 'error' });
        }
        if (!isRequired(exp.company)) {
          expErrors.push({ id: `exp-${exp.id || idx}-com`, field: 'company', message: `${itemPrefix}: Company name is required`, severity: 'error' });
        }
        if (exp.startDate && exp.endDate && !exp.current) {
          const dateCheck = validateDateSequence(exp.startDate, exp.endDate, false);
          if (!dateCheck.valid) {
            expErrors.push({ id: `exp-${exp.id || idx}-dates`, field: 'endDate', message: `${itemPrefix}: ${dateCheck.message}`, severity: 'error' });
          }
        }
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((ach, bulletIdx) => {
            const bulletRes = validateBullet(ach, 10, 250);
            if (!bulletRes.valid) {
              expErrors.push({
                id: `exp-${exp.id || idx}-b-${bulletIdx}`,
                field: 'achievements',
                message: `${itemPrefix} bullet #${bulletIdx + 1}: ${bulletRes.message}`,
                severity: 'error',
              });
            }
          });
        } else if (!exp.description) {
          expWarnings.push({
            id: `exp-${exp.id || idx}-bullets`,
            field: 'achievements',
            message: `${itemPrefix}: Consider adding 2-4 bullet achievements`,
            severity: 'warning',
          });
        }
      });
    }
    addResult('experience', 'Experience', expErrors, expWarnings);
  }

  // 4. Education
  if (enabledSections.includes('education')) {
    const eduErrors: ValidationItem[] = [];
    const eduWarnings: ValidationItem[] = [];
    const educations = resume.education || [];

    if (educations.length === 0) {
      eduWarnings.push({ id: 'edu-empty', field: 'education', message: 'No education history added yet', severity: 'warning' });
    } else {
      educations.forEach((edu, idx) => {
        const itemPrefix = `Edu #${idx + 1} (${edu.institution || 'Institution'})`;
        if (!isRequired(edu.institution)) {
          eduErrors.push({ id: `edu-${edu.id || idx}-inst`, field: 'institution', message: `${itemPrefix}: Institution name is required`, severity: 'error' });
        }
        if (!isRequired(edu.degree)) {
          eduErrors.push({ id: `edu-${edu.id || idx}-deg`, field: 'degree', message: `${itemPrefix}: Degree is required`, severity: 'error' });
        }
        if (edu.startDate && edu.endDate) {
          const dateCheck = validateDateSequence(edu.startDate, edu.endDate, false);
          if (!dateCheck.valid) {
            eduErrors.push({ id: `edu-${edu.id || idx}-dates`, field: 'endDate', message: `${itemPrefix}: ${dateCheck.message}`, severity: 'error' });
          }
        }
        if (edu.gpa) {
          const gpaRes = validateGPA(edu.gpa);
          if (!gpaRes.valid) {
            eduWarnings.push({ id: `edu-${edu.id || idx}-gpa`, field: 'gpa', message: `${itemPrefix}: ${gpaRes.message}`, severity: 'warning' });
          }
        }
      });
    }
    addResult('education', 'Education', eduErrors, eduWarnings);
  }

  // 5. Skills
  if (enabledSections.includes('skills')) {
    const skillErrors: ValidationItem[] = [];
    const skillWarnings: ValidationItem[] = [];
    const skills = resume.skills || [];

    if (skills.length === 0) {
      skillWarnings.push({ id: 'skill-empty', field: 'skills', message: 'No skills added. Add at least 5 skills for better ATS match', severity: 'warning' });
    } else if (skills.length < 3) {
      skillWarnings.push({ id: 'skill-count', field: 'skills', message: 'Add at least 3-5 key skills to showcase your expertise', severity: 'warning' });
    }

    // Check duplicate skill names
    const seen = new Set<string>();
    skills.forEach((s, idx) => {
      const name = (typeof s === 'string' ? s : s.name || '').trim().toLowerCase();
      if (!name) {
        skillErrors.push({ id: `skill-req-${idx}`, field: 'name', message: 'Empty skill item found', severity: 'error' });
      } else if (seen.has(name)) {
        skillWarnings.push({ id: `skill-dup-${idx}`, field: 'name', message: `Duplicate skill: "${typeof s === 'string' ? s : s.name}"`, severity: 'warning' });
      } else {
        seen.add(name);
      }
    });

    addResult('skills', 'Skills', skillErrors, skillWarnings);
  }

  // 6. Projects
  if (enabledSections.includes('projects')) {
    const projErrors: ValidationItem[] = [];
    const projWarnings: ValidationItem[] = [];
    const projects = resume.projects || [];

    projects.forEach((proj, idx) => {
      const itemPrefix = `Project #${idx + 1} (${proj.name || 'Untitled'})`;
      if (!isRequired(proj.name)) {
        projErrors.push({ id: `proj-${proj.id || idx}-name`, field: 'name', message: `${itemPrefix}: Project name is required`, severity: 'error' });
      }
      if (proj.link && !isValidURL(proj.link)) {
        projErrors.push({ id: `proj-${proj.id || idx}-link`, field: 'link', message: `${itemPrefix}: Invalid project URL`, severity: 'error' });
      }
      if (proj.highlights && proj.highlights.length > 0) {
        proj.highlights.forEach((h, hIdx) => {
          const res = validateBullet(h, 10, 250);
          if (!res.valid) {
            projErrors.push({ id: `proj-${proj.id || idx}-h-${hIdx}`, field: 'highlights', message: `${itemPrefix} highlight #${hIdx + 1}: ${res.message}`, severity: 'error' });
          }
        });
      }
    });

    addResult('projects', 'Projects', projErrors, projWarnings);
  }

  // 7. Certifications
  if (enabledSections.includes('certifications')) {
    const certErrors: ValidationItem[] = [];
    const certWarnings: ValidationItem[] = [];
    const certs = resume.certifications || [];

    certs.forEach((cert, idx) => {
      const itemPrefix = `Certification #${idx + 1} (${cert.name || 'Untitled'})`;
      if (!isRequired(cert.name)) {
        certErrors.push({ id: `cert-${cert.id || idx}-name`, field: 'name', message: `${itemPrefix}: Name is required`, severity: 'error' });
      }
      if (!isRequired(cert.issuer)) {
        certErrors.push({ id: `cert-${cert.id || idx}-issuer`, field: 'issuer', message: `${itemPrefix}: Issuer is required`, severity: 'error' });
      }
      if (cert.link && !isValidURL(cert.link)) {
        certErrors.push({ id: `cert-${cert.id || idx}-link`, field: 'link', message: `${itemPrefix}: Invalid URL`, severity: 'error' });
      }
    });

    addResult('certifications', 'Certifications', certErrors, certWarnings);
  }

  // 8. Achievements
  if (enabledSections.includes('achievements')) {
    const achErrors: ValidationItem[] = [];
    const achWarnings: ValidationItem[] = [];
    const achievements = resume.achievements || [];

    achievements.forEach((ach, idx) => {
      const itemPrefix = `Achievement #${idx + 1} (${ach.title || 'Untitled'})`;
      if (!isRequired(ach.title)) {
        achErrors.push({ id: `ach-${ach.id || idx}-title`, field: 'title', message: `${itemPrefix}: Title is required`, severity: 'error' });
      }
    });

    addResult('achievements', 'Achievements', achErrors, achWarnings);
  }

  // 9. Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach((cs) => {
      if (enabledSections.includes(cs.id)) {
        const csErrors: ValidationItem[] = [];
        const csWarnings: ValidationItem[] = [];
        (cs.items || []).forEach((item, idx) => {
          const itemPrefix = `Item #${idx + 1}`;
          if (!isRequired(item.title)) {
            csErrors.push({ id: `cs-${cs.id}-${item.id || idx}-title`, field: 'title', message: `${itemPrefix}: Title is required`, severity: 'error' });
          }
          if (item.link && !isValidURL(item.link)) {
            csErrors.push({ id: `cs-${cs.id}-${item.id || idx}-link`, field: 'link', message: `${itemPrefix}: Invalid URL`, severity: 'error' });
          }
          if (item.bullets && item.bullets.length > 0) {
            item.bullets.forEach((b, bIdx) => {
              const res = validateBullet(b, 10, 250);
              if (!res.valid) {
                csErrors.push({ id: `cs-${cs.id}-${item.id || idx}-b-${bIdx}`, field: 'bullets', message: `${itemPrefix} bullet #${bIdx + 1}: ${res.message}`, severity: 'error' });
              }
            });
          }
        });
        addResult(cs.id, cs.title || 'Custom Section', csErrors, csWarnings);
      }
    });
  }

  return {
    isValid: totalErrors === 0,
    hasErrors: totalErrors > 0,
    hasWarnings: totalWarnings > 0,
    totalErrors,
    totalWarnings,
    sections,
  };
};
