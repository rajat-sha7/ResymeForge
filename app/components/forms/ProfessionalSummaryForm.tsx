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
    if (currentResumeId && resumes[currentResumeId]) {
      const template = resumes[currentResumeId].template;
      setSuggestions(getSummarySuggestions(template));
    }
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>📝</span> Professional Summary
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600">Show in resume</span>
          <div 
            className={`w-10 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={handleToggle}
          >
            <div 
              className={`w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-4' : ''}`}
            />
          </div>
        </label>
      </div>

      <div className="relative">
        <textarea
          placeholder="Write a brief professional summary (2-4 lines)..."
          value={summary}
          onChange={handleChange}
          rows={4}
          maxLength={maxLength}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            !enabled ? 'opacity-50' : ''
          }`}
          disabled={!enabled}
        />
        {hasHTML(summary) && (
          <p className="text-red-500 text-sm mt-2">Avoid HTML or rich text — use plain text for ATS compatibility.</p>
        )}
        {checkBuzzwords(summary).length > 0 && (
          <p className="text-yellow-600 text-sm mt-2">Avoid buzzwords: {checkBuzzwords(summary).slice(0,3).join(', ')}</p>
        )}
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ✨ AI Suggestions
          </button>
          <span className={`text-sm ${charCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {charCount > maxLength * 0.9 && (
        <p className="text-yellow-600 text-sm mt-2">
          ⚠️ Summary is getting long. Keep it concise for ATS optimization.
        </p>
      )}

      {showSuggestions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3">AI-Assisted Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => applySuggestion(suggestion)}
              >
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-3">
            Click a suggestion to use it as a template. Customize it with your specific experience and technologies.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSummaryForm;