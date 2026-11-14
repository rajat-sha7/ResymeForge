"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ResumeDocument from '../components/ResumeDocument';
import { prepareResumeForRender } from '../utils/resumeRender';
import { ResumeData, SectionType } from '../types/resume';

type ExportPayload = { resume: ResumeData; enabledSections?: SectionType[] };

declare global {
  interface Window {
    /** Injected by the PDF renderer (see app/api/export-pdf) before the page loads. */
    __RESUME_EXPORT__?: ExportPayload;
  }
}

const decodeBase64 = (s: string) => {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(s), (c: string) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  } catch {
    try { return atob(s); } catch { return ''; }
  }
};

const readPayload = (): ExportPayload | null => {
  if (window.__RESUME_EXPORT__?.resume) return window.__RESUME_EXPORT__;
  const b = new URLSearchParams(window.location.search).get('data');
  if (!b) return null;
  try {
    const parsed = JSON.parse(decodeBase64(b));
    return parsed?.resume ? parsed : { resume: parsed };
  } catch (err) {
    console.error('Failed to parse resume data', err);
    return null;
  }
};

const PreviewContent: React.FC = () => {
  // Rendered client-only (see below), so the payload can be read during the first render.
  const [data] = useState<ResumeData | null>(() => {
    const payload = readPayload();
    return payload ? prepareResumeForRender(payload.resume, payload.enabledSections) : null;
  });

  // Set the PDF's document title, then signal to the PDF renderer that the resume has been painted.
  useEffect(() => {
    const name = data?.personalInfo?.name?.trim();
    if (name) document.title = `${name} – Resume`;
    document.body.setAttribute('data-resume-ready', 'true');
  }, [data]);

  if (!data) return <div style={{ padding: 40, fontFamily: 'Arial' }}>No resume data provided.</div>;

  return (
    <div className="resume-paper">
      <ResumeDocument data={data} />
    </div>
  );
};

const PublicPreview = dynamic(() => Promise.resolve(PreviewContent), { ssr: false });

export default PublicPreview;
