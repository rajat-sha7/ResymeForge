import React from "react";
import Reveal from "./Reveal";
import ScaledResume from "./ScaledResume";
import { sampleResume } from "./sampleResume";
import { PrimaryButton, CursorTag } from "./ui";

const CTASection: React.FC = () => (
  <section className="overflow-hidden bg-[#f5f4ed] py-24 sm:py-36">
    <div className="mx-auto grid max-w-[1328px] grid-cols-1 lg:grid-cols-2 items-center gap-16 px-4 sm:px-8">
      <Reveal>
        <h2 className="home-serif text-[56px] sm:text-[88px] lg:text-[100px] leading-[0.95] tracking-[-0.045em] text-[#151b26]">
          Your next application starts here
        </h2>
        <p className="mt-6 max-w-[480px] text-[19px] leading-[1.45] text-[#606060]">Free to use, and you don&apos;t need an account.</p>
        <PrimaryButton href="/builder" className="mt-10">
          Build my resume
        </PrimaryButton>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 560" fill="none" aria-hidden>
            <ellipse cx="280" cy="280" rx="262" ry="150" stroke="#b5ae9f" strokeWidth="1.5" strokeDasharray="6 8" />
            <ellipse cx="280" cy="280" rx="150" ry="262" stroke="#b5ae9f" strokeWidth="1.5" strokeDasharray="6 8" />
          </svg>
          <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2 shadow-[0_24px_60px_-24px_rgba(21,27,38,0.4)]">
            <ScaledResume template="healthcare" data={sampleResume} crop={0.9} />
          </div>
          <CursorTag label="You" color="#151b26" text="#fff" className="home-drift absolute left-[6%] top-[14%]" />
          <CursorTag label="ATS" color="#74d99a" className="home-drift-slow absolute right-[2%] top-[30%]" />
          <CursorTag label="Recruiter" color="#c1441a" text="#fff" className="home-drift absolute bottom-[16%] left-[0%]" />
          <CursorTag label="Hiring manager" color="#f2cd4b" className="home-drift-slow absolute bottom-[4%] right-[4%]" />
        </div>
      </Reveal>
    </div>
  </section>
);

export default CTASection;
