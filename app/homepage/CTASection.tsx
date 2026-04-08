"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseX, setMouseX] = useState(200);
  const [mouseY, setMouseY] = useState(200);
  const [isHovering, setIsHovering] = useState(true);

  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(120deg); }
        66% { transform: translateY(5px) rotate(240deg); }
      }
      @keyframes wave {
        0% { transform: scaleX(1) scaleY(1); }
        50% { transform: scaleX(1.2) scaleY(0.8); }
        100% { transform: scaleX(1) scaleY(1); }
      }
      @keyframes magnetic {
        0% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(5px, -5px) scale(1.1); }
        50% { transform: translate(-3px, 3px) scale(0.9); }
        75% { transform: translate(2px, -2px) scale(1.05); }
        100% { transform: translate(0, 0) scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from('.cta-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
        },
      });

      // Animate description
      gsap.from('.cta-description', {
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

      // Animate content container
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Mouse tracking for animation effects
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouseX(x);
      setMouseY(y);
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Rainbow animation effect with enhanced features
  useEffect(() => {
    if (!isHovering) return;

    const interval = setInterval(() => {
      // Create a subtle pulsing effect by slightly varying the gradient size
      const pulse = Math.sin(Date.now() * 0.005) * 50 + 200;
      // Add rainbow color shifting
      const hueShift = (Date.now() * 0.1) % 360;
      if (sectionRef.current) {
        sectionRef.current.style.backgroundSize = `${400 + pulse}% ${400 + pulse}%`;
        sectionRef.current.style.filter = `hue-rotate(${hueShift}deg)`;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section 
      ref={sectionRef} 
      className="py-16 sm:py-24 bg-linear-to-br from-blue-600 to-purple-700 relative overflow-hidden transition-all duration-500"
      style={{
        background: isHovering 
          ? `radial-gradient(circle at ${mouseX}px ${mouseY}px, 
              rgba(173, 216, 230, 0.3) 0%, 
              rgba(176, 224, 230, 0.25) 20%, 
              rgba(240, 248, 255, 0.2) 40%, 
              rgba(135, 206, 235, 0.25) 60%, 
              rgba(70, 130, 180, 0.2) 80%, 
              rgba(173, 216, 230, 0.3) 100%),
             radial-gradient(circle at ${mouseX * 0.7}px ${mouseY * 0.7}px, 
              rgba(255, 255, 255, 0.06) 0%, 
              transparent 40%),
             linear-gradient(135deg, rgba(176, 224, 230, 0.15), rgba(135, 206, 235, 0.1))`
          : 'linear-gradient(to bottom right, #2563eb, #7c3aed)',
        backgroundSize: isHovering ? '400% 400%, 300% 300%, 100% 100%' : '100% 100%',
        backgroundBlendMode: isHovering ? 'screen, overlay, normal' : 'normal',
        filter: isHovering ? 'saturate(0.9) brightness(1.05) contrast(0.95) hue-rotate(180deg)' : 'none'
      }}
    >
      <div className="absolute inset-0">
        {/* Subtle polarized filter overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white/3 via-transparent to-blue-50/2 backdrop-blur-[0.3px]" />
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/8 rounded-full blur-3xl transition-all duration-1000" 
             style={{
               transform: isHovering ? `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px) scale(1.2)` : 'translate(0, 0) scale(1)',
               opacity: isHovering ? 0.2 : 0.08
             }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/8 rounded-full blur-3xl transition-all duration-1000"
             style={{
               transform: isHovering ? `translate(${-mouseX * 0.02}px, ${-mouseY * 0.02}px) scale(1.2)` : 'translate(0, 0) scale(1)',
               opacity: isHovering ? 0.2 : 0.08
             }} />
        {isHovering && (
          <>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse" 
                 style={{
                   background: `conic-gradient(from ${Date.now() * 0.1}deg at ${mouseX}px ${mouseY}px, transparent, rgba(255,255,255,0.1), transparent)`,
                   animation: 'spin 3s linear infinite'
                 }} />
            <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm"
                 style={{
                   left: mouseX - 8,
                   top: mouseY - 8,
                   boxShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)'
                 }} />
            {/* Subtle frozen particles following cursor */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-sm opacity-40"
                style={{
                  left: mouseX + Math.cos((i * 60 + Date.now() * 0.001) % 360 * Math.PI / 180) * (25 + Math.sin(Date.now() * 0.002 + i) * 8) - 3,
                  top: mouseY + Math.sin((i * 60 + Date.now() * 0.001) % 360 * Math.PI / 180) * (25 + Math.sin(Date.now() * 0.002 + i) * 8) - 3,
                  width: `${2 + Math.sin(Date.now() * 0.003 + i) * 0.5}px`,
                  height: `${2 + Math.sin(Date.now() * 0.003 + i) * 0.5}px`,
                  backgroundColor: `hsla(${190 + i * 15}, 50%, 85%, 0.5)`,
                  boxShadow: `0 0 3px hsla(${190 + i * 15}, 60%, 90%, 0.3)`,
                  animation: `magnetic 5s ease-in-out infinite ${i * 0.2}s`
                }}
              />
            ))}
            {/* Wave effects - toned down */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`wave-${i}`}
                className="absolute rounded-full opacity-20"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${15 + i * 20}%`,
                  width: `${80 + i * 30}px`,
                  height: `${80 + i * 30}px`,
                  background: `radial-gradient(circle, hsla(${(i * 120 + Date.now() * 0.03) % 360}, 60%, 50%, 0.3) 0%, transparent 60%)`,
                  animation: `wave 5s ease-in-out infinite ${i * 0.8}s`
                }}
              />
            ))}
            {/* Floating rainbow orbs with enhanced effects */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl opacity-15"
                 style={{
                   background: `conic-gradient(from ${Date.now() * 0.005}deg, 
                     hsla(195, 40%, 80%, 0.3), 
                     hsla(200, 45%, 85%, 0.25), 
                     hsla(210, 35%, 75%, 0.3), 
                     hsla(185, 40%, 70%, 0.25), 
                     hsla(190, 35%, 78%, 0.3), 
                     hsla(195, 40%, 80%, 0.3))`,
                   animation: 'float 10s ease-in-out infinite 0s',
                   backdropFilter: 'blur(8px)'
                 }} />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full blur-xl opacity-15"
                 style={{
                   background: `conic-gradient(from ${Date.now() * -0.005}deg, 
                     hsla(200, 45%, 85%, 0.25), 
                     hsla(185, 40%, 70%, 0.25), 
                     hsla(195, 40%, 80%, 0.3), 
                     hsla(210, 35%, 75%, 0.3), 
                     hsla(190, 35%, 78%, 0.3), 
                     hsla(200, 45%, 85%, 0.25))`,
                   animation: 'float 11s ease-in-out infinite 1s',
                   backdropFilter: 'blur(2px)'
                 }} />
            <div className="absolute top-1/2 left-3/4 w-20 h-20 rounded-full blur-xl opacity-15"
                 style={{
                   background: `conic-gradient(from ${Date.now() * 0.008}deg, 
                     hsla(210, 35%, 75%, 0.3), 
                     hsla(200, 45%, 85%, 0.25), 
                     hsla(185, 40%, 70%, 0.25), 
                     hsla(195, 40%, 80%, 0.3), 
                     hsla(190, 35%, 78%, 0.3), 
                     hsla(210, 35%, 75%, 0.3))`,
                   animation: 'float 12s ease-in-out infinite 2s',
                   backdropFilter: 'blur(2px)'
                 }} />
            {/* Subtle energy field effect */}
            <div className="absolute inset-0 opacity-3"
                 style={{
                   background: `repeating-conic-gradient(from ${Date.now() * 0.003}deg at ${mouseX}px ${mouseY}px, 
                     rgba(255,255,255,0.03) 0deg, 
                     transparent 20deg, 
                     rgba(255,255,255,0.03) 40deg, 
                     transparent 60deg)`,
                   animation: 'spin 30s linear infinite'
                 }} />
          </>
        )}
      </div>
      <div className="cta-content relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="cta-title text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="cta-description text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Start building your ATS-optimized resume today. No sign-up required. Your data stays private in your browser.
        </p>
        <Link href="/builder" className="inline-flex items-center gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <span>Create Your Resume Now</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
