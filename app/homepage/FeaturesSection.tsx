import React from "react";
import Reveal from "./Reveal";
import AtsPanel from "./AtsPanel";
import { Eyebrow, CursorTag } from "./ui";

const features = [
  {
    title: "ATS health score",
    body: "Checks formatting, missing contact details, and weak wording, and tells you which section to fix.",
  },
  {
    title: "Job description matching",
    body: "Paste a job post to see which of its keywords your resume already covers and which it doesn't.",
  },
  {
    title: "Sections you control",
    body: "Turn sections on or off, reset one to start over, or add a custom section of your own.",
  },
  {
    title: "Saved as you go",
    body: "Drafts are stored in your browser, so you can close the tab and pick up where you left off. Undo works too.",
  },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="scroll-mt-20 bg-[#e3dacc] py-24 sm:py-36">
    <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
      <Reveal className="text-center">
        <h2 className="home-serif mx-auto max-w-[900px] text-balance text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em] text-[#151b26]">
          Writing, checking, and exporting in one editor
        </h2>
      </Reveal>

      <div className="mt-14 sm:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        <Reveal>
          <div className="relative overflow-hidden rounded-[6px] bg-[#f5f4ed] px-6 py-12 sm:px-16 sm:py-20">
            <svg className="pointer-events-none absolute -right-24 -top-10 h-[420px] w-[420px]" viewBox="0 0 420 420" fill="none" aria-hidden>
              <circle cx="210" cy="210" r="200" stroke="#5fc788" strokeWidth="2" />
            </svg>
            <svg className="pointer-events-none absolute -left-40 bottom-[-180px] h-[420px] w-[420px]" viewBox="0 0 420 420" fill="none" aria-hidden>
              <circle cx="210" cy="210" r="200" stroke="#b5ae9f" strokeWidth="1.5" strokeDasharray="6 8" />
            </svg>
            <div className="relative mx-auto max-w-[340px] rounded-[10px] bg-white p-6 shadow-[0_20px_50px_-20px_rgba(21,27,38,0.25)]">
              <AtsPanel />
            </div>
            <CursorTag label="Recruiter" color="#c1441a" text="#fff" className="home-drift-slow absolute bottom-8 right-6 sm:right-14" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Eyebrow>In the editor</Eyebrow>
          <h3 className="mt-5 text-[32px] sm:text-[40px] font-light leading-[1.15] tracking-[-0.03em] text-[#151b26]">
            Catch problems before a recruiter&apos;s software does
          </h3>
          <ul className="mt-10">
            {features.map((f) => (
              <li key={f.title} className="border-t border-[#cbc3b4] py-7">
                <h4 className="text-[18px] font-medium text-[#151b26]">{f.title}</h4>
                <p className="mt-2 text-[17px] leading-[1.5] text-[#55524c]">{f.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
