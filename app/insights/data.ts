export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: number;
  coverColor: string;
  tags: string[];
  featured?: boolean;
}

export const insights: Insight[] = [
  {
    slug: 'how-ats-works',
    title: 'How ATS Systems Actually Work (And How to Beat Them)',
    excerpt: 'Most online applications pass through an applicant tracking system before a recruiter sees them. Here is how they parse your resume and what you can do to make sure yours reads correctly.',
    content: `
<h2>What is an ATS?</h2>
<p>An Applicant Tracking System (ATS) is software used by recruiters and HR teams to collect, sort, scan, and rank job applications. Companies like Workday, Greenhouse, Lever, and Taleo power the hiring pipelines of thousands of major employers.</p>
<p>When you submit your resume online, it almost never goes straight to a human. First, the ATS parses your document, extracts information, and assigns a relevancy score based on how well it matches the job description.</p>
<h2>How ATS Parsing Works</h2>
<p>The ATS reads your resume top-to-bottom and tries to identify:</p>
<ul>
  <li><strong>Contact information</strong> — name, email, phone, location</li>
  <li><strong>Work experience</strong> — job titles, companies, dates, and bullets</li>
  <li><strong>Education</strong> — degree, institution, graduation year</li>
  <li><strong>Skills</strong> — hard skills, tools, technologies</li>
  <li><strong>Keywords</strong> — terms that appear in the job description</li>
</ul>
<p>If your resume uses complex layouts, tables, headers/footers, text boxes, or unusual fonts, the parser may scramble or miss your content entirely.</p>
<h2>The Keyword Matching Game</h2>
<p>Most ATS tools score resumes by counting keyword matches against the job posting. If a role requires "Python, REST APIs, and AWS" and your resume says "I built cloud services with scripting languages," you may score 0 even if you are the perfect candidate.</p>
<p><strong>Action:</strong> Mirror the exact wording of the job description. If they say "machine learning" do not just say "ML."</p>
<h2>Formatting Rules That Save You</h2>
<ol>
  <li>Use a clean single-column or simple two-column layout</li>
  <li>Save as PDF (most modern ATS handle PDF well)</li>
  <li>Never put critical information in headers, footers, or text boxes</li>
  <li>Use standard section headings: "Experience," "Education," "Skills"</li>
  <li>Avoid tables, columns created with tabs, and special characters</li>
</ol>
<h2>Beating the Score</h2>
<p>Use ResumeForge's ATS Health Panel to analyze your resume against a job description in real-time. It checks formatting, keyword density, and completeness — giving you an actionable score before you click submit.</p>
<blockquote>The goal is not to trick the ATS. It is to ensure that a system designed to filter finds you, because you actually are the right candidate.</blockquote>
    `,
    category: 'ATS Tips',
    author: 'Priya Mehta',
    authorRole: 'Technical Recruiter, 8 years experience',
    date: '2026-02-18',
    readTime: 6,
    coverColor: 'from-blue-600 via-blue-700 to-indigo-800',
    tags: ['ATS', 'Resume Tips', 'Job Search'],
    featured: true,
  },
  {
    slug: 'resume-summary-vs-objective',
    title: 'Resume Summary vs. Objective: Which One to Use in 2026',
    excerpt: 'The "Objective" section is dead — but a poorly written summary is almost as bad. Learn the exact formula for a 3-sentence summary that makes recruiters read on.',
    content: `
<h2>The Objective is Dead</h2>
<p>Statements like <em>"Seeking a challenging position where I can utilize my skills"</em> add zero value. Recruiters spend on average 6–10 seconds on first pass. An objective statement wastes all of it talking about what <em>you</em> want — not what you bring.</p>
<h2>The Professional Summary: Your Elevator Pitch</h2>
<p>A professional summary sits at the top of your resume and answers one question: <strong>Why should I keep reading?</strong></p>
<p>The best summaries follow a simple 3-part formula:</p>
<ol>
  <li><strong>Who you are</strong> — title + years of experience + specialization</li>
  <li><strong>What you have achieved</strong> — your single biggest quantified win</li>
  <li><strong>What you bring</strong> — your top 2–3 skills relevant to the target role</li>
</ol>
<h2>Example: Before vs. After</h2>
<p><strong>Before (weak):</strong><br/>
"Experienced software engineer looking for a role to grow and contribute to a dynamic team."</p>
<p><strong>After (strong):</strong><br/>
"Senior Software Engineer with 7 years building distributed systems at scale. Reduced API latency by 40% at Acme Corp by re-architecting the caching layer. Expert in Go, Kubernetes, and cloud-native design patterns."</p>
<h2>Tailoring Your Summary for Each Role</h2>
<p>Your summary should change for every application — at least slightly. Pull 2–3 keywords from the job description and weave them in naturally. This both helps ATS scoring and signals to human readers that you have actually read the posting.</p>
<h2>Length</h2>
<p>Keep it to 3–5 sentences or 50–80 words maximum. Anything longer and recruiters skip it entirely.</p>
    `,
    category: 'Writing Tips',
    author: 'James Okafor',
    authorRole: 'Career Coach & Ex-Google Recruiter',
    date: '2026-02-10',
    readTime: 4,
    coverColor: 'from-purple-600 via-purple-700 to-fuchsia-800',
    tags: ['Resume Writing', 'Summary', 'Career'],
  },
  {
    slug: 'quantify-achievements',
    title: "How to Quantify Your Achievements (Even When You Don't Have Numbers)",
    excerpt: 'A specific number turns a vague bullet into evidence. But what do you do when your job does not come with obvious metrics? We cover six techniques.',
    content: `
<h2>Why Numbers Matter</h2>
<p>Bullet points like "Improved team processes" are invisible to both ATS and human readers. Add a number and it becomes: "Reduced sprint planning time by 30% by implementing async pre-reads — saving the team 2 hours per week." Now it is a story and a proof point.</p>
<h2>The Six Quantification Techniques</h2>
<h3>1. Volume / Scale</h3>
<p>How much, how many, how often? <em>"Managed a portfolio of 45 enterprise clients" or "Processed 2,000+ support tickets monthly."</em></p>
<h3>2. Growth / Improvement</h3>
<p>Percentage change from a baseline. <em>"Increased email open rates from 18% to 31% in one quarter."</em></p>
<h3>3. Time Saved</h3>
<p>Even if you did not track it, estimate conservatively. <em>"Automated the weekly reporting process, saving approximately 3 hours per week."</em></p>
<h3>4. Money</h3>
<p>Revenue generated, costs saved, budget managed. <em>"Negotiated vendor contracts resulting in $120K annual savings."</em></p>
<h3>5. Team / Scope</h3>
<p>People managed, projects owned. <em>"Led a cross-functional team of 11 across 3 time zones."</em></p>
<h3>6. Rankings / Ratings</h3>
<p>Awards, percentiles, scores. <em>"Ranked #2 in regional sales out of 47 representatives."</em></p>
<h2>When You Truly Do Not Have Numbers</h2>
<p>Ask yourself: What would happen if I did not do this task? That is the value. Then approximate conservatively. It is always better to say "approximately" than to leave the bullet vague.</p>
<blockquote>"Managed social media accounts" becomes "Managed 4 social media accounts with a combined following of ~18K, growing engagement by roughly 25% over 6 months."</blockquote>
    `,
    category: 'Writing Tips',
    author: 'Sarah Liu',
    authorRole: 'Resume Writer & LinkedIn Coach',
    date: '2026-01-28',
    readTime: 5,
    coverColor: 'from-emerald-500 via-teal-600 to-cyan-700',
    tags: ['Resume Writing', 'Achievements', 'Metrics'],
  },
  {
    slug: 'linkedin-vs-resume',
    title: "LinkedIn Profile vs. Resume: What's Different and Why It Matters",
    excerpt: 'Your LinkedIn and resume serve entirely different purposes in your job search. Treating them the same is one of the most common mistakes candidates make.',
    content: `
<h2>Two Different Tools, Two Different Jobs</h2>
<p>Your resume is a targeted, curated artifact tailored for a specific role. Your LinkedIn profile is a searchable, public-facing professional identity that speaks to your entire career and network.</p>
<h2>Key Differences</h2>
<table>
  <tr><th>Resume</th><th>LinkedIn</th></tr>
  <tr><td>1–2 pages, concise</td><td>No length limit — more detail is better</td></tr>
  <tr><td>Tailored per application</td><td>One version for all audiences</td></tr>
  <tr><td>No photo</td><td>Professional photo is essential</td></tr>
  <tr><td>Formal tone</td><td>Slightly conversational, first-person OK</td></tr>
  <tr><td>No links needed</td><td>Links to projects, articles, portfolio</td></tr>
</table>
<h2>Headline Strategy</h2>
<p>Your LinkedIn headline is the most valuable SEO real estate on your profile. Do not just put your job title. Include the role you want, your top skill, and a value hook: <em>"Software Engineer | React & Node.js | Building products used by 2M+ users"</em></p>
<h2>The About Section</h2>
<p>Unlike your resume summary, the LinkedIn About section can be longer (up to 2,600 characters) and should tell your story. Write in first person, explain your career journey, and end with a clear call-to-action about what you are looking for.</p>
<h2>Recommendations</h2>
<p>Ask 3–5 colleagues or managers for specific written recommendations. These provide social proof that no resume can replicate.</p>
    `,
    category: 'Job Search',
    author: 'Marcus Rivera',
    authorRole: 'HR Director & Career Strategist',
    date: '2026-01-15',
    readTime: 5,
    coverColor: 'from-sky-500 via-blue-600 to-indigo-700',
    tags: ['LinkedIn', 'Job Search', 'Personal Brand'],
  },
  {
    slug: 'career-change-resume',
    title: "The Career Changer's Resume: How to Position a Pivot Without Lying",
    excerpt: 'Changing industries is hard. Your resume needs to reframe transferable skills without hiding your background. Here is the framework career coaches actually use.',
    content: `
<h2>The Core Challenge</h2>
<p>When you change careers, your job history no longer speaks directly to your target role. The mistake most people make is either hiding their old experience or listing it as-is and hoping the reader connects the dots. The solution is <strong>intentional framing</strong>.</p>
<h2>Step 1: Identify Transferable Skills</h2>
<p>List every skill from your previous career and map it to skills needed in the new one. A teacher pivoting to instructional design brings: curriculum development, learner experience design, stakeholder communication, and assessment frameworks. These are premium UX and L&D skills.</p>
<h2>Step 2: Lead with a Powerful Summary</h2>
<p>Your summary must do the heavy lifting. Name your new target title first: <em>"UX Designer (formerly high school teacher) with 8 years designing learning experiences for diverse audiences. Now applying human-centered design principles to digital products."</em></p>
<h2>Step 3: Rewrite Old Bullets Through the New Lens</h2>
<p>For every old bullet, ask: <em>"Is there a version of this that demonstrates a skill my target role values?"</em> You are not lying — you are emphasizing the parts that matter.</p>
<h2>Step 4: Add Proof of the Transition</h2>
<p>Include a "Projects" or "Training" section. Bootcamp certificates, freelance projects, side builds, or relevant courses signal commitment and reduce hiring risk.</p>
<h2>Step 5: Use a Hybrid Format</h2>
<p>Lead with a skills section grouped by capability, then follow with your experience in reverse-chronological order.</p>
    `,
    category: 'Career Change',
    author: 'Aisha Patel',
    authorRole: 'Career Transition Coach, ICF Certified',
    date: '2026-01-05',
    readTime: 7,
    coverColor: 'from-orange-500 via-rose-600 to-pink-700',
    tags: ['Career Change', 'Transferable Skills', 'Strategy'],
  },
  {
    slug: 'remote-job-resume',
    title: 'Optimizing Your Resume for Remote Job Applications in 2026',
    excerpt: 'Remote roles tend to draw a large pool of applicants. Your resume needs to show you can work well remotely, or it can get lost among the rest.',
    content: `
<h2>The Remote Job Market Reality</h2>
<p>A single remote engineering role at a recognizable company can receive 2,000+ applications. ATS filters are aggressive, and recruiters move fast. Your resume has to broadcast that you thrive without an office.</p>
<h2>Signal Remote Experience Directly</h2>
<p>If you have worked remotely before, say so explicitly: <em>"Led product roadmap planning across a fully remote, async-first team of 12 in 5 time zones."</em> This is a keyword ("remote") and a soft-skill proof point.</p>
<h2>Showcase Async Communication Skills</h2>
<p>Remote hiring managers specifically look for evidence of written communication, self-management, and async workflows. Include tools like Notion, Slack, Linear, Loom, or Confluence in your skills section.</p>
<h2>Home Office Setup (Optional but Smart)</h2>
<p>For senior remote roles, a brief note about your setup can remove friction: <em>"Dedicated home office with 300Mbps fiber, four-monitor setup, and professional audio/video for client-facing calls."</em></p>
<h2>Time Zone Flexibility</h2>
<p>If you can overlap with the hiring team's core hours, say so. Many remote teams have a core overlap window (e.g., 10am–2pm EST) and candidates who signal awareness of this stand out.</p>
<h2>Remote-Specific Keywords</h2>
<p>Sprinkle these naturally throughout your bullets: async communication, distributed team, remote-first, self-directed, high autonomy, written documentation, digital collaboration.</p>
    `,
    category: 'Remote Work',
    author: 'David Chen',
    authorRole: 'Remote Work Advocate & Tech Hiring Manager',
    date: '2025-12-20',
    readTime: 5,
    coverColor: 'from-violet-600 via-purple-700 to-indigo-800',
    tags: ['Remote Work', 'Job Search', 'Resume Tips'],
  },
];

export const categories = Array.from(new Set(insights.map(i => i.category)));
export const allTags    = Array.from(new Set(insights.flatMap(i => i.tags)));

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find(i => i.slug === slug);
}