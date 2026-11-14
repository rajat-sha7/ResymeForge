import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsightBySlug, insights } from "../data";
import { withHeadingIds } from "../toc";
import Header from "../../homepage/Header";
import Footer from "../../homepage/Footer";
import { CTABand, Eyebrow } from "../../homepage/ui";
import ShareButton from "./ShareButton";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getInsightBySlug((await params).slug);
  return post ? { title: `${post.title} – ResumeForge`, description: post.excerpt } : { title: "Article not found – ResumeForge" };
}

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function InsightPost({ params }: Params) {
  const post = getInsightBySlug((await params).slug);
  if (!post) notFound();

  const { html, headings } = withHeadingIds(post.content);
  const related = insights
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .concat(insights.filter((p) => p.slug !== post.slug))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);

  return (
    <main className="home-sans min-h-screen bg-[#f5f4ed] text-[#151b26] overflow-x-clip">
      <Header />

      {/* Title */}
      <header className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="home-mono text-[13px] uppercase tracking-[0.04em] text-[#606060]">
            <Link href="/insights" className="hover:text-[#151b26] underline-offset-4 hover:underline">
              Insights
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#151b26]">{post.category}</span>
          </nav>
          <h1 className="home-serif mt-6 max-w-[1040px] text-[44px] sm:text-[72px] leading-[1.02] tracking-[-0.035em]">{post.title}</h1>
          <p className="mt-7 max-w-[760px] text-[19px] sm:text-[22px] leading-[1.45] tracking-[-0.01em] text-[#606060]">{post.excerpt}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[#e3dacc] pt-6">
            <p className="home-mono text-[13px] text-[#606060]">
              {formatDate(post.date)} · {post.readTime} min read
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-[#e3dacc] px-3 py-1 text-[13px] text-[#55524c]">
                  {t}
                </span>
              ))}
            </div>
            <div className="sm:ml-auto">
              <ShareButton />
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1328px] grid-cols-1 gap-16 px-4 sm:px-8 lg:grid-cols-[260px_minmax(0,680px)] lg:justify-between xl:grid-cols-[260px_minmax(0,720px)_260px]">
          {/* Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Eyebrow>Contents</Eyebrow>
              <ol className="mt-5 border-l border-[#e3dacc]">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="-ml-px block border-l border-transparent py-2 pl-4 text-[15px] leading-snug text-[#606060] transition-colors hover:border-[#c1441a] hover:text-[#151b26]"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="prose-home min-w-0" dangerouslySetInnerHTML={{ __html: html }} />

          {/* Builder prompt */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 rounded-[6px] bg-[#f5f4ed] p-6">
              <p className="home-serif text-[26px] leading-[1.15] tracking-[-0.02em]">Check your own resume</p>
              <p className="mt-3 text-[15px] leading-[1.5] text-[#606060]">
                The ATS score in the builder flags the same issues this article covers.
              </p>
              <Link
                href="/builder"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-[#151b26] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[#262e3d]"
              >
                Open the builder
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <h2 className="home-serif text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.03em]">Keep reading</h2>
              <Link href="/insights" className="text-[16px] font-medium underline-offset-4 hover:underline">
                All articles →
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/insights/${p.slug}`}
                  className="group flex h-full flex-col rounded-[6px] bg-white p-7 sm:p-8 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(21,27,38,0.25)]"
                >
                  <p className="home-mono text-[12px] uppercase tracking-[0.04em] text-[#606060]">{p.category}</p>
                  <h3 className="home-serif mt-6 text-[26px] leading-[1.15] tracking-[-0.02em] group-hover:underline decoration-1 underline-offset-4">
                    {p.title}
                  </h3>
                  <p className="home-mono mt-auto pt-8 text-[12px] text-[#8a877f]">{p.readTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand title="Ready to rewrite yours?" body="Free, no account needed. Your draft is saved in your browser as you go." />
      <Footer />
    </main>
  );
}
