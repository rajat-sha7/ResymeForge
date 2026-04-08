import { ResumeData, ATSScore, ATSWarning, Skill } from '../types/resume';

// ATS-safe fonts
export const ATS_SAFE_FONTS = ['Arial', 'Calibri', 'Times New Roman', 'Georgia', 'Helvetica', 'Verdana'];

// Common action verbs for resume bullets
export const ACTION_VERBS = [
  'Achieved', 'Administered', 'Analyzed', 'Architected', 'Automated',
  'Built', 'Collaborated', 'Configured', 'Created', 'Debugged',
  'Delivered', 'Deployed', 'Designed', 'Developed', 'Documented',
  'Enhanced', 'Established', 'Executed', 'Expanded', 'Facilitated',
  'Generated', 'Identified', 'Implemented', 'Improved', 'Increased',
  'Integrated', 'Launched', 'Led', 'Maintained', 'Managed',
  'Mentored', 'Migrated', 'Modernized', 'Monitored', 'Optimized',
  'Orchestrated', 'Pioneered', 'Planned', 'Presented', 'Proposed',
  'Reduced', 'Refactored', 'Resolved', 'Reviewed', 'Scaled',
  'Simplified', 'Spearheaded', 'Streamlined', 'Supervised', 'Tested',
  'Trained', 'Transformed', 'Troubleshot', 'Updated', 'Upgraded',
];

// Common buzzwords to avoid
export const BUZZWORDS = [
  'synergy', 'leverage', 'paradigm', 'proactive', 'guru',
  'ninja', 'rockstar', 'wizard', 'passionate', 'dynamic',
  'results-driven', 'team player', 'self-starter', 'go-getter',
  'thought leader', 'visionary', 'game-changer', 'disruptive',
];

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (flexible for international formats)
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/;

// LinkedIn URL validation
export const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+\/?$/;

// GitHub URL validation
export const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

export const validateLinkedIn = (url: string): boolean => {
  if (!url) return true;
  return LINKEDIN_REGEX.test(url);
};

export const validateGitHub = (url: string): boolean => {
  if (!url) return true;
  return GITHUB_REGEX.test(url);
};

export const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // Count word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Return words that appear more than once or are significant
  return Object.entries(wordCount)
    .filter(([_, count]) => count >= 1)
    .map(([word]) => word);
};

export const findMatchingKeywords = (resumeText: string, jdKeywords: string[]): string[] => {
  const resumeLower = resumeText.toLowerCase();
  return jdKeywords.filter(keyword => resumeLower.includes(keyword.toLowerCase()));
};

export const findMissingKeywords = (resumeText: string, jdKeywords: string[]): string[] => {
  const resumeLower = resumeText.toLowerCase();
  return jdKeywords.filter(keyword => !resumeLower.includes(keyword.toLowerCase()));
};

export const checkDuplicateSkills = (skills: (Skill | string)[]): string[] => {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  skills.forEach(skill => {
    const name = typeof skill === 'string' ? skill : skill.name;
    const lower = name.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(name);
    }
    seen.add(lower);
  });
  
  return duplicates;
};

export const checkBuzzwords = (text: string): string[] => {
  const textLower = text.toLowerCase();
  return BUZZWORDS.filter(buzzword => textLower.includes(buzzword));
};

export const checkLongParagraphs = (text: string, maxLength: number = 300): boolean => {
  const paragraphs = text.split('\n').filter(p => p.trim());
  return paragraphs.some(p => p.length > maxLength);
};

export const getResumeText = (resume: ResumeData): string => {
  const parts: string[] = [];
  
  parts.push(resume.personalInfo.name);
  const summaryText = typeof resume.professionalSummary === 'string' 
    ? resume.professionalSummary 
    : resume.professionalSummary?.summary || '';
  parts.push(summaryText);
  parts.push(resume.skills.map(s => typeof s === 'string' ? s : s.name).join(' '));
  resume.experience.forEach(exp => {
    parts.push(exp.position, exp.company, exp.description);
    parts.push(exp.achievements.join(' '));
  });
  resume.projects.forEach(proj => {
    parts.push(proj.name, proj.description);
    parts.push(proj.technologies.join(' '));
  });
  resume.education.forEach(edu => {
    parts.push(edu.degree, edu.field, edu.institution);
  });
  resume.certifications.forEach(cert => {
    parts.push(cert.name, cert.issuer);
  });
  resume.achievements.forEach(ach => {
    parts.push(ach.title, ach.description);
  });
  
  return parts.join(' ');
};

