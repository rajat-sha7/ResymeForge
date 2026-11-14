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
  const [showSuggestions, setShowSuggestions] = useState(true);
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
    const template = (currentResumeId && resumes[currentResumeId]?.template) || 'software';
    setSuggestions(getSkillSuggestions(template));
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
    <div className="space-y-5">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Categorized technical capabilities, development tools, and interpersonal strengths.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
          </span>
        </div>
      </div>

      {/* Duplicate Alert */}
      {duplicates.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <span className="text-amber-700 text-xs font-semibold">⚠️ Duplicate skills detected:</span>
          <div className="flex flex-wrap gap-1">
            {duplicates.map((d, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-200 text-xs font-medium">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Skill Form Bar */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Add New Skill
        </label>
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🛠️
            </div>
            <input
              type="text"
              list="skills-quick-suggestions"
              placeholder="e.g. TypeScript, React, Docker..."
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                if (skillError) setSkillError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                skillError
                  ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
            <datalist id="skills-quick-suggestions">
              {[...suggestions.technical, ...suggestions.tools, ...suggestions.soft].map((s, i) => (
                <option key={i} value={s} />
              ))}
            </datalist>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'technical' | 'tools' | 'soft')}
            className="py-2.5 px-3 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-all font-medium text-gray-700"
          >
            <option value="technical">Technical</option>
            <option value="tools">Tools &amp; Tech</option>
            <option value="soft">Soft Skills</option>
          </select>

          <button
            type="button"
            onClick={() => addSkill()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-xs shrink-0"
          >
            Add Skill
          </button>
        </div>

        {skillError && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {skillError}</p>
        )}
      </div>

      {/* Suggested Industry Keywords Drawer */}
      <div>
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5"
        >
          <span>✨</span>
          <span>{showSuggestions ? 'Hide Recommended Skills' : 'Show Recommended Skills for Template'}</span>
        </button>

        {showSuggestions && (
          <div className="mt-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <span className="font-semibold text-blue-900 text-xs uppercase tracking-wider block">
              Suggested Keywords for Your Template
            </span>
            <div className="space-y-3">
              {['technical', 'tools', 'soft'].map((cat) => (
                <div key={cat}>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {cat === 'technical' ? 'Technical Skills' : cat === 'tools' ? 'Tools & Platforms' : 'Interpersonal / Soft Skills'}
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
                          className={`px-2.5 py-1 rounded-md text-xs transition-all font-medium ${
                            isAdded
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 shadow-2xs'
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
      </div>

      {/* Categorized Skills Display */}
      <div className="space-y-4 pt-2">
        {['technical', 'tools', 'soft'].map((cat) => {
          const catList = groupedSkills[cat as keyof typeof groupedSkills];
          return (
            <div key={cat} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  {cat === 'technical' ? '💻 Technical Skills' : cat === 'tools' ? '🛠️ Tools & Technologies' : '🤝 Soft Skills'}
                  <span className="text-gray-400 font-normal">({catList.length})</span>
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {catList.map((skill) => (
                  <div
                    key={skill.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border shadow-2xs transition-all ${
                      duplicates.includes(skill.name)
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors ml-0.5"
                      title="Remove skill"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {catList.length === 0 && (
                  <span className="text-gray-400 text-xs italic">No skills added in this category yet.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsForm;
