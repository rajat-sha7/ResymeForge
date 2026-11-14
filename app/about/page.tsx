import type { Metadata } from "next";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import Reveal from "../homepage/Reveal";
import ScaledResume from "../homepage/ScaledResume";
import { sampleResume } from "../homepage/sampleResume";
import { CTABand, Eyebrow, CursorTag } from "../homepage/ui";

export const metadata: Metadata = {
  title: "About – ResumeForge",
  description: "Why ResumeForge exists, what it does, and how it handles your data.",
};

const principles = [
  {
    title: "Free to use",
    body: "Every template, the ATS checker, and both export formats are available without paying.",
  },
  {
    title: "No account",
    body: "Open the builder and start typing. There's no sign-up form between you and your resume.",
  },
  {
    title: "Readable by software",
    body: "Templates are a single column of real text, without tables or images, so parsers can pull out your details.",
  },
  {
    title: "Scores you can act on",
    body: "Each deduction in the ATS score comes with a note on what caused it and which section to change.",
  },
];

const data = [
  {
    title: "Your drafts",
    body: "Saved in your browser's storage on this device as you type. Clearing site data for ResumeForge deletes them, so export a copy of anything you want to keep.",
  },
  {
    title: "Word export",
    body: "The .docx file is generated in your browser. Nothing is sent to a server.",
  },
  {
    title: "PDF export",
    body: "Your resume is sent to the server so a browser engine can render it as a PDF. The file is returned to you to download.",
  },
];

export default function AboutPage() {
  return (
    <main className="home-sans min-h-screen bg-[#f5f4ed] text-[#151b26] overflow-x-clip">
      <Header />

      {/* Intro */}
      <section className="pt-16 sm:pt-28 pb-20 sm:pb-32">
        <div className="mx-auto grid max-w-[1328px] grid-cols-1 items-center gap-16 px-4 sm:px-8 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <Eyebrow>About</Eyebrow>
            <h1 className="home-serif mt-5 text-[52px] sm:text-[84px] leading-[0.98] tracking-[-0.04em]">
              A resume&apos;s format shouldn&apos;t cost anyone an interview
            </h1>
            <p className="mt-8 max-w-[620px] text-[19px] sm:text-[22px] leading-[1.45] tracking-[-0.01em] text-[#606060]">
              Most applications are read by an applicant tracking system before a person sees them. Those systems are easily
              confused by columns, tables, and text inside images. ResumeForge keeps your resume in a format they can read, so
              it&apos;s judged on what you&apos;ve done.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[460px]">
              <svg className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)]" viewBox="0 0 540 600" fill="none" aria-hidden>
                <ellipse cx="270" cy="300" rx="250" ry="280" stroke="#b5ae9f" strokeWidth="1.5" strokeDasharray="6 8" />
              </svg>
              <div className="relative rotate-[-2deg] shadow-[0_30px_70px_-30px_rgba(21,27,38,0.45)]">
                <ScaledResume template="management" data={sampleResume} crop={0.62} />
              </div>
              <CursorTag label="ATS" color="#74d99a" className="home-drift absolute -right-4 top-[18%]" />
              <CursorTag label="Recruiter" color="#c1441a" text="#fff" className="home-drift-slow absolute -left-6 bottom-[14%]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white py-24 sm:py-36">
        <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
          <Reveal className="max-w-[820px]">
            <Eyebrow>How we build it</Eyebrow>
            <h2 className="home-serif mt-5 text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em]">Four rules the product follows</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-[6px] bg-[#f5f4ed] p-7 sm:p-8">
                  <p className="home-mono text-[13px] text-[#606060]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-12 text-[22px] font-medium tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.5] text-[#606060]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1328px] grid-cols-1 gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Eyebrow>Your data</Eyebrow>
            <h2 className="home-serif mt-5 text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em]">Where your resume goes</h2>
            <p className="mt-6 max-w-[520px] text-[19px] leading-[1.45] text-[#606060]">
              There are no accounts, so there&apos;s no profile of you on our side. Here is exactly what happens to what you write.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul>
              {data.map((d) => (
                <li key={d.title} className="border-t border-[#d9d4c7] py-7 last:border-b">
                  <h3 className="text-[18px] font-medium">{d.title}</h3>
                  <p className="mt-2 text-[17px] leading-[1.55] text-[#55524c]">{d.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CTABand title="See it for yourself" body="Pick a template and start writing. It takes a few minutes to get a first draft." />
      <Footer />
    </main>
  );
}
