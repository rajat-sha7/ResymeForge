'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getInsightBySlug, insights } from '../data';
import OptimizedLogo from '../../homepage/OptimizedLogo';
import {
  HiArrowLeft,
  HiClock,
  HiUser,
  HiTag,
  HiArrowRight,
  HiCalendarDays,
  HiBriefcase,
  HiShare,
  HiCheck,
} from 'react-icons/hi2';
import gsap from 'gsap';

export default function InsightPost() {
  const params  = useParams<{ slug: string }>();
  const post    = getInsightBySlug(params.slug);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !post) return;
    gsap.fromTo('.post-hero',  { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    gsap.fromTo('.post-body',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25 });
    gsap.fromTo('.post-aside', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 });
  }, [mounted, post]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#05060f] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Article not found</h1>
          <p className="text-gray-400 mb-6">This insight doesn't exist or may have been removed.</p>
          <Link href="/insights" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-colors text-sm">
            <HiArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  // Related posts: same category, not current
  const related = insights
    .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 2);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

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

      {/* ── Hero Banner ── */}
      <div className={`relative overflow-hidden bg-linear-to-br ${post.coverColor} py-16 md:py-24`}>
        <div className="absolute inset-0 bg-[#05060f]/70" />
        {/* glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 post-hero">
          {/* Breadcrumb */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Insights
          </Link>

          {/* Category + tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full bg-linear-to-r ${post.coverColor} text-white text-xs font-semibold shadow-md`}>
              {post.category}
            </span>
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-300 text-xs">
                <HiTag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
            {post.excerpt}
          </p>

          {/* Author row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-linear-to-br ${post.coverColor} flex items-center justify-center text-xs font-bold text-white shadow`}>
                {post.author.charAt(0)}
              </div>
              <span>
                <span className="text-white font-medium">{post.author}</span>
                <span className="block text-xs text-gray-500">{post.authorRole}</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <HiCalendarDays className="w-4 h-4" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <HiClock className="w-4 h-4" /> {post.readTime} min read
            </span>
            {/* Share */}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/15 hover:bg-white/15 transition-colors text-xs"
            >
              {copied ? <HiCheck className="w-3.5 h-3.5 text-green-400" /> : <HiShare className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Article + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 flex gap-12 items-start">

        {/* ── Main article body ── */}
        <article className="post-body flex-1 min-w-0 max-w-2xl">
          <div
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── CTA banner ── */}
          <div className={`mt-12 rounded-2xl p-6 bg-linear-to-br ${post.coverColor} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative">
              <HiBriefcase className="w-7 h-7 text-white mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Apply what you've learned</h3>
              <p className="text-white/70 text-sm mb-4">
                Use ResumeForge's ATS Health Panel to check your resume score before you apply.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
              >
                Build My Resume <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── Related Posts ── */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-lg font-bold text-white mb-5">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/insights/${rel.slug}`}
                    className="group block rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all overflow-hidden"
                  >
                    <div className={`h-1.5 w-full bg-linear-to-r ${rel.coverColor}`} />
                    <div className="p-4">
                      <span className="text-xs text-gray-500 mb-2 block">{rel.category}</span>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug mb-3 line-clamp-2">
                        {rel.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><HiClock className="w-3 h-3" /> {rel.readTime} min</span>
                        <span className="flex items-center gap-1"><HiUser className="w-3 h-3" /> {rel.author.split(' ')[0]}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* ── Sidebar ── */}
        <aside className="post-aside hidden lg:block w-64 shrink-0 sticky top-24 space-y-6">

          {/* Back link */}
          <Link
            href="/insights"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Insights
          </Link>

          {/* Article meta card */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl shrink-0 bg-linear-to-br ${post.coverColor} flex items-center justify-center text-sm font-bold text-white`}>
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-white">{post.author}</div>
                <div className="text-xs text-gray-500 mt-0.5">{post.authorRole}</div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-400 border-t border-white/8 pt-3">
              <div className="flex items-center gap-2">
                <HiCalendarDays className="w-3.5 h-3.5" /> {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <HiClock className="w-3.5 h-3.5" /> {post.readTime} min read
              </div>
              <div className="flex items-center gap-2">
                <HiTag className="w-3.5 h-3.5" /> {post.category}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-500">{tag}</span>
              ))}
            </div>
          </div>

          {/* All posts in same category */}
          {insights.filter(p => p.category === post.category && p.slug !== post.slug).length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">More in {post.category}</p>
              <ul className="space-y-3">
                {insights
                  .filter(p => p.category === post.category && p.slug !== post.slug)
                  .map(p => (
                    <li key={p.slug}>
                      <Link
                        href={`/insights/${p.slug}`}
                        className="text-sm text-gray-400 hover:text-white transition-colors line-clamp-2 leading-snug"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/builder"
            className={`block rounded-2xl p-5 bg-linear-to-br ${post.coverColor} relative overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative">
              <p className="text-xs font-semibold text-white/80 mb-1">Ready to apply?</p>
              <h3 className="text-base font-bold text-white mb-3">Build your resume</h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-white/20 px-3 py-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                Get started <HiArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </aside>
      </div>

    </div>
  );
}
