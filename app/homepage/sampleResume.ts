import { ResumeData } from "../types/resume";

/** Fictional resume used to render real template previews on the homepage. */
export const sampleResume: ResumeData = {
  id: "sample",
  title: "Sample resume",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  tags: [],
  template: "software",
  personalInfo: {
    name: "Alex Morgan",
    title: "Product Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 415 555 0142",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolio: "alexmorgan.dev",
  },
  professionalSummary: {
    enabled: true,
    summary:
      "Product engineer with six years of experience building web apps used by small businesses. Led the rebuild of a billing system that cut failed payments by 18%. Comfortable owning a feature from first sketch to production.",
  },
  skills: [
    { id: "s1", name: "TypeScript", category: "technical", priority: 1 },
    { id: "s2", name: "React", category: "technical", priority: 2 },
    { id: "s3", name: "Node.js", category: "technical", priority: 3 },
    { id: "s4", name: "PostgreSQL", category: "technical", priority: 4 },
    { id: "s5", name: "AWS", category: "tools", priority: 5 },
    { id: "s6", name: "Figma", category: "tools", priority: 6 },
    { id: "s7", name: "Mentoring", category: "soft", priority: 7 },
    { id: "s8", name: "Technical writing", category: "soft", priority: 8 },
  ],
  experience: [
    {
      id: "e1",
      company: "Ledgerly",
      position: "Senior Product Engineer",
      location: "Austin, TX",
      startDate: "Mar 2022",
      endDate: "",
      current: true,
      description: "Billing and payments team for an invoicing product with 40,000 paying customers.",
      achievements: [
        "Rebuilt the payment retry system, reducing failed payments by 18% in two quarters",
        "Designed a usage-based pricing model now used by a third of new accounts",
        "Mentored four engineers through their first on-call rotation",
      ],
    },
    {
      id: "e2",
      company: "Brightdesk",
      position: "Software Engineer",
      location: "Remote",
      startDate: "Jun 2019",
      endDate: "Feb 2022",
      current: false,
      description: "Customer support software for retail teams.",
      achievements: [
        "Shipped a shared inbox that replaced three internal tools",
        "Cut page load time on the main dashboard from 4.1s to 1.3s",
      ],
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Open Receipts",
      description: "Open-source library for parsing receipts from photos.",
      technologies: ["TypeScript", "Tesseract"],
      role: "Maintainer",
      highlights: ["Used by 1,200 projects on GitHub"],
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "University of Texas at Austin",
      degree: "B.S.",
      field: "Computer Science",
      location: "Austin, TX",
      startDate: "2015",
      endDate: "2019",
    },
  ],
  certifications: [
    { id: "c1", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2023" },
  ],
  achievements: [
    { id: "a1", title: "Speaker, Austin JS", description: "Talk on designing retry logic for payments.", date: "2024" },
  ],
  customSections: [],
};
