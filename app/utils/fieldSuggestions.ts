import { TemplateType } from '../types/resume';

export interface PredefinedBullet {
  category: string;
  template: string;
}

export interface SkillCategoryGroup {
  technical: string[];
  tools: string[];
  soft: string[];
}

// 1. Suggested Job Titles by Template / Domain
export const SUGGESTED_JOB_TITLES: Record<TemplateType | string, string[]> = {
  software: [
    'Software Engineer',
    'Senior Full Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'DevOps / Cloud Engineer',
    'Mobile Application Developer',
    'Data Engineer',
    'System Architect',
    'QA / Automation Engineer',
    'Machine Learning Engineer',
  ],
  management: [
    'Product Manager',
    'Senior Project Manager',
    'Technical Program Manager (TPM)',
    'Engineering Manager',
    'Operations Director',
    'Scrum Master / Agile Coach',
    'Business Operations Manager',
    'Product Owner',
    'Management Consultant',
  ],
  sales: [
    'Account Executive',
    'Enterprise Sales Director',
    'Sales Development Representative (SDR)',
    'Business Development Manager',
    'Customer Success Manager (CSM)',
    'Key Account Manager',
    'Regional Sales Lead',
    'Client Relationship Manager',
  ],
  healthcare: [
    'Registered Nurse (RN)',
    'Clinical Research Coordinator',
    'Healthcare Administrator',
    'Nurse Practitioner (NP)',
    'Medical Assistant',
    'Patient Care Coordinator',
    'Clinical Nurse Specialist',
    'Health Information Manager',
  ],
  creative: [
    'UI/UX Designer',
    'Senior Product Designer',
    'Visual & Brand Designer',
    'Design Systems Lead',
    'Motion Graphics Designer',
    'Art Director',
    'UX Researcher',
    'Graphic Designer',
  ],
  academic: [
    'Postdoctoral Research Fellow',
    'Assistant Professor',
    'Research Scientist',
    'Graduate Teaching Assistant',
    'Academic Advisor',
    'Lecturer',
    'Curriculum Developer',
    'Laboratory Director',
  ],
};

