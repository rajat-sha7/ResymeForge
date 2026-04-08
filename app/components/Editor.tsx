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

  // sync body element heights after collapsed changes or on mount
  useEffect(() => {
    Object.keys(sectionBodies.current).forEach((key) => {
      const el = sectionBodies.current[key];
      if (!el) return;
      if (collapsed[key]) {
        // collapsed -> ensure height 0
        gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' });
      } else {
        gsap.set(el, { height: 'auto', opacity: 1, overflow: 'visible' });
      }
    });
  }, [collapsed]);

  const animateToggle = (section: string) => {
    const el = sectionBodies.current[section];
    if (!el) return;
    const isCollapsed = !!collapsed[section];
    if (isCollapsed) {
      // expand
      const targetHeight = el.scrollHeight;
      gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' });
      gsap.to(el, { height: targetHeight, opacity: 1, duration: 0.32, ease: 'power2.out', onComplete: () => { gsap.set(el, { height: 'auto', overflow: 'visible' }); } });
      setCollapsed((c) => ({ ...c, [section]: false }));
      setSectionCollapsed(section, false);
    } else {
      // collapse
      const fromHeight = el.scrollHeight;
      gsap.set(el, { height: fromHeight, overflow: 'hidden' });
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: 'power2.in' });
      setCollapsed((c) => ({ ...c, [section]: true }));
      setSectionCollapsed(section, true);
    }
  };

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
        // Handle custom sections
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
        {orderedSections.map((section) => (
          <div key={section} className="editor-section bg-white rounded-lg border border-gray-200">
            {/* Section Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 ${section === 'personalInfo' ? '' : 'cursor-pointer'}`} onClick={() => {
              if (section === 'personalInfo') return;
              setCollapsed((c) => ({ ...c, [section]: !c[section] }));
            }}>
              <div className="flex items-center gap-3">
                <div className="text-xl">{SECTION_ICONS[section] || '📌'}</div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{section === 'personalInfo' ? 'Personal Information' : section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  <div className="text-xs text-gray-500">{section === 'personalInfo' ? 'Basic contact details' : ''}</div>
                </div>
              </div>
              <div>
                {section === 'personalInfo' ? (
                  <span className="text-xs text-gray-400">Required</span>
                ) : (
                  <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${collapsed[section] ? '-rotate-90' : 'rotate-0'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            {/* Section Body (collapsible) */}
            <div className={`${collapsed[section] ? 'hidden' : 'block'} p-4`}>{renderSection(section)}</div>
          </div>
        ))}

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
            {orderedSections.map((section) => (
              <span
                key={section}
                className="flex items-center gap-1 text-gray-600"
                title={section.replace(/([A-Z])/g, ' $1').trim()}
              >
                {SECTION_ICONS[section] || '📌'}
              </span>
            ))}
          </div>
          <div className="text-gray-500">
            <span className="font-medium">{orderedSections.length}</span> sections active
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;