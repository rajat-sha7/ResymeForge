"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const features = [
    {
      icon: '🎯',
      title: 'ATS Optimized',
      description: 'Built-in ATS scoring system helps you optimize your resume for automated tracking systems used by Fortune 500 companies.',
    },
    {
      icon: '📊',
      title: 'Real-time Analysis',
      description: 'Get instant feedback on your resume with our comprehensive ATS health panel showing completeness, formatting, and keyword match.',
    },
    {
      icon: '🎨',
      title: '6 Professional Templates',
      description: 'Choose from Software, Management, Creative, Academic, Sales, and Healthcare templates tailored for different industries.',
    },
    {
      icon: '📱',
      title: 'Drag & Drop Editor',
      description: 'Easily reorder sections, toggle visibility, and customize your resume layout with our intuitive drag-and-drop interface.',
    },
    {
      icon: '📄',
      title: 'Multiple Export Formats',
      description: 'Export your resume as PDF or DOCX with perfect formatting, ready to submit to any job application.',
    },
    {
      icon: '💾',
      title: 'Auto-Save',
      description: 'Never lose your work. All changes are automatically saved to your browser storage as you type.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title and description
      gsap.from('.features-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
        },
      });

      gsap.from('.features-description', {
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

      // Animate feature cards with child elements
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0, scale: 0.85, rotate: -6 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          stagger: 0.18,
          ease: 'elastic.out(1, 0.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
          onComplete: () => {
            // Animate child elements after card animation
            gsap.fromTo('.feature-icon',
              { scale: 0, rotation: -180 },
              { scale: 1, rotation: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
            );
            gsap.fromTo('.feature-title',
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
            );
            gsap.fromTo('.feature-desc',
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
            );
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-slide functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
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

    if (isLeftSwipe && currentSlide < features.length - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  return (
    <section id="features" ref={sectionRef} className="py-16 sm:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="features-title text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="features-description text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create a winning resume that passes ATS systems and impresses recruiters.
          </p>
        </div>
        {/* Desktop/Large Screen Grid Layout */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-6 sm:p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="feature-icon text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="feature-title text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="feature-desc text-gray-400">{feature.description}</p>
            </div>
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
              {features.map((feature, index) => (
                <div key={index} className="w-full shrink-0 px-4">
                  <div className="feature-card group p-6 sm:p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 text-center">
                    <div className="feature-icon text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="feature-title text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="feature-desc text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

       
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
