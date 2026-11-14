'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../store/resumeStore';
import {
  calculateATSScore,
  extractKeywords,
  findMatchingKeywords,
  findMissingKeywords,
  getResumeText,
  ATS_SAFE_FONTS,
} from '../utils/ats';
import { ATSScore } from '../types/resume';

const ATSHealthPanel: React.FC = () => {
  const { currentResumeId, resumes, jobDescription, setJobDescription } = useResumeStore();
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [showJDInput, setShowJDInput] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (currentResumeId && resumes[currentResumeId]) {
      const score = calculateATSScore(resumes[currentResumeId], jobDescription);
      setAtsScore(score);

      if (jobDescription && jobDescription.trim().length > 0) {
        const jdKeywords = extractKeywords(jobDescription);
        const resumeText = getResumeText(resumes[currentResumeId]);
        setMatchedKeywords(findMatchingKeywords(resumeText, jdKeywords));
        setMissingKeywords(findMissingKeywords(resumeText, jdKeywords));
      } else {
        setMatchedKeywords(score.matchedKeywords || []);
        setMissingKeywords(score.missingKeywords || []);
      }
    }
  }, [currentResumeId, resumes, jobDescription]);

  if (!currentResumeId || !resumes[currentResumeId]) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 w-80 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2">Resume Health</h2>

      {/* Overall Score */}
      {atsScore && (
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold ${getScoreColor(atsScore.overall)}`}>
              {atsScore.overall}
            </div>
            <div className="text-sm text-gray-500">ATS Score</div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completeness</span>
                <span className={getScoreColor(atsScore.completeness)}>{atsScore.completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBgColor(atsScore.completeness)}`}
                  style={{ width: `${atsScore.completeness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Formatting</span>
                <span className={getScoreColor(atsScore.formatting)}>{atsScore.formatting}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBgColor(atsScore.formatting)}`}
                  style={{ width: `${atsScore.formatting}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Keyword Match</span>
                <span className={getScoreColor(atsScore.keywordMatch)}>{atsScore.keywordMatch}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBgColor(atsScore.keywordMatch)}`}
                  style={{ width: `${atsScore.keywordMatch}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Input */}
      <div className="mb-6">
        <button
          onClick={() => setShowJDInput(!showJDInput)}
          className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {showJDInput ? 'Hide Job Description' : 'Paste Job Description'}
        </button>
        
        {showJDInput && (
          <div className="mt-3">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here to check keyword match..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              rows={6}
            />
            {jobDescription && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Matched Keywords ({matchedKeywords.length})</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {matchedKeywords.slice(0, 15).map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      {kw}
                    </span>
                  ))}
                </div>
                
                <div className="text-sm font-medium mb-2">Missing Keywords ({missingKeywords.length})</div>
                <div className="flex flex-wrap gap-1">
                  {missingKeywords.slice(0, 10).map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warnings */}
      {atsScore && atsScore.warnings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Warnings ({atsScore.warnings.length})</h3>
          <div className="space-y-2">
            {atsScore.warnings.map((warning, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border text-sm ${getSeverityColor(warning.severity)}`}
              >
                <div className="font-medium">{warning.section}</div>
                <div className="text-xs mt-1">{warning.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Checklist */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Section Checklist</h3>
        <div className="space-y-2">
          {[
            { name: 'Personal Info', check: resumes[currentResumeId].personalInfo.name && resumes[currentResumeId].personalInfo.email },
            { name: 'Summary', check: typeof resumes[currentResumeId].professionalSummary === 'string' 
              ? resumes[currentResumeId].professionalSummary 
              : (resumes[currentResumeId].professionalSummary as { summary?: string })?.summary },
            { name: 'Skills', check: resumes[currentResumeId].skills.length > 0 },
            { name: 'Experience', check: resumes[currentResumeId].experience.length > 0 },
            { name: 'Education', check: resumes[currentResumeId].education.length > 0 },
            { name: 'Projects', check: resumes[currentResumeId].projects.length > 0 },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                item.check ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {item.check ? '✓' : '○'}
              </span>
              <span className={item.check ? 'text-gray-700' : 'text-gray-400'}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Safety */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">ATS-Safe Fonts</h3>
        <div className="flex flex-wrap gap-2">
          {ATS_SAFE_FONTS.map((font, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {font}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Using these fonts ensures ATS compatibility
        </p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">ATS Tips</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use standard section headings</li>
          <li>• Avoid tables, columns, and graphics</li>
          <li>• Include keywords from job description</li>
          <li>• Use bullet points for achievements</li>
          <li>• Keep formatting simple and consistent</li>
        </ul>
      </div>
    </div>
  );
};

export default ATSHealthPanel;