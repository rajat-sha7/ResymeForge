'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { insights, categories } from './data';
import OptimizedLogo from '../homepage/OptimizedLogo';
import gsap from 'gsap';
import {
  HiClock,
  HiTag,
  HiMagnifyingGlass,
  HiArrowRight,
  HiSparkles,
  HiBookOpen,
  HiUser,
  HiXMark,
} from 'react-icons/hi2';

export default function InsightsPage() {
  const [search,          setSearch]          = useState('');
  const [activeCategory,  setActiveCategory]  = useState<string>('All');
  const [mounted,         setMounted]         = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    // Hero entrance
    gsap.fromTo(
      '.insights-hero-text',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
    );

    // Cards entrance
    gsap.fromTo(
      '.insight-card',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.3 },
    );
  }, [mounted, search, activeCategory]);

  const filtered = insights.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured    = insights.find(p => p.featured);
  const allCategories = ['All', ...categories];

  return (
    <div className="min-h-screen bg-[#05060f] text-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <OptimizedLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/toolbox" className="hover:text-white transition-colors">Toolbox</Link>
            <Link href="/insights" className="text-white font-medium">Insights</Link>
            <Link
              href="/builder"
              className="px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Build Resume
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden py-20 md:py-28">
        {/* Background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-175 h-100 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="insights-hero-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
            <HiSparkles className="w-3.5 h-3.5" /> Career Intelligence
          </div>
          <h1 className="insights-hero-text text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Insights &amp;
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Career Guides
            </span>
          </h1>
          <p className="insights-hero-text text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Practical, research-backed advice for every stage of your job search — from crafting an
            ATS-perfect resume to negotiating your offer.
          </p>

          {/* Search */}
          <div className="insights-hero-text max-w-lg mx-auto relative">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles, topics, or tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 !text-white !caret-white placeholder-gray-500 text-sm outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <HiXMark className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* ── Category Pills ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-600 self-center">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Featured Post ── */}
        {!search && activeCategory === 'All' && featured && (
          <Link href={`/insights/${featured.slug}`} className="block mb-14 group">
            <div className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${featured.coverColor} p-px`}>
              <div className="rounded-3xl overflow-hidden bg-[#0a0b18] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium">
                      Featured
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xl">
                    {featured.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <HiUser className="w-3.5 h-3.5" /> {featured.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HiClock className="w-3.5 h-3.5" /> {featured.readTime} min read
                    </span>
                    <span>{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                {/* Right CTA */}
                <div className="shrink-0">
                  <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${featured.coverColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl`}>
                    <HiArrowRight className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Cards Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter(p => !(!search && activeCategory === 'All' && p.featured)).map(post => (
              <Link
                key={post.slug}
                href={`/insights/${post.slug}`}
                className="insight-card group block rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-300 overflow-hidden"
              >
                {/* Cover */}
                <div className={`h-2 w-full bg-linear-to-r ${post.coverColor}`} />

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/8">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs text-gray-600 bg-white/3 px-2 py-0.5 rounded-md">
                        <HiTag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <HiUser className="w-3.5 h-3.5" /> {post.author.split(' ')[0]} {post.author.split(' ')[1]}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HiClock className="w-3.5 h-3.5" /> {post.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <HiBookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No articles found</h3>
            <p className="text-sm text-gray-600">Try adjusting your search or category filter.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <section className="border-t border-white/8 bg-white/2 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to put this into practice?</h2>
          <p className="text-gray-400 mb-7 text-sm">
            Build an ATS-optimized resume with our free builder — no sign-up required.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105"
          >
            Build My Resume <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
