'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ProfessionalSummary } from '../../types/resume';
import { getSummarySuggestions, checkBuzzwords } from '../../utils/ats';
import { hasHTML } from '../../utils/validation';

interface ProfessionalSummaryFormProps {
  data: ProfessionalSummary;
}

const ProfessionalSummaryForm: React.FC<ProfessionalSummaryFormProps> = ({ data }) => {
  const { updateSection, currentResumeId, resumes } = useResumeStore();
  const [summary, setSummary] = useState(data.summary);
  const [enabled, setEnabled] = useState(data.enabled ?? true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const maxLength = 500;
  const charCount = summary.length;

  useEffect(() => {
    setSummary(data.summary);
    setEnabled(data.enabled ?? true);
  }, [data]);

  useEffect(() => {
    const template = (currentResumeId && resumes[currentResumeId]?.template) || 'software';
    setSuggestions(getSummarySuggestions(template));
  }, [currentResumeId, resumes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSummary(value);
    updateSection('professionalSummary', { summary: value, enabled });
  };

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    updateSection('professionalSummary', { summary, enabled: newEnabled });
  };

  const applySuggestion = (suggestion: string) => {
    setSummary(suggestion);
    updateSection('professionalSummary', { summary: suggestion, enabled });
    setShowSuggestions(false);
  };

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const buzzwords = checkBuzzwords(summary);

  return (
    <div className="space-y-4">
      {/* Subheader bar with toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            A high-impact 2-4 sentence hook summarizing your domain experience and core value.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-700">Include in Resume</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={handleToggle}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className={`space-y-3 transition-opacity ${!enabled ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* Textarea Field Container */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Summary Statement
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">{wordCount} words</span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  charCount > maxLength * 0.95
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : charCount > maxLength * 0.8
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {charCount}/{maxLength}
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="e.g. Results-driven Software Engineer with 5+ years of experience designing scalable distributed web platforms..."
              value={summary}
              onChange={handleChange}
              rows={4}
              maxLength={maxLength}
              disabled={!enabled}
              className="w-full p-3.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 leading-relaxed text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Validation & Micro-feedback */}
          {hasHTML(summary) && (
            <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
              ⚠️ Avoid HTML tags — use plain text for optimal ATS parsing.
            </p>
          )}

          {buzzwords.length > 0 && (
            <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-900">⚠️ Cliché buzzwords detected:</span>
                <div className="flex flex-wrap gap-1">
                  {buzzwords.slice(0, 4).map((b, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white text-amber-800 border border-amber-200 text-[11px] font-medium">
                      &quot;{b}&quot;
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-amber-700 text-[11px]">Replace with quantifiable outcomes</span>
            </div>
          )}

          {charCount > maxLength * 0.9 && (
            <p className="text-amber-600 text-xs mt-1.5 flex items-center gap-1">
              ⚠️ Summary is approaching the 500-character ceiling. Keep it tight for ATS scanners.
            </p>
          )}
        </div>

        {/* Suggestion Toggle & Drawer */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <span>✨</span>
            <span>{showSuggestions ? 'Hide Summary Templates' : 'Browse Predefined Summary Templates'}</span>
          </button>

          {showSuggestions && (
            <div className="mt-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900">
                  Predefined Summaries Aligned with Your Template
                </span>
                <span className="text-[11px] text-blue-600 font-medium">Click to replace input</span>
              </div>

              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group"
                  >
                    <p className="text-xs text-gray-700 leading-relaxed group-hover:text-gray-900">
                      {suggestion}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <span className="text-[11px] font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                        Use this template →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;