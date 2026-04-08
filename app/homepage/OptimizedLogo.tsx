"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface OptimizedLogoProps {
  forgeColor?: string;
}

const OptimizedLogo: React.FC<OptimizedLogoProps> = ({ forgeColor = "text-white" }) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main logo entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top 90%",
        }
      });

      // Hammer dramatic entrance with 3D rotation
      tl.fromTo(
        ".logo-hammer",
        {
          rotationY: -180,
          rotationX: -45,
          scale: 0.3,
          opacity: 0,
          transformOrigin: "center center"
        },
        {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(2)",
        }
      );

      // Sparks explosion effect
      tl.fromTo(
        ".logo-spark",
        { scale: 0, opacity: 0, rotation: 0 },
        {
          scale: gsap.utils.random(1, 2.5),
          opacity: 1,
          rotation: gsap.utils.random(180, 720),
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // Text dramatic entrance with 3D effect
      tl.fromTo(
        ".logo-text",
        {
          y: 30,
          opacity: 0,
          rotationX: -90,
          transformOrigin: "center bottom"
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.5)",
        },
        "-=0.6"
      );

      // Continuous floating animation
      gsap.to(".logo-hammer", {
        y: -3,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // Glowing effect animation
      gsap.to(".logo-glow", {
        opacity: 0.8,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.5,
      });

      // Spark continuous animation
      gsap.to(".logo-spark", {
        scale: gsap.utils.random(0.8, 1.5),
        rotation: "+=360",
        duration: gsap.utils.random(2, 4),
        ease: "none",
        stagger: 0.3,
        repeat: -1,
        delay: 3,
      });

      // Metallic shine effect
      gsap.to(".logo-shine", {
        x: 50,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        delay: 1.5,
      });

    }, logoRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={logoRef} className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
      {/* Logo Icon with 3D Container */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {/* Glow Effect */}
        <div className="logo-glow absolute inset-0 bg-orange-400/20 rounded-full blur-xl scale-75 opacity-0" />

        {/* Hammer with 3D styling */}
        <div className="relative logo-hammer" style={{ transformStyle: "preserve-3d" }}>
          <svg
            className="w-7 h-7 text-orange-400 drop-shadow-2xl filter"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 10px rgba(251, 146, 60, 0.5))" }}
          >
            {/* Hammer handle with gradient */}
            <defs>
              <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B4513" />
                <stop offset="50%" stopColor="#A0522D" />
                <stop offset="100%" stopColor="#8B4513" />
              </linearGradient>
              <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
            </defs>

            {/* Hammer handle */}
            <rect x="11" y="8" width="2" height="12" rx="1" fill="url(#handleGradient)" />

            {/* Hammer head with metallic look */}
            <rect x="6" y="4" width="12" height="6" rx="1" fill="url(#headGradient)" />

            {/* Hammer striking surface */}
            <rect x="4" y="2" width="16" height="4" rx="1" fill="url(#headGradient)" opacity="0.9" />

            {/* Metallic shine overlay */}
            <rect
              className="logo-shine"
              x="4" y="2" width="4" height="4" rx="1"
              fill="url(#headGradient)"
              opacity="0.6"
              style={{ transform: "translateX(-50px)" }}
            />
          </svg>
        </div>

        {/* Enhanced Sparks with more particles */}
        <div className="absolute -top-2 -right-2">
          <div className="logo-spark w-1.5 h-1.5 bg-yellow-300 rounded-full absolute top-0 right-0 shadow-lg" />
          <div className="logo-spark w-1 h-1 bg-orange-300 rounded-full absolute top-2 right-3 shadow-md" />
          <div className="logo-spark w-2 h-2 bg-yellow-400 rounded-full absolute -top-1 right-1 shadow-xl" />
          <div className="logo-spark w-0.5 h-0.5 bg-orange-200 rounded-full absolute top-1 right-1 shadow-sm" />
          <div className="logo-spark w-1 h-1 bg-yellow-200 rounded-full absolute -top-0.5 right-2 shadow-md" />
        </div>

        {/* Additional floating particles */}
        <div className="absolute -top-3 left-2">
          <div className="logo-spark w-0.5 h-0.5 bg-blue-300 rounded-full shadow-sm" />
        </div>
        <div className="absolute top-1 -left-1">
          <div className="logo-spark w-1 h-1 bg-purple-300 rounded-full shadow-md" />
        </div>
      </div>

      {/* Enhanced Text with 3D effect */}
      <div className="flex items-center gap-1" style={{ perspective: "500px" }}>
        <span
          className="logo-text text-blue-400 font-black text-lg"
          style={{
            textShadow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)",
            transformStyle: "preserve-3d"
          }}
        >
          Resume
        </span>
        <span
          className={`logo-text ${forgeColor} font-black text-lg`}
          style={{
            textShadow: forgeColor === "text-black" 
              ? "none" 
              : "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
            transformStyle: "preserve-3d"
          }}
        >
          Forge
        </span>
      </div>
    </div>
  );
};

export default OptimizedLogo;
