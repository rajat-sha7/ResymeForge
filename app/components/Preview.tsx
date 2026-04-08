'use client';

import React, { useRef, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import BaseTemplate from '../templates/BaseTemplate';
import SoftwareTemplate from '../templates/SoftwareTemplate';
import ManagementTemplate from '../templates/ManagementTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import AcademicTemplate from '../templates/AcademicTemplate';
import SalesTemplate from '../templates/SalesTemplate';
import HealthcareTemplate from '../templates/HealthcareTemplate';
import { exportToDOCX } from '../utils/export';

const Preview: React.FC = () => {
  const { currentResumeId, resumes, sectionOrder, enabledSections } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);
  const [isExporting, setIsExporting] = useState(false);

  if (!currentResumeId || !resumes[currentResumeId]) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">👁️</div>
          <h2 className="text-xl font-semibold text-gray-700">No Resume to Preview</h2>
          <p className="text-gray-500 mt-2">Create or select a resume to see the preview.</p>
        </div>
      </div>
    );
  }

  const resume = resumes[currentResumeId];
  const orderedSections = sectionOrder.filter(s => enabledSections.includes(s));

  // Template switcher
  const renderTemplate = () => {
    switch ((resume.template || 'software').toLowerCase()) {
      case 'software':
        return <SoftwareTemplate data={resume} />;
      case 'management':
        return <ManagementTemplate data={resume} />;
      case 'creative':
        return <CreativeTemplate data={resume} />;
      case 'academic':
        return <AcademicTemplate data={resume} />;
      case 'sales':
        return <SalesTemplate data={resume} />;
      case 'healthcare':
        return <HealthcareTemplate data={resume} />;
      default:
        return <BaseTemplate data={resume} enabledSections={orderedSections} />;
    }
  };

  

  const handleExportDOCX = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      const filename = `${resume.personalInfo?.name || 'resume'}.docx`
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .slice(0, 255);
      
      await exportToDOCX(resume, orderedSections, filename);
    } catch (error) {
      console.error('DOCX export failed:', error);
      alert(`Failed to export DOCX: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      // Build a base64-encoded resume JSON and point the Puppeteer worker at the public preview page.
      const json = JSON.stringify(resume);
      // base64 unicode-safe
      const base64 = btoa(unescape(encodeURIComponent(json)));
      const url = `${window.location.origin}/public-preview?data=${encodeURIComponent(base64)}`;

      // If a Docker worker URL is configured in env, call it directly.
      // Otherwise fall back to the in-app API route which uses local Puppeteer.
      const workerBase = process.env.NEXT_PUBLIC_PDF_WORKER_URL || null;
      const endpoint = workerBase ? `${workerBase.replace(/\/$/, '')}/generate-pdf` : '/api/export-pdf';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `PDF export failed (${res.status})`);
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${resume.personalInfo?.name || 'resume'}.pdf`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      {/* Header with controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
            
            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                ➖
              </button>
              <span className="text-sm text-gray-600 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(Math.min(1.5, scale + 0.1))}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                ➕
              </button>
              <button
                onClick={() => setScale(0.75)}
                className="text-xs text-blue-600 hover:text-blue-700 ml-1"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {isExporting ? <span className="animate-spin">⏳</span> : '📄'} PDF
            </button>
            <button
              onClick={handleExportDOCX}
              disabled={isExporting}
              className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {isExporting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                '📝'
              )}
              DOCX
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview panel - Full width */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-center">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}
            >
              <div
                ref={previewRef}
                data-export-element="true"
                className="bg-white shadow-xl rounded-lg overflow-hidden"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '20mm',
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with page info */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-center">
        <span className="text-sm text-gray-500">
          A4 Format (210mm × 297mm) • {orderedSections.length} sections • 
          Template: {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default Preview;