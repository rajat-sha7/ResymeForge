import React from "react";
import Link from "next/link";
import OptimizedLogo from "./OptimizedLogo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/builder", label: "Resume builder" },
      { href: "/#templates", label: "Templates" },
      { href: "/toolbox", label: "Toolbox" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/about", label: "About" },
    ],
  },
];

const Footer: React.FC = () => (
  <footer className="border-t border-[#e3dacc] bg-[#f5f4ed] text-[#151b26]">
    <div className="mx-auto max-w-[1328px] px-4 sm:px-8 pt-16 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">
        <div className="flex flex-col gap-3">
          <OptimizedLogo forgeColor="text-[#151b26]" size="lg" />
          <p className="text-sm text-[#606060] max-w-sm mt-1">
            Build ATS-compliant, recruiter-approved resumes tailored to your dream roles. Free, private, and session-saved.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="home-mono text-[13px] uppercase tracking-[0.04em] text-[#606060]">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[16px] hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-16 border-t border-[#e3dacc] pt-6 text-[14px] text-[#606060]">© {new Date().getFullYear()} ResumeForge</p>
    </div>
  </footer>
);

export default Footer;
