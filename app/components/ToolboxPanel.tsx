'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { SectionType, TemplateType } from '../types/resume';

const sections: { key: SectionType; label: string; icon: string }[] = [
  { key: 'personalInfo', label: 'Personal Info', icon: '👤' },
  { key: 'professionalSummary', label: 'Professional Summary', icon: '📝' },
  { key: 'skills', label: 'Skills', icon: '🔧' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'projects', label: 'Projects', icon: '🚀' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'certifications', label: 'Certifications', icon: '📜' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'customSections', label: 'Custom Section', icon: '➕' },
];

interface TemplateDropdownProps {
  templates: { id: TemplateType; label: string; icon: string }[];
  value: TemplateType;
  onChange: (val: TemplateType) => void;
  disabled?: boolean;
}

const TemplateDropdown: React.FC<TemplateDropdownProps> = ({ templates, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc as EventListener);
    document.addEventListener('touchstart', onDoc as EventListener);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc as EventListener);
      document.removeEventListener('touchstart', onDoc as EventListener);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const selected = templates.find((t) => t.id === value) || templates[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => !disabled && setOpen((s) => !s)}
        className={`w-full flex items-center gap-2 p-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-50`}
      >
        <span className="text-base">{selected.icon}</span>
        <span className="flex-1 text-left truncate text-gray-800">{selected.label}</span>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
          {templates.map((t) => (
            <li key={t.id} role="option" aria-selected={t.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className={`w-full text-left p-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors ${
                  t.id === value ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span className="flex-1 truncate text-gray-800">{t.label}</span>
                {t.id === value && <span className="text-xs text-blue-600">Selected</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface ToolboxPanelProps {
  width?: number;
  isOpen?: boolean;
  onToggle?: () => void;
  hideHeader?: boolean;
}

const ToolboxPanel: React.FC<ToolboxPanelProps> = ({ width, isOpen, onToggle, hideHeader }) => {
  const {
    enabledSections,
    reorderSections,
    toggleSection,
    resetSection,
    undo,
    redo,
    canUndo,
    canRedo,
    currentResumeId,
    resumes,
    setTemplate,
    addCustomSection,
    removeCustomSection,
    createResume,
  } = useResumeStore();

  const templates: { id: TemplateType; label: string; icon: string }[] = [
    { id: 'software', label: 'Software/Tech', icon: '💻' },
    { id: 'management', label: 'Management', icon: '📊' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'academic', label: 'Academic', icon: '📚' },
    { id: 'sales', label: 'Sales', icon: '💼' },
    { id: 'healthcare', label: 'Healthcare', icon: '⚕️' },
  ];

  const currentTemplate = currentResumeId && resumes[currentResumeId]
    ? resumes[currentResumeId].template
    : 'software';

  const isSidebar = typeof isOpen === 'boolean';

  return (
    <div
      className={`relative h-full bg-white flex flex-col border-r border-gray-200 ${
        isSidebar ? 'shadow-lg w-full' : 'shadow-sm'
      }`}
      style={width ? { width } : undefined}
    >
      {isSidebar && onToggle && (
        <button
          onClick={onToggle}
          className={`absolute z-10 bg-blue-500 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors ${
            isOpen ? '-right-3' : 'right-1'
          } top-1/2 -translate-y-1/2`}
          aria-label="Toggle toolbox"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      )}

      {/* Collapsed state - show minimal UI */}
      {isSidebar && !isOpen && (
        <div className="flex flex-col items-center py-4 gap-4">
          <div className="text-2xl rotate-90 whitespace-nowrap origin-center transform scale-75">
            🔧
          </div>
        </div>
      )}

      {/* Collapsed state - show minimal UI */}
      {isSidebar && !isOpen && (
        <div className="flex flex-col items-center py-4 gap-4">
          <div className="text-2xl rotate-90 whitespace-nowrap origin-center transform scale-75">
            🔧
          </div>
        </div>
      )}

      {/* Full content - only show when open or in modal mode */}
      {(!isSidebar || isOpen) && (
        <>
          {!hideHeader && (
            <div className="shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Resume Toolbox</h2>
                {width && !isSidebar && (
                  <button
                    onClick={() => {
                      const event = new CustomEvent('toggleToolbox');
                      window.dispatchEvent(event);
                    }}
                    className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                    aria-label="Close toolbox"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 bg-white">
            {!currentResumeId && (
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm text-blue-700 mb-2 sm:mb-3">No resume selected. Create one to get started!</p>
                <button
                  onClick={() => createResume('My Resume', 'software')}
                  className="w-full px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  ✨ Create New Resume
                </button>
              </div>
            )}

            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  canUndo() ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                ↩ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  canRedo() ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                Redo ↪
              </button>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Template</h3>

              {/* Custom dropdown to avoid native select issues and enable icons/styles */}
              <TemplateDropdown
                templates={templates}
                value={currentTemplate}
                onChange={(val) => setTemplate(val)}
                disabled={!currentResumeId}
              />

              {!currentResumeId && <p className="text-xs text-gray-400 mt-1">Create a resume first to select a template</p>}
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Active Sections</h3>
              <p className="text-xs text-gray-500 mb-2 sm:mb-3">Drag to reorder sections</p>
              <div className="space-y-1">
                {enabledSections.map((section) => {
              const isCustomSection = section.startsWith('custom_');
              let sectionLabel = '';
              let sectionIcon = '📌';

              if (isCustomSection && currentResumeId && resumes[currentResumeId]) {
                const customSection = resumes[currentResumeId].customSections?.find((cs) => cs.id === section);
                sectionLabel = customSection?.title || 'Custom Section';
              } else {
                const sectionData = sections.find((s) => s.key === section);
                if (!sectionData) return null;
                sectionLabel = sectionData.label;
                sectionIcon = sectionData.icon;
              }

              return (
                <div
                  key={section}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg mb-1 sm:mb-2 cursor-move hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-lg">{sectionIcon}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{sectionLabel}</span>
                    {isCustomSection && <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded hidden sm:inline">Custom</span>}
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCustomSection) {
                          removeCustomSection(section);
                        } else {
                          resetSection(section);
                        }
                      }}
                      className="p-0.5 sm:p-1 text-gray-400 hover:text-yellow-600 text-xs sm:text-sm"
                      title={isCustomSection ? 'Delete' : 'Reset'}
                    >
                      {isCustomSection ? '🗑️' : '🔄'}
                    </button>
                    {section !== 'personalInfo' && !isCustomSection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(section, false);
                        }}
                        className="p-0.5 sm:p-1 text-gray-400 hover:text-red-600 text-xs sm:text-sm"
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                    {isCustomSection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(section, false);
                        }}
                        className="p-0.5 sm:p-1 text-gray-400 hover:text-red-600 text-xs sm:text-sm"
                        title="Hide"
                      >
                        👁️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </div>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Add Section</h3>
              <div className="space-y-0.5 sm:space-y-1">
                {sections
                  .filter((s) => s.key !== 'customSections' && !enabledSections.includes(s.key))
                  .map((section) => (
                    <button
                      key={section.key}
                      onClick={() => toggleSection(section.key, true)}
                      className="w-full flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs sm:text-sm text-blue-700 transition-colors"
                    >
                      <span>+</span>
                      <span className="text-sm sm:text-base">{section.icon}</span>
                      <span className="truncate">{section.label}</span>
                    </button>
                  ))}
                <button
                  onClick={() => addCustomSection()}
                  className="w-full flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg text-xs sm:text-sm text-green-700 transition-colors"
                >
                  <span>+</span>
                  <span className="text-sm sm:text-base">➕</span>
                  <span className="truncate">Add Custom Section</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Quick Actions</h3>
              <div className="space-y-1 sm:space-y-2">
                <button
                  onClick={() => {
                    const allSections = sections.map((s) => s.key).filter((s) => s !== 'customSections') as SectionType[];
                    reorderSections(allSections);
                  }}
                  className="w-full p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 transition-colors"
                >
                  Enable All Sections
                </button>
                <button
                  onClick={() => {
                    const defaultSections: SectionType[] = ['personalInfo', 'professionalSummary', 'skills', 'experience', 'education'];
                    reorderSections(defaultSections);
                  }}
                  className="w-full p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 transition-colors"
                >
                  Reset to Default Order
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ToolboxPanel;