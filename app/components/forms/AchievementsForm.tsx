'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Achievement } from '../../types/resume';

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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🏆</span> Achievements & Awards
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Achievement
          </button>
        )}
      </div>

      {achievements.map((ach, index) => {
        const categoryInfo = getCategoryInfo(ach.category || 'other');
        return (
          <div key={ach.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            {editingIndex === index ? (
              <AchievementEditor
                achievement={ach}
                onSave={(updated) => handleSave(index, updated)}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700`}>
                        {categoryInfo.label}
                      </span>
                      {ach.date && <span className="text-sm text-gray-500">{ach.date}</span>}
                    </div>
                    <h3 className="font-semibold text-lg">{ach.title || 'Achievement Title'}</h3>
                    {ach.description && <p className="text-sm text-gray-700 mt-1">{ach.description}</p>}
                    {ach.impact && (
                      <p className="text-sm text-green-600 mt-1 font-medium">
                        💪 Impact: {ach.impact}
                      </p>
                    )}
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
                      onClick={() => handleDelete(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
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

      {isAdding && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Add New Achievement</h3>
          <AchievementEditor
            achievement={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {achievements.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">No achievements added yet. Click "Add Achievement" to get started.</p>
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

import { isRequired, maxLength } from '../../utils/validation';

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
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.title as string)) newErrors.title = 'Title is required';
    if (formData.description && !maxLength(formData.description, 1000)) newErrors.description = 'Description too long';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      date: formData.date || '',
      category: formData.category || 'other',
      impact: formData.impact || '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Employee of the Year Award"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category || 'other'}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {ACHIEVEMENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="text"
            name="date"
            placeholder="2024"
            value={formData.date || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Describe the achievement and context..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Impact (quantifiable results)
          <span className="text-gray-400 text-xs ml-2">e.g., "Saved $50K annually" or "Improved efficiency by 30%"</span>
        </label>
        <input
          type="text"
          name="impact"
          placeholder="Led to 25% increase in team productivity"
          value={formData.impact || ''}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isNew ? 'Add Achievement' : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AchievementsForm;