// 2. High-Impact Achievement Bullet Templates by Template / Domain
export const SUGGESTED_BULLET_TEMPLATES: Record<TemplateType | string, PredefinedBullet[]> = {
  software: [
    {
      category: 'Architecture & Performance',
      template: 'Architected and deployed microservices architecture handling [X]k daily requests, reducing latency by [Y]%',
    },
    {
      category: 'CI/CD & DevOps',
      template: 'Automated CI/CD build pipelines using GitHub Actions and Docker, reducing release cycle time by [X]%',
    },
    {
      category: 'Frontend & UX',
      template: 'Spearheaded frontend rebuild using React and Next.js, elevating Lighthouse performance score from [X] to [Y]',
    },
    {
      category: 'Database & Backend',
      template: 'Optimized PostgreSQL queries, indexing, and connection pooling, cutting median database response time by [X]%',
    },
    {
      category: 'Leadership & Mentorship',
      template: 'Mentored [X] junior software engineers through code reviews, pair programming, and architectural onboarding',
    },
    {
      category: 'Reliability & Scaling',
      template: 'Engineered automated failover and monitoring alerting using Prometheus/Grafana, achieving [99.9X]% system uptime',
    },
  ],
  management: [
    {
      category: 'Delivery & Launch',
      template: 'Led cross-functional team of [X] engineers and designers to launch core product MVP [Y] weeks ahead of schedule',
    },
    {
      category: 'Strategy & Roadmap',
      template: 'Defined product roadmap and quarterly OKRs aligned with executive strategy, boosting quarterly revenue by [X]%',
    },
    {
      category: 'Process Optimization',
      template: 'Streamlined sprint planning and agile ceremonies, accelerating team story-point velocity by [X]%',
    },
    {
      category: 'Budget & Cost',
      template: 'Negotiated key SaaS vendor contracts and cloud infrastructure allocations, reducing annual OPEX by $[X]k',
    },
    {
      category: 'Stakeholder Alignment',
      template: 'Aligned executive leadership and customer stakeholders across [X] departments to resolve roadmap blockers',
    },
  ],
  sales: [
    {
      category: 'Quota Attainment',
      template: 'Surpassed annual sales quota by [X]%, generating $[Y] in new recurring enterprise revenue (ARR)',
    },
    {
      category: 'Prospecting & Pipeline',
      template: 'Pioneered multi-channel outbound prospecting campaign, booking [X]+ qualified sales meetings monthly',
    },
    {
      category: 'Enterprise Closing',
      template: 'Negotiated and closed [X] multi-year SaaS agreements with Fortune 500 accounts, maintaining [Y]% retention',
    },
    {
      category: 'Cycle Acceleration',
      template: 'Shortened average enterprise sales cycle from [X] days to [Y] days through consultative discovery frameworks',
    },
  ],
  healthcare: [
    {
      category: 'Patient Care',
      template: 'Delivered compassionate clinical patient care and triage for [X]+ patients daily in high-volume unit',
    },
    {
      category: 'Compliance & Standards',
      template: 'Maintained 100% compliance with HIPAA, OSHA, and hospital charting protocols across all patient records',
    },
    {
      category: 'Collaboration',
      template: 'Collaborated with multidisciplinary medical team of [X] physicians and specialists to customize care plans',
    },
    {
      category: 'Quality Improvement',
      template: 'Implemented updated patient intake hygiene protocol, reducing hospital-acquired infection rates by [X]%',
    },
  ],
  creative: [
    {
      category: 'Design Systems',
      template: 'Constructed comprehensive design system with [X]+ accessible components in Figma, cutting dev handoff time by [Y]%',
    },
    {
      category: 'Conversion & UX',
      template: 'Redesigned core mobile checkout funnel, reducing cart abandonment and lifting checkout completion by [X]%',
    },
    {
      category: 'User Research',
      template: 'Conducted [X] moderated user usability tests and translated insights into user journey wireframes',
    },
    {
      category: 'Brand & Creative',
      template: 'Developed unified brand visual guidelines and marketing creative assets deployed across [X] channels',
    },
  ],
  academic: [
    {
      category: 'Publications',
      template: 'Authored and published [X] peer-reviewed articles in high-impact academic journals with [Y]+ citations',
    },
    {
      category: 'Grant Funding',
      template: 'Co-authored grant proposal securing $[X]k in institutional and federal funding for research lab',
    },
    {
      category: 'Teaching & Mentorship',
      template: 'Instructed undergraduate courses of [X]+ students, earning a [Y]/5.0 student satisfaction rating',
    },
    {
      category: 'Data Analysis',
      template: 'Synthesized and analyzed experimental dataset of [X]+ samples utilizing Python, R, and SPSS',
    },
  ],
};

// 3. Education Coursework, Fields of Study & Honors Suggestions
export const SUGGESTED_FIELDS_OF_STUDY = [
  'Computer Science',
  'Software Engineering',
  'Data Science & Analytics',
  'Information Technology',
  'Electrical & Computer Engineering',
  'Business Administration (MBA)',
  'Finance & Accounting',
  'Marketing & Communications',
  'Healthcare Administration',
  'Nursing & Biomedical Sciences',
  'Graphic Design & Digital Media',
  'Human-Computer Interaction (HCI)',
  'Mechanical Engineering',
  'Economics',
];

export const SUGGESTED_COURSEWORK_BY_DOMAIN: Record<string, string[]> = {
  technical: [
    'Data Structures & Algorithms',
    'Distributed Systems',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Object-Oriented Programming',
    'Cloud Computing & Architecture',
    'Machine Learning & AI',
    'Cybersecurity & Cryptography',
    'Web Architecture & API Design',
    'Software Testing & QA',
  ],
  business: [
    'Financial Modeling & Analysis',
    'Strategic Management',
    'Corporate Finance',
    'Marketing Strategy',
    'Operations & Supply Chain',
    'Business Law & Ethics',
    'Organizational Leadership',
    'Data-Driven Decision Making',
  ],
  general: [
    'Statistics & Probability',
    'Project Management Methodologies',
    'Technical Communications',
    'Human-Centered Design',
    'Research Methodologies',
    'Ethics in Technology',
  ],
};

