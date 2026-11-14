'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import ToolboxPanel from '../components/ToolboxPanel';
import Editor from '../components/Editor';
import Preview from '../components/Preview';
import { useResumeStore } from '../store/resumeStore';
import OptimizedLogo from '../homepage/OptimizedLogo';
import { calculateATSScore } from '../utils/ats';
import { exportToDOCX } from '../utils/export';
import { validateResumeData } from '../utils/validation';
import { generateResumePDF, downloadBlob } from '../utils/pdfExport';
import { resumeFileName } from '../utils/resumeRender';
import ValidationModal from '../components/ValidationModal';
import PdfPreviewModal from '../components/PdfPreviewModal';
import { TemplateType } from '../types/resume';
import { useSearchParams } from 'next/navigation';

function BuilderPage() {
  const { currentResumeId, resumes, jobDescription, enabledSections, sectionOrder } = useResumeStore();
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const createResume = useResumeStore((s) => s.createResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'split'>('editor');
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isToolboxSidebarOpen, setIsToolboxSidebarOpen] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);
  const [showJDInModal, setShowJDInModal] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isExportGuardOpen, setIsExportGuardOpen] = useState(false);
  const [pendingExport, setPendingExport] = useState<(() => void) | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // local state for name prompt (declare before effects)
  const [showNameModal, setShowNameModal] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
  const [newResumeName, setNewResumeName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read template query param and apply to current resume if present
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!mounted) return;
    const tpl = searchParams.get('template');
    if (!tpl) return;
    const key = tpl.toLowerCase();
    const valid = ["software","management","creative","academic","sales","healthcare"];
    if (!valid.includes(key)) return;

    let fromTemplate = null;
    try {
      fromTemplate = sessionStorage.getItem('resume_from_template');
    } catch {}
    if (fromTemplate) {
      try { sessionStorage.removeItem('resume_from_template'); } catch {}
    }
    if (!fromTemplate) {
      if (currentResumeId) {
        setTemplate(key as TemplateType);
      }
      return;
    }

    if (!currentResumeId) {
      const newId = createResume('New Resume', key as TemplateType);
      setNewlyCreatedId(newId);
      setShowNameModal(true);
    } else {
      setTemplate(key as TemplateType);
    }
  }, [mounted, searchParams, currentResumeId, setTemplate, createResume]);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading Resume Builder...</p>
        </div>
      </div>
    );
  }

  // Name entry modal submit handler
  const handleNameSave = () => {
    const id = newlyCreatedId || currentResumeId;
    if (!id) return;
    const title = newResumeName.trim() || 'Untitled Resume';
    updateResume(id, { title });
    setShowNameModal(false);
    setNewResumeName('');
    setNewlyCreatedId(null);
  };

  const handleNameCancel = () => {
    setShowNameModal(false);
    setNewResumeName('');
    setNewlyCreatedId(null);
  };

  const resumeCount = Object.keys(resumes).length;
  const currentResume = currentResumeId ? resumes[currentResumeId] : null;

  // Calculate ATS score
  const atsScore = currentResume 
    ? calculateATSScore(currentResume, jobDescription) 
    : null;

  // Calculate Resume Validation Report
  const validationReport = currentResume
    ? validateResumeData(currentResume, enabledSections)
    : null;

  const handleNavigateToSection = (sectionId: string) => {
    window.dispatchEvent(new CustomEvent('expand-editor-section', { detail: sectionId }));
  };

  const executeDocxExport = async () => {
    if (!currentResume) return;
    const orderedSections = sectionOrder.filter((s) => enabledSections.includes(s));
    try {
      await exportToDOCX(currentResume, orderedSections, resumeFileName(currentResume, 'docx'));
    } catch (error) {
      console.error('DOCX export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  /** Downloads `pdf` if given (the file shown in the preview), otherwise renders a fresh one. */
  const executePdfDownload = async (pdf?: Blob) => {
    if (!currentResume) return;
    if (pdf) {
      downloadBlob(pdf, resumeFileName(currentResume, 'pdf'));
      return;
    }
    if (isPdfExporting) return;
    setIsPdfExporting(true);
    try {
      const blob = await generateResumePDF(currentResume, enabledSections);
      downloadBlob(blob, resumeFileName(currentResume, 'pdf'));
    } catch (error) {
      console.error('PDF export failed:', error);
      alert(`PDF export failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsPdfExporting(false);
    }
  };

  /** Runs an export, first showing the validation guard if the resume has errors. */
  const requestExport = (run: () => void) => {
    if (validationReport && validationReport.hasErrors) {
      setPendingExport(() => run);
      setIsExportGuardOpen(true);
      return;
    }
    run();
  };

  const handleExportRequest = () => requestExport(executeDocxExport);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <OptimizedLogo forgeColor="text-black" />
          </Link>
          <span className="hidden sm:inline text-sm text-gray-500 border-l border-gray-300 pl-4">
            {resumeCount} resume{resumeCount !== 1 ? 's' : ''} saved
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* View Toggle */}
          <div className="hidden xs:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('editor')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                activeView === 'editor'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="hidden sm:inline">📝 Editor</span>
              <span className="sm:hidden">📝</span>
            </button>
            <button
              onClick={() => setActiveView('split')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                activeView === 'split'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="hidden sm:inline">⚡ Split</span>
              <span className="sm:hidden">⚡</span>
            </button>
          </div>

          {/* Validation Quality Check Button */}
          {validationReport && (
            <button
              onClick={() => setIsValidationModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 ${
                validationReport.hasErrors
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300 ring-2 ring-red-200 animate-pulse'
                  : validationReport.hasWarnings
                  ? 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300'
              }`}
              aria-label="Quality and validation check"
              title={
                validationReport.hasErrors
                  ? `${validationReport.totalErrors} issues to fix`
                  : validationReport.hasWarnings
                  ? `${validationReport.totalWarnings} recommendations`
                  : 'All validation checks passed'
              }
            >
              <span>{validationReport.hasErrors ? '⚠️' : validationReport.hasWarnings ? '⚡' : '✅'}</span>
              <span className="hidden sm:inline">
                {validationReport.hasErrors
                  ? `${validationReport.totalErrors} Issue${validationReport.totalErrors !== 1 ? 's' : ''}`
                  : validationReport.hasWarnings
                  ? `${validationReport.totalWarnings} Tip${validationReport.totalWarnings !== 1 ? 's' : ''}`
                  : 'Valid'}
              </span>
              <span className="sm:hidden">
                {validationReport.hasErrors ? validationReport.totalErrors : '✓'}
              </span>
            </button>
          )}

          {/* ATS Score Button */}
          {atsScore && (
            <button
              onClick={() => setIsATSModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-r from-purple-600 to-purple-500 text-white text-sm font-medium shadow-xs hover:shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label={`ATS score ${atsScore.overall}`}
              title={`ATS: ${atsScore.overall}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 13l3-3 3 3 4-4 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">ATS: {atsScore.overall}</span>
              <span className="sm:hidden">{atsScore.overall}</span>
            </button>
          )}

          {/* Preview Button */}
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-r from-green-500 to-green-400 text-white text-sm font-medium shadow-xs hover:shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-300"
            aria-label="Preview resume"
            title="Preview"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>

          <Link
            href="/toolbox"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-white text-sm font-medium shadow-xs hover:shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Toolbox Modal */}
      {isToolboxOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full mx-auto transform transition-all duration-200">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Resume Toolbox</h2>
                <button
                  onClick={() => setIsToolboxOpen(false)}
                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Close toolbox"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 max-h-[80vh] overflow-auto">
                <ToolboxPanel width={400} hideHeader />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Name Entry Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Name your resume</h3>
                <p className="text-sm text-gray-500">Enter a title so you can identify this resume later.</p>
              </div>
              <div className="p-4">
                <input
                  autoFocus
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  placeholder="e.g., Senior Backend Engineer — Acme Corp"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button onClick={handleNameCancel} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button onClick={handleNameSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save &amp; Start</button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbox Sidebar - Medium screens and up */}
        <div className={`hidden md:flex relative transition-all duration-300 ${
          isToolboxSidebarOpen ? 'w-64' : 'w-12'
        }`}>
          <ToolboxPanel isOpen={isToolboxSidebarOpen} onToggle={() => setIsToolboxSidebarOpen(!isToolboxSidebarOpen)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Form Editor */}
          <div className={`overflow-auto transition-all ${activeView === 'split' ? 'w-1/2 border-r border-gray-200' : 'flex-1'}`}>
            <Editor />
          </div>

          {/* Split Screen Live Preview */}
          {activeView === 'split' && (
            <div className="w-1/2 overflow-auto bg-gray-100 p-4 hidden md:block">
              <div className="sticky top-0 bg-white/90 backdrop-blur-xs p-2 rounded-lg mb-3 shadow-xs border border-gray-200 flex items-center justify-between z-10">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">⚡ Live Preview</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                  >
                    PDF Preview
                  </button>
                  <button
                    onClick={() => requestExport(() => executePdfDownload())}
                    disabled={isPdfExporting}
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isPdfExporting ? 'Generating…' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handleExportRequest}
                    className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                  >
                    Export DOCX
                  </button>
                </div>
              </div>
              <Preview />
            </div>
          )}
        </div>

        {/* Mobile bottom controls */}
        <div
          className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-xl px-2 py-1 flex items-center gap-2 shadow-md border border-gray-200"
          role="toolbar"
          aria-label="Mobile controls"
        >
          {/* Validation Pill */}
          <button
            onClick={() => setIsValidationModalOpen(true)}
            className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label="Validation check"
            title="Validation check"
          >
            <span className="text-base">{validationReport?.hasErrors ? '⚠️' : '✅'}</span>
            {validationReport && validationReport.totalErrors > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-800">
                {validationReport.totalErrors}
              </span>
            )}
          </button>

          {/* Preview */}
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Preview resume"
            title="Preview"
          >
            <span className="text-base">👁️</span>
          </button>

          {/* ATS */}
          <button
            onClick={() => setIsATSModalOpen(true)}
            className="relative h-8 w-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-200"
            aria-label="Show ATS score"
            title={atsScore ? `ATS Score ${atsScore.overall}` : 'ATS Score'}
          >
            <span className="text-base">📊</span>
            {atsScore && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {atsScore.overall}
              </span>
            )}
          </button>

          {/* Toolbox */}
          <button
            onClick={() => setIsToolboxOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-xs hover:shadow-md transition-transform transform hover:-translate-y-0.5 duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Open toolbox"
            title="Toolbox"
          >
            <span className="text-lg">🔧</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-2 sm:px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {currentResume && (
            <>
              <span className="truncate">
                <span className="hidden sm:inline">Current: </span>
                <strong className="text-gray-700">{currentResume.title}</strong>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden md:inline">Template: {currentResume.template}</span>
              {validationReport && validationReport.hasErrors && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <button
                    onClick={() => setIsValidationModalOpen(true)}
                    className="text-red-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>⚠️</span> {validationReport.totalErrors} validation {validationReport.totalErrors === 1 ? 'issue' : 'issues'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden sm:inline">Auto-saved to local storage</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">ATS-Optimized Resume Builder</span>
          <span className="sm:hidden">💾</span>
        </div>
      </footer>

      {/* Validation Quality Modal */}
      {validationReport && (
        <ValidationModal
          isOpen={isValidationModalOpen}
          onClose={() => setIsValidationModalOpen(false)}
          report={validationReport}
          onNavigateToSection={handleNavigateToSection}
        />
      )}

      {/* Pre-export Validation Guard Modal */}
      {validationReport && (
        <ValidationModal
          isOpen={isExportGuardOpen}
          onClose={() => {
            setIsExportGuardOpen(false);
            setPendingExport(null);
          }}
          report={validationReport}
          onNavigateToSection={(id) => {
            setIsPreviewModalOpen(false);
            handleNavigateToSection(id);
          }}
          isExportGuard
          onProceedExport={() => pendingExport?.()}
        />
      )}

      {/* PDF Preview Modal — shows the real PDF and downloads that same file */}
      {currentResume && (
        <PdfPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          resume={currentResume}
          enabledSections={enabledSections}
          onDownloadPdf={(pdf) => requestExport(() => executePdfDownload(pdf))}
          onExportDocx={handleExportRequest}
        />
      )}

      {/* ATS Report Modal */}
      {isATSModalOpen && atsScore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-black/5">
            {/* Modal Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-800">ATS Report</h2>
                <span className="text-sm text-gray-500">— Detailed analysis &amp; suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(atsScore, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ats-report.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 text-sm"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => setIsATSModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Close ATS report"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-linear-to-br from-white to-gray-50 shadow-inner">
                  <div className={`text-6xl font-extrabold ${getScoreColor(atsScore.overall)}`}>{atsScore.overall}</div>
                </div>
                <div className="mt-3 text-sm text-gray-500">ATS Score</div>
                <div className="mt-4 text-xs text-gray-400">Higher is better — aim for 80+</div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Completeness</span>
                    <span className={`text-sm font-bold ${getScoreColor(atsScore.completeness)}`}>{atsScore.completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${getBarColor(atsScore.completeness)} h-3 rounded-full transition-all duration-300`} style={{ width: `${atsScore.completeness}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Formatting &amp; Impact</span>
                      {atsScore.actionVerbScore !== undefined && (
                        <span className="text-xs text-gray-400">
                          (Verbs: {atsScore.actionVerbScore}/30, Metrics: {atsScore.metricsScore || 0}/25)
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(atsScore.formatting)}`}>{atsScore.formatting}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${getBarColor(atsScore.formatting)} h-3 rounded-full transition-all duration-300`} style={{ width: `${atsScore.formatting}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Keyword Match {jobDescription ? '(Custom JD)' : `(${currentResume?.template || 'Industry'} Benchmark)`}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(atsScore.keywordMatch)}`}>{atsScore.keywordMatch}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${getBarColor(atsScore.keywordMatch)} h-3 rounded-full transition-all duration-300`} style={{ width: `${atsScore.keywordMatch}%` }} />
                  </div>
                </div>
              </div>

              {/* Target Job Description & Keywords Match Box */}
              <div className="p-4 bg-gray-50/90 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Job Description Keyword Match</h4>
                    <p className="text-xs text-gray-500">
                      {jobDescription
                        ? 'Comparing keywords against your pasted job description.'
                        : 'Using role benchmarks. Paste a job description for exact match analysis.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowJDInModal(!showJDInModal)}
                    className="px-3 py-1 bg-white border border-gray-200 text-blue-600 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
                  >
                    {showJDInModal ? 'Hide JD' : jobDescription ? 'Edit JD' : '+ Paste Job Description'}
                  </button>
                </div>

                {showJDInModal && (
                  <div className="pt-2">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the target job description or requirements here..."
                      className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                      rows={5}
                    />
                    {jobDescription && (
                      <div className="flex justify-end mt-1">
                        <button
                          onClick={() => setJobDescription('')}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Clear Job Description
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Matched Keywords */}
                {atsScore.matchedKeywords && atsScore.matchedKeywords.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                      <span>✓</span> Matched Keywords ({atsScore.matchedKeywords.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {atsScore.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {atsScore.missingKeywords && atsScore.missingKeywords.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      <span>⚡</span> High-Value Keywords to Add ({atsScore.missingKeywords.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {atsScore.missingKeywords.slice(0, 16).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Issues to Fix */}
              {atsScore.warnings && atsScore.warnings.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Optimization Checklist ({atsScore.warnings.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {atsScore.warnings.map((warning, index) => {
                      const getBorder = () => {
                        if (warning.severity === 'high') return 'border-red-500 bg-red-50/20';
                        if (warning.severity === 'medium') return 'border-amber-400 bg-amber-50/20';
                        return 'border-blue-400 bg-blue-50/10';
                      };

                      const handleFixClick = () => {
                        const sec = warning.section.toLowerCase();
                        let target = 'personalInfo';
                        if (sec.includes('summary')) target = 'professionalSummary';
                        else if (sec.includes('skill')) target = 'skills';
                        else if (sec.includes('experience')) target = 'experience';
                        else if (sec.includes('education')) target = 'education';
                        else if (sec.includes('project')) target = 'projects';
                        handleNavigateToSection(target);
                        setIsATSModalOpen(false);
                      };

                      return (
                        <div key={index} className={`flex items-start justify-between p-3 rounded-lg border-l-4 border border-gray-200 shadow-2xs ${getBorder()}`}>
                          <div className="flex items-start gap-2.5 flex-1 pr-2">
                            <span className="text-sm mt-0.5">
                              {warning.severity === 'high' ? '⚠️' : warning.severity === 'medium' ? '⚡' : 'ℹ️'}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-800">{warning.section}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                                  warning.severity === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : warning.severity === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {warning.severity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{warning.message}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleFixClick}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap hover:underline pt-0.5"
                          >
                            Fix in Editor →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ATS Tips */}
              <div className="bg-linear-to-r from-indigo-50 to-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">ATS Optimization Tips</h3>
                <ul className="text-sm text-indigo-600 space-y-2">
                  <li>• Use standard section headings (Experience, Education, Skills)</li>
                  <li>• Avoid tables, columns, and graphics</li>
                  <li>• Include keywords from job description naturally</li>
                  <li>• Use bullet points for achievements</li>
                  <li>• Keep formatting simple and consistent</li>
                  <li>• Use ATS-safe fonts like Arial, Calibri, or Times New Roman</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              <button
                onClick={() => setIsATSModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderPageWrapper() {
  return (
    <Suspense fallback={null}>
      <BuilderPage />
    </Suspense>
  );
}
