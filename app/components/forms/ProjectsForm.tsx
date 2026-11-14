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
import {
  POPULAR_TECH_STACKS,
  SUGGESTED_PROJECT_HIGHLIGHTS,
} from '../../utils/fieldSuggestions';

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
    <div className="space-y-4">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Showcase technical, entrepreneurial, or portfolio projects demonstrating real-world skills.
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <span>+</span> Add Project
          </button>
        )}
      </div>

      {/* Projects Cards List */}
      <div className="space-y-3">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
          >
            {editingIndex === index ? (
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    ✏️ Edit Project Details
                  </span>
                </div>
                <ProjectEditor
                  project={proj}
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
                        🚀 {proj.name || 'Untitled Project'}
                      </h3>
                      {proj.role && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {proj.role}
                        </span>
                      )}
                    </div>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-md border border-gray-200">
                            {tech}
                          </span>
                        ))}
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

                {proj.description && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {proj.highlights && proj.highlights.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {proj.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="flex-1">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {proj.link && (
                  <div className="mt-2.5 pt-1.5 border-t border-gray-50">
                    <a
                      href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>🔗</span> {proj.link}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Project Drawer / Box */}
      {isAdding && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add New Project
            </span>
          </div>
          <ProjectEditor
            project={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && !isAdding && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">🚀</div>
          <h4 className="text-sm font-semibold text-gray-800">No projects added yet</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Projects give recruiters proof of hands-on technical skills and end-to-end execution.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add First Project
          </button>
        </div>
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
  const [showHighlightTemplates, setShowHighlightTemplates] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const suggestedRoles = [
    'Lead Full-Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'DevOps Engineer',
    'Mobile App Developer',
    'UI/UX Designer',
  ];

  const addTechStack = (techs: string[]) => {
    const existing = formData.technologies || [];
    const merged = [...existing];
    techs.forEach((t) => {
      if (!merged.some((m) => m.toLowerCase() === t.toLowerCase())) {
        merged.push(t);
      }
    });
    setFormData({
      ...formData,
      technologies: merged,
    });
  };

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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Project Name <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🚀
            </div>
            <input
              type="text"
              name="name"
              placeholder="e.g. Distributed Task Orchestrator"
              value={formData.name || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.name && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.name}</p>}
        </div>

        {/* Your Role */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Your Role</label>
            <span className="text-[11px] text-gray-400">Suggestions</span>
          </div>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              💼
            </div>
            <input
              type="text"
              name="role"
              list="suggested-project-roles"
              placeholder="e.g. Lead Full-Stack Developer"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
          <datalist id="suggested-project-roles">
            {suggestedRoles.map((r, i) => (
              <option key={i} value={r} />
            ))}
          </datalist>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {suggestedRoles.slice(0, 4).map((role, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              >
                + {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Project Overview / Purpose
        </label>
        <textarea
          name="description"
          placeholder="Brief description of the problem solved, architectural overview, and target users..."
          value={formData.description || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-3 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
        />
        {errors.description && <p className="text-red-600 text-xs mt-1.5 font-medium">⚠️ {errors.description}</p>}
      </div>

      {/* Technologies Used */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Technologies &amp; Frameworks
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="e.g. Next.js, GraphQL, PostgreSQL"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            className="flex-1 p-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-all"
          >
            Add Tech
          </button>
        </div>

        {/* Quick stack presets */}
        <div className="mb-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1">
            ⚡ Quick-Add Stacks:
          </span>
          <div className="flex flex-wrap gap-1">
            {POPULAR_TECH_STACKS.map((stack, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addTechStack(stack.technologies)}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-medium"
              >
                + {stack.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(formData.technologies || []).map((tech, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-medium border border-blue-200">
              {tech}
              <button type="button" onClick={() => removeTechnology(index)} className="text-blue-500 hover:text-blue-900">✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Key Highlights / Features */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Key Highlights &amp; Accomplishments
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHighlightTemplates(!showHighlightTemplates)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1"
            >
              ✨ {showHighlightTemplates ? 'Hide Templates' : 'Bullet Templates'}
            </button>
            <span className="text-xs text-gray-400">10-220 chars</span>
          </div>
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
            className={`flex-1 p-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
              highlightError
                ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
            }`}
          />
          <button
            type="button"
            onClick={addHighlight}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-semibold shadow-xs"
          >
            Add
          </button>
        </div>

        {highlightError && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {highlightError}</p>}
        {errors.highlights && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.highlights}</p>}

        {showHighlightTemplates && (
          <div className="mt-2 mb-2 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900 block">Predefined Project Highlight Templates:</span>
              <span className="text-[11px] text-blue-600 font-medium">Click to load into input</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {SUGGESTED_PROJECT_HIGHLIGHTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setHighlightInput(item.template);
                    if (highlightError) setHighlightError(null);
                  }}
                  className="text-left p-2.5 rounded-lg bg-white hover:bg-blue-100 border border-blue-100 text-gray-800 transition-colors"
                >
                  <span className="font-medium text-blue-700 block text-[10px] uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span>{item.template}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 mt-2">
          {(formData.highlights || []).map((hl, index) => (
            <div key={index} className="flex items-start gap-2.5 p-2.5 bg-gray-50/80 border border-gray-200 rounded-lg text-xs text-gray-800 hover:border-gray-300 transition-all">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="flex-1 leading-relaxed">{hl}</span>
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
                title="Remove highlight"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Project Link */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Project URL or GitHub Link (Optional)
        </label>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
            🔗
          </div>
          <input
            type="url"
            name="link"
            placeholder="https://github.com/username/project"
            value={formData.link || ''}
            onChange={handleChange}
            className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
              errors.link
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
            }`}
          />
        </div>
        {errors.link && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.link}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Project' : 'Save Changes'}
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

export default ProjectsForm;
