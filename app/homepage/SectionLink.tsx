"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const PENDING_KEY = "rf:scroll-to-section";

/** Smoothly scrolls a homepage section into view. Sections set their own scroll-margin for the sticky header. */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Wait a frame so anything closing on click (e.g. the mobile menu) has released scroll first.
  requestAnimationFrame(() => el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }));
}

type SectionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** id of the homepage section to scroll to. */
  section: string;
};

/**
 * Link to a homepage section that scrolls it into view without putting `#id` in the URL.
 * From another page it navigates to `/` first, then scrolls once the homepage mounts.
 */
export const SectionLink: React.FC<SectionLinkProps> = ({ section, onClick, ...rest }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Link
      {...rest}
      href="/"
      onClick={(e) => {
        onClick?.(e);
        // Let modified clicks (new tab/window) behave like a normal link.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (pathname === "/") {
          scrollToSection(section);
          return;
        }
        try {
          sessionStorage.setItem(PENDING_KEY, section);
        } catch {
          /* storage unavailable: we still land on the homepage */
        }
        router.push("/");
      }}
    />
  );
};

/** Mounted on the homepage: finishes a scroll requested from another page, and strips any legacy `#id` from the URL. */
export const SectionScrollHandler: React.FC = () => {
  useEffect(() => {
    let target: string | null = null;
    try {
      target = sessionStorage.getItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
    const hash = window.location.hash.slice(1);
    if (hash) {
      target ??= decodeURIComponent(hash);
      // Pass `null` state so Next's router syncs to the new URL instead of restoring the hash later.
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (target) scrollToSection(target);
  }, []);
  return null;
};