export const SUGGESTED_HONORS = [
  "Dean's List (All Semesters)",
  'Summa Cum Laude (Top 1%)',
  'Magna Cum Laude',
  'Cum Laude',
  'University Honors Scholar',
  'Presidential Academic Merit Scholarship',
  'Departmental Honors in Major',
  'Phi Beta Kappa Academic Honor Society',
  'First Place in Annual Capstone Competition',
  'Outstanding Graduate Researcher Award',
];

// 4. Project Tech Stacks & Ideas Suggestions
export const POPULAR_TECH_STACKS: { label: string; technologies: string[] }[] = [
  {
    label: 'Modern Web (Next.js + TS)',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    label: 'MERN Stack',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Redux'],
  },
  {
    label: 'Cloud & DevOps',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions'],
  },
  {
    label: 'Python / AI Backend',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    label: 'Mobile Development',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'GraphQL'],
  },
];

export const SUGGESTED_PROJECT_HIGHLIGHTS: PredefinedBullet[] = [
  {
    category: 'Architecture',
    template: 'Built responsive web application serving [X]+ active monthly users with sub-second response times',
  },
  {
    category: 'Authentication & Security',
    template: 'Integrated OAuth2 / JWT authentication, role-based access control (RBAC), and session management',
  },
  {
    category: 'API & Integration',
    template: 'Developed RESTful / GraphQL APIs with comprehensive unit test coverage and automated Swagger docs',
  },
  {
    category: 'Cloud Deployment',
    template: 'Containerized application with Docker and orchestrated deployment onto AWS / Vercel with automated CI/CD',
  },
];

// 5. Predefined Summary Suggestions by All 6 App Templates
export const SUMMARY_SUGGESTIONS_BY_TEMPLATE: Record<TemplateType | string, string[]> = {
  software: [
    'Results-driven Software Engineer with [X]+ years of experience designing and scaling distributed web applications. Proven track record in TypeScript, React, and cloud architectures, reducing latency and boosting team delivery velocity.',
    'Full Stack Engineer specializing in modern JavaScript/TypeScript ecosystems and microservices. Passionate about clean code, robust API architecture, and delivering high-performance user experiences.',
    'Senior Backend Developer with deep expertise in distributed databases, REST/GraphQL APIs, and cloud infrastructure. Dedicated to building fault-tolerant systems with high uptime.',
    'Entry-level Software Developer with a solid foundation in computer science, data structures, and hands-on project experience in full-stack web technologies.',
  ],
  management: [
    'Strategic Product Manager with [X]+ years leading cross-functional engineering and design teams. Adept at translating customer pain points into high-impact product roadmaps and quantifiable business revenue.',
    'Results-oriented Technical Program Manager experienced in agile methodologies, stakeholder alignment, and managing complex multi-team software deliveries on time and within budget.',
    'Engineering Leader with a proven history of scaling high-performing software teams, fostering technical excellence, and streamlining development lifecycle processes.',
  ],
  sales: [
    'High-performing Enterprise Account Executive with [X]+ years in B2B SaaS sales. Consistent record of exceeding quotas by [Y]%, closing multi-year enterprise contracts, and accelerating pipeline growth.',
    'Energetic Business Development Representative skilled in consultative selling, outbound prospecting, and relationship building, consistently driving qualified discovery pipelines.',
    'Customer Success Leader dedicated to maximizing client retention, product adoption, and expansion revenue across enterprise account portfolios.',
  ],
  healthcare: [
    'Compassionate Registered Nurse with [X]+ years of clinical experience in acute patient care and triage. Dedicated to patient advocacy, strict HIPAA compliance, and interdisciplinary collaboration.',
    'Detail-oriented Clinical Coordinator with comprehensive background in electronic health record (EHR) management, regulatory protocols, and patient care optimization.',
    'Healthcare Professional experienced in patient assessment, medication administration, and improving care delivery standards in fast-paced medical environments.',
  ],
  creative: [
    'User-centered UI/UX Designer with [X]+ years crafting intuitive digital interfaces and scalable design systems. Expert in Figma, user research, wireframing, and elevating customer conversion funnels.',
    'Product Designer passionate about bridging the gap between user needs and business objectives through data-informed visual design and interactive prototyping.',
    'Creative Director experienced in leading multi-disciplinary design teams, brand strategy, and delivering cohesive visual identities across omni-channel touchpoints.',
  ],
  academic: [
    'Dedicated Academic Researcher and Educator with [X]+ years of university instruction and peer-reviewed publication experience. Proven track record in grant writing and statistical analysis.',
    'Postdoctoral Research Scientist specializing in empirical methodologies, data modeling, and interdisciplinary research collaborations.',
    'Higher Education Lecturer committed to student mentorship, curriculum innovation, and advancing academic scholarship through rigorous inquiry.',
  ],
};

