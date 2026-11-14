import { ResumeData, SectionType } from '../types/resume';

/**
 * Renders the resume to a PDF on the server (same templates as the on-screen preview)
 * and returns it as a Blob. The same Blob is used both to display the preview and to
 * download, so what the user sees is exactly what they get.
 */
export const generateResumePDF = async (
  resume: ResumeData,
  enabledSections: SectionType[],
  signal?: AbortSignal
): Promise<Blob> => {
  const res = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, enabledSections }),
    signal,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || `PDF generation failed (${res.status})`);
  }
  const blob = await res.blob();
  if (blob.type !== 'application/pdf') {
    throw new Error('PDF generation returned an unexpected response.');
  }
  return blob;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
