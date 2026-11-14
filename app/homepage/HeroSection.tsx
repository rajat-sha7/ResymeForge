import React from "react";
import Reveal from "./Reveal";
import ScaledResume from "./ScaledResume";
import AtsPanel from "./AtsPanel";
import { sampleResume } from "./sampleResume";
import { PrimaryButton, TextLink, CursorTag } from "./ui";

const sections = ["Contact", "Summary", "Experience", "Skills", "Projects", "Education"];

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden bg-[#f5f4ed] pt-20 sm:pt-32">
    <div className="mx-auto max-w-[1328px] px-4 sm:px-8 text-center">
      <Reveal>
        <h1 className="home-serif mx-auto max-w-[1100px] text-[52px] leading-[0.98] sm:text-[84px] lg:text-[104px] tracking-[-0.04em] text-[#151b26]">
          Write a resume that makes it to a person
        </h1>
        <p className="mx-auto mt-7 max-w-[760px] text-balance text-[19px] sm:text-[24px] leading-[1.3] tracking-[-0.02em] text-[#606060]">
          Six templates built for different fields, and a checker that flags what applicant tracking software will
          trip on as you write.
        </p>
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          <PrimaryButton href="/builder">Build my resume</PrimaryButton>
          <TextLink href="#templates">See the templates</TextLink>
        </div>
      </Reveal>
    </div>

    {/* Product window */}
    <Reveal delay={200} className="relative mx-auto mt-16 sm:mt-24 max-w-[1120px] px-4 sm:px-8">
      <div className="rounded-t-[14px] border border-b-0 border-[#d9d4c7] bg-[#fbfaf6] p-2 sm:p-3 pb-0 sm:pb-0 shadow-[0_-20px_60px_-30px_rgba(21,27,38,0.25)]">
        <div className="flex items-center gap-2 px-2 pb-3 pt-1">
          <span className="h-3 w-3 rounded-full bg-[#d9d4c7]" />
          <span className="h-3 w-3 rounded-full bg-[#d9d4c7]" />
          <span className="h-3 w-3 rounded-full bg-[#d9d4c7]" />
          <span className="home-mono ml-4 hidden sm:inline text-[12px] text-[#8a877f]">Alex Morgan — Software template</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_260px] overflow-hidden rounded-t-[8px] border border-b-0 border-[#e6e2d8] bg-white text-left">
          {/* Section list */}
          <aside className="hidden md:block border-r border-[#efece4] p-5">
            <p className="home-mono text-[11px] uppercase tracking-[0.06em] text-[#606060]">Sections</p>
            <ul className="mt-3 space-y-1">
              {sections.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-[14px] ${
                    i === 2 ? "bg-[#f5f4ed] font-medium text-[#151b26]" : "text-[#606060]"
                  }`}
                >
                  {s}
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="#c9c4b8" aria-hidden>
                    <circle cx="2.5" cy="3" r="1.2" /><circle cx="7.5" cy="3" r="1.2" />
                    <circle cx="2.5" cy="7" r="1.2" /><circle cx="7.5" cy="7" r="1.2" />
                    <circle cx="2.5" cy="11" r="1.2" /><circle cx="7.5" cy="11" r="1.2" />
                  </svg>
                </li>
              ))}
            </ul>
          </aside>

          {/* Live page */}
          <div className="relative bg-[#efede6] px-5 pt-6 sm:px-12 sm:pt-10">
            <div className="mx-auto max-w-[460px] shadow-[0_8px_30px_rgba(21,27,38,0.10)]">
              <ScaledResume template="software" data={sampleResume} crop={0.62} />
            </div>
            <CursorTag label="You" color="#151b26" text="#fff" className="home-drift absolute left-[66%] top-[52%]" />
          </div>

          {/* ATS panel */}
          <aside className="hidden md:block border-l border-[#efece4] p-6">
            <AtsPanel />
          </aside>
        </div>
      </div>
    </Reveal>
  </section>
);

export default HeroSection;
