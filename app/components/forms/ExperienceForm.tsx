'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Experience } from '../../types/resume';
import { ACTION_VERBS } from '../../utils/ats';
import {
  SUGGESTED_JOB_TITLES,
  SUGGESTED_BULLET_TEMPLATES,
} from '../../utils/fieldSuggestions';
import {
  hasHTML,
  isRequired,
  validateBullets,
  validateBullet,
  validateDateSequence,
  maxLength,
} from '../../utils/validation';

interface ExperienceFormProps {
  data: Experience[];
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [experiences, setExperiences] = useState<Experience[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const formattedData = data.map((exp, i) => ({
      ...exp,
      id: exp.id || Date.now().toString() + i,
      location: (exp as any).location || '',
      current: (exp as any).current || false,
      achievements: exp.achievements || [],
    }));
    setExperiences(formattedData);
  }, [data]);

  const handleAdd = (exp: Experience) => {
    const updated = [...experiences, { ...exp, id: Date.now().toString() }];
    setExperiences(updated);
    updateSection('experience', updated);
    setIsAdding(false);
  };

  const handleSave = (index: number, updatedExp: Experience) => {
    const updated = [...experiences];
    updated[index] = updatedExp;
    setExperiences(updated);
    updateSection('experience', updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    updateSection('experience', updated);
  };

  const handleDuplicate = (index: number) => {
    const exp = experiences[index];
    const duplicated = { ...exp, id: Date.now().toString() };
    const updated = [...experiences, duplicated];
    setExperiences(updated);
    updateSection('experience', updated);
  };

  return (
    <div className="space-y-4">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Document your professional roles, quantifiable impact, and key responsibilities.
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <span>+</span> Add Experience
          </button>
        )}
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
          >
            {editingIndex === index ? (
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    ✏️ Edit Position Details
                  </span>
                </div>
                <ExperienceEditor
                  experience={exp}
                  onSave={(updated) => handleSave(index, updated)}
                  onCancel={() => setEditingIndex(null)}
                />
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">
                        {exp.position || 'Untitled Position'}
                      </h3>
                      {exp.current && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Current Role
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                      <span className="font-medium text-gray-800">🏢 {exp.company || 'Company'}</span>
                      {exp.location && <span>📍 {exp.location}</span>}
                      <span className="text-gray-500">
                        📅 {exp.startDate || 'Start'} – {exp.current ? 'Present' : exp.endDate || 'End'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingIndex(index)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(index)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {exp.description && (
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Key Accomplishments ({exp.achievements.length})
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="flex-1">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Experience Drawer / Box */}
      {isAdding && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add New Position
            </span>
          </div>
          <ExperienceEditor
            experience={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {experiences.length === 0 && !isAdding && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">💼</div>
          <h4 className="text-sm font-semibold text-gray-800">No work experience listed</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Adding past employment positions with measurable metrics is the #1 driver of high ATS scores.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add First Experience
          </button>
        </div>
      )}
    </div>
  );
};

interface ExperienceEditorProps {
  experience: Partial<Experience>;
  onSave: (exp: Experience) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, onSave, onCancel, isNew }) => {
  const { currentResumeId, resumes } = useResumeStore();
  const currentTemplate = (currentResumeId && resumes[currentResumeId]?.template) || 'software';
  const suggestedTitles = SUGGESTED_JOB_TITLES[currentTemplate] || SUGGESTED_JOB_TITLES.software;
  const suggestedBullets = SUGGESTED_BULLET_TEMPLATES[currentTemplate] || SUGGESTED_BULLET_TEMPLATES.software;

  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    ...experience,
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [achievementError, setAchievementError] = useState<string | null>(null);
  const [showActionVerbs, setShowActionVerbs] = useState(false);
  const [showBulletTemplates, setShowBulletTemplates] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const addAchievement = () => {
    const trimmed = newAchievement.trim();
    if (!trimmed) {
      setAchievementError('Please enter an achievement description before adding');
      return;
    }
    const val = validateBullet(trimmed, 10, 220);
    if (!val.valid) {
      setAchievementError(val.message || 'Invalid bullet point');
      return;
    }
    setFormData({
      ...formData,
      achievements: [...(formData.achievements || []), trimmed],
    });
    setNewAchievement('');
    setAchievementError(null);
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: (formData.achievements || []).filter((_, i) => i !== index),
    });
  };

  const insertActionVerb = (verb: string) => {
    setNewAchievement(verb + ' ' + newAchievement);
    setShowActionVerbs(false);
    setAchievementError(null);
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.position as string)) newErrors.position = 'Job title is required';
    if (!isRequired(formData.company as string)) newErrors.company = 'Company is required';
    if (formData.description && !maxLength(formData.description, 1000)) newErrors.description = 'Description is too long (max 1000 characters)';

    if (formData.startDate && formData.endDate && !formData.current) {
      const dateCheck = validateDateSequence(formData.startDate, formData.endDate, formData.current);
      if (!dateCheck.valid) {
        newErrors.endDate = dateCheck.message || 'End date cannot be earlier than start date';
      }
    }

    if (!validateBullets(formData.achievements, 10, 220)) {
      newErrors.achievements = 'All bullet points must be 10-220 characters without HTML tags';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      company: (formData.company || '').trim(),
      position: (formData.position || '').trim(),
      location: (formData.location || '').trim(),
      startDate: (formData.startDate || '').trim(),
      endDate: formData.current ? '' : (formData.endDate || '').trim(),
      current: formData.current || false,
      description: (formData.description || '').trim(),
      achievements: formData.achievements || [],
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">Suggestions</span>
          </div>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              💼
            </div>
            <input
              type="text"
              name="position"
              list="suggested-job-titles"
              placeholder="e.g. Senior Software Engineer"
              value={formData.position || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.position
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          <datalist id="suggested-job-titles">
            {suggestedTitles.map((t, i) => (
              <option key={i} value={t} />
            ))}
          </datalist>
          {errors.position && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.position}</p>}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {suggestedTitles.slice(0, 4).map((title, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, position: title });
                  if (errors.position) {
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.position;
                      return c;
                    });
                  }
                }}
                className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              >
                + {title}
              </button>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🏢
            </div>
            <input
              type="text"
              name="company"
              placeholder="e.g. Google, Stripe, or Stealth Startup"
              value={formData.company || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.company
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.company && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.company}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Location
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              📍
            </div>
            <input
              type="text"
              name="location"
              placeholder="e.g. New York, NY (or Remote)"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Dates */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Start Date
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  📅
                </div>
                <input
                  type="text"
                  name="startDate"
                  placeholder="Jan 2021"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  className="w-full pl-8 pr-2.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                End Date
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  📅
                </div>
                <input
                  type="text"
                  name="endDate"
                  placeholder={formData.current ? 'Present' : 'Dec 2023'}
                  value={formData.current ? 'Present' : (formData.endDate || '')}
                  onChange={handleChange}
                  disabled={formData.current}
                  className={`w-full pl-8 pr-2.5 py-2.5 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                    errors.endDate
                      ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 hover:border-gray-400 bg-white focus:border-blue-600 focus:ring-blue-500/15'
                  } disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200`}
                />
              </div>
            </div>
          </div>
          {errors.endDate && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.endDate}</p>}
        </div>
      </div>

      {/* Currently Work Here Checkbox */}
      <div className="flex items-center gap-2 pt-0.5">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="current"
            checked={formData.current || false}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-xs font-medium text-gray-700">I currently work in this role</span>
        </label>
      </div>

      {/* Role Summary */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Role Summary (Optional Overview)
        </label>
        <textarea
          name="description"
          placeholder="High-level overview of team scope, core mission, or departments supported..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
        />
        {errors.description && <p className="text-red-600 text-xs mt-1.5 font-medium">⚠️ {errors.description}</p>}
      </div>

      {/* Key Achievements */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Key Achievements &amp; Metrics
          </label>
          <span className="text-[11px] text-gray-400">10-220 chars per bullet</span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. Accelerated API response times by 40% through Redis caching..."
              value={newAchievement}
              onChange={(e) => {
                setNewAchievement(e.target.value);
                if (achievementError) setAchievementError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              className={`w-full p-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                achievementError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={addAchievement}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-semibold shadow-xs"
          >
            Add Bullet
          </button>
        </div>

        {achievementError && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {achievementError}</p>
        )}
        {errors.achievements && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.achievements}</p>
        )}

        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowBulletTemplates(!showBulletTemplates);
                if (showActionVerbs) setShowActionVerbs(false);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1"
            >
              ✨ {showBulletTemplates ? 'Hide Templates' : 'Bullet Templates'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowActionVerbs(!showActionVerbs);
                if (showBulletTemplates) setShowBulletTemplates(false);
              }}
              className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1"
            >
              💡 {showActionVerbs ? 'Hide Verbs' : 'Action Verbs'}
            </button>
          </div>
          <span className={`text-[11px] ${newAchievement.length > 220 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            {newAchievement.length}/220
          </span>
        </div>

        {/* Bullet Templates Drawer */}
        {showBulletTemplates && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">
                Predefined Achievement Bullets for {currentTemplate.toUpperCase()}:
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Click to insert</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {suggestedBullets.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNewAchievement(b.template);
                    setShowBulletTemplates(false);
                    if (achievementError) setAchievementError(null);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-100 text-xs text-gray-800 transition-all block group"
                >
                  <span className="font-semibold text-blue-700 text-[10px] uppercase block tracking-wider mb-0.5 group-hover:underline">
                    {b.category}
                  </span>
                  <span>{b.template}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Verbs Drawer */}
        {showActionVerbs && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl mb-3">
            <p className="text-xs text-gray-700 mb-2 font-semibold">Click to prepend power verb:</p>
            <div className="flex flex-wrap gap-1">
              {ACTION_VERBS.slice(0, 24).map((verb, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertActionVerb(verb)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Added Bullet Points List */}
        <div className="space-y-2 mt-2">
          {(formData.achievements || []).map((ach, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 p-2.5 bg-gray-50/80 border border-gray-200 rounded-lg text-xs text-gray-800 group hover:border-gray-300 transition-all"
            >
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="flex-1 leading-relaxed">{ach}</span>
              <button
                type="button"
                onClick={() => removeAchievement(index)}
                className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
                title="Remove bullet"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Experience' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
