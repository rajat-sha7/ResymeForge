"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { insights, categories } from "./data";
import { withHeadingIds } from "./toc";
import Reveal from "../homepage/Reveal";
import { Eyebrow } from "../homepage/ui";

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const InsightsBrowser: React.FC = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const featured = insights.find((p) => p.featured) ?? insights[0];
  const featuredHeadings = useMemo(() => withHeadingIds(featured.content).headings.slice(0, 5), [featured]);
  const showFeatured = !query && category === "All";

  const q = query.trim().toLowerCase();
  const results = insights.filter((p) => {
    const inCategory = category === "All" || p.category === category;
    const matches =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return inCategory && matches && !(showFeatured && p.slug === featured.slug);
  });

  return (
    <>
      {/* Hero */}
      <section className="pt-16 sm:pt-28 pb-14 sm:pb-20">
        <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
          <Reveal>
            <Eyebrow>Insights</Eyebrow>
            <h1 className="home-serif mt-5 max-w-[900px] text-[52px] sm:text-[88px] leading-[0.98] tracking-[-0.04em]">
              Guides for the job search
            </h1>
            <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-[560px] text-[19px] sm:text-[22px] leading-[1.4] tracking-[-0.01em] text-[#606060]">
                How applicant tracking systems read resumes, how to write each section, and what to do when you&apos;re changing careers.
              </p>
              <label className="relative block w-full lg:w-[380px]">
                <span className="sr-only">Search articles</span>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#606060" strokeWidth="1.5" aria-hidden>
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  className="h-12 w-full rounded-full border border-[#d9d4c7] bg-white pl-11 pr-4 text-[16px] outline-none transition-colors focus:border-[#151b26]"
                />
              </label>
            </div>
          </Reveal>

          <div role="tablist" aria-label="Categories" className="mt-10 flex flex-wrap gap-2 border-t border-[#e3dacc] pt-6">
            {["All", ...categories].map((c) => {
              const selected = c === category;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(c)}
                  className={`home-mono h-9 rounded-full px-4 text-[13px] uppercase tracking-[0.03em] transition-colors ${
                    selected ? "bg-[#151b26] text-white" : "border border-[#d9d4c7] text-[#151b26] hover:border-[#151b26]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
          {/* Featured */}
          {showFeatured && (
            <Reveal>
              <Link
                href={`/insights/${featured.slug}`}
                className="group mb-16 grid grid-cols-1 overflow-hidden rounded-[6px] bg-[#f5f4ed] lg:grid-cols-[1.4fr_1fr]"
              >
                <div className="p-8 sm:p-14">
                  <p className="home-mono text-[12px] uppercase tracking-[0.04em] text-[#c1441a]">Featured · {featured.category}</p>
                  <h2 className="home-serif mt-6 text-[36px] sm:text-[52px] leading-[1.05] tracking-[-0.03em] group-hover:underline decoration-1 underline-offset-[6px]">
                    {featured.title}
                  </h2>
                  <p className="mt-6 max-w-[620px] text-[18px] leading-[1.55] text-[#606060]">{featured.excerpt}</p>
                  <p className="home-mono mt-10 text-[12px] text-[#8a877f]">
                    {formatDate(featured.date)} · {featured.readTime} min read
                  </p>
                </div>
                <div className="relative border-t border-[#e3dacc] bg-[#e3dacc] p-8 sm:p-14 lg:border-l lg:border-t-0">
                  <svg className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px]" viewBox="0 0 380 380" fill="none" aria-hidden>
                    <circle cx="190" cy="190" r="180" stroke="#b5ae9f" strokeWidth="1.5" strokeDasharray="6 8" />
                  </svg>
                  <p className="home-mono relative text-[12px] uppercase tracking-[0.04em] text-[#55524c]">In this article</p>
                  <ol className="relative mt-5 space-y-3">
                    {featuredHeadings.map((h, i) => (
                      <li key={h.id} className="flex gap-4 border-b border-[#cbc3b4] pb-3 text-[17px] text-[#151b26]">
                        <span className="home-mono pt-0.5 text-[12px] text-[#8a877f]">{String(i + 1).padStart(2, "0")}</span>
                        {h.text}
                      </li>
                    ))}
                  </ol>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((post, i) => (
                <Reveal key={post.slug} delay={(i % 3) * 70}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex h-full flex-col rounded-[6px] bg-[#f5f4ed] p-7 sm:p-8 transition-colors hover:bg-[#efede4]"
                  >
                    <p className="home-mono text-[12px] uppercase tracking-[0.04em] text-[#606060]">{post.category}</p>
                    <h3 className="home-serif mt-6 text-[28px] leading-[1.12] tracking-[-0.02em] group-hover:underline decoration-1 underline-offset-4">
                      {post.title}
                    </h3>
                    <p className="mt-4 text-[16px] leading-[1.5] text-[#606060] line-clamp-3">{post.excerpt}</p>
                    <p className="home-mono mt-auto pt-8 text-[12px] text-[#8a877f]">
                      {formatDate(post.date)} · {post.readTime} min read
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[6px] bg-[#f5f4ed] px-6 py-20 text-center">
              <p className="home-serif text-[32px] tracking-[-0.02em]">No articles match that search</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="mt-6 text-[16px] font-medium underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default InsightsBrowser;
