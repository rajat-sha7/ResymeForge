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

const VALIDATED_FIELDS: (keyof PersonalInfo)[] = ['name', 'email', 'phone', 'linkedin', 'github', 'portfolio'];

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

  // Show errors for fields that already hold invalid values (e.g. after reload), and
  // for every field — including empty required ones — when the user is sent here
  // from the validation report ("Fix section") or the export guard.
  useEffect(() => {
    const collect = (includeEmpty: boolean) => {
      const next: { [key: string]: string } = {};
      VALIDATED_FIELDS.forEach((field) => {
        const value = (data?.[field] as string) || '';
        if (!includeEmpty && !value.trim()) return;
        const error = validateField(field, value);
        if (error) next[field] = error;
      });
      return next;
    };

    setErrors((prev) => ({ ...collect(false), ...prev }));

    const onShowErrors = (e: Event) => {
      if ((e as CustomEvent).detail !== 'personalInfo') return;
      setErrors(collect(true));
    };
    window.addEventListener('expand-editor-section', onShowErrors);
    return () => window.removeEventListener('expand-editor-section', onShowErrors);
  }, [data]);

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
    <div className="space-y-6">
      {/* Contact Details Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">Contact Details</span>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              ATS Core
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">* Required fields</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                👤
              </div>
              <input
                type="text"
                name="name"
                placeholder="e.g. Alex Morgan"
                value={formData.name || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.name && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                ✉️
              </div>
              <input
                type="email"
                name="email"
                placeholder="e.g. alex.morgan@example.com"
                value={formData.email || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                📞
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.phone || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.phone && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">Location Details</span>
          {formData.city && formData.country && !formData.location && (
            <button
              type="button"
              onClick={() => {
                const combined = `${formData.city}, ${formData.country}`;
                setFormData({ ...formData, location: combined });
                updateSection('personalInfo', { ...formData, location: combined });
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ✨ Set header to &quot;{formData.city}, {formData.country}&quot;
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              City
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🏙️
              </div>
              <input
                type="text"
                name="city"
                placeholder="e.g. San Francisco"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Country
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🌍
              </div>
              <input
                type="text"
                name="country"
                placeholder="e.g. United States"
                value={formData.country || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Location Header */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Location Display String
              </label>
              <span className="text-[11px] text-gray-400">Printed on resume header</span>
            </div>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                📍
              </div>
              <input
                type="text"
                name="location"
                placeholder="e.g. San Francisco, CA, USA"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social & Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">Online Profiles &amp; Portfolio</span>
          <span className="text-xs text-gray-400 font-medium">Include links for recruiter visibility</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              LinkedIn URL
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                💼
              </div>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.linkedin
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.linkedin && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.linkedin}</p>}
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              GitHub URL
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🐙
              </div>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                value={formData.github || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.github
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.github && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.github}</p>}
          </div>

          {/* Portfolio */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Portfolio / Website URL
            </label>
            <div className="relative rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">
                🔗
              </div>
              <input
                type="url"
                name="portfolio"
                placeholder="https://yourportfolio.dev"
                value={formData.portfolio || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                  errors.portfolio
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/15 text-red-900'
                    : 'border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-blue-500/15'
                }`}
              />
            </div>
            {errors.portfolio && <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">⚠️ {errors.portfolio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
