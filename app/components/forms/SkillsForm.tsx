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
    const name = skillName || newSkill.trim();
    if (!isRequired(name)) return;
    if (hasHTML(name)) return;
    if (!maxLength(name, 60)) return;
    if (name) {
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
      setDuplicates(checkDuplicateSkills(updated));
    }
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
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>🔧</span> Skills
      </h2>

      {duplicates.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Duplicate skills detected: {duplicates.join(', ')}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'technical' | 'tools' | 'soft')}
          className="p-3 border border-gray-300 rounded-lg bg-white"
        >
          <option value="technical">Technical</option>
          <option value="tools">Tools</option>
          <option value="soft">Soft Skills</option>
        </select>
        <button
          onClick={() => addSkill()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="text-sm text-blue-600 hover:text-blue-700 mb-4"
      >
        ✨ Show Skill Suggestions
      </button>

      {showSuggestions && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3">Suggested Skills</h4>
          <div className="space-y-3">
            {['technical', 'tools', 'soft'].map((cat) => (
              <div key={cat}>
                <p className="text-xs font-medium text-gray-600 mb-1 capitalize">{cat}</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions[cat as keyof typeof suggestions].map((skill, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCategory(cat as 'technical' | 'tools' | 'soft');
                        addSkill(skill);
                      }}
                      className="px-2 py-1 bg-white border border-blue-200 rounded text-xs hover:bg-blue-100"
                      disabled={skills.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {['technical', 'tools', 'soft'].map((cat) => (
          <div key={cat}>
            <h4 className="text-sm font-medium text-gray-600 mb-2 capitalize">
              {cat === 'technical' ? 'Technical Skills' : cat === 'tools' ? 'Tools & Technologies' : 'Soft Skills'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {groupedSkills[cat as keyof typeof groupedSkills].map((skill) => (
                <div
                  key={skill.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                    duplicates.includes(skill.name) ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100'
                  }`}
                >
                  <span className="text-sm">{skill.name}</span>
                  <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-600 ml-1">
                    ×
                  </button>
                </div>
              ))}
              {groupedSkills[cat as keyof typeof groupedSkills].length === 0 && (
                <span className="text-gray-400 text-sm">No skills added</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;