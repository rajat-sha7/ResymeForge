'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { SectionType } from '../types/resume';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ProfessionalSummaryForm from './forms/ProfessionalSummaryForm';
import SkillsForm from './forms/SkillsForm';
import ExperienceForm from './forms/ExperienceForm';
import ProjectsForm from './forms/ProjectsForm';
import EducationForm from './forms/EducationForm';
import CertificationsForm from './forms/CertificationsForm';
import AchievementsForm from './forms/AchievementsForm';
import CustomSectionForm from './forms/CustomSectionForm';
import { validateResumeData } from '../utils/validation';
import gsap from 'gsap';

const SECTION_ICONS: Record<string, string> = {
  personalInfo: '👤',
  professionalSummary: '📝',
  skills: '🛠️',
  experience: '💼',
  projects: '🚀',
  education: '🎓',
  certifications: '📜',
  achievements: '🏆',
  custom: '📌',
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  personalInfo: 'Basic contact details & online profiles',
  professionalSummary: 'Executive summary & career hook',
  skills: 'Technical proficiencies, frameworks & soft skills',
  experience: 'Work history & quantifiable achievements',
  projects: 'Key portfolio & technical applications',
  education: 'Academic background, degrees & honors',
  certifications: 'Industry credentials & accredited licenses',
  achievements: 'Notable awards, publications & recognitions',
  custom: 'Custom resume section & initiatives',
};

