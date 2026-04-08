'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '../store/resumeStore';
import { TemplateType } from '../types/resume';
import { calculateATSScore } from '../utils/ats';
import gsap from 'gsap';
import OptimizedLogo from '../homepage/OptimizedLogo';
import { useSearchParams } from 'next/navigation';
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
  HiCalendarDays,
  HiDocumentText,
  HiTag,
  HiFolderOpen,
  HiShieldCheck,
  HiChartBarSquare,
} from 'react-icons/hi2';

const TEMPLATE_INFO: Record<TemplateType, { icon: string; description: string; color: string; accent: string }> = {
  software:   { icon: String.fromCodePoint(0x1F4BB), description: 'Ideal for developers, engineers, and tech professionals',  color: 'blue',   accent: 'bg-blue-500'   },
  management: { icon: String.fromCodePoint(0x1F4CA), description: 'Perfect for managers, directors, and executives',           color: 'purple', accent: 'bg-purple-500' },
  creative:   { icon: String.fromCodePoint(0x1F3A8), description: 'Great for designers, artists, and creative professionals',  color: 'pink',   accent: 'bg-pink-500'   },
  academic:   { icon: String.fromCodePoint(0x1F393), description: 'Suited for researchers, professors, and academics',         color: 'green',  accent: 'bg-green-500'  },
  sales:      { icon: String.fromCodePoint(0x1F4C8), description: 'Optimized for sales, business development, and marketing',  color: 'orange', accent: 'bg-orange-500' },
  healthcare: { icon: String.fromCodePoint(0x2695, 0xFE0F), description: 'Tailored for medical and healthcare professionals', color: 'teal',   accent: 'bg-teal-500'   },
};

const TEMPLATE_BADGE: Record<string, string> = {
  blue:   'bg-blue-100   text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  pink:   'bg-pink-100   text-pink-700',
  green:  'bg-green-100  text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  teal:   'bg-teal-100   text-teal-700',
};

