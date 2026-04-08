'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Education } from '../../types/resume';

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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🎓</span> Education
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Education
          </button>
        )}
      </div>

      {educations.map((edu, index) => (
        <div key={edu.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          {editingIndex === index ? (
            <EducationEditor
              education={edu}
              onSave={(updated) => handleSave(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{edu.degree || 'Degree'} in {edu.field || 'Field'}</h3>
                  <p className="text-gray-600">{edu.institution || 'Institution'}{edu.location ? ` • ${edu.location}` : ''}</p>
                  <p className="text-sm text-gray-500">{edu.startDate || 'Start'} - {edu.endDate || 'End'}</p>
                  {edu.gpa && <p className="text-sm text-green-600 font-medium">GPA: {edu.gpa}</p>}
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
              {edu.coursework && edu.coursework.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Relevant Coursework: </span>
                  <span className="text-sm text-gray-700">{edu.coursework.join(', ')}</span>
                </div>
              )}
              {edu.honors && edu.honors.length > 0 && (
                <div className="mt-1">
                  <span className="text-sm text-gray-500">Honors: </span>
                  <span className="text-sm text-gray-700">{edu.honors.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Add New Education</h3>
          <EducationEditor
            education={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {educations.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">No education added yet. Click "Add Education" to get started.</p>
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

import { isRequired, maxLength } from '../../utils/validation';

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
  };

  const addCoursework = () => {
    if (courseInput.trim()) {
      setFormData({
        ...formData,
        coursework: [...(formData.coursework || []), courseInput.trim()],
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
    if (honorInput.trim()) {
      setFormData({
        ...formData,
        honors: [...(formData.honors || []), honorInput.trim()],
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
    if (formData.field && !maxLength(formData.field, 200)) newErrors.field = 'Field is too long';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      institution: formData.institution || '',
      degree: formData.degree || '',
      field: formData.field || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      gpa: formData.gpa || '',
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
          <input
            type="text"
            name="institution"
            placeholder="Stanford University"
            value={formData.institution || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Stanford, CA"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
          <select
            name="degree"
            value={formData.degree || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Degree</option>
            {degreeOptions.map((deg) => (
              <option key={deg} value={deg}>{deg}</option>
            ))}
          </select>
          {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
          <input
            type="text"
            name="field"
            placeholder="Computer Science"
            value={formData.field || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="text"
            name="startDate"
            placeholder="Aug 2018"
            value={formData.startDate || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="text"
            name="endDate"
            placeholder="May 2022"
            value={formData.endDate || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPA (optional)</label>
          <input
            type="text"
            name="gpa"
            placeholder="3.8/4.0"
            value={formData.gpa || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Coursework</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Data Structures, Algorithms, etc."
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCoursework()}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCoursework}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.coursework || []).map((course, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              {course}
              <button onClick={() => removeCoursework(index)} className="text-gray-500 hover:text-gray-700">×</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Honors & Awards</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Dean's List, Summa Cum Laude, etc."
            value={honorInput}
            onChange={(e) => setHonorInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHonor()}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addHonor}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.honors || []).map((honor, index) => (
            <span key={index} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              🏆 {honor}
              <button onClick={() => removeHonor(index)} className="text-yellow-600 hover:text-yellow-800">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isNew ? 'Add Education' : 'Save Changes'}
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

export default EducationForm;