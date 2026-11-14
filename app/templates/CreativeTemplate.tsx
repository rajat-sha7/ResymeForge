import React from "react";
import { ResumeData } from "../types/resume";
import { formatDateRange } from "../utils/resumeRender";


const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11pt', lineHeight: '1.6' }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-32 bg-linear-to-b from-orange-400 to-red-500 p-4 text-white">
          <div className="h-24 w-24 rounded-full bg-white/20 mx-auto mb-4"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-5">
          {/* Header */}
            <div className="mb-4">
            <h1 className="text-3xl font-black mb-1">{data.personalInfo?.name || 'Your Name'}</h1>
            <div className="text-sm text-gray-700 mb-2">{data.personalInfo?.title || ''}</div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo?.phone && <span className="text-gray-600">•</span>}
              {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo?.location && <span className="text-gray-600">•</span>}
              {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
            </div>
          </div>

          {/* Professional Summary - Highlighted Box */}
          {data.professionalSummary && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r">
              <p className="text-sm font-medium">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary?.summary}</p>
            </div>
          )}

          {/* Experience - Timeline Style */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-3 text-gray-900">Experience</h2>
              <div className="space-y-4 py-2 border-l-2 border-orange-300 pl-4">
                {data.experience.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="w-4 h-4 bg-orange-400 rounded-full border-2 border-white absolute -left-[25px] top-0.5" />
                    <div>
                      <p className="font-bold text-sm">{exp.position}</p>
                      <p className="text-xs text-gray-600">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-gray-500 font-semibold">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                      <p className="text-xs mt-1">{exp.description}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="text-xs mt-1 space-y-0.5">
                          {exp.achievements.map((ach, i) => <li key={i} className="text-gray-700 flex gap-2"><span>◆</span> <span>{ach}</span></li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills - Pill Style */}
          {normalizedSkills.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-3 text-gray-900">Skills</h2>
              <div className="space-y-3">
                {Object.entries(groupedSkills).map(([cat, skills]) => (
                  <div key={cat}>
                    <p className="text-xs font-bold uppercase text-orange-600 mb-2">{categoryLabels[cat] || cat}</p>
                    <p className="text-sm text-gray-700">{skills.map(s => s.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-3 text-gray-900">Projects</h2>
              <div className="grid gap-3">
                {data.projects.map(proj => (
                  <div key={proj.id} className="border-2 border-gray-200 p-3 rounded-lg hover:border-orange-300 transition">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">{proj.name}</p>
                      {proj.link && <a href={proj.link} className="text-xs text-orange-600 underline" target="_blank" rel="noopener noreferrer">View</a>}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{proj.role}</p>
                    <p className="text-xs">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          <div className="grid grid-cols-2 gap-4">
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider mb-2 text-gray-900">Education</h2>
                <div className="space-y-2">
                  {data.education.map(edu => (
                    <div key={edu.id} className="text-xs">
                      <p className="font-bold">{edu.degree}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-gray-500">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider mb-2 text-gray-900">Certifications</h2>
                <div className="space-y-2">
                  {data.certifications.map(cert => (
                    <div key={cert.id} className="text-xs">
                      <p className="font-bold">{cert.name}</p>
                      <p className="text-gray-600">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
