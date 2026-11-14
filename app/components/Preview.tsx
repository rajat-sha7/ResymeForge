'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import ResumeDocument from './ResumeDocument';
import { prepareResumeForRender } from '../utils/resumeRender';

/**
 * Live HTML preview of the current resume on an A4 sheet. It uses the same renderer
 * as the PDF export (ResumeDocument inside .resume-paper).
 */
const Preview: React.FC = () => {
  const { currentResumeId, resumes, enabledSections } = useResumeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(0.75);
  // null = fit the sheet to the panel width; a number = user-chosen zoom.
  const [userScale, setUserScale] = useState<number | null>(null);
  const scale = userScale ?? fitScale;
  const resume = currentResumeId ? resumes[currentResumeId] : null;

  const renderData = useMemo(
    () => (resume ? prepareResumeForRender(resume, enabledSections) : null),
    [resume, enabledSections]
  );

  const hasResume = renderData !== null;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const A4_WIDTH_PX = 794; // 210mm at 96dpi
    const update = () => setFitScale(Math.max(0.3, Math.min(1, (el.clientWidth - 8) / A4_WIDTH_PX)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasResume]);

  if (!renderData) {
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

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 border border-gray-200">
          <button
            onClick={() => setUserScale(Math.max(0.3, +(scale - 0.1).toFixed(2)))}
            className="px-2 py-0.5 hover:bg-gray-100 rounded text-gray-600"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="text-xs text-gray-600 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setUserScale(Math.min(1.5, +(scale + 0.1).toFixed(2)))}
            className="px-2 py-0.5 hover:bg-gray-100 rounded text-gray-600"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => setUserScale(null)}
            className={`text-xs ml-1 ${userScale === null ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'}`}
            disabled={userScale === null}
          >
            Fit
          </button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-auto">
        {/* `zoom` (unlike transform) also shrinks the layout box, so no empty space is left below. */}
        <div className="mx-auto shadow-xl w-fit" style={{ zoom: scale }}>
          <div className="resume-paper">
            <ResumeDocument data={renderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
