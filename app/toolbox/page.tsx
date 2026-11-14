'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';
import { useResumeStore } from '../store/resumeStore';
import { TemplateType } from '../types/resume';
import { calculateATSScore } from '../utils/ats';
import gsap from 'gsap';
import {
  HiPlus,
  HiPencilSquare,
  HiPencil,
  HiDocumentDuplicate,
  HiTrash,
  HiMagnifyingGlass,
  HiXMark,
  HiCheck,
  HiUser,
  HiEnvelope,
  HiArrowRight,
  HiClock,
  HiOutlineDocumentText,
  HiExclamationTriangle,
} from 'react-icons/hi2';

interface TemplateMetadata {
  name: string;
  category: string;
  body: string;
  icon: string;
  highlights: string[];
}

const TEMPLATE_INFO: Record<TemplateType, TemplateMetadata> = {
  software: {
    name: 'Software',
    category: 'Engineering & Tech',
    body: 'Skills grouped by type, with room for projects and links to GitHub and a portfolio.',
    icon: '💻',
    highlights: ['Technical Skills', 'Projects & Links', 'ATS Single-Column'],
  },
  management: {
    name: 'Management',
    category: 'Leadership & Strategy',
    body: 'Opens with a summary and experience, with key projects called out before skills.',
    icon: '📊',
    highlights: ['Executive Summary', 'Key Metrics', 'Team Leadership'],
  },
  creative: {
    name: 'Creative',
    category: 'Design & Media',
    body: 'A quieter layout that puts experience first and leaves space for portfolio work.',
    icon: '🎨',
    highlights: ['Experience-First', 'Portfolio Links', 'Visual Hierarchy'],
  },
  academic: {
    name: 'Academic',
    category: 'Research & Faculty',
    body: 'Education comes first, followed by research, competencies, and awards.',
    icon: '🎓',
    highlights: ['Education-First', 'Publications', 'Conferences & Awards'],
  },
  sales: {
    name: 'Sales',
    category: 'Business Development',
    body: 'Leads with experience and gives notable achievements a section of their own.',
    icon: '📈',
    highlights: ['Quota Attainment', 'Revenue Growth', 'Client Acquisition'],
  },
  healthcare: {
    name: 'Healthcare',
    category: 'Clinical & Medical',
    body: 'Licenses and certifications sit at the top, where hiring teams look first.',
    icon: '⚕️',
    highlights: ['Licensing & Certs', 'Clinical Rotations', 'Patient Care'],
  },
};

const SAMPLE_SUGGESTIONS = [
  'Full Stack Software Engineer',
  'Senior Product Manager',
  'Engineering Team Lead',
  'Product Designer',
  'Account Executive',
];

function ToolboxDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    resumes,
    currentResumeId,
    setCurrentResumeId,
    createResume,
    duplicateResume,
    deleteResume,
    updateResume,
    addTag,
    removeTag,
  } = useResumeStore();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<TemplateType | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'score' | 'title'>('updated');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [newResumeTemplate, setNewResumeTemplate] = useState<TemplateType>('software');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Inline renaming
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Inline tag addition per card
  const [addingTagToId, setAddingTagToId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      gsap.fromTo(
        '.resume-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [mounted, filterTemplate, filterTag, searchQuery, sortBy]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  useEffect(() => {
    if (!mounted) return;
    const tpl = searchParams.get('template');
    if (tpl) {
      const key = tpl.toLowerCase();
      if (['software', 'management', 'creative', 'academic', 'sales', 'healthcare'].includes(key)) {
        setFilterTemplate(key as TemplateType);
      }
    }
  }, [mounted, searchParams]);

  if (!mounted) {
    return (
      <div className="home-sans min-h-screen bg-[#f5f4ed] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#151b26] border-t-transparent rounded-full animate-spin" />
          <p className="home-mono text-[13px] uppercase tracking-[0.04em] text-[#606060]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const resumeList = Object.values(resumes);
  const allTags = Array.from(new Set(resumeList.flatMap((r) => r.tags || [])));

  // Calculate Average ATS score across resumes
  const avgATS =
    resumeList.length > 0
      ? Math.round(
          resumeList.reduce((acc, r) => acc + calculateATSScore(r).overall, 0) /
            resumeList.length
        )
      : 0;

  const filteredResumes = resumeList
    .filter((resume) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        resume.title.toLowerCase().includes(q) ||
        (resume.personalInfo?.name && resume.personalInfo.name.toLowerCase().includes(q)) ||
        (resume.personalInfo?.email && resume.personalInfo.email.toLowerCase().includes(q));
      const matchesTemplate = filterTemplate === 'all' || resume.template === filterTemplate;
      const matchesTag = filterTag === 'all' || (resume.tags || []).includes(filterTag);
      return matchesSearch && matchesTemplate && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return calculateATSScore(b).overall - calculateATSScore(a).overall;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleCreateResume = () => {
    const title = newResumeName.trim() || 'My Professional Resume';
    const id = createResume(title, newResumeTemplate);
    setCurrentResumeId(id);
    setNewResumeName('');
    setShowCreateModal(false);
    router.push('/builder');
  };

  const handleEditResume = (id: string) => {
    setCurrentResumeId(id);
    router.push('/builder');
  };

  const handleStartRename = (id: string, title: string) => {
    setRenamingId(id);
    setRenameValue(title);
  };

  const handleCommitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) updateResume(id, { title: trimmed });
    setRenamingId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteResume(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleAddTagSubmit = (resumeId: string) => {
    const tag = newTagInput.trim();
    if (tag) {
      addTag(resumeId, tag);
      setNewTagInput('');
      setAddingTagToId(null);
    }
  };

  const getATSMetrics = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Ready for parsers',
        textColor: 'text-[#156e3b]',
        bgColor: 'bg-[#5fc788]',
        badgeBg: 'bg-[#5fc788]/15 text-[#156e3b] border-[#5fc788]/40',
      };
    }
    if (score >= 60) {
      return {
        label: 'Moderate match',
        textColor: 'text-[#b45309]',
        bgColor: 'bg-[#f59e0b]',
        badgeBg: 'bg-[#fde68a]/35 text-[#b45309] border-[#d97706]/40',
      };
    }
    return {
      label: 'Needs attention',
      textColor: 'text-[#c1441a]',
      bgColor: 'bg-[#c1441a]',
      badgeBg: 'bg-[#fecdd3]/40 text-[#c1441a] border-[#c1441a]/40',
    };
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || filterTemplate !== 'all' || filterTag !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setFilterTemplate('all');
    setFilterTag('all');
  };

  return (
    <main className="home-sans min-h-screen bg-[#f5f4ed] text-[#151b26] overflow-x-clip flex flex-col">
      {/* Site Header matching the Homepage */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-[1328px] w-full mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {/* Workspace Hero Section */}
        <section className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e3dacc] pb-8">
          <div>
            <p className="home-mono text-[13px] sm:text-[14px] uppercase tracking-[0.06em] text-[#c1441a]">
              Resume Workspace
            </p>
            <h1 className="home-serif mt-3 text-[44px] sm:text-[68px] lg:text-[78px] leading-[0.98] tracking-[-0.04em] text-[#151b26]">
              Your Resumes
            </h1>
            <p className="mt-4 max-w-[680px] text-[18px] sm:text-[22px] leading-[1.35] tracking-[-0.015em] text-[#606060]">
              Manage your drafts, track real-time ATS scores, organize with tags, and pick from six layouts built for different career fields.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/builder"
              className="inline-flex h-12 sm:h-13 items-center gap-2 rounded-full border border-[#151b26] bg-transparent px-5 sm:px-6 text-[15px] sm:text-[16px] font-medium text-[#151b26] hover:bg-[#151b26]/5 transition-colors"
            >
              <HiPencilSquare className="w-4 h-4" />
              <span>Open Builder</span>
            </Link>

            <button
              onClick={() => {
                setNewResumeName('');
                setShowCreateModal(true);
              }}
              className="inline-flex h-12 sm:h-13 items-center gap-2 rounded-full bg-[#c1441a] px-6 text-[15px] sm:text-[16px] font-medium text-white shadow-[0_10px_28px_-8px_rgba(193,68,26,0.45)] hover:bg-[#a9390f] transition-all"
            >
              <HiPlus className="w-4 h-4 stroke-2" />
              <span>Create Resume</span>
            </button>
          </div>
        </section>

        {/* 4 Metric Stats Cards in Homepage Editorial Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* Card 1: Total Resumes */}
          <div className="rounded-[14px] border border-[#e3dacc] bg-[#fbfaf6] p-5 sm:p-6 transition-all hover:bg-white hover:border-[#151b26]/30">
            <span className="home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060]">
              Saved Drafts
            </span>
            <p className="home-serif text-[38px] sm:text-[46px] leading-none text-[#151b26] mt-3">
              {resumeList.length}
            </p>
            <p className="text-[13px] text-[#8a877f] mt-2">
              {resumeList.length === 1 ? '1 active draft stored' : `${resumeList.length} drafts stored in session`}
            </p>
          </div>

          {/* Card 2: Average ATS Readiness */}
          <div className="rounded-[14px] border border-[#e3dacc] bg-[#fbfaf6] p-5 sm:p-6 transition-all hover:bg-white hover:border-[#151b26]/30">
            <span className="home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060]">
              ATS Readiness
            </span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="home-serif text-[38px] sm:text-[46px] leading-none text-[#151b26]">
                {resumeList.length > 0 ? avgATS : '--'}
              </span>
              {resumeList.length > 0 && <span className="home-mono text-[16px] text-[#8a877f]">/100</span>}
            </div>
            <p className="text-[13px] text-[#8a877f] mt-2">
              {resumeList.length === 0
                ? 'Create a resume to score'
                : avgATS >= 80
                ? 'High interview readiness'
                : avgATS >= 60
                ? 'Competitive benchmark'
                : 'Improvements suggested'}
            </p>
          </div>

          {/* Card 3: Templates Active */}
          <div className="rounded-[14px] border border-[#e3dacc] bg-[#fbfaf6] p-5 sm:p-6 transition-all hover:bg-white hover:border-[#151b26]/30">
            <span className="home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060]">
              Active Layouts
            </span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="home-serif text-[38px] sm:text-[46px] leading-none text-[#151b26]">
                {new Set(resumeList.map((r) => r.template)).size}
              </span>
              <span className="home-mono text-[16px] text-[#8a877f]">/6</span>
            </div>
            <p className="text-[13px] text-[#8a877f] mt-2">Role-calibrated formats</p>
          </div>

          {/* Card 4: Tags Used */}
          <div className="rounded-[14px] border border-[#e3dacc] bg-[#fbfaf6] p-5 sm:p-6 transition-all hover:bg-white hover:border-[#151b26]/30">
            <span className="home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060]">
              Custom Tags
            </span>
            <p className="home-serif text-[38px] sm:text-[46px] leading-none text-[#151b26] mt-3">
              {allTags.length}
            </p>
            <p className="text-[13px] text-[#8a877f] mt-2 truncate">
              {allTags.length > 0 ? `${allTags.length} categories applied` : 'Categorize target roles'}
            </p>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="rounded-[14px] border border-[#e3dacc] bg-[#fbfaf6] p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877f] pointer-events-none" />
              <input
                type="text"
                placeholder="Search resumes by title, candidate name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-[15px] bg-white border border-[#e3dacc] rounded-full focus:outline-none focus:border-[#151b26] text-[#151b26] transition-all placeholder:text-[#8a877f]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8a877f] hover:text-[#151b26] transition-colors"
                  title="Clear search"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Sort */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Template Select */}
              <div className="relative">
                <select
                  value={filterTemplate}
                  onChange={(e) => setFilterTemplate(e.target.value as TemplateType | 'all')}
                  className="px-4 py-2.5 pr-8 text-[14px] font-medium bg-white border border-[#e3dacc] rounded-full focus:outline-none focus:border-[#151b26] text-[#151b26] cursor-pointer appearance-none"
                >
                  <option value="all">All Templates</option>
                  {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a877f] text-xs">
                  ▼
                </div>
              </div>

              {/* Tag Select */}
              {allTags.length > 0 && (
                <div className="relative">
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="px-4 py-2.5 pr-8 text-[14px] font-medium bg-white border border-[#e3dacc] rounded-full focus:outline-none focus:border-[#151b26] text-[#151b26] cursor-pointer appearance-none"
                  >
                    <option value="all">All Tags ({allTags.length})</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        🏷️ {tag}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a877f] text-xs">
                    ▼
                  </div>
                </div>
              )}

              {/* Sort By Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'updated' | 'score' | 'title')}
                  className="px-4 py-2.5 pr-8 text-[14px] font-medium bg-white border border-[#e3dacc] rounded-full focus:outline-none focus:border-[#151b26] text-[#151b26] cursor-pointer appearance-none"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="score">Highest ATS Score</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a877f] text-xs">
                  ▼
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[#c1441a] bg-[#c1441a]/10 border border-[#c1441a]/30 rounded-full hover:bg-[#c1441a]/15 transition-colors"
                >
                  <HiXMark className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              {/* Counter */}
              <span className="home-mono ml-auto text-[13px] text-[#606060] px-3.5 py-1.5 rounded-full bg-white border border-[#e3dacc]">
                {filteredResumes.length} of {resumeList.length} resume{resumeList.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResumes.map((resume) => {
            const tInfo =
              TEMPLATE_INFO[resume.template as TemplateType] || TEMPLATE_INFO.software;
            const isActive = resume.id === currentResumeId;
            const atsScore = calculateATSScore(resume);
            const atsMetrics = getATSMetrics(atsScore.overall);
            const isRenaming = renamingId === resume.id;
            const isAddingTag = addingTagToId === resume.id;

            return (
              <div
                key={resume.id}
                className={`resume-card group rounded-[16px] border bg-[#fbfaf6] p-6 transition-all duration-200 flex flex-col justify-between hover:bg-white hover:border-[#151b26]/40 hover:shadow-[0_12px_36px_-12px_rgba(21,27,38,0.12)] ${
                  isActive ? 'border-[#151b26] ring-2 ring-[#151b26]/20' : 'border-[#e3dacc]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="home-mono text-[12px] uppercase tracking-[0.05em] px-3 py-1 rounded-full bg-white border border-[#e3dacc] text-[#151b26] font-medium flex items-center gap-1.5">
                      <span>{tInfo.icon}</span>
                      <span>{tInfo.name}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="home-mono text-[11px] uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full bg-[#151b26] text-white">
                          Active
                        </span>
                      )}
                      <span
                        className={`home-mono text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${atsMetrics.badgeBg}`}
                        title={`ATS Score: ${atsScore.overall}/100`}
                      >
                        {atsScore.overall} ATS
                      </span>
                    </div>
                  </div>

                  {/* Title & Rename */}
                  <div className="mb-4">
                    {isRenaming ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={renameInputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleCommitRename(resume.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommitRename(resume.id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="w-full home-serif text-[22px] font-medium text-[#151b26] border-b-2 border-[#151b26] outline-none bg-transparent py-0.5"
                        />
                        <button
                          onClick={() => handleCommitRename(resume.id)}
                          className="p-1 text-[#156e3b] hover:opacity-80"
                          title="Save"
                        >
                          <HiCheck className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/title">
                        <h3
                          className="home-serif text-[22px] sm:text-[24px] font-medium text-[#151b26] tracking-[-0.02em] truncate cursor-pointer hover:text-[#c1441a] transition-colors"
                          title="Click to rename"
                          onClick={() => handleStartRename(resume.id, resume.title)}
                        >
                          {resume.title}
                        </h3>
                        <button
                          onClick={() => handleStartRename(resume.id, resume.title)}
                          className="opacity-0 group-hover/title:opacity-100 text-[#8a877f] hover:text-[#151b26] transition-opacity p-0.5"
                          title="Rename"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Candidate Details Snippet */}
                  <div className="space-y-1.5 text-[13px] text-[#606060] mb-4 bg-white p-3.5 rounded-[10px] border border-[#efece4]">
                    <div className="flex items-center gap-2 truncate">
                      <HiUser className="w-4 h-4 text-[#8a877f] shrink-0" />
                      <span className="truncate font-medium text-[#151b26]">
                        {resume.personalInfo?.name || 'No name entered'}
                      </span>
                    </div>
                    {resume.personalInfo?.email && (
                      <div className="flex items-center gap-2 truncate">
                        <HiEnvelope className="w-4 h-4 text-[#8a877f] shrink-0" />
                        <span className="truncate">{resume.personalInfo.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#8a877f] home-mono text-[12px]">
                      <HiClock className="w-4 h-4 shrink-0" />
                      <span>
                        Updated{' '}
                        {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* ATS Score Visual Progress Meter */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="text-[#606060] font-normal">ATS Readiness</span>
                      <span className={`font-semibold ${atsMetrics.textColor}`}>
                        {atsScore.overall}/100 • {atsMetrics.label}
                      </span>
                    </div>
                    <div className="h-2 bg-[#efece4] rounded-full overflow-hidden p-0.5 border border-[#e3dacc]">
                      <div
                        className={`h-full rounded-full ${atsMetrics.bgColor} transition-all duration-500`}
                        style={{ width: `${Math.max(atsScore.overall, 4)}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags Management */}
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(resume.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-[#151b26] border border-[#e3dacc] text-[12px] font-medium rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(resume.id, tag)}
                            className="text-[#8a877f] hover:text-[#c1441a] transition-colors p-0.5"
                            title={`Remove ${tag}`}
                          >
                            <HiXMark className="w-3 h-3" />
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Inline Control */}
                      {isAddingTag ? (
                        <div className="inline-flex items-center gap-1 bg-white border border-[#151b26] rounded-full px-2.5 py-0.5">
                          <input
                            type="text"
                            placeholder="Tag name..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTagSubmit(resume.id);
                              if (e.key === 'Escape') setAddingTagToId(null);
                            }}
                            className="text-[12px] outline-none w-20 text-[#151b26] bg-transparent"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddTagSubmit(resume.id)}
                            className="text-[#156e3b] hover:opacity-80 p-0.5"
                            title="Add"
                          >
                            <HiCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setAddingTagToId(null)}
                            className="text-[#8a877f] hover:text-[#151b26] p-0.5"
                            title="Cancel"
                          >
                            <HiXMark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingTagToId(resume.id);
                            setNewTagInput('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[12px] font-medium text-[#606060] hover:text-[#151b26] bg-white border border-dashed border-[#e3dacc] hover:border-[#151b26] rounded-full transition-colors"
                          title="Add a custom tag"
                        >
                          <HiPlus className="w-3 h-3" />
                          <span>Tag</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-[#e3dacc] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEditResume(resume.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#151b26] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#262e3d] transition-colors"
                  >
                    <HiPencilSquare className="w-4 h-4" />
                    <span>Open in Editor</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartRename(resume.id, resume.title)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e3dacc] bg-white text-[#151b26] hover:bg-[#efece4] transition-colors"
                      title="Rename Resume"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => duplicateResume(resume.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e3dacc] bg-white text-[#151b26] hover:bg-[#efece4] transition-colors"
                      title="Duplicate Resume"
                    >
                      <HiDocumentDuplicate className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget({ id: resume.id, title: resume.title })}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#c1441a]/30 bg-white text-[#c1441a] hover:bg-[#c1441a]/10 transition-colors"
                      title="Delete Resume"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredResumes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-[#fbfaf6] rounded-[18px] border border-[#e3dacc]">
              <div className="w-16 h-16 bg-white border border-[#e3dacc] text-[#151b26] rounded-full flex items-center justify-center mb-4 shadow-sm">
                <HiOutlineDocumentText className="w-8 h-8" />
              </div>
              <h3 className="home-serif text-[28px] text-[#151b26] mb-2">
                {resumeList.length === 0 ? 'No Resumes Created Yet' : 'No Resumes Match Filters'}
              </h3>
              <p className="text-[17px] text-[#606060] mb-8 max-w-md">
                {resumeList.length === 0
                  ? 'Get started by creating your first ATS-optimized resume. Choose from our specialized role templates.'
                  : 'Try clearing your search query or removing template and tag filters to view all your resumes.'}
              </p>
              {resumeList.length === 0 ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[#c1441a] px-6 text-[16px] font-medium text-white shadow-[0_10px_28px_-8px_rgba(193,68,26,0.45)] hover:bg-[#a9390f] transition-all"
                >
                  <HiPlus className="w-4 h-4 stroke-2" />
                  <span>Create Your First Resume</span>
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#151b26] bg-white px-5 text-[15px] font-medium text-[#151b26] hover:bg-[#efece4] transition-colors"
                >
                  <HiXMark className="w-4 h-4" />
                  <span>Clear Search & Filters</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Available Templates Section (matches homepage TemplatesSection.tsx) */}
        <section className="mt-16 pt-12 border-t border-[#e3dacc]">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="home-mono text-[13px] uppercase tracking-[0.06em] text-[#c1441a]">
                Role Formats
              </p>
              <h2 className="home-serif text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.03em] text-[#151b26] mt-2">
                Explore Resume Templates
              </h2>
              <p className="mt-2 text-[17px] text-[#606060] max-w-[620px]">
                Every template is a single column of real text, so applicant tracking software can read it. What changes is the order of sections and what each one emphasizes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
              <div
                key={key}
                className="rounded-[16px] border border-[#e3dacc] bg-[#fbfaf6] p-6 hover:bg-white hover:border-[#151b26]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{info.icon}</span>
                    <span className="home-mono text-[11px] uppercase tracking-[0.06em] text-[#8a877f]">
                      {info.category}
                    </span>
                  </div>

                  <h3 className="home-serif text-[24px] text-[#151b26] mb-2">{info.name}</h3>
                  <p className="text-[15px] text-[#606060] leading-relaxed mb-4">{info.body}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {info.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="home-mono text-[11px] uppercase tracking-[0.04em] px-2.5 py-0.5 rounded-full bg-white border border-[#e3dacc] text-[#606060]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewResumeTemplate(key as TemplateType);
                    setNewResumeName('');
                    setShowCreateModal(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#151b26] bg-white py-2.5 text-[14px] font-medium text-[#151b26] hover:bg-[#151b26] hover:text-white transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                  <span>Create with {info.name}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#151b26]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-[#fbfaf6] rounded-[20px] shadow-2xl border border-[#e3dacc] w-full max-w-sm p-6 sm:p-7 z-10 text-[#151b26]">
            <div className="flex items-center justify-center w-12 h-12 bg-[#c1441a]/15 text-[#c1441a] rounded-full mx-auto mb-4">
              <HiExclamationTriangle className="w-6 h-6" />
            </div>

            <h2 className="home-serif text-[24px] text-center mb-2">Delete Resume?</h2>

            <p className="text-[15px] text-[#606060] text-center mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#151b26]">"{deleteTarget.title}"</span>? This
              action will permanently remove this draft from your browser session.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border border-[#e3dacc] bg-white py-2.5 text-[15px] font-medium text-[#151b26] hover:bg-[#efece4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#c1441a] text-white py-2.5 text-[15px] font-medium hover:bg-[#a9390f] transition-colors"
              >
                <HiTrash className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Resume Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#151b26]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-[#fbfaf6] rounded-[22px] shadow-2xl border border-[#e3dacc] w-full max-w-lg p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto text-[#151b26]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e3dacc] mb-6">
              <div>
                <p className="home-mono text-[12px] uppercase tracking-[0.06em] text-[#c1441a]">
                  New Draft
                </p>
                <h2 className="home-serif text-[28px] sm:text-[32px] leading-tight text-[#151b26]">
                  Create New Resume
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e3dacc] bg-white text-[#8a877f] hover:text-[#151b26] transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Resume Title Input */}
              <div>
                <label className="block home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060] mb-2">
                  Resume Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer - Google"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateResume()}
                  className="w-full px-4 py-2.5 text-[15px] bg-white border border-[#e3dacc] rounded-[10px] focus:outline-none focus:border-[#151b26] text-[#151b26] transition-all"
                  autoFocus
                />

                {/* Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="home-mono text-[11px] text-[#8a877f]">Suggestions:</span>
                  {SAMPLE_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNewResumeName(suggestion)}
                      className="text-[12px] px-2.5 py-0.5 rounded-full bg-white hover:bg-[#efece4] text-[#606060] hover:text-[#151b26] border border-[#e3dacc] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Picker */}
              <div>
                <label className="block home-mono text-[12px] uppercase tracking-[0.06em] text-[#606060] mb-2.5">
                  Choose Role Template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(TEMPLATE_INFO).map(([key, info]) => {
                    const isSelected = newResumeTemplate === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewResumeTemplate(key as TemplateType)}
                        className={`flex items-start gap-2.5 p-3.5 rounded-[12px] border text-left transition-all ${
                          isSelected
                            ? 'border-[#151b26] bg-white ring-2 ring-[#151b26]/20'
                            : 'border-[#e3dacc] bg-[#fbfaf6] hover:bg-white hover:border-[#151b26]/40'
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{info.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="home-serif text-[18px] text-[#151b26] truncate">
                              {info.name}
                            </span>
                            {isSelected && (
                              <HiCheck className="w-4 h-4 text-[#c1441a] shrink-0 ml-1" />
                            )}
                          </div>
                          <p className="text-[12px] text-[#8a877f] line-clamp-2 mt-0.5 leading-snug">
                            {info.body}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-5 border-t border-[#e3dacc]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-full border border-[#e3dacc] bg-white py-2.5 text-[15px] font-medium text-[#151b26] hover:bg-[#efece4] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateResume}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#c1441a] text-white py-2.5 text-[15px] font-medium hover:bg-[#a9390f] shadow-sm transition-all"
              >
                <HiPencilSquare className="w-4 h-4" />
                <span>Create & Open Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Footer matching the Homepage */}
      <Footer />
    </main>
  );
}

export default function ToolboxDashboardWrapper() {
  return (
    <Suspense fallback={null}>
      <ToolboxDashboard />
    </Suspense>
  );
}
