import React from "react";
import Reveal from "./Reveal";
import ScaledResume from "./ScaledResume";
import { sampleResume } from "./sampleResume";
import { Eyebrow } from "./ui";

const Card: React.FC<{ step: string; title: string; body: string; children: React.ReactNode }> = ({ step, title, body, children }) => (
  <div className="flex h-full flex-col rounded-[6px] bg-[#f5f4ed] p-6 sm:p-8">
    <div className="h-[200px] sm:h-[220px]">{children}</div>
    <p className="home-mono mt-8 text-[13px] text-[#606060]">{step}</p>
    <h3 className="mt-2 text-[24px] font-medium tracking-[-0.02em] text-[#151b26]">{title}</h3>
    <p className="mt-3 text-[17px] leading-[1.45] text-[#606060]">{body}</p>
  </div>
);

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="scroll-mt-20 bg-white py-24 sm:py-36">
    <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
      <Reveal className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="home-serif mx-auto mt-5 max-w-[1000px] text-balance text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em] text-[#151b26]">
          From a blank page to a finished PDF
        </h2>
      </Reveal>

      <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <Reveal>
          <Card step="01" title="Pick a template" body="Start from a layout made for your field. You can switch later without retyping anything.">
            <div className="flex h-full items-end justify-center gap-3">
              {(["management", "software", "academic"] as const).map((t, i) => (
                <div
                  key={t}
                  className={`w-[30%] shadow-[0_6px_20px_rgba(21,27,38,0.10)] ${i === 1 ? "mb-6 outline-2 outline-offset-4 outline-[#c1441a]" : ""}`}
                >
                  <ScaledResume template={t} data={sampleResume} crop={0.85} />
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card step="02" title="Fill in your details" body="Write each section in plain form fields. The page updates as you type, and the ATS score updates with it.">
            <div className="flex h-full flex-col justify-center gap-3" aria-hidden>
              <div className="rounded-[6px] border border-[#e3dacc] bg-white px-4 py-3">
                <p className="text-[12px] text-[#606060]">Job title</p>
                <p className="mt-0.5 text-[16px] text-[#151b26]">
                  Senior Product Engineer<span className="home-caret ml-px inline-block h-[18px] w-px translate-y-[3px] bg-[#151b26]" />
                </p>
              </div>
              <div className="rounded-[6px] border border-[#e3dacc] bg-white px-4 py-3">
                <p className="text-[12px] text-[#606060]">Achievement</p>
                <p className="mt-0.5 text-[15px] leading-snug text-[#151b26]">
                  Rebuilt the payment retry system, reducing failed payments by 18%
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card step="03" title="Download and apply" body="Export a PDF for applications, or a Word file when a recruiter asks for one they can edit.">
            <div className="flex h-full flex-col justify-center gap-3" aria-hidden>
              {[
                { name: "Alex_Morgan_Resume.pdf", tag: "PDF", color: "#c1441a" },
                { name: "Alex_Morgan_Resume.docx", tag: "DOCX", color: "#2f5bd3" },
              ].map((f) => (
                <div key={f.tag} className="flex items-center gap-3 rounded-[6px] border border-[#e3dacc] bg-white px-4 py-3">
                  <span className="home-mono rounded-[3px] px-1.5 py-0.5 text-[11px] text-white" style={{ background: f.color }}>
                    {f.tag}
                  </span>
                  <span className="truncate text-[15px] text-[#151b26]">{f.name}</span>
                  <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#606060" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v9M4 7l4 4 4-4M3 14h10" />
                  </svg>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  </section>
);

export default HowItWorks;
