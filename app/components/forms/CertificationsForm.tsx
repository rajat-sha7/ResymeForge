'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Certification } from '../../types/resume';
import { isRequired, isValidURL, maxLength } from '../../utils/validation';

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
    <div className="space-y-4">
      {/* Subheader Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500">
            Professional licenses, vendor credentials, and accredited course completions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
          >
            <span>💡</span> Quick Add Popular
          </button>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
            >
              <span>+</span> Add Certification
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Suggestions Drawer */}
      {showSuggestions && (
        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Popular Industry Credentials (Click to Add)
            </span>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {Object.keys(POPULAR_CERTIFICATIONS).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
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
                type="button"
                onClick={() => handleQuickAdd(cert)}
                className="p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-400 hover:shadow-xs transition-all group"
              >
                <p className="font-semibold text-xs text-gray-900 group-hover:text-blue-700">{cert.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{cert.issuer}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Cards List */}
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="border border-gray-200 hover:border-gray-300 rounded-xl bg-white transition-all shadow-2xs overflow-hidden"
          >
            {editingIndex === index ? (
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    ✏️ Edit Certification
                  </span>
                </div>
                <CertificationEditor
                  certification={cert}
                  onSave={(updated) => handleSave(index, updated)}
                  onCancel={() => setEditingIndex(null)}
                />
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">
                      📜 {cert.name || 'Untitled Certification'}
                    </h3>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">🏛️ {cert.issuer || 'Issuer'}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1.5 flex-wrap">
                      {cert.date && <span>📅 Issued: {cert.date}</span>}
                      {cert.expiryDate && <span>⌛ Expires: {cert.expiryDate}</span>}
                      {cert.credentialId && (
                        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          ID: {cert.credentialId}
                        </span>
                      )}
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

                {cert.link && (
                  <div className="mt-2 pt-1 border-t border-gray-50">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>🔗</span> View Official Credential
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Certification Drawer / Box */}
      {isAdding && (
        <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              ➕ Add New Certification
            </span>
          </div>
          <CertificationEditor
            certification={{}}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </div>
      )}

      {/* Empty State */}
      {certifications.length === 0 && !isAdding && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <div className="text-3xl mb-2">📜</div>
          <h4 className="text-sm font-semibold text-gray-800">No certifications added</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Adding verified certifications (AWS, PMP, Google, Meta) improves recruiter credibility.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            + Add Certification
          </button>
        </div>
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

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!isRequired(formData.name as string)) newErrors.name = 'Certification name is required';
    if (!isRequired(formData.issuer as string)) newErrors.issuer = 'Issuing organization is required';
    if (formData.link && !isValidURL(formData.link)) newErrors.link = 'Enter a valid URL (e.g. https://credly.com/...)';
    if (formData.credentialId && !maxLength(formData.credentialId, 100)) newErrors.credentialId = 'ID is too long (max 100 characters)';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: formData.id || Date.now().toString(),
      name: (formData.name || '').trim(),
      issuer: (formData.issuer || '').trim(),
      date: (formData.date || '').trim(),
      expiryDate: (formData.expiryDate || '').trim(),
      credentialId: (formData.credentialId || '').trim(),
      link: (formData.link || '').trim(),
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Certification Name <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              📜
            </div>
            <input
              type="text"
              name="name"
              placeholder="e.g. AWS Certified Solutions Architect"
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

        {/* Issuer */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Issuing Organization <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
              🏛️
            </div>
            <input
              type="text"
              name="issuer"
              placeholder="e.g. Amazon Web Services, Microsoft, PMI"
              value={formData.issuer || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.issuer
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.issuer && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.issuer}</p>}
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Issue Date
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              📅
            </div>
            <input
              type="text"
              name="date"
              placeholder="e.g. Jan 2024"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Expiry Date
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              ⌛
            </div>
            <input
              type="text"
              name="expiryDate"
              placeholder="e.g. Jan 2027 or 'No Expiration'"
              value={formData.expiryDate || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Credential ID */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Credential ID
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              🔑
            </div>
            <input
              type="text"
              name="credentialId"
              placeholder="e.g. AWS-123456"
              value={formData.credentialId || ''}
              onChange={handleChange}
              className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.credentialId
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.credentialId && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.credentialId}</p>}
        </div>

        {/* Credential URL */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
            Credential URL
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
              🔗
            </div>
            <input
              type="url"
              name="link"
              placeholder="https://credly.com/badges/..."
              value={formData.link || ''}
              onChange={handleChange}
              className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                errors.link
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
              }`}
            />
          </div>
          {errors.link && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.link}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-all shadow-xs"
        >
          <span>✓</span> {isNew ? 'Add Certification' : 'Save Changes'}
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

export default CertificationsForm;