export const calculateATSScore = (resume: ResumeData, jobDescription: string = ''): ATSScore => {
  const warnings: ATSWarning[] = [];
  let formattingScore = 100;
  let completenessScore = 100;
  let keywordScore = 100;
  
  // Check completeness
  if (!resume.personalInfo.name) {
    warnings.push({
      type: 'incomplete',
      message: 'Name is missing',
      section: 'Personal Info',
      severity: 'high',
    });
    completenessScore -= 15;
  }
  
  if (!resume.personalInfo.email) {
    warnings.push({
      type: 'incomplete',
      message: 'Email is missing',
      section: 'Personal Info',
      severity: 'high',
    });
    completenessScore -= 10;
  } else if (!validateEmail(resume.personalInfo.email)) {
    warnings.push({
      type: 'incomplete',
      message: 'Email format is invalid',
      section: 'Personal Info',
      severity: 'medium',
    });
    formattingScore -= 5;
  }
  
  if (!resume.personalInfo.phone) {
    warnings.push({
      type: 'incomplete',
      message: 'Phone number is missing',
      section: 'Personal Info',
      severity: 'medium',
    });
    completenessScore -= 5;
  } else if (!validatePhone(resume.personalInfo.phone)) {
    warnings.push({
      type: 'incomplete',
      message: 'Phone format may not be ATS-friendly',
      section: 'Personal Info',
      severity: 'low',
    });
    formattingScore -= 3;
  }
  
  const summaryText = typeof resume.professionalSummary === 'string' 
    ? resume.professionalSummary 
    : resume.professionalSummary?.summary || '';

  if (!summaryText) {
    warnings.push({
      type: 'incomplete',
      message: 'Professional summary is empty',
      section: 'Professional Summary',
      severity: 'medium',
    });
    completenessScore -= 10;
  } else if (summaryText.length < 50) {
    warnings.push({
      type: 'incomplete',
      message: 'Professional summary is too short',
      section: 'Professional Summary',
      severity: 'low',
    });
    completenessScore -= 5;
  } else if (summaryText.length > 500) {
    warnings.push({
      type: 'long-paragraph',
      message: 'Professional summary is too long (max 500 chars)',
      section: 'Professional Summary',
      severity: 'medium',
    });
    formattingScore -= 5;
  }
  
  if (resume.skills.length === 0) {
    warnings.push({
      type: 'incomplete',
      message: 'No skills listed',
      section: 'Skills',
      severity: 'high',
    });
    completenessScore -= 15;
  }
  
  const duplicateSkills = checkDuplicateSkills(resume.skills);
  if (duplicateSkills.length > 0) {
    warnings.push({
      type: 'incomplete',
      message: `Duplicate skills found: ${duplicateSkills.join(', ')}`,
      section: 'Skills',
      severity: 'low',
    });
    formattingScore -= 3;
  }
  
  if (resume.experience.length === 0) {
    warnings.push({
      type: 'incomplete',
      message: 'No work experience listed',
      section: 'Experience',
      severity: 'medium',
    });
    completenessScore -= 10;
  }
  
  // Check for buzzwords
  const resumeText = getResumeText(resume);
  const foundBuzzwords = checkBuzzwords(resumeText);
  if (foundBuzzwords.length > 0) {
    warnings.push({
      type: 'buzzword',
      message: `Avoid buzzwords: ${foundBuzzwords.slice(0, 3).join(', ')}`,
      section: 'General',
      severity: 'low',
    });
    formattingScore -= foundBuzzwords.length * 2;
  }
  
  // Check long paragraphs in experience
  resume.experience.forEach((exp, index) => {
    if (checkLongParagraphs(exp.description)) {
      warnings.push({
        type: 'long-paragraph',
        message: `Experience ${index + 1} has long paragraphs`,
        section: 'Experience',
        severity: 'medium',
      });
      formattingScore -= 3;
    }
  });
  
  // Keyword matching with job description
  if (jobDescription) {
    const jdKeywords = extractKeywords(jobDescription);
    const matchedKeywords = findMatchingKeywords(resumeText, jdKeywords);
    const missingKeywords = findMissingKeywords(resumeText, jdKeywords);
    
    keywordScore = Math.min(100, Math.round((matchedKeywords.length / jdKeywords.length) * 100));
    
    if (missingKeywords.length > 0 && missingKeywords.length <= 10) {
      warnings.push({
        type: 'missing-keyword',
        message: `Consider adding: ${missingKeywords.slice(0, 5).join(', ')}`,
        section: 'Keywords',
        severity: 'medium',
      });
    }
  }
  
  // Calculate overall score
  const overall = Math.round(
    (formattingScore * 0.3) + 
    (completenessScore * 0.4) + 
    (keywordScore * 0.3)
  );
  
  return {
    overall: Math.max(0, Math.min(100, overall)),
    keywordMatch: Math.max(0, Math.min(100, keywordScore)),
    formatting: Math.max(0, Math.min(100, formattingScore)),
    completeness: Math.max(0, Math.min(100, completenessScore)),
    warnings,
  };
};

