'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Project } from '../../types/resume';
import {
  hasHTML,
  isRequired,
  isValidURL,
  validateBullets,
  validateBullet,
  maxLength,
} from '../../utils/validation';

interface ProjectsFormProps {
  data: Project[];
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [projects, setProjects] = useState<Project[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const formattedData = data.map((proj, i) => ({
      ...proj,
      id: proj.id || Date.now().toString() + i,
      role: (proj as any).role || '',
      relevanceScore: (proj as any).relevanceScore || 0,
      highlights: (proj as any).highlights || [],
    }));
    setProjects(formattedData);
  }, [data]);

  const handleAdd = (proj: Project) => {
    const updated = [...projects, { ...proj, id: Date.now().toString() }];
    setProjects(updated);
    updateSection('projects', updated);
    setIsAdding(false);
  };

  const handleSave = (index: number, updatedProj: Project) => {
    const updated = [...projects];
    updated[index] = updatedProj;
    setProjects(updated);
    updateSection('projects', updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    updateSection('projects', updated);
  };

  const handleDuplicate = (index: number) => {
    const proj = projects[index];
    const duplicated = { ...proj, id: Date.now().toString() };
    const updated = [...projects, duplicated];
    setProjects(updated);
    updateSection('projects', updated);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🚀</span> Projects
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-xs"
          >
            + Add Project
          </button>
        )}
      </div>

      {projects.map((proj, index) => (
        <div key={proj.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          {editingIndex === index ? (
            <ProjectEditor
              project={proj}
              onSave={(updated) => handleSave(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{proj.name || 'Project Name'}</h3>
                  {proj.role && <p className="text-gray-600 text-sm">{proj.role}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
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

              {proj.description && (
                <p className="mt-2 text-sm text-gray-700">{proj.description}</p>
              )}

              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
                  {proj.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              )}

              {proj.link && (
                <a
                  href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-blue-600 hover:underline inline-block"
                >
                  🔗 {proj.link}
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
          <h3 className="font-semibold text-gray-800 mb-3">Add New Project</h3>
          <ProjectEditor
            project={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {projects.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">No projects added yet. Click &quot;Add Project&quot; to showcase your work.</p>
      )}
    </div>
  );
};

interface ProjectEditorProps {
  project: Partial<Project>;
  onSave: (proj: Project) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    role: '',
    description: '',
    technologies: [],
    highlights: [],
    link: '',
    ...project,
  });
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [highlightError, setHighlightError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

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

  const addTechnology = () => {
    const trimmed = techInput.trim();
    if (trimmed) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), trimmed],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter((_, i) => i !== index),
    });
  };

  const addHighlight = () => {
    const trimmed = highlightInput.trim();
    if (!trimmed) {
      setHighlightError('Please enter a highlight description before adding');
      return;
    }
    const val = validateBullet(trimmed, 10, 220);
    if (!val.valid) {
      setHighlightError(val.message || 'Invalid highlight bullet');
      return;
    }
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), trimmed],
    });
    setHighlightInput('');
    setHighlightError(null);
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.name as string)) newErrors.name = 'Project name is required';
    if (hasHTML(formData.name as string)) newErrors.name = 'Invalid characters in name';
    if (formData.description && !maxLength(formData.description, 1000)) newErrors.description = 'Description is too long (max 1000 chars)';
    if (formData.link && !isValidURL(formData.link)) newErrors.link = 'Enter a valid URL (e.g. https://github.com/...)';
    if (!validateBullets(formData.highlights, 10, 220)) {
      newErrors.highlights = 'Highlights must be 10-220 characters without HTML tags';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      name: (formData.name || '').trim(),
      role: (formData.role || '').trim(),
      description: (formData.description || '').trim(),
      technologies: formData.technologies || [],
      highlights: formData.highlights || [],
      link: (formData.link || '').trim(),
      relevanceScore: formData.relevanceScore || 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="E-commerce Analytics Platform"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 ${
              errors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
          <input
            type="text"
            name="role"
            placeholder="Lead Full-Stack Developer"
            value={formData.role || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Brief description of the project purpose, architecture, and scope..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">⚠️ {errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="e.g. Next.js, GraphQL, PostgreSQL"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Add Tech
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(formData.technologies || []).map((tech, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium">
              {tech}
              <button type="button" onClick={() => removeTechnology(index)} className="text-blue-500 hover:text-blue-800">✕</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Key Highlights / Features</label>
          <span className="text-xs text-gray-400">10-220 chars per bullet</span>
        </div>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            placeholder="e.g. Architected real-time WebSocket dashboard handling 10k concurrent users..."
            value={highlightInput}
            onChange={(e) => {
              setHighlightInput(e.target.value);
              if (highlightError) setHighlightError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            className={`flex-1 p-3 border rounded-lg focus:ring-2 ${
              highlightError ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            type="button"
            onClick={addHighlight}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Add
          </button>
        </div>

        {highlightError && <p className="text-red-500 text-xs mt-1">⚠️ {highlightError}</p>}
        {errors.highlights && <p className="text-red-500 text-xs mt-1">⚠️ {errors.highlights}</p>}

        <div className="space-y-2 mt-2">
          {(formData.highlights || []).map((hl, index) => (
            <div key={index} className="flex items-start gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-gray-400 mt-0.5">•</span>
              <span className="flex-1 text-sm text-gray-800">{hl}</span>
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="text-gray-400 hover:text-red-600 p-0.5"
                title="Remove highlight"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (optional)</label>
        <input
          type="url"
          name="link"
          placeholder="https://github.com/username/project"
          value={formData.link || ''}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 ${
            errors.link ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.link && <p className="text-red-500 text-xs mt-1">⚠️ {errors.link}</p>}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          {isNew ? 'Add Project' : 'Save Changes'}
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

export default ProjectsForm;
