"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import HeroScene from "./HeroScene";

interface HeroSectionProps {
  mouseX: number;
  mouseY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mouseX, mouseY }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
        },
      });
      gsap.from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 75%",
        },
      });
      gsap.fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 70%",
          }
        }
      );
      gsap.from(".hero-stats", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 65%",
        },
      });

      gsap.from(".scroll-indicator", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 60%",
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <HeroScene mouseX={mouseX} mouseY={mouseY} />
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div ref={textRef}>
          <h1 className="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6 overflow-hidden">
            <span className="inline-block">Build</span>{" "}
            <span className="inline-block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">ATS-Friendly</span>{" "}
            <span className="inline-block">Resumes</span>
          </h1>
          <p className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
            Create professional, ATS-optimized resumes that get past automated screening systems and land you more interviews at top MNCs.
          </p>
          <div className="flex flex-row gap-4">
            <Link href="/builder" className="hero-cta px-6 sm:px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-base sm:text-lg hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2 border-2 border-blue-500">
              <span>Start Building</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="#templates" className="hero-cta px-6 sm:px-8 py-4 border-2 border-gray-600 text-white rounded-full font-semibold text-base sm:text-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300 bg-black/40">
              View Templates
            </Link>
          </div>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-6 sm:gap-8 hidden sm:flex">
            <div className="hero-stats">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-500">ATS Pass Rate</div>
            </div>
            <div className="hero-stats">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-500">Resumes Created</div>
            </div>
            <div className="hero-stats">
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
          </div>
        </div>

      </div>
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
