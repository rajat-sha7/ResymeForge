import React from 'react';
import { ResumeData, SectionType } from '../types/resume';

interface BaseTemplateProps {
  data: ResumeData;
  enabledSections: SectionType[];
}

// ATS-friendly template with clean, parseable structure
const BaseTemplate: React.FC<BaseTemplateProps> = ({ data, enabledSections }) => {
  // Normalize skills to always have the Skill structure
  const normalizedSkills = data.skills.map((skill, i) => {
    if (typeof skill === 'string') {
      return { id: `skill-${i}`, name: skill, category: 'technical' as const, priority: i };
    }
    return skill;
  });
  
  // Group skills by category if available
  const groupedSkills = normalizedSkills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof normalizedSkills>);

  const categoryLabels: Record<string, string> = {
    technical: 'Technical Skills',
    tools: 'Tools & Technologies',
    soft: 'Soft Skills',
    other: 'Other Skills',
  };

  return (
    <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.4' }}>
      {/* Personal Info - ATS readable header */}
      {enabledSections.includes('personalInfo') && (
        <div className="mb-5 text-center border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">{data.personalInfo.name || 'Your Name'}</h1>
          <div className="text-sm space-x-2">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
          </div>
          <div className="text-sm space-x-2 mt-1">
            {data.personalInfo.linkedin && <span>LinkedIn: {data.personalInfo.linkedin}</span>}
            {data.personalInfo.github && <span>| GitHub: {data.personalInfo.github}</span>}
            {data.personalInfo.portfolio && <span>| Portfolio: {data.personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {enabledSections.includes('professionalSummary') && data.professionalSummary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary}</p>
        </div>
      )}

      {/* Skills - Grouped by category for better ATS parsing */}
      {enabledSections.includes('skills') && data.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Skills</h2>
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="mb-1">
              <span className="text-sm font-semibold">{categoryLabels[category] || category}: </span>
              <span className="text-sm">{skills.map(s => s.name).join(', ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Experience - ATS optimized with clear structure */}
      {enabledSections.includes('experience') && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold">{exp.position}</h3>
                <span className="text-sm">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium">{exp.company}</span>
                {exp.location && <span className="text-sm text-gray-600">{exp.location}</span>}
              </div>
              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="mt-1 ml-4">
                  {exp.achievements.map((ach, i) => (
                    <li key={i} className="text-sm before:content-['•'] before:mr-2">{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {enabledSections.includes('projects') && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold">{proj.name}</h3>
                {proj.link && <span className="text-sm text-blue-700">{proj.link}</span>}
              </div>
              {proj.role && <p className="text-sm italic">{proj.role}</p>}
              {proj.description && <p className="text-sm mt-1">{proj.description}</p>}
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}
                </p>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="mt-1 ml-4">
                  {proj.highlights.map((hl, i) => (
                    <li key={i} className="text-sm before:content-['•'] before:mr-2">{hl}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {enabledSections.includes('education') && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm">{edu.institution}</span>
                {edu.location && <span className="text-sm text-gray-600">{edu.location}</span>}
              </div>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
              {edu.coursework && edu.coursework.length > 0 && (
                <p className="text-sm">
                  <span className="font-medium">Relevant Coursework:</span> {edu.coursework.join(', ')}
                </p>
              )}
              {edu.honors && edu.honors.length > 0 && (
                <p className="text-sm">
                  <span className="font-medium">Honors:</span> {edu.honors.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {enabledSections.includes('certifications') && data.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold">{cert.name}</span>
                <span className="text-sm">{cert.date}</span>
              </div>
              <span className="text-sm">{cert.issuer}</span>
              {cert.credentialId && <span className="text-sm text-gray-600 ml-2">ID: {cert.credentialId}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {enabledSections.includes('achievements') && data.achievements.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">Achievements & Awards</h2>
          {data.achievements.map((ach) => (
            <div key={ach.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold">{ach.title}</span>
                {ach.date && <span className="text-sm">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-sm">{ach.description}</p>}
              {ach.impact && <p className="text-sm italic">Impact: {ach.impact}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.filter(cs => enabledSections.includes(cs.id as SectionType)).map(section => (
        <div key={section.id} className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-2">{section.title}</h2>
          {section.items.map((item) => (
            <div key={item.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold">{item.title}</span>
                {item.date && <span className="text-sm">{item.date}</span>}
              </div>
              {item.subtitle && <span className="text-sm">{item.subtitle}</span>}
              {item.description && <p className="text-sm mt-1">{item.description}</p>}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-1 ml-4">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm before:content-['•'] before:mr-2">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BaseTemplate;