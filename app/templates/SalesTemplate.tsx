import React from "react";
import { ResumeData } from "../types/resume";
import { formatDateRange } from "../utils/resumeRender";


const SalesTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8" style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '11pt', lineHeight: '1.6' }}>
      {/* Bold Header with accent */}
        <div className="mb-6 bg-linear-to-r from-orange-500 to-amber-600 text-white p-5 rounded-lg">
        <h1 className="text-3xl font-black mb-1">{data.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-sm font-bold opacity-90">{data.personalInfo?.title || 'Sales Professional'}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Key Metrics - Highlighted */}
      {data.professionalSummary && (
        <div className="mb-6 bg-linear-to-b from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-lg">
          <p className="text-sm font-bold text-amber-900">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary?.summary}</p>
        </div>
      )}

      {/* Experience - Metrics Focused */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-4 text-orange-700 pb-2 border-b-2 border-orange-300">Sales & Business Experience</h2>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="border-l-4 border-amber-400 pl-4 bg-orange-50 p-3 rounded-r">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm text-gray-900">{exp.position}</p>
                  <span className="text-xs font-bold text-white bg-orange-600 px-2 py-1 rounded">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <p className="text-sm font-semibold text-orange-700">{exp.company}</p>
                <p className="text-xs text-gray-600 mb-2">{exp.location}</p>
                <p className="text-sm text-gray-800">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                        <span className="text-orange-600 font-bold">→</span>
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

      {/* Skills - Star Ratings Style */}
      {normalizedSkills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-4 text-orange-700 pb-2 border-b-2 border-orange-300">Competitive Strengths</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(groupedSkills).map(([cat, skills]) => (
              <div key={cat}>
                <p className="text-xs font-bold uppercase text-orange-600 mb-2">{categoryLabels[cat] || cat}</p>
                <p className="text-sm text-gray-800">{skills.map(s => s.name).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects/Achievements */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider mb-4 text-orange-700 pb-2 border-b-2 border-orange-300">Notable Achievements</h2>
          <div className="grid gap-3">
            {data.projects.map(proj => (
              <div key={proj.id} className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                  {proj.link && <a href={proj.link} className="text-xs font-bold text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">View</a>}
                </div>
                <p className="text-xs text-orange-700 font-semibold mb-1">{proj.role}</p>
                <p className="text-sm text-gray-800">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-2 gap-4">
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 text-orange-700 pb-2 border-b-2 border-orange-300">Education</h2>
            <div className="space-y-2">
              {data.education.map(edu => (
                <div key={edu.id} className="text-xs">
                  <p className="font-bold text-gray-900">{edu.degree}</p>
                  <p className="text-orange-700 font-semibold">{edu.institution}</p>
                  <p className="text-gray-600">{formatDateRange(edu.startDate, edu.endDate)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 text-orange-700 pb-2 border-b-2 border-orange-300">Certifications</h2>
            <div className="space-y-2">
              {data.certifications.map(cert => (
                <div key={cert.id} className="text-xs">
                  <p className="font-bold text-gray-900">{cert.name}</p>
                  <p className="text-orange-700">{cert.issuer}</p>
                  <p className="text-gray-600">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTemplate;
