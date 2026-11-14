import React from "react";
import { ResumeData } from "../types/resume";
import { formatDateRange } from "../utils/resumeRender";


const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const normalizedSkills = data.skills.map((skill, i) =>
    typeof skill === 'string' ? { id: `skill-${i}`, name: skill, category: 'technical', priority: i } : skill
  );
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
    <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8" style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', lineHeight: '1.7' }}>
      {/* Header with institution style */}
      <div className="text-center border-b-4 border-green-700 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#065f46' }}>{data.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#059669' }}>Academic & Research Professional</p>
        <div className="flex flex-wrap justify-center gap-3">
          {data.personalInfo?.email && <span className="text-xs">{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span className="text-gray-400 text-xs">•</span>}
          {data.personalInfo?.phone && <span className="text-xs">{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span className="text-gray-400 text-xs">•</span>}
          {data.personalInfo?.location && <span className="text-xs">{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Professional Summary - Academic Focus */}
      {data.professionalSummary && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-700 italic">
          <p className="text-sm">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary?.summary}</p>
        </div>
      )}

      {/* Education - Prominent */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Education</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="border-l-4 border-green-300 pl-4">
                <p className="font-bold text-sm">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                <p className="text-sm font-semibold" style={{ color: '#059669' }}>{edu.institution}</p>
                <p className="text-xs text-gray-600">{formatDateRange(edu.startDate, edu.endDate)}</p>
                {edu.gpa && edu.showGpa && <p className="text-xs text-gray-700 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm">{exp.position}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{exp.company}, {exp.location}</p>
                <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1 list-none">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-2">
                        <span style={{ color: '#059669' }}>›</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research/Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Research & Projects</h2>
          <div className="space-y-3">
            {data.projects.map(proj => (
              <div key={proj.id} className="border rounded-lg p-3 border-green-200 bg-green-50">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm">{proj.name}</p>
                  {proj.link && <a href={proj.link} className="text-xs text-green-700 underline" target="_blank" rel="noopener noreferrer">Link</a>}
                </div>
                <p className="text-xs font-semibold text-gray-600 mb-1">{proj.role}</p>
                <p className="text-xs text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {normalizedSkills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Competencies</h2>
          <div className="space-y-3">
            {Object.entries(groupedSkills).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs font-bold uppercase mb-2" style={{ color: '#059669' }}>{categoryLabels[cat] || cat}</p>
                <p className="text-sm text-gray-700">{skills.map(s => s.name).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Certifications & Credentials</h2>
          <div className="space-y-2">
            {data.certifications.map(cert => (
              <div key={cert.id} className="text-xs">
                <p className="font-bold">{cert.name}</p>
                <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600" style={{ color: '#065f46' }}>Awards & Honors</h2>
          <div className="space-y-2">
            {data.achievements.map(ach => (
              <div key={ach.id} className="text-xs">
                <p className="font-bold">{ach.title}</p>
                <p className="text-gray-600">{ach.date}</p>
                {ach.description && <p className="text-gray-700 mt-0.5">{ach.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicTemplate;
