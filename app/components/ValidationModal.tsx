'use client';

import React from 'react';
import { ResumeValidationReport, SectionValidationResult } from '../utils/validation';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ResumeValidationReport;
  onNavigateToSection?: (sectionId: string) => void;
  isExportGuard?: boolean;
  onProceedExport?: () => void;
}

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

const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  report,
  onNavigateToSection,
  isExportGuard = false,
  onProceedExport,
}) => {
  if (!isOpen) return null;

  const sectionEntries = Object.values(report.sections);

  const handleJumpToSection = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              report.hasErrors
                ? 'bg-red-100 text-red-600'
                : report.hasWarnings
                ? 'bg-amber-100 text-amber-600'
                : 'bg-green-100 text-green-600'
            }`}>
              {report.hasErrors ? '⚠️' : report.hasWarnings ? '⚡' : '✅'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isExportGuard ? 'Resume Incomplete — Quality Check' : 'Resume Validation & Quality Check'}
              </h2>
              <p className="text-xs text-gray-500">
                {isExportGuard
                  ? 'Your resume has missing required fields that should be fixed before exporting.'
                  : 'Automated audit of required fields, formats, and ATS standards.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-6 py-3.5 border-b border-gray-100">
          {report.hasErrors ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-600">● {report.totalErrors} Error{report.totalErrors !== 1 ? 's' : ''} to fix</span>
                {report.totalWarnings > 0 && (
                  <span className="text-xs text-red-600 font-normal">
                    (plus {report.totalWarnings} recommendation{report.totalWarnings !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                Fix required
              </span>
            </div>
          ) : report.hasWarnings ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-700">✓ No critical errors!</span>
                <span className="text-xs text-amber-600 font-normal">
                  {report.totalWarnings} quality improvement{report.totalWarnings !== 1 ? 's' : ''} available
                </span>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                Ready with recommendations
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-700">✓ All checks passed!</span>
                <span className="text-xs text-green-600 font-normal">
                  Your resume meets all structure, required fields, and ATS validation criteria.
                </span>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                100% Ready
              </span>
            </div>
          )}
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sectionEntries.map((section: SectionValidationResult) => {
            const hasSectionErrors = section.errors.length > 0;
            const hasSectionWarnings = section.warnings.length > 0;
            const isSectionClean = !hasSectionErrors && !hasSectionWarnings;

            return (
              <div
                key={section.sectionId}
                className={`p-4 rounded-xl border transition-all ${
                  hasSectionErrors
                    ? 'border-red-200 bg-red-50/30'
                    : hasSectionWarnings
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{SECTION_ICONS[section.sectionId] || '📌'}</span>
                    <h3 className="font-semibold text-gray-800 text-sm">{section.sectionTitle}</h3>
                    {hasSectionErrors ? (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        {section.errors.length} {section.errors.length === 1 ? 'error' : 'errors'}
                      </span>
                    ) : hasSectionWarnings ? (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                        {section.warnings.length} {section.warnings.length === 1 ? 'suggestion' : 'suggestions'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        ✓ Complete
                      </span>
                    )}
                  </div>

                  {onNavigateToSection && (hasSectionErrors || hasSectionWarnings) && (
                    <button
                      onClick={() => handleJumpToSection(section.sectionId)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                    >
                      Fix section →
                    </button>
                  )}
                </div>

                {/* Error Items */}
                {hasSectionErrors && (
                  <ul className="mt-3 space-y-1.5 pl-7 text-xs text-red-700 list-disc">
                    {section.errors.map((err) => (
                      <li key={err.id} className="leading-snug">
                        <span className="font-semibold">{err.message}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Warning Items */}
                {hasSectionWarnings && (
                  <ul className="mt-2 space-y-1 pl-7 text-xs text-amber-700 list-disc">
                    {section.warnings.map((warn) => (
                      <li key={warn.id} className="leading-snug">
                        <span>{warn.message}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {isSectionClean && (
                  <p className="mt-2 text-xs text-gray-500 pl-7">
                    No formatting or missing field issues in this section.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Validated against ATS parsing standards and export guidelines.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isExportGuard ? 'Review & Fix' : 'Close'}
            </button>
            {isExportGuard && onProceedExport && (
              <button
                onClick={() => {
                  onClose();
                  onProceedExport();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Export Anyway
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
