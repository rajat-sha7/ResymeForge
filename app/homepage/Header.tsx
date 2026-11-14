"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OptimizedLogo from "./OptimizedLogo";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#templates", label: "Templates" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Link
        href="/builder"
        className="block bg-[#151b26] px-4 py-3 text-center text-[14px] sm:text-[15px] font-medium text-white hover:text-white/85"
      >
        Paste a job description and see which keywords your resume is missing →
      </Link>

      <header className="sticky top-0 z-50 border-b border-[#e3dacc] bg-[#f5f4ed]/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1328px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center hover:opacity-85 transition-opacity" title="ResumeForge Home">
            <OptimizedLogo forgeColor="text-[#151b26]" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`text-[16px] font-medium text-[#151b26] transition-opacity hover:opacity-70 ${
                  isActive(l.href) ? "underline decoration-[#c1441a] decoration-2 underline-offset-[10px]" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/builder"
              className="hidden md:inline-flex h-12 items-center rounded-full bg-[#151b26] px-5 text-[16px] font-medium text-white hover:bg-[#262e3d] transition-colors"
            >
              Start building
            </Link>
            <button
              type="button"
              className="md:hidden -mr-2 p-2 text-[#151b26]"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 8h16M3 14h16" />}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-[#f5f4ed] transition-opacity duration-200 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-6 pt-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="home-serif border-b border-[#e3dacc] py-4 text-[32px] tracking-[-0.02em] text-[#151b26]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/builder"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-[#151b26] px-6 text-[16px] font-medium text-white"
            >
              Start building
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
