"use client";
import React, { useEffect, useRef, useState } from "react";
import { ResumeData, TemplateType } from "../types/resume";
import SoftwareTemplate from "../templates/SoftwareTemplate";
import ManagementTemplate from "../templates/ManagementTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import AcademicTemplate from "../templates/AcademicTemplate";
import SalesTemplate from "../templates/SalesTemplate";
import HealthcareTemplate from "../templates/HealthcareTemplate";

const templates: Record<TemplateType, React.FC<{ data: ResumeData }>> = {
  software: SoftwareTemplate,
  management: ManagementTemplate,
  creative: CreativeTemplate,
  academic: AcademicTemplate,
  sales: SalesTemplate,
  healthcare: HealthcareTemplate,
};

// US Letter at 96dpi
const PAGE_W = 816;
const PAGE_H = 1056;

interface Props {
  template: TemplateType;
  data: ResumeData;
  /** Fraction of the page height to show (1 = whole page). */
  crop?: number;
  className?: string;
}

/** Renders a real resume template at page size and scales it to fit its container. */
const ScaledResume: React.FC<Props> = ({ template, data, crop = 1, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const Template = templates[template];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      inert
      className={`relative overflow-hidden bg-white select-none ${className}`}
      style={{ aspectRatio: `${PAGE_W} / ${PAGE_H * crop}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-300 [&>div]:!shadow-none [&>div]:!rounded-none"
        style={{ width: PAGE_W, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <Template data={data} />
      </div>
    </div>
  );
};

export default ScaledResume;
