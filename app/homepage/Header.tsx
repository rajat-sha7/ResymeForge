"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import OptimizedLogo from "./OptimizedLogo";

const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Simple CSS-driven mount animation (more reliable than GSAP for SPA navigation)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      // Start with original background, become transparent after 300px scroll
      const scrolled = window.scrollY > 300;
      setIsScrolled(scrolled);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 transform ${
        isScrolled
          ? 'backdrop-blur-2xl bg-linear-to-r from-white/10 via-white/5 to-white/10 border-b border-white/30 shadow-2xl shadow-black/60'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{
        background: isScrolled
          ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0.12) 100%)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(32px) saturate(200%) contrast(120%) brightness(110%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(32px) saturate(200%) contrast(120%) brightness(110%)' : 'none',
        boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset' : 'none',
      }}
    >
      {/* mount animation classes */}
      <div className={`${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'} transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <OptimizedLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="relative text-gray-200 hover:text-white transition-all duration-500 text-sm font-medium tracking-wide group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 drop-shadow-sm">Features</span>
              <div className="absolute inset-0 bg-linear-to-r from-white/15 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
              <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-linear-to-r from-blue-300 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full" />
            </Link>
            <Link
              href="#templates"
              className="relative text-gray-200 hover:text-white transition-all duration-500 text-sm font-medium tracking-wide group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 drop-shadow-sm">Templates</span>
              <div className="absolute inset-0 bg-linear-to-r from-white/15 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
              <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-linear-to-r from-blue-300 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full" />
            </Link>
            <Link
              href="/insights"
              className="relative text-gray-200 hover:text-white transition-all duration-500 text-sm font-medium tracking-wide group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 drop-shadow-sm">Insights</span>
              <div className="absolute inset-0 bg-linear-to-r from-white/15 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
              <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-linear-to-r from-blue-300 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full" />
            </Link>
            <Link
              href="/about"
              className="relative text-gray-200 hover:text-white transition-all duration-500 text-sm font-medium tracking-wide group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10 drop-shadow-sm">About</span>
              <div className="absolute inset-0 bg-linear-to-r from-white/15 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
              <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-linear-to-r from-blue-300 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full" />
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/builder"
              className="relative px-6 py-2 bg-linear-to-r from-white/20 via-white/15 to-white/20 hover:from-white/30 hover:via-white/25 hover:to-white/30 text-white rounded-full font-medium text-sm border border-white/40 hover:border-white/60 transition-all duration-500 hover:scale-105 backdrop-blur-xl shadow-xl shadow-white/20 hover:shadow-2xl hover:shadow-white/30 group overflow-hidden"
              style={{
                backdropFilter: 'blur(16px) saturate(150%)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%)',
              }}
            >
              <span className="relative z-10 drop-shadow-sm">Get Started</span>
              <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden" style={{borderRadius: '9999px'}}>
                <div className="absolute left-0 top-0 h-full w-full bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" style={{height: '100%', borderRadius: '9999px'}} />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </>
              )}
            </svg>
          </button>

          {/* Mobile Menu Overlay */}
          <div
            className={`fixed inset-0 top-14 sm:top-16 md:hidden z-40 transition-all duration-100 ${
              mobileMenuOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Frozen Glass Backdrop */}
            <div
              className="absolute inset-0 bg-linear-to-br from-white/15 via-white/8 to-white/15"
              style={{
                backdropFilter: 'blur(40px) saturate(180%) contrast(130%) brightness(115%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%) contrast(130%) brightness(115%)',
              }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content with Frozen Glass */}
            <div
              className="relative bg-linear-to-b from-white/10 via-white/5 to-white/10 border-t border-white/30 shadow-2xl"
              style={{
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
              }}
            >
              <nav className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] space-y-8 px-4">
                <Link
                  href="#features"
                  className="relative text-white text-xl font-medium hover:text-blue-200 transition-all duration-500 group px-6 py-3 rounded-2xl"
                  onClick={handleMobileLinkClick}
                >
                  <span className="relative z-10 drop-shadow-sm">Features</span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </Link>
                <Link
                  href="#templates"
                  className="relative text-white text-xl font-medium hover:text-blue-200 transition-all duration-500 group px-6 py-3 rounded-2xl"
                  onClick={handleMobileLinkClick}
                >
                  <span className="relative z-10 drop-shadow-sm">Templates</span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </Link>
                <Link
                  href="/insights"
                  className="relative text-white text-xl font-medium hover:text-blue-200 transition-all duration-500 group px-6 py-3 rounded-2xl"
                  onClick={handleMobileLinkClick}
                >
                  <span className="relative z-10 drop-shadow-sm">Insights</span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </Link>
                <Link
                  href="/about"
                  className="relative text-white text-xl font-medium hover:text-blue-200 transition-all duration-500 group px-6 py-3 rounded-2xl"
                  onClick={handleMobileLinkClick}
                >
                  <span className="relative z-10 drop-shadow-sm">About</span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </Link>
                <div className="pt-8">
                  <Link
                    href="/builder"
                    className="relative px-8 py-4 bg-linear-to-r from-blue-500 via-purple-600 to-blue-500 hover:from-blue-400 hover:via-purple-500 hover:to-blue-400 text-white rounded-full font-semibold text-lg transition-all duration-500 hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 group overflow-hidden"
                    style={{
                      backdropFilter: 'blur(12px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(12px) saturate(140%)',
                    }}
                    onClick={handleMobileLinkClick}
                  >
                    <span className="relative z-10 drop-shadow-sm">Get Started</span>
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden" style={{borderRadius: '9999px'}}>
                      <div className="absolute left-0 top-0 h-full w-full bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" style={{height: '100%', borderRadius: '9999px'}} />
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
