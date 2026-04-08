'use client';

import React, { useEffect, useState } from 'react';
import AnimatedBackground from './homepage/AnimatedBackground';
import Header from './homepage/Header';
import HeroSection from './homepage/HeroSection';
import FeaturesSection from './homepage/FeaturesSection';
import TemplatesSection from './homepage/TemplatesSection';
import InsightsSection from './homepage/InsightsSection';
import CTASection from './homepage/CTASection';

// Main Homepage Component
export default function HomePage() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    // Track mouse movement for 3D parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Homepage UI components from /homepage */}
      <Header />
      <AnimatedBackground />
      <HeroSection mouseX={mouseX} mouseY={mouseY} />
      <TemplatesSection />
      <FeaturesSection />
      <InsightsSection />
      <CTASection />
    </main>
  );
}
