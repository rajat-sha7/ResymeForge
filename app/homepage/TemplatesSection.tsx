"use client";
import React, { useState } from "react";
import { TemplateType } from "../types/resume";
import ResumeNameModal from "../components/ResumeNameModal";
import Reveal from "./Reveal";
import ScaledResume from "./ScaledResume";
import { sampleResume } from "./sampleResume";
import { Eyebrow } from "./ui";

const templates: { id: TemplateType; name: string; body: string }[] = [
  { id: "software", name: "Software", body: "Skills grouped by type, with room for projects and links to GitHub and a portfolio." },
  { id: "management", name: "Management", body: "Opens with a summary and experience, with key projects called out before skills." },
  { id: "creative", name: "Creative", body: "A quieter layout that puts experience first and leaves space for portfolio work." },
  { id: "academic", name: "Academic", body: "Education comes first, with sections for research, competencies, and awards." },
  { id: "sales", name: "Sales", body: "Leads with experience and gives notable achievements a section of their own." },
  { id: "healthcare", name: "Healthcare", body: "Licenses and certifications sit at the top, where hiring teams look first." },
];

const TemplatesSection: React.FC = () => {
  const [active, setActive] = useState<TemplateType>("software");
  const [modal, setModal] = useState<TemplateType | null>(null);
  const current = templates.find((t) => t.id === active)!;

  return (
    <section id="templates" className="scroll-mt-20 bg-[#f5f4ed] py-24 sm:py-36">
      <div className="mx-auto max-w-[1328px] px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 items-center">
          <Reveal>
            <Eyebrow>Templates</Eyebrow>
            <h2 className="home-serif mt-5 text-[40px] sm:text-[60px] leading-[1.05] tracking-[-0.03em] text-[#151b26]">
              Six layouts, each arranged for a field
            </h2>
            <p className="mt-6 max-w-[520px] text-[19px] leading-[1.45] text-[#606060]">
              Every template is built from real, selectable text rather than images, so applicant tracking software can read
              it. What changes is the order of sections and what each one emphasizes.
            </p>

            <div role="tablist" aria-label="Templates" className="mt-10 border-t border-[#e3dacc]">
              {templates.map((t) => {
                const selected = t.id === active;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(t.id)}
                    className={`block w-full border-b border-[#e3dacc] py-4 text-left transition-colors ${
                      selected ? "text-[#151b26]" : "text-[#8a877f] hover:text-[#151b26]"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-[20px] font-medium tracking-[-0.01em]">{t.name}</span>
                      <span
                        className={`h-2 w-2 rounded-full bg-[#c1441a] transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}
                      />
                    </span>
                    {selected && <span className="mt-2 block max-w-[460px] text-[16px] leading-[1.45] text-[#606060]">{t.body}</span>}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setModal(active)}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-[#151b26] px-6 text-[16px] font-medium text-white hover:bg-[#262e3d] transition-colors"
            >
              Use the {current.name} template
            </button>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative rounded-[6px] bg-[#e3dacc] p-6 sm:p-14">
              <div key={active} className="home-fade mx-auto max-w-[520px] shadow-[0_24px_60px_-24px_rgba(21,27,38,0.35)]">
                <ScaledResume template={active} data={sampleResume} />
              </div>
              <p className="home-mono mt-5 text-center text-[12px] text-[#6f6a5f]">Sample resume shown in the {current.name} template</p>
            </div>
          </Reveal>
        </div>
      </div>

      {modal && <ResumeNameModal template={modal} onClose={() => setModal(null)} />}
    </section>
  );
};

export default TemplatesSection;
