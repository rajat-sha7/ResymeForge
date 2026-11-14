'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Education } from '../../types/resume';
import { isRequired, maxLength, validateDateSequence, validateGPA } from '../../utils/validation';
import {
  SUGGESTED_FIELDS_OF_STUDY,
  SUGGESTED_COURSEWORK_BY_DOMAIN,
  SUGGESTED_HONORS,
} from '../../utils/fieldSuggestions';

interface EducationFormProps {
  data: Education[];
}

const EducationForm: React.FC<EducationFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [educations, setEducations] = useState<Education[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const formattedData = data.map((edu, i) => ({
      ...edu,
      id: edu.id || Date.now().toString() + i,
      location: (edu as any).location || '',
      coursework: (edu as any).coursework || [],
      honors: (edu as any).honors || [],
    }));
    setEducations(formattedData);
  }, [data]);

  const handleAdd = (edu: Education) => {
    const updated = [...educations, { ...edu, id: Date.now().toString() }];
    setEducations(updated);
    updateSection('education', updated);
    setIsAdding(false);
  };

  const handleSave = (index: number, updatedEdu: Education) => {
    const updated = [...educations];
    updated[index] = updatedEdu;
    setEducations(updated);
    updateSection('education', updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated);
    updateSection('education', updated);
  };

  return (
    <div className="space-y-4">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Degrees, academic institutions, relevant coursework, and honors.
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            <span>+</span> Add Education
          </button>
        )}
      </div>

      {/* Education Cards List */}
      <div className="space-y-3">
        {educations.map((edu, index) => (
          <div
            key={edu.id}
            className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
          >
            {editingIndex === index ? (
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    ✏️ Edit Academic Degree
                  </span>
                </div>
                <EducationEditor
                  education={edu}
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
                        {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      {edu.gpa && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                      <span className="font-medium text-gray-800">🏛️ {edu.institution || 'Institution'}</span>
                      {edu.location && <span>📍 {edu.location}</span>}
                      <span className="text-gray-500">
                        📅 {edu.startDate || 'Start'} – {edu.endDate || 'End'}
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
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                      Relevant Coursework:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {edu.coursework.map((c, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.honors && edu.honors.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1">
                      Honors &amp; Awards:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {edu.honors.map((h, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium flex items-center gap-1">
                          🏆 {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Education Drawer / Box */}
      {isAdding && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add Academic Degree
            </span>
          </div>
          <EducationEditor
            education={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {educations.length === 0 && !isAdding && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">🎓</div>
          <h4 className="text-sm font-semibold text-gray-800">No education entries yet</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Add your degrees, colleges/universities, honors, or recent certifications.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add Education
          </button>
        </div>
      )}
    </div>
  );
};

interface EducationEditorProps {
  education: Partial<Education>;
  onSave: (edu: Education) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const EducationEditor: React.FC<EducationEditorProps> = ({ education, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    coursework: [],
    honors: [],
    ...education,
  });
  const [courseInput, setCourseInput] = useState('');
  const [honorInput, setHonorInput] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const addCoursework = () => {
    const trimmed = courseInput.trim();
    if (trimmed) {
      setFormData({
        ...formData,
        coursework: [...(formData.coursework || []), trimmed],
      });
      setCourseInput('');
    }
  };

  const removeCoursework = (index: number) => {
    setFormData({
      ...formData,
      coursework: (formData.coursework || []).filter((_, i) => i !== index),
    });
  };

  const addHonor = () => {
    const trimmed = honorInput.trim();
    if (trimmed) {
      setFormData({
        ...formData,
        honors: [...(formData.honors || []), trimmed],
      });
      setHonorInput('');
    }
  };

  const removeHonor = (index: number) => {
    setFormData({
      ...formData,
      honors: (formData.honors || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.institution as string)) newErrors.institution = 'Institution is required';
    if (!isRequired(formData.degree as string)) newErrors.degree = 'Degree is required';
    if (formData.field && !maxLength(formData.field, 200)) newErrors.field = 'Field of study is too long';

    if (formData.startDate && formData.endDate) {
      const dateCheck = validateDateSequence(formData.startDate, formData.endDate);
      if (!dateCheck.valid) {
        newErrors.endDate = dateCheck.message || 'End date cannot be earlier than start date';
      }
    }

    if (formData.gpa) {
      const gpaCheck = validateGPA(formData.gpa);
      if (!gpaCheck.valid) {
        newErrors.gpa = gpaCheck.message || 'Enter a valid GPA';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      institution: (formData.institution || '').trim(),
      degree: (formData.degree || '').trim(),
      field: (formData.field || '').trim(),
      location: (formData.location || '').trim(),
      startDate: (formData.startDate || '').trim(),
      endDate: (formData.endDate || '').trim(),
      gpa: (formData.gpa || '').trim(),
      coursework: formData.coursework || [],
      honors: formData.honors || [],
    });
  };

  const degreeOptions = [
    'High School Diploma',
    'Associate of Arts (AA)',
    'Associate of Science (AS)',
    'Bachelor of Arts (BA)',
    'Bachelor of Science (BS)',
    'Bachelor of Engineering (BE)',
    'Bachelor of Technology (BTech)',
    'Master of Arts (MA)',
    'Master of Science (MS)',
    'Master of Business Administration (MBA)',
    'Master of Engineering (ME)',
    'Master of Technology (MTech)',
    'Doctor of Philosophy (PhD)',
    'Juris Doctor (JD)',
    'Doctor of Medicine (MD)',
    'Other',
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Institution */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Institution Name <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🏛️
            </div>
            <input
              type="text"
              name="institution"
              placeholder="e.g. Stanford University or MIT"
              value={formData.institution || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.institution
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.institution && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.institution}</p>}
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
              placeholder="e.g. Stanford, CA"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Degree */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Degree Level <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🎓
            </div>
            <select
              name="degree"
              value={formData.degree || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.degree
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            >
              <option value="">Select Degree Type</option>
              {degreeOptions.map((deg) => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
          </div>
          {errors.degree && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.degree}</p>}
        </div>

        {/* Field of Study */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Field of Study / Major
            </label>
            <span className="text-[11px] text-gray-400">Suggestions</span>
          </div>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              📚
            </div>
            <input
              type="text"
              name="field"
              list="suggested-fields-of-study"
              placeholder="e.g. Computer Science"
              value={formData.field || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
          <datalist id="suggested-fields-of-study">
            {SUGGESTED_FIELDS_OF_STUDY.map((f, i) => (
              <option key={i} value={f} />
            ))}
          </datalist>
          {errors.field && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.field}</p>}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {['Computer Science', 'Data Science', 'Software Engineering', 'MBA'].map((field, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, field });
                  if (errors.field) {
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.field;
                      return c;
                    });
                  }
                }}
                className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              >
                + {field}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Start Date
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              📅
            </div>
            <input
              type="text"
              name="startDate"
              placeholder="Aug 2018"
              value={formData.startDate || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Graduation / End Date
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              📅
            </div>
            <input
              type="text"
              name="endDate"
              placeholder="May 2022"
              value={formData.endDate || ''}
              onChange={handleChange}
              className={`w-full pl-9 pr-3.5 py-2.5 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.endDate
                  ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 hover:border-gray-400 bg-white focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.endDate && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.endDate}</p>}
        </div>

        {/* GPA */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            GPA (Optional - recommend only if &gt;= 3.5)
          </label>
          <div className="relative rounded-lg max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              ⭐
            </div>
            <input
              type="text"
              name="gpa"
              placeholder="e.g. 3.8 / 4.0"
              value={formData.gpa || ''}
              onChange={handleChange}
              className={`w-full pl-9 pr-3.5 py-2.5 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.gpa
                  ? 'border-red-400 bg-red-50/15 text-red-900 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 hover:border-gray-400 bg-white focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.gpa && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.gpa}</p>}
        </div>
      </div>

      {/* Relevant Coursework */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Relevant Coursework
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="e.g. Distributed Systems, Algorithms"
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCoursework())}
            className="flex-1 p-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
          />
          <button
            type="button"
            onClick={addCoursework}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-all"
          >
            Add Course
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {(formData.coursework || []).map((course, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium">
              {course}
              <button type="button" onClick={() => removeCoursework(index)} className="text-gray-400 hover:text-red-600">✕</button>
            </span>
          ))}
        </div>

        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1">Suggested Coursework:</span>
          <div className="flex flex-wrap gap-1">
            {[
              ...SUGGESTED_COURSEWORK_BY_DOMAIN.technical.slice(0, 6),
              ...SUGGESTED_COURSEWORK_BY_DOMAIN.business.slice(0, 3),
              ...SUGGESTED_COURSEWORK_BY_DOMAIN.general.slice(0, 2),
            ]
              .filter((course) => !(formData.coursework || []).includes(course))
              .map((course, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      coursework: [...(formData.coursework || []), course],
                    });
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                >
                  + {course}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Honors & Awards */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
          Honors &amp; Academic Awards
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="e.g. Dean's List, Summa Cum Laude"
            value={honorInput}
            onChange={(e) => setHonorInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHonor())}
            className="flex-1 p-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
          />
          <button
            type="button"
            onClick={addHonor}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition-all"
          >
            Add Honor
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {(formData.honors || []).map((honor, index) => (
            <span key={index} className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium">
              🏆 {honor}
              <button type="button" onClick={() => removeHonor(index)} className="text-yellow-600 hover:text-yellow-900">✕</button>
            </span>
          ))}
        </div>

        <div>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1">Suggested Honors &amp; Awards:</span>
          <div className="flex flex-wrap gap-1">
            {SUGGESTED_HONORS
              .filter((honor) => !(formData.honors || []).includes(honor))
              .slice(0, 6)
              .map((honor, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      honors: [...(formData.honors || []), honor],
                    });
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                >
                  + {honor}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Education' : 'Save Changes'}
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

export default EducationForm;
