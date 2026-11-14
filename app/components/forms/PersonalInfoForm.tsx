'use client';

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfo } from '../../types/resume';
import {
  isRequired,
  isValidEmail,
  isValidPhone,
  isValidLinkedIn,
  isValidGitHub,
  isValidURL,
  hasHTML,
  maxLength,
} from '../../utils/validation';

interface PersonalInfoFormProps {
  data: PersonalInfo;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data }) => {
  const { updateSection } = useResumeStore();
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const validateField = (name: string, value: string): string | null => {
    const trimmed = (value || '').trim();

    switch (name) {
      case 'name':
        if (!isRequired(trimmed)) return 'Full Name is required';
        if (hasHTML(trimmed)) return 'HTML tags are not allowed';
        if (!maxLength(trimmed, 80)) return 'Full Name cannot exceed 80 characters';
        return null;

      case 'email':
        if (!isRequired(trimmed)) return 'Email address is required';
        if (!isValidEmail(trimmed)) return 'Enter a valid email address (e.g. name@example.com)';
        return null;

      case 'phone':
        if (!isRequired(trimmed)) return 'Phone number is required';
        if (!isValidPhone(trimmed)) return 'Enter a valid phone number (7-15 digits)';
        return null;

      case 'linkedin':
        if (trimmed && !isValidLinkedIn(trimmed)) return 'Enter a valid LinkedIn profile URL';
        return null;

      case 'github':
        if (trimmed && !isValidGitHub(trimmed)) return 'Enter a valid GitHub profile URL';
        return null;

      case 'portfolio':
        if (trimmed && !isValidURL(trimmed)) return 'Enter a valid website URL (e.g. https://yoursite.com)';
        return null;

      default:
        if (hasHTML(trimmed)) return 'HTML tags are not allowed';
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    const error = validateField(name, value);
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[name] = error;
      } else {
        delete updated[name];
      }
      return updated;
    });

    updateSection('personalInfo', newData);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[name] = error;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>👤</span> Personal Information
        </h2>
        <span className="text-xs text-gray-400">* Required for ATS compliance</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.name
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.email
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={formData.phone || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.phone
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.phone}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            placeholder="New York"
            value={formData.city || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            placeholder="USA"
            value={formData.country || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location (Display) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Header (Display)</label>
          <input
            type="text"
            name="location"
            placeholder="New York, NY, USA"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Appears directly at the top of your resume template.</p>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin"
            placeholder="https://linkedin.com/in/johndoe"
            value={formData.linkedin || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.linkedin
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.linkedin && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.linkedin}</p>}
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
          <input
            type="url"
            name="github"
            placeholder="https://github.com/johndoe"
            value={formData.github || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.github
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.github && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.github}</p>}
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / Website</label>
          <input
            type="url"
            name="portfolio"
            placeholder="https://johndoe.dev"
            value={formData.portfolio || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition-colors ${
              errors.portfolio
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.portfolio && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {errors.portfolio}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
