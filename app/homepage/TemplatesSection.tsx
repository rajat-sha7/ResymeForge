"use client";
import React, { useRef, useEffect, useState } from "react";
import { TemplateType } from "../types/resume";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import ResumeNameModal from "../components/ResumeNameModal";

const TemplatesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { name: 'Software', color: 'bg-linear-to-br from-blue-500 to-cyan-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" fill="#222" stroke="#fff" strokeWidth="1.5"/><rect x="7" y="9" width="10" height="2" rx="1" fill="#fff"/><rect x="7" y="13" width="6" height="2" rx="1" fill="#fff"/></svg>
    ) },
    { name: 'Management', color: 'bg-linear-to-br from-purple-500 to-pink-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="#fff"/><path d="M6 16L10 10L14 14L18 8" stroke="#e11d48" strokeWidth="2"/><rect x="6" y="6" width="2" height="2" fill="#a21caf"/><rect x="10" y="12" width="2" height="2" fill="#a21caf"/><rect x="14" y="16" width="2" height="2" fill="#a21caf"/></svg>
    ) },
    { name: 'Creative', color: 'bg-linear-to-br from-orange-500 to-red-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fff"/><circle cx="12" cy="12" r="6" fill="#f59e42"/><circle cx="10" cy="10" r="1" fill="#e11d48"/><circle cx="14" cy="10" r="1" fill="#a21caf"/><circle cx="12" cy="14" r="1" fill="#22d3ee"/></svg>
    ) },
    { name: 'Academic', color: 'bg-linear-to-br from-green-500 to-emerald-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="8" rx="2" fill="#fff"/><path d="M12 4L20 8L12 12L4 8L12 4Z" fill="#222"/><rect x="10" y="14" width="4" height="4" rx="1" fill="#10b981"/></svg>
    ) },
    { name: 'Sales', color: 'bg-linear-to-br from-yellow-500 to-orange-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 17l-5-5 1.41-1.41L12 14.17l6.59-6.59L20 9l-8 8z" fill="#fff"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#f59e42" strokeWidth="2"/></svg>
    ) },
    { name: 'Healthcare', color: 'bg-linear-to-br from-blue-500 to-cyan-500', icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#fff"/><path d="M12 8v8M8 12h8" stroke="#6366f1" strokeWidth="2"/></svg>
    ) },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title and description
      gsap.from('.templates-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
        },
      });

      gsap.from('.templates-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      // Animate template cards
      gsap.from('.template-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-slide functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % templates.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % templates.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < templates.length - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  return (
    <section id="templates" ref={sectionRef} className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="templates-title text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Industry-Specific Templates
          </h2>
          <p className="templates-description text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from 6 professionally designed templates optimized for different career paths.
          </p>
        </div>
        {/* Desktop/Large Screen Grid Layout */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {templates.map((template, index) => (
              <button
              key={index}
              className="template-card group relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer border-none outline-none"
              onClick={() => setSelectedTemplate(template.name.toLowerCase())}
              type="button"
            >
              <div className={`absolute inset-0 ${template.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="mb-2 group-hover:scale-125 transition-transform duration-300">
                  {template.icon}
                </span>
                <span className="font-medium mt-2 text-lg drop-shadow-lg">{template.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Slider Layout */}
        <div className="block sm:hidden">
          <div 
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {templates.map((template, index) => (
                <div key={index} className="w-full shrink-0 px-4">
                  <button
                    className="template-card group relative aspect-3/4 w-full rounded-2xl overflow-hidden cursor-pointer border-none outline-none"
                    onClick={() => setSelectedTemplate(template.name.toLowerCase())}
                    type="button"
                  >
                    <div className={`absolute inset-0 ${template.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <span className="mb-2 group-hover:scale-125 transition-transform duration-300 text-5xl">
                        {template.icon}
                      </span>
                      <span className="font-medium mt-2 text-xl drop-shadow-lg">{template.name}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedTemplate && (
        <ResumeNameModal
          template={selectedTemplate as TemplateType}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </section>
  );
};

export default TemplatesSection;
