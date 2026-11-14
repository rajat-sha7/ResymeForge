'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Achievement } from '../../types/resume';
import { isRequired, maxLength } from '../../utils/validation';

interface AchievementsFormProps {
  data: Achievement[];
}

const ACHIEVEMENT_CATEGORIES = [
  { value: 'award', label: '🏆 Award', color: 'yellow' },
  { value: 'recognition', label: '⭐ Recognition', color: 'blue' },
  { value: 'publication', label: '📄 Publication', color: 'green' },
  { value: 'patent', label: '💡 Patent', color: 'purple' },
  { value: 'speaking', label: '🎤 Speaking', color: 'pink' },
  { value: 'volunteer', label: '🤝 Volunteer', color: 'teal' },
  { value: 'competition', label: '🏅 Competition', color: 'orange' },
  { value: 'other', label: '📌 Other', color: 'gray' },
];

const AchievementsForm: React.FC<AchievementsFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [achievements, setAchievements] = useState<Achievement[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const formattedData = data.map((ach, i) => ({
      ...ach,
      id: ach.id || Date.now().toString() + i,
      category: (ach as any).category || 'other',
      impact: (ach as any).impact || '',
    }));
    setAchievements(formattedData);
  }, [data]);

  const handleAdd = (ach: Achievement) => {
    const updated = [...achievements, { ...ach, id: Date.now().toString() }];
    setAchievements(updated);
    updateSection('achievements', updated);
    setIsAdding(false);
  };

  const handleSave = (index: number, updatedAch: Achievement) => {
    const updated = [...achievements];
    updated[index] = updatedAch;
    setAchievements(updated);
    updateSection('achievements', updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    updateSection('achievements', updated);
  };

  const getCategoryInfo = (category: string) => {
    return ACHIEVEMENT_CATEGORIES.find(c => c.value === category) || ACHIEVEMENT_CATEGORIES[7];
  };

  return (
    <div className="space-y-4">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Honors, patents, published articles, keynote speeches, or standout recognitions.
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <span>+</span> Add Achievement
          </button>
        )}
      </div>

      {/* Achievements Cards List */}
      <div className="space-y-3">
        {achievements.map((ach, index) => {
          const categoryInfo = getCategoryInfo(ach.category || 'other');
          return (
            <div
              key={ach.id}
              className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
            >
              {editingIndex === index ? (
                <div className="p-5 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      ✏️ Edit Achievement
                    </span>
                  </div>
                  <AchievementEditor
                    achievement={ach}
                    onSave={(updated) => handleSave(index, updated)}
                    onCancel={() => setEditingIndex(null)}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {categoryInfo.label}
                        </span>
                        {ach.date && <span className="text-xs text-gray-500 font-medium">📅 {ach.date}</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{ach.title || 'Untitled Achievement'}</h3>
                      {ach.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{ach.description}</p>}
                      {ach.impact && (
                        <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md w-fit">
                          <span>💪</span>
                          <span>Impact: {ach.impact}</span>
                        </div>
                      )}
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
                        onClick={() => handleDelete(index)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Achievement Drawer / Box */}
      {isAdding && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add New Achievement
            </span>
          </div>
          <AchievementEditor
            achievement={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {achievements.length === 0 && !isAdding && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="text-sm font-semibold text-gray-800">No achievements recorded</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Highlighting special honors, patents, or awards helps you stand out from other candidates.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add Achievement
          </button>
        </div>
      )}
    </div>
  );
};

interface AchievementEditorProps {
  achievement: Partial<Achievement>;
  onSave: (ach: Achievement) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const AchievementEditor: React.FC<AchievementEditorProps> = ({ achievement, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: '',
    description: '',
    date: '',
    category: 'other',
    impact: '',
    ...achievement,
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.title as string)) newErrors.title = 'Achievement title is required';
    if (formData.description && !maxLength(formData.description, 1000)) newErrors.description = 'Description is too long (max 1000 characters)';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      title: (formData.title || '').trim(),
      description: (formData.description || '').trim(),
      date: (formData.date || '').trim(),
      category: formData.category || 'other',
      impact: (formData.impact || '').trim(),
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Achievement / Award Title <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🏆
            </div>
            <input
              type="text"
              name="title"
              placeholder="e.g. Employee of the Year or First Place Hackathon"
              value={formData.title || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.title && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Category
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              ⭐
            </div>
            <select
              name="category"
              value={formData.category || 'other'}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 text-gray-700"
            >
              {ACHIEVEMENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Year / Date
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              📅
            </div>
            <input
              type="text"
              name="date"
              placeholder="e.g. 2024 or Nov 2023"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Description &amp; Context
        </label>
        <textarea
          name="description"
          placeholder="Describe the competitive criteria, scope, or background of this recognition..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
        />
      </div>

      {/* Impact */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Quantifiable Impact (Optional)
          </label>
          <span className="text-[11px] text-gray-400">e.g. &quot;Selected top 1% out of 500 applicants&quot;</span>
        </div>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
            💪
          </div>
          <input
            type="text"
            name="impact"
            placeholder="e.g. Led to $50K research grant or 30% speedup"
            value={formData.impact || ''}
            onChange={handleChange}
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Achievement' : 'Save Changes'}
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

export default AchievementsForm;