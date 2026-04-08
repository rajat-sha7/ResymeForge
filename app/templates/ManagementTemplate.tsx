import React from "react";
import { ResumeData } from "../types/resume";


const ManagementTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-linear-to-b from-slate-50 to-gray-100 text-gray-900 rounded-lg shadow-xl p-8" style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '11pt', lineHeight: '1.5' }}>
      {/* Header with sidebar accent */}
      <div className="flex gap-6 mb-6">
        <div className="w-1 bg-linear-to-b from-slate-700 to-slate-900"></div>
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: '#1e293b' }}>{data.personalInfo?.name || 'Your Name'}</h1>
          <p className="text-sm font-semibold tracking-widest uppercase text-slate-600">Executive Professional</p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            {data.personalInfo?.email && <span className="bg-white px-2 py-1 rounded">{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span className="bg-white px-2 py-1 rounded">{data.personalInfo.phone}</span>}
            {data.personalInfo?.location && <span className="bg-white px-2 py-1 rounded">{data.personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <div className="mb-6 bg-white p-4 rounded-lg border-l-4 border-slate-700">
          <p className="text-sm leading-relaxed font-medium">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary?.summary}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Experience & Projects */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-900 pb-2 border-b-2 border-slate-300">Professional Experience</h2>
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id} className="border-l-4 border-slate-400 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{exp.position}</p>
                        <p className="text-xs text-slate-600">{exp.company} • {exp.location}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-xs mt-2 text-gray-700">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-none mt-2 space-y-1">
                        {exp.achievements.map((ach, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-slate-500">▸</span><span>{ach}</span></li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-900 pb-2 border-b-2 border-slate-300">Key Projects</h2>
              <div className="space-y-3">
                {data.projects.map(proj => (
                  <div key={proj.id} className="bg-white p-3 rounded border border-slate-200">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs">{proj.name}</p>
                      {proj.link && <a href={proj.link} className="text-xs text-slate-700 underline hover:text-slate-900" target="_blank" rel="noopener noreferrer">Link</a>}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{proj.role}</p>
                    <p className="text-xs mt-1 text-gray-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Skills, Education, etc */}
        <div className="col-span-1 space-y-6">
          {/* Skills */}
          {normalizedSkills.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-900 pb-2 border-b-2 border-slate-300">Core Skills</h2>
              <div className="space-y-3">
                {Object.entries(groupedSkills).map(([cat, skills]) => (
                  <div key={cat}>
                    <p className="text-xs font-bold text-slate-700 mb-2">{categoryLabels[cat] || cat}</p>
                    <p className="text-sm text-gray-700">{skills.map(s => s.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-900 pb-2 border-b-2 border-slate-300">Education</h2>
              <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold">{edu.degree} in {edu.field}</p>
                    <p className="text-slate-600">{edu.institution}</p>
                    <p className="text-slate-500 text-xs">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && edu.showGpa && <p className="text-slate-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 text-slate-900 pb-2 border-b-2 border-slate-300">Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="text-xs">
                    <p className="font-bold">{cert.name}</p>
                    <p className="text-slate-600">{cert.issuer}</p>
                    <p className="text-slate-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementTemplate;
