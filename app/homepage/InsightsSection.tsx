import React from "react";
import Link from "next/link";
import { insights } from "../insights/data";
import Reveal from "./Reveal";
import { Eyebrow, TextLink } from "./ui";

const InsightsSection: React.FC = () => {
  const posts = [...insights].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);

  return (
    <section className="bg-white py-24 sm:py-36">
      <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Insights</Eyebrow>
            <h2 className="home-serif mt-5 text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em] text-[#151b26]">
              Guides for the job search
            </h2>
          </div>
          <TextLink href="/insights">All articles</TextLink>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link href={`/insights/${post.slug}`} className="group flex h-full flex-col rounded-[6px] bg-[#f5f4ed] p-7 sm:p-8 transition-colors hover:bg-[#efede4]">
                <p className="home-mono text-[12px] uppercase tracking-[0.04em] text-[#606060]">{post.category}</p>
                <h3 className="home-serif mt-6 text-[28px] leading-[1.12] tracking-[-0.02em] text-[#151b26] group-hover:underline decoration-1 underline-offset-4">
                  {post.title}
                </h3>
                <p className="mt-4 text-[16px] leading-[1.5] text-[#606060] line-clamp-3">{post.excerpt}</p>
                <p className="home-mono mt-auto pt-8 text-[12px] text-[#8a877f]">{post.readTime} min read</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
