import React from "react";
import Link from "next/link";
import { SectionLink } from "./SectionLink";

export const ink = "#151b26";

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`home-mono text-[13px] sm:text-[14px] uppercase tracking-[0.04em] text-[#151b26] ${className}`}>{children}</p>
);

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
);

/** Primary call to action: rust pill with a circled arrow. */
export const PrimaryButton: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`group inline-flex h-14 items-center gap-4 rounded-full bg-[#c1441a] pl-6 pr-2 text-[17px] font-medium text-white shadow-[0_10px_28px_-8px_rgba(193,68,26,0.55)] transition-colors hover:bg-[#a9390f] ${className}`}
  >
    {children}
    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/50 transition-transform duration-300 group-hover:translate-x-0.5">
      <Arrow />
    </span>
  </Link>
);

/** Arrow text link. Pass `section` instead of `href` to scroll to a homepage section without a `#id` in the URL. */
export const TextLink: React.FC<{ children: React.ReactNode } & ({ href: string; section?: never } | { section: string; href?: never })> = ({
  href,
  section,
  children,
}) => {
  const className = "group inline-flex items-center gap-2 text-[17px] font-medium text-[#151b26] underline-offset-4 hover:underline";
  const content = (
    <>
      {children}
      <span className="transition-transform group-hover:translate-x-0.5">
        <Arrow />
      </span>
    </>
  );
  return section ? (
    <SectionLink section={section} className={className}>
      {content}
    </SectionLink>
  ) : (
    <Link href={href!} className={className}>
      {content}
    </Link>
  );
};

/** A cursor with a name tag, as seen in multiplayer editors. */
export const CursorTag: React.FC<{ label: string; color: string; text?: string; className?: string }> = ({
  label,
  color,
  text = ink,
  className = "",
}) => (
  <div className={`pointer-events-none flex items-start ${className}`} aria-hidden>
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path d="M3 2.5l19 8.2-8.4 2.6-3.3 8.2L3 2.5z" fill={color} />
    </svg>
    <span className="mt-5 -ml-1 whitespace-nowrap rounded-[3px] px-2 py-0.5 text-[14px] sm:text-[16px]" style={{ background: color, color: text }}>
      {label}
    </span>
  </div>
);

/** Closing call to action used at the bottom of inner pages. */
export const CTABand: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <section className="bg-[#e3dacc] py-20 sm:py-28">
    <div className="mx-auto flex max-w-[1328px] flex-col gap-10 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[760px]">
        <h2 className="home-serif text-[44px] sm:text-[64px] leading-[1.02] tracking-[-0.035em] text-[#151b26]">{title}</h2>
        <p className="mt-5 text-[19px] leading-[1.45] text-[#55524c]">{body}</p>
      </div>
      <PrimaryButton href="/builder" className="shrink-0 self-start lg:self-auto">
        Build my resume
      </PrimaryButton>
    </div>
  </section>
);
