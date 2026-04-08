"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";

const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random positions once using useMemo
  const particlePositions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for particles
      gsap.fromTo('.particle', 
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          }
        }
      );

      // Entrance animation for background orbs
      gsap.fromTo('.bg-orb',
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
          }
        }
      );

      // Continuous floating animation for particles
      const particles = containerRef.current?.querySelectorAll('.particle');
      particles?.forEach((particle, i) => {
        gsap.to(particle, {
          y: 'random(-100, 100)',
          x: 'random(-100, 100)',
          duration: 'random(3, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {particlePositions.map((position, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 bg-blue-500/20 rounded-full"
          style={{
            left: position.left,
            top: position.top,
          }}
        />
      ))}
      <div className="bg-orb absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="bg-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default AnimatedBackground;
