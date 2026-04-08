"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { insights } from "../insights/data";
import {
  HiArrowRight,
  HiClock,
  HiUser,
  HiTag,
  HiSparkles,
} from "react-icons/hi2";

const InsightsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              section.querySelectorAll(".insight-hp-card"),
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }
            );
            gsap.fromTo(
              section.querySelectorAll(".insight-hp-header"),
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Show 3 most recent posts
  const featured = insights
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="insight-hp-header text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-5">
            <HiSparkles className="w-3.5 h-3.5" /> Career Intelligence
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Insights &amp;{" "}
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Career Guides
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Research-backed advice from real recruiters — on ATS, resume writing, career pivots, and more.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {featured.map((post, i) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className={`insight-hp-card group block rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-300 overflow-hidden ${
                i === 0 ? "md:col-span-1" : ""
              }`}
            >
              {/* Accent bar */}
              <div className={`h-1.5 w-full bg-linear-to-r ${post.coverColor}`} />

              <div className="p-6">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/8">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs text-gray-600 bg-white/3 px-2 py-0.5 rounded-md"
                    >
                      <HiTag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <HiUser className="w-3.5 h-3.5" />
                    {post.author.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiClock className="w-3.5 h-3.5" /> {post.readTime} min read
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm font-medium hover:bg-white/8 hover:text-white hover:border-white/35 transition-all duration-300 group"
          >
            View all articles
            <HiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
