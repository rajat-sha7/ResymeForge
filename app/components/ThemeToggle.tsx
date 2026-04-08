'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'resume_toolbox_theme';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setTheme(e.matches ? 'dark' : 'light');
    };
    try {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch {
      // fallback
      try {
        (mq as any).addListener(handler);
        return () => (mq as any).removeListener(handler);
      } catch {
        return;
      }
    }
  }, []);

  return (
    <div className="fixed left-6 bottom-6 z-50">
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-black/70 border rounded-lg shadow-sm hover:opacity-95"
        aria-label="Toggle theme"
      >
        <span className="text-sm">{theme === 'light' ? '🌞 Light' : '🌙 Dark'}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
