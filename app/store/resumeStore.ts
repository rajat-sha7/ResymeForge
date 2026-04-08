import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { 
  ResumeData, 
  SectionType, 
  TemplateType,
  CustomSection,
} from '../types/resume';

interface ResumeStore {
  resumes: { [id: string]: ResumeData };
  currentResumeId: string | null;
  enabledSections: SectionType[];
  sectionOrder: SectionType[];
  history: {
    past: { [id: string]: ResumeData }[];
    future: { [id: string]: ResumeData }[];
  };
  jobDescription: string;
  // collapsedSections maps resumeId -> { sectionKey: boolean }
  collapsedSections: Record<string, Record<string, boolean>>;
  
  setCurrentResumeId: (id: string) => void;
  setCurrentResume: (id: string) => void;
  createResume: (title?: string, template?: TemplateType) => string;
  updateResume: (id: string, data: Partial<ResumeData>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string, newName?: string) => string;
  updateSection: <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => void;
  // transient notification for UI to show saved/added animations
  notification: { message: string; type?: 'success' | 'info' | 'error'; id?: number } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  reorderSections: (sections: SectionType[]) => void;
  toggleSection: (section: SectionType, enabled: boolean) => void;
  resetSection: (section: SectionType) => void;
  duplicateItem: (section: SectionType, itemId: string) => void;
  setTemplate: (template: TemplateType) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  setJobDescription: (jd: string) => void;
  setSectionCollapsed: (section: SectionType, collapsed: boolean) => void;
  addTag: (resumeId: string, tag: string) => void;
  removeTag: (resumeId: string, tag: string) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addCustomSection: () => string;
  removeCustomSection: (sectionId: string) => void;
  updateCustomSection: (sectionId: string, data: Partial<CustomSection>) => void;
}

const createDefaultResume = (title: string = 'Untitled Resume', template: TemplateType = 'software'): ResumeData => ({
  id: Date.now().toString(),
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: [],
  template,
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    city: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  professionalSummary: '',
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
  customSections: [],
});