const Editor: React.FC = () => {
  const { currentResumeId, resumes, sectionOrder, enabledSections } = useResumeStore();
  const collapsedFromStore = useResumeStore((s) => s.collapsedSections);
  const setSectionCollapsed = useResumeStore((s) => s.setSectionCollapsed);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const sectionBodies = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('.editor-section');
      gsap.fromTo(
        sections,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
    // initialize collapsed state for sections (load from store if available)
    // Start non-personal sections collapsed by default
    const map: Record<string, boolean> = {};
    sectionOrder.forEach((s) => {
      map[s] = s === 'personalInfo' ? false : true; // personalInfo always expanded; others collapsed
    });
    if (currentResumeId && collapsedFromStore && collapsedFromStore[currentResumeId]) {
      Object.keys(collapsedFromStore[currentResumeId]).forEach((k) => {
        map[k] = !!collapsedFromStore[currentResumeId][k];
      });
    }
    // ensure personalInfo always expanded
    map['personalInfo'] = false;
    setCollapsed(map);
  }, [sectionOrder]);

  // Listen for jump to section events from validation drawer / modal
  useEffect(() => {
    const handleExpandSection = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const sectionId = customEvent.detail;
      if (!sectionId) return;

      setCollapsed((prev) => ({ ...prev, [sectionId]: false }));
      setSectionCollapsed(sectionId, false);

      setTimeout(() => {
        const targetEl = document.getElementById(`editor-section-${sectionId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    window.addEventListener('expand-editor-section', handleExpandSection);
    return () => {
      window.removeEventListener('expand-editor-section', handleExpandSection);
    };
  }, [setSectionCollapsed]);

  // sync body element heights after collapsed changes or on mount
  useEffect(() => {
    Object.keys(sectionBodies.current).forEach((key) => {
      const el = sectionBodies.current[key];
      if (!el) return;
      if (collapsed[key]) {
        gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' });
      } else {
        gsap.set(el, { height: 'auto', opacity: 1, overflow: 'visible' });
      }
    });
  }, [collapsed]);

  if (!currentResumeId || !resumes[currentResumeId]) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Resume Selected</h2>
          <p className="text-gray-500">Create a new resume or select an existing one from the toolbox.</p>
        </div>
      </div>
    );
  }

  const resume = resumes[currentResumeId];
  const validationReport = validateResumeData(resume, enabledSections);

  const isSectionFilled = (sec: string): boolean => {
    switch (sec) {
      case 'personalInfo':
        return !!(resume.personalInfo?.name && resume.personalInfo?.email);
      case 'professionalSummary':
        const sum = typeof resume.professionalSummary === 'string'
          ? resume.professionalSummary
          : resume.professionalSummary?.summary;
        return !!sum && sum.trim().length > 0;
      case 'skills':
        return (resume.skills?.length || 0) > 0;
      case 'experience':
        return (resume.experience?.length || 0) > 0;
      case 'education':
        return (resume.education?.length || 0) > 0;
      case 'projects':
        return (resume.projects?.length || 0) > 0;
      case 'certifications':
        return (resume.certifications?.length || 0) > 0;
      case 'achievements':
        return (resume.achievements?.length || 0) > 0;
      default:
        if (sec.startsWith('custom_') && resume.customSections) {
          const cs = resume.customSections.find(c => c.id === sec);
          return (cs?.items?.length || 0) > 0;
        }
        return false;
    }
  };

  const renderSection = (section: SectionType) => {
    if (!enabledSections.includes(section)) {
      return null;
    }

    switch (section) {
      case 'personalInfo':
        return <PersonalInfoForm data={resume.personalInfo} />;
      case 'professionalSummary':
        const summaryData = typeof resume.professionalSummary === 'string' 
          ? { summary: resume.professionalSummary, enabled: true }
          : resume.professionalSummary || { summary: '', enabled: true };
        return <ProfessionalSummaryForm data={summaryData} />;
      case 'skills':
        return <SkillsForm data={resume.skills} />;
      case 'experience':
        return <ExperienceForm data={resume.experience} />;
      case 'projects':
        return <ProjectsForm data={resume.projects} />;
      case 'education':
        return <EducationForm data={resume.education} />;
      case 'certifications':
        return <CertificationsForm data={resume.certifications} />;
      case 'achievements':
        return <AchievementsForm data={resume.achievements} />;
      default:
        if (section.startsWith('custom_') && resume.customSections) {
          const customSection = resume.customSections.find(cs => cs.id === section);
          if (customSection) {
            return <CustomSectionForm data={customSection} sectionId={section} />;
          }
        }
        return null;
    }
  };

  const orderedSections = sectionOrder.filter(s => enabledSections.includes(s));

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{resume.title || 'Untitled Resume'}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)} Template
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {orderedSections.length} Sections
            </span>
          </div>
        </div>
      </div>

      {/* Sections - Scrollable */}
      <div ref={sectionsRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {orderedSections.map((section) => {
          const sectionValidation = validationReport.sections[section];
          const hasErrors = sectionValidation && sectionValidation.errors.length > 0;
          const hasWarnings = sectionValidation && sectionValidation.warnings.length > 0;
          const isFilled = isSectionFilled(section);

          return (
            <div
              key={section}
              id={`editor-section-${section}`}
              className={`editor-section bg-white rounded-xl border transition-all ${
                hasErrors
                  ? 'border-red-300 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 shadow-2xs'
              }`}
            >
              {/* Section Header */}
              <div
                className={`px-5 py-3.5 flex items-center justify-between border-b border-gray-100 ${
                  section === 'personalInfo' ? '' : 'cursor-pointer select-none'
                }`}
                onClick={() => {
                  if (section === 'personalInfo') return;
                  const willCollapse = !collapsed[section];
                  setCollapsed((c) => ({ ...c, [section]: willCollapse }));
                  setSectionCollapsed(section, willCollapse);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{SECTION_ICONS[section] || '📌'}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      {section === 'personalInfo'
                        ? 'Personal Information'
                        : section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div className="text-xs text-gray-400">
                      {SECTION_DESCRIPTIONS[section] || ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Validation Status Pill */}
                  {hasErrors ? (
                    <span
                      title={sectionValidation.errors.map((e) => e.message).join('\n')}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200"
                    >
                      <span>⚠️</span> {sectionValidation.errors.length}{' '}
                      {sectionValidation.errors.length === 1 ? 'error' : 'errors'}
                    </span>
                  ) : hasWarnings ? (
                    <span
                      title={sectionValidation.warnings.map((w) => w.message).join('\n')}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"
                    >
                      <span>⚡</span> {sectionValidation.warnings.length}{' '}
                      {sectionValidation.warnings.length === 1 ? 'tip' : 'tips'}
                    </span>
                  ) : isFilled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <span>✓</span> Complete
                    </span>
                  ) : null}

                  {section === 'personalInfo' ? (
                    <span className="text-xs text-gray-400 font-medium">Required</span>
                  ) : (
                    <svg
                      className={`w-4 h-4 text-gray-500 transform transition-transform ${
                        collapsed[section] ? '-rotate-90' : 'rotate-0'
                      }`}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Section Body (collapsible) */}
              <div className={`${collapsed[section] ? 'hidden' : 'block'} p-5 sm:p-6 bg-white rounded-b-xl`}>
                {renderSection(section)}
              </div>
            </div>
          );
        })}

        {orderedSections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-medium text-gray-700">No sections enabled</h3>
            <p className="text-gray-500 mt-1">
              Enable sections from the toolbox panel to start building your resume.
            </p>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {orderedSections.map((section) => {
              const secVal = validationReport.sections[section];
              const secHasErr = secVal && secVal.errors.length > 0;
              return (
                <span
                  key={section}
                  className={`flex items-center gap-1 ${secHasErr ? 'text-red-500 font-semibold' : 'text-gray-600'}`}
                  title={`${section.replace(/([A-Z])/g, ' $1').trim()}${secHasErr ? ' (has errors)' : ''}`}
                >
                  {SECTION_ICONS[section] || '📌'}
                  {secHasErr && <span className="text-xs text-red-500">•</span>}
                </span>
              );
            })}
          </div>
          <div className="text-gray-500 text-xs">
            <span className="font-medium text-gray-700">{orderedSections.length}</span> active sections
            {validationReport.totalErrors > 0 && (
              <span className="ml-2 font-medium text-red-600">
                • {validationReport.totalErrors} issue{validationReport.totalErrors !== 1 ? 's' : ''} to resolve
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
