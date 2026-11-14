'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Experience } from '../../types/resume';
import { ACTION_VERBS } from '../../utils/ats';
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>💼</span> Work Experience
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
          >
            + Add Experience
          </button>
        )}
      </div>

      {experiences.map((exp, index) => (
        <div key={exp.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          {editingIndex === index ? (
            <ExperienceEditor
              experience={exp}
              onSave={(updated) => handleSave(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{exp.position || 'Position'}</h3>
                  <p className="text-gray-600">{exp.company || 'Company'}{exp.location ? ` • ${exp.location}` : ''}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate || 'Start'} - {exp.current ? 'Present' : (exp.endDate || 'End')}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDuplicate(index)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
          <h3 className="font-semibold text-gray-800 mb-3">Add New Work Experience</h3>
          <ExperienceEditor
            experience={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {experiences.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">No experience added yet. Click &quot;Add Experience&quot; to get started.</p>
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="position"
            placeholder="Software Engineer"
            value={formData.position || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              errors.position ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.position && <p className="text-red-500 text-xs mt-1">⚠️ {errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            placeholder="Acme Corp"
            value={formData.company || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              errors.company ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.company && <p className="text-red-500 text-xs mt-1">⚠️ {errors.company}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="San Francisco, CA"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="text"
              name="startDate"
              placeholder="Jan 2021"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="text"
              name="endDate"
              placeholder={formData.current ? 'Present' : 'Dec 2023'}
              value={formData.current ? 'Present' : (formData.endDate || '')}
              onChange={handleChange}
              disabled={formData.current}
              className={`w-full p-3 border rounded-lg focus:ring-2 ${
                errors.endDate ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
              } disabled:bg-gray-100 disabled:text-gray-500`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">⚠️ {errors.endDate}</p>}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          name="current"
          checked={formData.current || false}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-sm text-gray-700">I currently work here</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Summary</label>
        <textarea
          name="description"
          placeholder="Brief description of your overall role and impact..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">⚠️ {errors.description}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Key Achievements (Bullet Points)
          </label>
          <span className="text-xs text-gray-400">10-220 chars per bullet</span>
        </div>

        <div className="flex gap-2 mb-1">
          <input
            type="text"
            placeholder="e.g. Accelerated API response times by 40% through Redis caching..."
            value={newAchievement}
            onChange={(e) => {
              setNewAchievement(e.target.value);
              if (achievementError) setAchievementError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
            className={`flex-1 p-3 border rounded-lg focus:ring-2 ${
              achievementError ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            type="button"
            onClick={addAchievement}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add Bullet
          </button>
        </div>

        {achievementError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {achievementError}</p>
        )}
        {errors.achievements && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {errors.achievements}</p>
        )}

        <div className="flex items-center justify-between mt-2 mb-2">
          <button
            type="button"
            onClick={() => setShowActionVerbs(!showActionVerbs)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            💡 {showActionVerbs ? 'Hide Action Verbs' : 'Suggest Action Verbs'}
          </button>
          <span className={`text-xs ${newAchievement.length > 220 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            {newAchievement.length}/220
          </span>
        </div>

        {showActionVerbs && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
            <p className="text-xs text-gray-600 mb-2 font-medium">Click to insert strong action verb:</p>
            <div className="flex flex-wrap gap-1">
              {ACTION_VERBS.slice(0, 24).map((verb, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertActionVerb(verb)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 mt-2">
          {(formData.achievements || []).map((ach, index) => (
            <div key={index} className="flex items-start gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="flex-1 text-sm text-gray-800">{ach}</span>
              <button
                type="button"
                onClick={() => removeAchievement(index)}
                className="text-gray-400 hover:text-red-600 p-0.5"
                title="Remove bullet"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          {isNew ? 'Add Experience' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
