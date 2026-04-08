import React from "react";
import { ResumeData } from "../types/resume";


const HealthcareTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-900 rounded-lg shadow-xl" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: '1.6' }}>
      {/* Header Row 1 - Professional Banner */}
      <div className="bg-linear-to-r from-blue-700 to-teal-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-1">{data.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-sm font-semibold opacity-95">{data.personalInfo?.title || 'Healthcare Professional'}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Professional Summary - License Verification Box */}
        {data.professionalSummary && (
          <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r">
            <p className="text-sm leading-relaxed">{typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary?.summary}</p>
          </div>
        )}

        {/* Licenses & Certifications - Prominent */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-blue-700" style={{ color: '#1e40af' }}>Licenses & Certifications</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.certifications.map(cert => (
                <div key={cert.id} className="bg-blue-50 border border-blue-300 p-3 rounded-lg">
                  <p className="font-bold text-sm text-blue-900">{cert.name}</p>
                  <p className="text-xs text-blue-700 font-semibold">{cert.issuer}</p>
                  <p className="text-xs text-gray-600">Issued: {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-700" style={{ color: '#1e40af' }}>Professional Experience</h2>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="border-l-4 border-teal-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{exp.position}</p>
                      <p className="text-sm font-semibold text-teal-700">{exp.company}</p>
                    </div>
                    <span className="text-xs font-semibold text-white bg-teal-600 px-2 py-1 rounded">{exp.startDate}-{exp.endDate}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{exp.location}</p>
                  <p className="text-sm mt-2 text-gray-800">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-teal-600 font-bold">✓</span>
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-700" style={{ color: '#1e40af' }}>Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-bold text-sm text-gray-900">{edu.degree} in {edu.field}</p>
                  <p className="text-sm font-semibold text-teal-700">{edu.institution}</p>
                  <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && edu.showGpa && <p className="text-xs text-gray-700 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {normalizedSkills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-700" style={{ color: '#1e40af' }}>Clinical & Professional Skills</h2>
            <div className="space-y-4">
              {Object.entries(groupedSkills).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="text-sm font-bold text-teal-700 mb-2 uppercase">{categoryLabels[cat] || cat}</p>
                  <p className="text-sm text-gray-800">{skills.map(s => s.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects/Initiatives */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-700" style={{ color: '#1e40af' }}>Healthcare Initiatives</h2>
            <div className="space-y-3">
              {data.projects.map(proj => (
                <div key={proj.id} className="border-l-4 border-blue-400 pl-4">
                  <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                  <p className="text-xs font-semibold text-teal-700">{proj.role}</p>
                  <p className="text-sm mt-1 text-gray-800">{proj.description}</p>
                  {proj.link && <a href={proj.link} className="text-xs text-teal-600 underline mt-1 inline-block" target="_blank" rel="noopener noreferrer">Learn More</a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthcareTemplate;