// 6. Predefined Skill Suggestions by All 6 App Templates
export const SKILL_SUGGESTIONS_BY_TEMPLATE: Record<TemplateType | string, SkillCategoryGroup> = {
  software: {
    technical: ['TypeScript', 'JavaScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'SQL', 'GraphQL', 'REST APIs', 'Next.js'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Vercel', 'Postman', 'VS Code', 'GitHub Actions'],
    soft: ['System Design', 'Code Reviews', 'Problem Solving', 'Team Collaboration', 'Agile / Scrum', 'Mentorship'],
  },
  management: {
    technical: ['Product Strategy', 'Roadmapping', 'Agile Methodologies', 'User Story Mapping', 'KPI Tracking', 'A/B Testing', 'Market Research'],
    tools: ['Jira', 'Confluence', 'Figma', 'Notion', 'Google Analytics', 'Linear', 'Mixpanel', 'Trello', 'Slack'],
    soft: ['Cross-functional Leadership', 'Stakeholder Management', 'Strategic Decision Making', 'Negotiation', 'Conflict Resolution'],
  },
  sales: {
    technical: ['B2B Sales', 'Pipeline Management', 'Consultative Selling', 'Contract Negotiation', 'Lead Qualification', 'Cold Outreach', 'Forecasting'],
    tools: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'Outreach.io', 'Gong', 'ZoomInfo', 'Pipedrive'],
    soft: ['Active Listening', 'Relationship Building', 'Persuasion', 'Resilience', 'Customer Empathy', 'Executive Presentation'],
  },
  healthcare: {
    technical: ['Patient Assessment', 'Clinical Triage', 'Medication Administration', 'HIPAA Compliance', 'Vital Signs Monitoring', 'Infection Control', 'Care Planning'],
    tools: ['Epic Systems', 'Cerner EHR', 'PointClickCare', 'Meditech', 'Pyxis MedStation', 'Stethoscopes', 'BLS / ACLS'],
    soft: ['Patient Empathy', 'Crisis Management', 'Interdisciplinary Teamwork', 'Detail Orientation', 'Clear Communication', 'Compassion'],
  },
  creative: {
    technical: ['UI/UX Design', 'Design Systems', 'Wireframing', 'Interactive Prototyping', 'User Research', 'Typography', 'Responsive Design', 'Information Architecture'],
    tools: ['Figma', 'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'After Effects', 'Framer', 'Sketch', 'Miro'],
    soft: ['Creative Problem Solving', 'User Advocacy', 'Design Presentation', 'Constructive Feedback', 'Visual Storytelling'],
  },
  academic: {
    technical: ['Quantitative Research', 'Qualitative Analysis', 'Experimental Design', 'Grant Writing', 'Manuscript Preparation', 'Statistical Modeling', 'Curriculum Design'],
    tools: ['Python', 'R Studio', 'SPSS', 'LaTeX', 'EndNote', 'Zotero', 'Canvas / Blackboard', 'MATLAB'],
    soft: ['Academic Mentorship', 'Critical Thinking', 'Public Speaking', 'Peer Reviewing', 'Scholarly Writing', 'Pedagogy'],
  },
};
