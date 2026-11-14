'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { CustomSection } from '../../types/resume';
import { isRequired, isValidURL, validateBullets, maxLength } from '../../utils/validation';

interface CustomSectionFormProps {
  data: CustomSection;
  sectionId: string;
}

const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ data, sectionId }) => {
  const { updateCustomSection } = useResumeStore();
  const [section, setSection] = useState<CustomSection>(data);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    setSection({
      ...data,
      id: data.id || sectionId,
      title: data.title || 'Custom Section',
      items: data.items || [],
    });
  }, [data, sectionId]);

  const handleTitleChange = (newTitle: string) => {
    const updated = { ...section, title: newTitle };
    setSection(updated);
    updateCustomSection(sectionId, updated);
    setIsEditingTitle(false);
  };

  const handleAddItem = (item: CustomSection['items'][0]) => {
    const updatedItems = [...section.items, { ...item, id: Date.now().toString() }];
    const updated = { ...section, items: updatedItems };
    setSection(updated);
    updateCustomSection(sectionId, updated);
    setIsAddingItem(false);
  };

  const handleSaveItem = (index: number, updatedItem: CustomSection['items'][0]) => {
    const updatedItems = [...section.items];
    updatedItems[index] = updatedItem;
    const updated = { ...section, items: updatedItems };
    setSection(updated);
    updateCustomSection(sectionId, updated);
    setEditingItemIndex(null);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = section.items.filter((_, i) => i !== index);
    const updated = { ...section, items: updatedItems };
    setSection(updated);
    updateCustomSection(sectionId, updated);
  };

  return (
    <div className="space-y-4">
      {/* Subheader Bar with Editable Section Title */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue={section.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleChange((e.target as HTMLInputElement).value);
                  }
                }}
                onBlur={(e) => handleTitleChange(e.target.value)}
                autoFocus
                className="text-sm font-bold border-b-2 border-blue-500 outline-none px-1 text-gray-800"
              />
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 group"
              onClick={() => setIsEditingTitle(true)}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                📌 {section.title}
              </span>
              <span className="text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                (click to rename)
              </span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-0.5">
            Add custom items, initiatives, leadership roles, or domain-specific activities.
          </p>
        </div>

        {!isAddingItem && (
          <button
            type="button"
            onClick={() => setIsAddingItem(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <span>+</span> Add Item
          </button>
        )}
      </div>

      {/* Custom Items Cards List */}
      <div className="space-y-3">
        {section.items.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
          >
            {editingItemIndex === index ? (
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    ✏️ Edit Item
                  </span>
                </div>
                <CustomItemEditor
                  item={item}
                  onSave={(updated) => handleSaveItem(index, updated)}
                  onCancel={() => setEditingItemIndex(null)}
                />
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">{item.title || 'Untitled Item'}</h3>
                      {item.date && <span className="text-xs text-gray-500 font-medium">📅 {item.date}</span>}
                    </div>
                    {item.subtitle && <p className="text-xs font-medium text-gray-700 mt-0.5">{item.subtitle}</p>}
                    {item.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-2.5 space-y-1 text-xs text-gray-700">
                        {item.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span className="flex-1">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.link && (
                      <div className="mt-2 pt-1 border-t border-gray-50">
                        <a
                          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span>🔗</span> View Link
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingItemIndex(index)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
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
        ))}
      </div>

      {/* Add Item Box */}
      {isAddingItem && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add New Item
            </span>
          </div>
          <CustomItemEditor
            item={{}}
            onSave={handleAddItem}
            onCancel={() => setIsAddingItem(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {section.items.length === 0 && !isAddingItem && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">📌</div>
          <h4 className="text-sm font-semibold text-gray-800">No items in this section</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Add custom items, extracurriculars, volunteer work, or domain-specific highlights.
          </p>
          <button
            type="button"
            onClick={() => setIsAddingItem(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add First Item
          </button>
        </div>
      )}
    </div>
  );
};

interface CustomItemEditorProps {
  item: Partial<CustomSection['items'][0]>;
  onSave: (item: CustomSection['items'][0]) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const CustomItemEditor: React.FC<CustomItemEditorProps> = ({ item, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<Partial<CustomSection['items'][0]>>({
    title: '',
    subtitle: '',
    date: '',
    description: '',
    bullets: [],
    link: '',
    ...item,
  });
  const [bulletInput, setBulletInput] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [bulletError, setBulletError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const addBullet = () => {
    const trimmed = bulletInput.trim();
    if (!trimmed) {
      setBulletError('Please enter bullet content');
      return;
    }
    if (trimmed.length < 10) {
      setBulletError('Bullet must be at least 10 characters');
      return;
    }
    if (trimmed.length > 220) {
      setBulletError('Bullet cannot exceed 220 characters');
      return;
    }
    setFormData({
      ...formData,
      bullets: [...(formData.bullets || []), trimmed],
    });
    setBulletInput('');
    setBulletError(null);
  };

  const removeBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: (formData.bullets || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.title as string)) newErrors.title = 'Title is required';
    if (formData.link && !isValidURL(formData.link)) newErrors.link = 'Invalid URL';
    if (formData.description && !maxLength(formData.description, 1000)) newErrors.description = 'Description is too long (max 1000 characters)';
    if (!validateBullets(formData.bullets, 10, 220)) newErrors.bullets = 'Bullets must be 10-220 chars and plain text';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      title: (formData.title || '').trim(),
      subtitle: (formData.subtitle || '').trim(),
      date: (formData.date || '').trim(),
      description: (formData.description || '').trim(),
      bullets: formData.bullets || [],
      link: (formData.link || '').trim(),
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              📌
            </div>
            <input
              type="text"
              name="title"
              placeholder="e.g. Open Source Contributor"
              value={formData.title || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.title && <p className="text-red-600 text-xs mt-1.5 font-medium">⚠️ {errors.title}</p>}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Subtitle / Organization
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🏢
            </div>
            <input
              type="text"
              name="subtitle"
              placeholder="e.g. Apache Software Foundation"
              value={formData.subtitle || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Date / Duration
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              📅
            </div>
            <input
              type="text"
              name="date"
              placeholder="e.g. 2023 - Present"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Link */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Link (Optional)
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              🔗
            </div>
            <input
              type="url"
              name="link"
              placeholder="https://..."
              value={formData.link || ''}
              onChange={handleChange}
              className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.link
                  ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.link && <p className="text-red-600 text-xs mt-1.5 font-medium">⚠️ {errors.link}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Brief description of the initiative or role..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
        />
      </div>

      {/* Bullet Points */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Bullet Points
        </label>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            placeholder="Add a bullet point (10-220 characters)..."
            value={bulletInput}
            onChange={(e) => {
              setBulletInput(e.target.value);
              if (bulletError) setBulletError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
            className={`flex-1 p-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
              bulletError
                ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
            }`}
          />
          <button
            type="button"
            onClick={addBullet}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-xs"
          >
            Add Bullet
          </button>
        </div>

        {bulletError && <p className="text-red-600 text-xs mt-1 font-medium">⚠️ {bulletError}</p>}
        {errors.bullets && <p className="text-red-600 text-xs mt-1 font-medium">⚠️ {errors.bullets}</p>}

        <div className="space-y-2 mt-2">
          {(formData.bullets || []).map((bullet, index) => (
            <div key={index} className="flex items-start gap-2.5 p-2.5 bg-gray-50/80 border border-gray-200 rounded-lg text-xs text-gray-800 hover:border-gray-300 transition-all">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="flex-1 leading-relaxed">{bullet}</span>
              <button
                type="button"
                onClick={() => removeBullet(index)}
                className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Item' : 'Save Changes'}
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

export default CustomSectionForm;
