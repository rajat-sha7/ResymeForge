'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Skill } from '../../types/resume';
import { checkDuplicateSkills, getSkillSuggestions } from '../../utils/ats';
import { hasHTML, maxLength, isRequired } from '../../utils/validation';

interface SkillsFormProps {
  data: (Skill | string)[];
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data }) => {
  const { updateSection, currentResumeId, resumes } = useResumeStore();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState<string | null>(null);
  const [category, setCategory] = useState<'technical' | 'tools' | 'soft'>('technical');
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ technical: string[]; tools: string[]; soft: string[] }>({
    technical: [],
    tools: [],
    soft: [],
  });

  useEffect(() => {
    // Normalize data to Skill[] format
    const formattedData = data.map((s, i) => {
      if (typeof s === 'string') {
        return {
          id: Date.now().toString() + i,
          name: s,
          category: 'technical' as const,
          priority: i,
        };
      }
      return {
        id: s.id || Date.now().toString() + i,
        name: s.name,
        category: s.category || 'technical',
        priority: s.priority ?? i,
      };
    });
    setSkills(formattedData);
    setDuplicates(checkDuplicateSkills(formattedData));
  }, [data]);

  useEffect(() => {
    if (currentResumeId && resumes[currentResumeId]) {
      const template = resumes[currentResumeId].template;
      setSuggestions(getSkillSuggestions(template));
    }
  }, [currentResumeId, resumes]);

  const addSkill = (skillName?: string) => {
    const name = (skillName || newSkill).trim();

    if (!isRequired(name)) {
      setSkillError('Please enter a skill name');
      return;
    }
    if (hasHTML(name)) {
      setSkillError('HTML tags are not allowed');
      return;
    }
    if (!maxLength(name, 60)) {
      setSkillError('Skill name cannot exceed 60 characters');
      return;
    }

    const alreadyExists = skills.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
      setSkillError(`Skill "${name}" is already in your skills list`);
      return;
    }

    const newSkillObj: Skill = {
      id: Date.now().toString(),
      name,
      category,
      priority: skills.length,
    };
    const updated = [...skills, newSkillObj];
    setSkills(updated);
    updateSection('skills', updated);
    setNewSkill('');
    setSkillError(null);
    setDuplicates(checkDuplicateSkills(updated));
  };

  const removeSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    updateSection('skills', updated);
    setDuplicates(checkDuplicateSkills(updated));
  };

  const groupedSkills = {
    technical: skills.filter((s) => s.category === 'technical'),
    tools: skills.filter((s) => s.category === 'tools'),
    soft: skills.filter((s) => s.category === 'soft'),
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🔧</span> Skills
        </h2>
        <span className="text-xs text-gray-400">Add 5-10 targeted keywords</span>
      </div>

      {duplicates.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Duplicate skills detected: {duplicates.join(', ')}
          </p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="e.g. TypeScript, React, Docker..."
            value={newSkill}
            onChange={(e) => {
              setNewSkill(e.target.value);
              if (skillError) setSkillError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className={`flex-1 min-w-[200px] p-3 border rounded-lg focus:ring-2 ${
              skillError ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'technical' | 'tools' | 'soft')}
            className="p-3 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="technical">Technical</option>
            <option value="tools">Tools & Technologies</option>
            <option value="soft">Soft Skills</option>
          </select>
          <button
            type="button"
            onClick={() => addSkill()}
            className="px-6 py-3 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            Add Skill
          </button>
        </div>

        {skillError && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {skillError}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="text-xs font-medium text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-1"
      >
        ✨ {showSuggestions ? 'Hide Suggestions' : 'Show Recommended Skills for Template'}
      </button>

      {showSuggestions && (
        <div className="mb-6 p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 text-xs mb-3 uppercase tracking-wider">Suggested Industry Keywords</h4>
          <div className="space-y-3">
            {['technical', 'tools', 'soft'].map((cat) => (
              <div key={cat}>
                <p className="text-xs font-medium text-gray-600 mb-1 capitalize">
                  {cat === 'technical' ? 'Technical' : cat === 'tools' ? 'Tools' : 'Soft Skills'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(suggestions[cat as keyof typeof suggestions] || []).map((skill, i) => {
                    const isAdded = skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setCategory(cat as 'technical' | 'tools' | 'soft');
                          addSkill(skill);
                        }}
                        disabled={isAdded}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          isAdded
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {isAdded ? '✓' : '+'} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {['technical', 'tools', 'soft'].map((cat) => (
          <div key={cat}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {cat === 'technical' ? 'Technical Skills' : cat === 'tools' ? 'Tools & Technologies' : 'Soft Skills'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {groupedSkills[cat as keyof typeof groupedSkills].map((skill) => (
                <div
                  key={skill.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border ${
                    duplicates.includes(skill.name)
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-gray-400 hover:text-red-600 ml-1.5"
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {groupedSkills[cat as keyof typeof groupedSkills].length === 0 && (
                <span className="text-gray-400 text-xs italic">No skills added in this category</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
