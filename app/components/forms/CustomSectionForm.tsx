'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { CustomSection } from '../../types/resume';

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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
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
              className="text-xl font-semibold border-b-2 border-blue-500 outline-none px-1"
            />
          </div>
        ) : (
          <h2
            className="text-xl font-semibold flex items-center gap-2 cursor-pointer hover:text-blue-600 group"
            onClick={() => setIsEditingTitle(true)}
          >
            <span>📝</span> {section.title}
            <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              (click to edit)
            </span>
          </h2>
        )}
        {!isAddingItem && (
          <button
            onClick={() => setIsAddingItem(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>

      {section.items.map((item, index) => (
        <div key={item.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          {editingItemIndex === index ? (
            <CustomItemEditor
              item={item}
              onSave={(updated) => handleSaveItem(index, updated)}
              onCancel={() => setEditingItemIndex(null)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{item.title || 'Item Title'}</h3>
                    {item.date && <span className="text-sm text-gray-500">• {item.date}</span>}
                  </div>
                  {item.subtitle && <p className="text-gray-600">{item.subtitle}</p>}
                  {item.description && <p className="text-sm text-gray-700 mt-1">{item.description}</p>}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {item.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                    >
                      🔗 View Link
                    </a>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => setEditingItemIndex(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
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
      ))}

      {isAddingItem && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Add New Item</h3>
          <CustomItemEditor
            item={{}}
            onSave={handleAddItem}
            onCancel={() => setIsAddingItem(false)}
            isNew
          />
        </div>
      )}

      {section.items.length === 0 && !isAddingItem && (
        <p className="text-gray-500 text-center py-8">
          No items in this section yet. Click "Add Item" to get started.
        </p>
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

import { isRequired, isValidURL, validateBullets, maxLength } from '../../utils/validation';

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Item title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            placeholder="Organization, location, etc."
            value={formData.subtitle || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="text"
            name="date"
            placeholder="2024 or Jan 2024 - Present"
            value={formData.date || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
          <input
            type="url"
            name="link"
            placeholder="https://..."
            value={formData.link || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Brief description..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points</label>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            placeholder="Add a bullet point..."
            value={bulletInput}
            onChange={(e) => {
              setBulletInput(e.target.value);
              if (bulletError) setBulletError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addBullet}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        {bulletError && <p className="text-red-500 text-xs mt-1 mb-2">⚠️ {bulletError}</p>}
        {errors.bullets && <p className="text-red-500 text-xs mt-1 mb-2">⚠️ {errors.bullets}</p>}
        <div className="space-y-2">
          {(formData.bullets || []).map((bullet, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-400">•</span>
              <span className="flex-1 text-sm">{bullet}</span>
              <button
                onClick={() => removeBullet(index)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isNew ? 'Add Item' : 'Save Changes'}
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

export default CustomSectionForm;