const defaultSections: SectionType[] = [
  'personalInfo',
  'professionalSummary',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'achievements',
];

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: {},
      currentResumeId: null,
      enabledSections: defaultSections,
      sectionOrder: defaultSections,
      history: { past: [], future: [] },
      jobDescription: '',
      collapsedSections: {},
      notification: null,

      setCurrentResumeId: (id: string) => set({ currentResumeId: id }),

      setCurrentResume: (id: string) => {
        const exists = !!get().resumes[id];
        if (exists) set({ currentResumeId: id });
      },

      createResume: (title?: string, template?: TemplateType) => {
        const newResume = createDefaultResume(title || 'New Resume', template || 'software');
        set((state) => ({
          resumes: { ...state.resumes, [newResume.id]: newResume },
          currentResumeId: newResume.id,
        }));
        return newResume.id;
      },

      updateResume: (id, data) => {
        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [id]: {
              ...state.resumes[id],
              ...data,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
        get().showNotification?.('Saved', 'success');
      },

      deleteResume: (id) =>
        set((state) => {
          const newResumes = { ...state.resumes };
          delete newResumes[id];
          return {
            resumes: newResumes,
            currentResumeId: state.currentResumeId === id ? null : state.currentResumeId,
          };
        }),

      duplicateResume: (id, newName) => {
        const resume = get().resumes[id];
        const newId = Date.now().toString();
        const duplicated: ResumeData = {
          ...JSON.parse(JSON.stringify(resume)),
          id: newId,
          title: newName || `${resume.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          resumes: { ...state.resumes, [newId]: duplicated },
        }));
        return newId;
      },

      updateSection: (section, data) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;
        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              [section]: data,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
        get().showNotification?.('Saved', 'success');
      },

      setSectionCollapsed: (section, collapsed) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;
        set((state) => ({
          collapsedSections: {
            ...state.collapsedSections,
            [currentResumeId]: {
              ...(state.collapsedSections[currentResumeId] || {}),
              [section]: collapsed,
            },
          },
        }));
      },

      reorderSections: (sections) => set({ sectionOrder: sections, enabledSections: sections }),

      toggleSection: (section, enabled) =>
        set((state) => ({
          enabledSections: enabled
            ? [...state.enabledSections, section]
            : state.enabledSections.filter((s) => s !== section),
          sectionOrder: enabled && !state.sectionOrder.includes(section)
            ? [...state.sectionOrder, section]
            : state.sectionOrder,
        })),

      resetSection: (section) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;
        get().saveToHistory();
        const defaultData = createDefaultResume();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              [section]: defaultData[section as keyof ResumeData],
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      duplicateItem: (section, itemId) => {
        const { currentResumeId, resumes } = get();
        if (!currentResumeId) return;
        const resume = resumes[currentResumeId];
        const sectionData = resume[section as keyof ResumeData];

        if (Array.isArray(sectionData)) {
          get().saveToHistory();
          const item = sectionData.find((i) => typeof i === 'object' && i !== null && 'id' in i && (i as { id: string }).id === itemId) as unknown as Record<string, unknown> | null;
          if (item && typeof item === 'object') {
            const duplicated = { ...item, id: Date.now().toString() };
            set((state) => ({
              resumes: {
                ...state.resumes,
                [currentResumeId]: {
                  ...state.resumes[currentResumeId],
                  [section]: [...(sectionData as unknown[]), duplicated],
                  updatedAt: new Date().toISOString(),
                },
              },
            }));
            get().showNotification?.('Added', 'success');
          }
        }
      },

      setTemplate: (template) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;
        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              template,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      saveToHistory: () => {
        set((state) => ({
          history: {
            past: [...state.history.past.slice(-19), { ...state.resumes }],
            future: [],
          },
        }));
      },

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        set((state) => ({
          resumes: previous,
          history: {
            past: state.history.past.slice(0, -1),
            future: [state.resumes, ...state.history.future],
          },
        }));
      },

      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;
        const next = history.future[0];
        set((state) => ({
          resumes: next,
          history: {
            past: [...state.history.past, state.resumes],
            future: state.history.future.slice(1),
          },
        }));
      },

      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,

      setJobDescription: (jd) => set({ jobDescription: jd }),

      showNotification: (message: string, type: 'success' | 'info' | 'error' = 'info') => {
        const id = Date.now();
        set({ notification: { message, type, id } });
        setTimeout(() => {
          // clear only if the id hasn't changed
          if (get().notification?.id === id) set({ notification: null });
        }, 1600);
      },

      addTag: (resumeId, tag) =>
        set((state) => ({
          resumes: {
            ...state.resumes,
            [resumeId]: {
              ...state.resumes[resumeId],
              tags: [...new Set([...(state.resumes[resumeId]?.tags || []), tag])],
            },
          },
        })),

      removeTag: (resumeId, tag) =>
        set((state) => ({
          resumes: {
            ...state.resumes,
            [resumeId]: {
              ...state.resumes[resumeId],
              tags: (state.resumes[resumeId]?.tags || []).filter((t) => t !== tag),
            },
          },
        })),

      addCustomSection: () => {
        const { currentResumeId, resumes } = get();
        if (!currentResumeId) return '';

        const sectionId = `custom_${Date.now()}`;
        const newSection = {
          id: sectionId,
          title: 'Custom Section',
          items: [],
        };

        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              customSections: [...(state.resumes[currentResumeId].customSections || []), newSection],
              updatedAt: new Date().toISOString(),
            },
          },
          enabledSections: [...state.enabledSections, sectionId as SectionType],
          sectionOrder: [...state.sectionOrder, sectionId as SectionType],
        }));

        get().showNotification?.('Added section', 'success');
        return sectionId;
      },

      removeCustomSection: (sectionId) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              customSections: (state.resumes[currentResumeId].customSections || []).filter(cs => cs.id !== sectionId),
              updatedAt: new Date().toISOString(),
            },
          },
          enabledSections: state.enabledSections.filter(s => s !== sectionId),
          sectionOrder: state.sectionOrder.filter(s => s !== sectionId),
        }));
      },

      updateCustomSection: (sectionId, data) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        get().saveToHistory();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              customSections: (state.resumes[currentResumeId].customSections || []).map(cs =>
                cs.id === sectionId ? { ...cs, ...data } : cs
              ),
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },
    }),
    {
      name: 'resume-builder-storage',
      storage: createJSONStorage(() => localforage),
    }
  )
);