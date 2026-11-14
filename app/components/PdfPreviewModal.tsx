'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ResumeData, SectionType } from '../types/resume';
import { generateResumePDF } from '../utils/pdfExport';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  enabledSections: SectionType[];
  /** Called with the exact PDF shown in the preview when the user downloads it. */
  onDownloadPdf: (pdf: Blob) => void;
  onExportDocx: () => void;
}

/**
 * Shows the real PDF that will be downloaded (rendered by the server), not an HTML
 * approximation, and downloads that same file.
 */
const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  resume,
  enabledSections,
  onDownloadPdf,
  onExportDocx,
}) => {
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const blob = await generateResumePDF(resume, enabledSections, controller.signal);
      if (controller.signal.aborted) return;
      setPdf(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      if (controller.signal.aborted) return;
      setPdf(null);
      setError(err instanceof Error ? err.message : 'Could not generate the PDF.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [resume, enabledSections]);

  useEffect(() => {
    if (!isOpen) return;
    generate();
    return () => abortRef.current?.abort();
    // Only regenerate when the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Release the object URL when the modal closes/unmounts.
  useEffect(() => {
    if (isOpen) return;
    setPdf(null);
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4" role="dialog" aria-modal="true" aria-label="PDF preview">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[92vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">PDF Preview</h2>
            <p className="text-xs text-gray-500">This is the exact file you will download (A4).</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close preview">
            ✕
          </button>
        </div>

        <div className="flex-1 bg-gray-200 relative min-h-0">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100/80 z-10">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Generating PDF…</p>
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-red-600 font-medium">Couldn&apos;t generate the PDF</p>
              <p className="text-sm text-gray-600 max-w-md">{error}</p>
              <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Try again
              </button>
            </div>
          )}
          {pdfUrl && !error && (
            <iframe
              key={pdfUrl}
              src={`${pdfUrl}#view=FitH&navpanes=0`}
              title="Resume PDF preview"
              className="w-full h-full border-0"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={generate}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              ↻ Refresh
            </button>
            {pdfUrl && !error && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline">
                Open in new tab
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onExportDocx} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Export DOCX
            </button>
            <button
              onClick={() => pdf && onDownloadPdf(pdf)}
              disabled={!pdf || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
