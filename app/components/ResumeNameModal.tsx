"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '../store/resumeStore';
import { TemplateType } from '../types/resume';

interface Props {
  template: TemplateType;
  onClose: () => void;
}

const templateGradient: Record<TemplateType, string> = {
  software: 'from-blue-500 to-cyan-500',
  management: 'from-purple-500 to-pink-500',
  creative: 'from-orange-500 to-red-500',
  academic: 'from-green-500 to-emerald-500',
  sales: 'from-yellow-500 to-orange-500',
  healthcare: 'from-sky-500 to-indigo-500',
};

const ResumeNameModal: React.FC<Props> = ({ template, onClose }) => {
  const [name, setName] = useState<string>(`New ${template.charAt(0).toUpperCase() + template.slice(1)} Resume`);
  const createResume = useResumeStore((s) => s.createResume);
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // small entrance animation
    requestAnimationFrame(() => setVisible(true));
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = createResume(name || `New Resume`, template || 'software');
    onClose();
    // navigate to builder with template query
    router.push(`/builder?template=${template}`);
  };

  const grad = templateGradient[template] || templateGradient.software;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleCreate}
        role="dialog"
        aria-modal="true"
        aria-label="Name your resume"
        className={`relative bg-white rounded-2xl shadow-2xl w-[min(640px,94%)] z-10 overflow-hidden transform transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className={`h-2 bg-linear-to-r ${grad}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br ${grad} text-white shadow-md shrink-0`}> 
              <span className="font-bold">{template.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Name your resume</h3>
              <p className="text-sm text-gray-600">Give your resume a name before you start editing.</p>
            </div>
          </div>

          <div className="mt-4">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors"
              placeholder="Resume name"
              aria-label="Resume name"
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">Template: <span className="font-medium text-gray-700">{template}</span></div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm bg-white/90 text-gray-800 border border-gray-200 shadow-sm hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white text-sm shadow">Create and Edit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResumeNameModal;