export const getSummarySuggestions = (role: string): string[] => {
  const suggestions: { [key: string]: string[] } = {
    'software-engineer': [
      'Software Engineer with X years of experience in building scalable applications using [technologies].',
      'Results-driven developer specializing in [area] with a track record of delivering high-quality solutions.',
      'Experienced in full software development lifecycle from requirements to deployment and maintenance.',
    ],
    'frontend-developer': [
      'Frontend Developer with expertise in React, TypeScript, and modern web technologies.',
      'UI/UX focused developer creating responsive, accessible, and performant web applications.',
      'Passionate about building delightful user experiences with clean, maintainable code.',
    ],
    'backend-developer': [
      'Backend Developer specializing in building robust APIs and microservices architecture.',
      'Experienced in designing scalable database solutions and optimizing system performance.',
      'Strong background in cloud infrastructure and DevOps practices.',
    ],
    'fullstack-developer': [
      'Full Stack Developer proficient in both frontend and backend technologies.',
      'End-to-end developer with experience in React, Node.js, and cloud services.',
      'Versatile engineer capable of delivering complete solutions from database to UI.',
    ],
    'fresher': [
      'Recent graduate with strong foundation in computer science fundamentals.',
      'Eager learner with hands-on project experience in [technologies].',
      'Entry-level developer passionate about writing clean, efficient code.',
    ],
    'product-manager': [
      'Product Manager with experience in leading cross-functional teams.',
      'Data-driven PM focused on user-centric product development.',
      'Strategic thinker with a track record of successful product launches.',
    ],
  };
  
  return suggestions[role] || suggestions['software-engineer'];
};

export const getSkillSuggestions = (role: string): { technical: string[]; tools: string[]; soft: string[] } => {
  const skills: { [key: string]: { technical: string[]; tools: string[]; soft: string[] } } = {
    'software-engineer': {
      technical: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL', 'REST APIs', 'Microservices'],
      tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Jira', 'VS Code'],
      soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management'],
    },
    'frontend-developer': {
      technical: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Responsive Design'],
      tools: ['Git', 'Webpack', 'Vite', 'Figma', 'Chrome DevTools', 'npm', 'Jest'],
      soft: ['Attention to Detail', 'Creativity', 'User Empathy', 'Communication'],
    },
    'backend-developer': {
      technical: ['Node.js', 'Python', 'Java', 'Go', 'SQL', 'NoSQL', 'REST APIs', 'GraphQL'],
      tools: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ'],
      soft: ['Analytical Thinking', 'System Design', 'Documentation', 'Debugging'],
    },
    'fullstack-developer': {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'REST APIs', 'GraphQL'],
      tools: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'CI/CD', 'Vercel'],
      soft: ['Versatility', 'Problem Solving', 'Communication', 'Project Management'],
    },
    'fresher': {
      technical: ['JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'SQL', 'Data Structures', 'Algorithms'],
      tools: ['Git', 'VS Code', 'GitHub', 'Postman', 'npm'],
      soft: ['Quick Learner', 'Team Player', 'Adaptability', 'Eagerness to Learn'],
    },
    'product-manager': {
      technical: ['Product Strategy', 'User Research', 'A/B Testing', 'Analytics', 'Roadmapping'],
      tools: ['Jira', 'Confluence', 'Figma', 'Google Analytics', 'Mixpanel', 'Notion'],
      soft: ['Leadership', 'Communication', 'Stakeholder Management', 'Decision Making'],
    },
  };
  
  return skills[role] || skills['software-engineer'];
};