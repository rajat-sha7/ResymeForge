'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Certification } from '../../types/resume';

interface CertificationsFormProps {
  data: Certification[];
}

const POPULAR_CERTIFICATIONS = {
  technical: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services' },
    { name: 'Google Cloud Professional Cloud Architect', issuer: 'Google Cloud' },
    { name: 'Microsoft Azure Solutions Architect Expert', issuer: 'Microsoft' },
    { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Cloud Native Computing Foundation' },
    { name: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp' },
  ],
  development: [
    { name: 'Meta Front-End Developer', issuer: 'Meta' },
    { name: 'Meta Back-End Developer', issuer: 'Meta' },
    { name: 'Google UX Design Professional', issuer: 'Google' },
    { name: 'Oracle Certified Professional, Java SE Developer', issuer: 'Oracle' },
    { name: 'Microsoft Certified: Azure Developer Associate', issuer: 'Microsoft' },
  ],
  data: [
    { name: 'Google Data Analytics Professional', issuer: 'Google' },
    { name: 'IBM Data Science Professional', issuer: 'IBM' },
    { name: 'AWS Certified Data Analytics', issuer: 'Amazon Web Services' },
    { name: 'Tableau Desktop Specialist', issuer: 'Tableau' },
    { name: 'Databricks Certified Data Engineer', issuer: 'Databricks' },
  ],
  security: [
    { name: 'CompTIA Security+', issuer: 'CompTIA' },
    { name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC²' },
    { name: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council' },
    { name: 'AWS Certified Security - Specialty', issuer: 'Amazon Web Services' },
  ],
  management: [
    { name: 'Project Management Professional (PMP)', issuer: 'PMI' },
    { name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance' },
    { name: 'ITIL 4 Foundation', issuer: 'Axelos' },
    { name: 'Six Sigma Green Belt', issuer: 'ASQ' },
  ],
};

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [certifications, setCertifications] = useState<Certification[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('technical');

  useEffect(() => {
    const formattedData = data.map((cert, i) => ({
      ...cert,
      id: cert.id || Date.now().toString() + i,
      expiryDate: (cert as any).expiryDate || '',
      credentialId: (cert as any).credentialId || '',
    }));
    setCertifications(formattedData);
  }, [data]);

  const handleAdd = (cert: Certification) => {
    const updated = [...certifications, { ...cert, id: Date.now().toString() }];
    setCertifications(updated);
    updateSection('certifications', updated);
    setIsAdding(false);
  };

  const handleQuickAdd = (suggestion: { name: string; issuer: string }) => {
    const cert: Certification = {
      id: Date.now().toString(),
      name: suggestion.name,
      issuer: suggestion.issuer,
      date: '',
      expiryDate: '',
      credentialId: '',
      link: '',
    };
    const updated = [...certifications, cert];
    setCertifications(updated);
    updateSection('certifications', updated);
    setShowSuggestions(false);
  };

  const handleSave = (index: number, updatedCert: Certification) => {
    const updated = [...certifications];
    updated[index] = updatedCert;
    setCertifications(updated);
    updateSection('certifications', updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index);
    setCertifications(updated);
    updateSection('certifications', updated);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>📜</span> Certifications
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            💡 Quick Add
          </button>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Add Certification
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.keys(POPULAR_CERTIFICATIONS).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {POPULAR_CERTIFICATIONS[selectedCategory as keyof typeof POPULAR_CERTIFICATIONS].map((cert, i) => (
              <button
                key={i}
                onClick={() => handleQuickAdd(cert)}
                className="p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-sm">{cert.name}</p>
                <p className="text-xs text-gray-500">{cert.issuer}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {certifications.map((cert, index) => (
        <div key={cert.id} className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          {editingIndex === index ? (
            <CertificationEditor
              certification={cert}
              onSave={(updated) => handleSave(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{cert.name || 'Certification Name'}</h3>
                  <p className="text-gray-600">{cert.issuer || 'Issuer'}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    {cert.date && <span>Issued: {cert.date}</span>}
                    {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                  </div>
                  {cert.credentialId && (
                    <p className="text-xs text-gray-400 mt-1">ID: {cert.credentialId}</p>
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
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                  🔗 View Credential
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Add New Certification</h3>
          <CertificationEditor
            certification={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {certifications.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">No certifications added yet. Click "Add Certification" or use "Quick Add" to get started.</p>
      )}
    </div>
  );
};

interface CertificationEditorProps {
  certification: Partial<Certification>;
  onSave: (cert: Certification) => void;
  onCancel: () => void;
  isNew?: boolean;
}

import { isRequired, isValidURL, maxLength } from '../../utils/validation';

const CertificationEditor: React.FC<CertificationEditorProps> = ({ certification, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
    link: '',
    ...certification,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleSave = () => {
    const newErrors: { [k: string]: string } = {};
    if (!isRequired(formData.name as string)) newErrors.name = 'Certification name is required';
    if (!isRequired(formData.issuer as string)) newErrors.issuer = 'Issuer is required';
    if (formData.link && !isValidURL(formData.link)) newErrors.link = 'Invalid URL';
    if (formData.credentialId && !maxLength(formData.credentialId, 100)) newErrors.credentialId = 'ID too long';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      name: formData.name || '',
      issuer: formData.issuer || '',
      date: formData.date || '',
      expiryDate: formData.expiryDate || '',
      credentialId: formData.credentialId || '',
      link: formData.link || '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
          <input
            type="text"
            name="name"
            placeholder="AWS Certified Solutions Architect"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
          <input
            type="text"
            name="issuer"
            placeholder="Amazon Web Services"
            value={formData.issuer || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.issuer && <p className="text-red-500 text-xs mt-1">{errors.issuer}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input
            type="text"
            name="date"
            placeholder="Jan 2024"
            value={formData.date || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (if applicable)</label>
          <input
            type="text"
            name="expiryDate"
            placeholder="Jan 2027 or 'No Expiration'"
            value={formData.expiryDate || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
          <input
            type="text"
            name="credentialId"
            placeholder="ABC123XYZ"
            value={formData.credentialId || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
          <input
            type="url"
            name="link"
            placeholder="https://www.credly.com/badges/..."
            value={formData.link || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isNew ? 'Add Certification' : 'Save Changes'}
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

export default CertificationsForm;