function ToolboxDashboard() {
  const router = useRouter();
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

  const [mounted,           setMounted]           = useState(false);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [filterTemplate,    setFilterTemplate]    = useState<TemplateType | 'all'>('all');
  const [filterTag,         setFilterTag]         = useState<string | 'all'>('all');
  const [showCreateModal,   setShowCreateModal]   = useState(false);
  const [newResumeName,     setNewResumeName]     = useState('');
  const [newResumeTemplate, setNewResumeTemplate] = useState<TemplateType>('software');
  const [tagInput,          setTagInput]          = useState<Record<string, string>>({});
  const [deleteTarget,      setDeleteTarget]      = useState<{ id: string; title: string } | null>(null);
  const [renamingId,        setRenamingId]        = useState<string | null>(null);
  const [renameValue,       setRenameValue]       = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted) {
      gsap.fromTo(
        '.resume-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' },
      );
    }
  }, [mounted, filterTemplate, filterTag, searchQuery]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const searchParams = useSearchParams();
  useEffect(() => {
    if (!mounted) return;
    const tpl = searchParams.get('template');
    if (tpl) {
      const key = tpl.toLowerCase();
      if (['software','management','creative','academic','sales','healthcare'].includes(key)) {
        setFilterTemplate(key as TemplateType);
      }
    }
  }, [mounted, searchParams]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const resumeList = Object.values(resumes);
  const allTags    = Array.from(new Set(resumeList.flatMap(r => r.tags || [])));

  const filteredResumes = resumeList
    .filter(resume => {
      const matchesSearch   = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              resume.personalInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate = filterTemplate === 'all' || resume.template === filterTemplate;
      const matchesTag      = filterTag === 'all' || (resume.tags || []).includes(filterTag);
      return matchesSearch && matchesTemplate && matchesTag;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreateResume = () => {
    if (newResumeName.trim()) {
      const id = createResume(newResumeName.trim(), newResumeTemplate);
      setCurrentResumeId(id);
      setNewResumeName('');
      setShowCreateModal(false);
      router.push('/builder');
    }
  };

  const handleAddTag = (resumeId: string) => {
    const tag = tagInput[resumeId]?.trim();
    if (tag) {
      addTag(resumeId, tag);
      setTagInput({ ...tagInput, [resumeId]: '' });
    }
  };

  const handleEditResume = (id: string) => {
    setCurrentResumeId(id);
    router.push('/builder');
  };

  const handleStartRename  = (id: string, title: string) => { setRenamingId(id); setRenameValue(title); };
  const handleCommitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) updateResume(id, { title: trimmed });
    setRenamingId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) { deleteResume(deleteTarget.id); setDeleteTarget(null); }
  };

  const getATSColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', ring: 'ring-emerald-200' };
    if (score >= 60) return { text: 'text-amber-600',   bg: 'bg-amber-500',   ring: 'ring-amber-200'   };
    return               { text: 'text-red-500',        bg: 'bg-red-500',     ring: 'ring-red-200'     };
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <OptimizedLogo forgeColor="text-black" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <HiPlus className="w-4 h-4" />
              New Resume
            </button>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <HiPencilSquare className="w-4 h-4" />
              Open Editor
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { Icon: HiDocumentText,  value: resumeList.length,                  label: 'Total Resumes',    accent: 'border-l-blue-500',    iconCls: 'text-blue-500'    },
            { Icon: HiTag,           value: allTags.length,                     label: 'Tags Used',        accent: 'border-l-purple-500',  iconCls: 'text-purple-500'  },
            { Icon: HiFolderOpen,    value: Object.keys(TEMPLATE_INFO).length,  label: 'Templates',        accent: 'border-l-green-500',   iconCls: 'text-green-500'   },
            { Icon: HiShieldCheck,   value: 'ATS',                              label: 'Optimized Format', accent: 'border-l-emerald-500', iconCls: 'text-emerald-500' },
          ].map(({ Icon, value, label, accent, iconCls }, i) => (
            <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border border-gray-200 border-l-4 ${accent}`}>
              <Icon className={`w-6 h-6 mb-2 ${iconCls}`} />
              <div className="text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-52 relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={filterTemplate}
              onChange={(e) => setFilterTemplate(e.target.value as TemplateType | 'all')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="all">All Templates</option>
              {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
                <option key={key} value={key}>{info.icon} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
              ))}
            </select>
            {allTags.length > 0 && (
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {filteredResumes.length} of {resumeList.length} resume{resumeList.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredResumes.map((resume) => {
            const tInfo      = TEMPLATE_INFO[resume.template as TemplateType] || TEMPLATE_INFO.software;
            const isActive   = resume.id === currentResumeId;
            const atsScore   = calculateATSScore(resume);
            const atsColors  = getATSColor(atsScore.overall);
            const isRenaming = renamingId === resume.id;

            return (
              <div
                key={resume.id}
                className={`resume-card group bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col ${
                  isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`h-1 w-full ${tInfo.accent}`} />

                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${TEMPLATE_BADGE[tInfo.color] ?? 'bg-gray-100'}`}>
                      {tInfo.icon}
                    </div>
                    <div className="min-w-0">
                      {isRenaming ? (
                        <input
                          ref={renameInputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleCommitRename(resume.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')  handleCommitRename(resume.id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="w-full text-sm font-semibold border-b-2 border-blue-400 outline-none bg-transparent pb-0.5"
                        />
                      ) : (
                        <h3
                          className="font-semibold text-gray-800 text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
                          title="Click to rename"
                          onClick={() => handleStartRename(resume.id, resume.title)}
                        >
                          {resume.title}
                        </h3>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TEMPLATE_BADGE[tInfo.color] ?? 'bg-gray-100 text-gray-600'}`}>
                        {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">Active</span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ring-1 ${atsColors.text} ${atsColors.ring} bg-white`}>
                      {atsScore.overall}
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-3 flex-1">
                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    {resume.personalInfo?.name && (
                      <div className="flex items-center gap-1.5">
                        <HiUser className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{resume.personalInfo.name}</span>
                      </div>
                    )}
                    {resume.personalInfo?.email && (
                      <div className="flex items-center gap-1.5">
                        <HiEnvelope className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{resume.personalInfo.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <HiCalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <HiChartBarSquare className="w-3.5 h-3.5" /> ATS Score
                      </span>
                      <span className={`font-semibold ${atsColors.text}`}>{atsScore.overall}/100</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${atsColors.bg} transition-all duration-500`} style={{ width: `${atsScore.overall}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {(resume.tags || []).map(tag => (
                        <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                          <button
                            onClick={() => removeTag(resume.id, tag)}
                            className="text-gray-400 hover:text-red-500 leading-none ml-0.5"
                          >
                            <HiXMark className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        value={tagInput[resume.id] || ''}
                        onChange={(e) => setTagInput({ ...tagInput, [resume.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(resume.id)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none focus:border-blue-400"
                      />
                      <button
                        onClick={() => handleAddTag(resume.id)}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <HiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleEditResume(resume.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <HiPencilSquare className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleStartRename(resume.id, resume.title)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title="Rename"
                  >
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => duplicateResume(resume.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title="Duplicate"
                  >
                    <HiDocumentDuplicate className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: resume.id, title: resume.title })}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredResumes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <HiDocumentText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                {resumeList.length === 0 ? 'No resumes yet' : 'No results'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-xs">
                {resumeList.length === 0
                  ? 'Create your first resume to get started.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {resumeList.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiPlus className="w-4 h-4" /> Create Resume
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => { setNewResumeTemplate(key as TemplateType); setShowCreateModal(true); }}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${TEMPLATE_BADGE[info.color] ?? 'bg-gray-100'}`}>
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
              <HiTrash className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 text-center mb-1">Delete Resume?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              <span className="font-medium text-gray-700">"{deleteTarget.title}"</span> will be permanently
              deleted. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-sm"
              >
                <HiTrash className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Create New Resume</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume Name</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer - Google"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateResume()}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setNewResumeTemplate(key as TemplateType)}
                      className={`flex items-center gap-2 p-3 border-2 rounded-xl text-left transition-all ${
                        newResumeTemplate === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{info.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      {newResumeTemplate === key && (
                        <HiCheck className="w-4 h-4 text-blue-500 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateResume}
                disabled={!newResumeName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <HiPencilSquare className="w-4 h-4" /> Create & Edit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ToolboxDashboardWrapper() {
  return (
    <Suspense fallback={null}>
      <ToolboxDashboard />
    </Suspense>
  );
}