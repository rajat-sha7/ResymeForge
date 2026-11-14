import React from "react";
import { calculateATSScore } from "../utils/ats";
import { sampleResume } from "./sampleResume";

/** The ATS health readout, computed by the app's real scorer on the sample resume. */
const AtsPanel: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const score = calculateATSScore(sampleResume);
  const rows = [
    { label: "Formatting", value: score.formatting },
    { label: "Completeness", value: score.completeness },
    { label: "Keywords", value: score.keywordMatch },
  ];
  const warnings = score.warnings.slice(0, compact ? 1 : 3);

  return (
    <div className="text-[#151b26]">
      <p className="home-mono text-[11px] uppercase tracking-[0.06em] text-[#606060]">ATS health</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="home-serif text-[56px] leading-none tracking-[-0.03em]">{score.overall}</span>
        <span className="text-[14px] text-[#606060]">/ 100</span>
      </div>
      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#606060]">{r.label}</span>
              <span className="font-medium">{r.value}</span>
            </div>
            <div className="mt-1.5 h-[6px] rounded-full bg-[#ebe8df]">
              <div className="h-full rounded-full bg-[#5fc788]" style={{ width: `${r.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-[#e6e2d8] pt-4">
        <p className="home-mono text-[11px] uppercase tracking-[0.06em] text-[#606060]">Suggestions</p>
        {warnings.length ? (
          <ul className="mt-2 space-y-2">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug">
                <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${w.severity === "high" ? "bg-[#c1441a]" : "bg-[#e0b33a]"}`} />
                {w.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px]">No issues found.</p>
        )}
      </div>
    </div>
  );
};

export default AtsPanel;
