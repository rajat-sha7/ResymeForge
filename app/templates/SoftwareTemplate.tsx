import React from "react";
import { ResumeData } from "../types/resume";
import { formatDateRange, getSummaryText } from "../utils/resumeRender";


const SoftwareTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  // Normalize skills
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

  const pi = data.personalInfo;
  const summary = getSummaryText(data.professionalSummary);
  const contactLine = [pi?.email, pi?.phone, pi?.location].filter((v): v is string => !!v && !!v.trim());
  const linkLine = [
    pi?.linkedin && `LinkedIn: ${pi.linkedin}`,
    pi?.github && `GitHub: ${pi.github}`,
    pi?.portfolio && `Portfolio: ${pi.portfolio}`,
  ].filter((v): v is string => !!v);

  return (
    <div
      className="bg-white text-black rounded-lg shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 max-w-full md:max-w-200 mx-auto w-full print:shadow-none print:rounded-none print:p-3 xs:print:p-4 sm:print:p-6 md:print:p-8 lg:print:p-10"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11pt', lineHeight: '1.5' }}
    >
      {/* Personal Info */}
      <div className="mb-5 text-center border-b-2 border-blue-700 pb-2 xs:pb-3 sm:pb-4">
        <h1 className="text-lg xs:text-xl sm:text-2xl font-bold uppercase tracking-wide mb-1 xs:mb-2 text-blue-700 wrap-break-word">{pi?.name || 'Your Name'}</h1>
        {pi?.title && <div className="text-sm text-gray-700 mb-1">{pi.title}</div>}
        {contactLine.length > 0 && (
          <div className="text-xs xs:text-sm text-gray-800 wrap-break-word">{contactLine.join('  |  ')}</div>
        )}
        {linkLine.length > 0 && (
          <div className="text-xs xs:text-sm text-gray-600 mt-1 wrap-break-word">{linkLine.join('  |  ')}</div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
          <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Professional Summary</h2>
            <p className="text-xs sm:text-sm text-gray-800">{summary}</p>
          </div>
      )}

      {/* Skills */}
      {normalizedSkills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Skills</h2>
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {Object.entries(groupedSkills).map(([cat, skills]) => (
                <div key={cat} className="min-w-30">
                  <div className="font-semibold text-blue-600 text-xs mb-1">{categoryLabels[cat] || cat}</div>
                  <ul className="list-disc ml-4 sm:ml-5 text-xs">
                    {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Professional Experience</h2>
            <ul>
              {data.experience.map(exp => (
                <li key={exp.id} className="mb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-bold break-words">{exp.position} @ {exp.company}</span>
                    <span className="text-xs text-gray-500">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{exp.location}</div>
                  <div className="text-xs sm:text-sm">{exp.description}</div>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc ml-4 sm:ml-6 text-xs mt-1">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Projects</h2>
            <ul>
              {data.projects.map(proj => (
                <li key={proj.id} className="mb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-bold break-words">{proj.name}</span>
                    {proj.link && <a href={proj.link} className="text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                  </div>
                  <div className="text-xs text-gray-500">{proj.role}</div>
                  <div className="text-xs sm:text-sm">{proj.description}</div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-xs mt-1">Tech: {proj.technologies.join(', ')}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Education</h2>
            <ul>
              {data.education.map(edu => (
                <li key={edu.id} className="mb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-bold break-words">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</span>
                    <span className="text-xs text-gray-500">{formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                  {edu.gpa && edu.showGpa && <div className="text-xs">GPA: {edu.gpa}</div>}
                </li>
              ))}
            </ul>
          </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Certifications</h2>
          <ul>
            {data.certifications.map(cert => (
              <li key={cert.id} className="mb-2 text-xs sm:text-sm">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <> – {cert.issuer}</>}
                {cert.date && <> ({cert.date})</>}
                {cert.link && <a href={cert.link} className="text-xs text-blue-600 underline ml-2" target="_blank" rel="noopener noreferrer">{cert.link}</a>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold uppercase border-b border-blue-400 pb-1 mb-2 tracking-wide">Achievements & Awards</h2>
          <ul>
            {data.achievements.map(ach => (
              <li key={ach.id} className="mb-2 text-xs sm:text-sm">
                <span className="font-bold">{ach.title}</span>
                {ach.date && <> – {ach.date}</>}
                {ach.description && <div className="text-xs">{ach.description}</div>}
                {ach.impact && <div className="text-xs italic text-blue-600">Impact: {ach.impact}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SoftwareTemplate;
