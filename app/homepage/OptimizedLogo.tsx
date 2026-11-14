'use client';

import React from 'react';

export interface OptimizedLogoProps {
  forgeColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const OptimizedLogo: React.FC<OptimizedLogoProps> = ({
  forgeColor = 'text-[#151b26]',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const isDarkBg =
    forgeColor.includes('white') ||
    forgeColor.includes('slate-100') ||
    forgeColor.includes('gray-100');

  const mainTextColor = isDarkBg ? 'text-white' : 'text-[#151b26]';

  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7',
      text: 'text-[20px]',
    },
    md: {
      icon: 'w-8 h-8 sm:w-8.5 sm:h-8.5',
      text: 'text-[24px] sm:text-[26px]',
    },
    lg: {
      icon: 'w-10 h-10 sm:w-11 sm:h-11',
      text: 'text-[32px] sm:text-[38px]',
    },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Precision Emblem matching Homepage Color System */}
      <div className="relative flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-105">
        <svg
          className={`${sizeClasses.icon} transition-shadow duration-200`}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Deep Charcoal Squircle in Homepage Ink */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="8.5"
            fill="#151b26"
          />
          <rect
            x="2.5"
            y="2.5"
            width="31"
            height="31"
            rx="8"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />

          {/* Folded Resume Sheet in Homepage Warm Linen #f5f4ed */}
          <path
            d="M9.5 8C9.5 6.89543 10.3954 6 11.5 6H20.5L26.5 12V26C26.5 27.1046 25.6046 28 24.5 28H11.5C10.3954 28 9.5 27.1046 9.5 26V8Z"
            fill="#F5F4ED"
          />

          {/* Corner Fold in Homepage Warm Border Tone #e3dacc */}
          <path
            d="M20.5 6V10.5C20.5 11.3284 21.1716 12 22 12H26.5L20.5 6Z"
            fill="#E3DACC"
          />

          {/* ATS Resume Lines in Homepage Neutrals & Rust Accent */}
          <rect x="12.5" y="10" width="5.5" height="1.8" rx="0.9" fill="#151B26" />
          <rect x="12.5" y="14.5" width="9.5" height="1.4" rx="0.7" fill="#B5AE9F" />
          <rect x="12.5" y="18" width="10.5" height="1.4" rx="0.7" fill="#B5AE9F" />
          <rect x="12.5" y="21.5" width="7" height="1.4" rx="0.7" fill="#C1441A" />
          <circle cx="22.5" cy="22.2" r="1" fill="#5FC788" />

          {/* Signature Rust Forge Sparkle #c1441a */}
          <path
            d="M27.5 3C27.5 5.3 29.3 7.1 31.5 7.1C29.3 7.1 27.5 8.9 27.5 11.2C27.5 8.9 25.7 7.1 23.5 7.1C25.7 7.1 27.5 5.3 27.5 3Z"
            fill="#C1441A"
          />
          <circle cx="21" cy="4" r="0.8" fill="#F59E0B" opacity="0.9" />
        </svg>
      </div>

      {/* Homepage Editorial Wordmark in home-serif */}
      {showText && (
        <span
          className={`home-serif ${sizeClasses.text} tracking-[-0.025em] ${mainTextColor} leading-none`}
        >
          ResumeForge
        </span>
      )}
    </div>
  );
};

export default OptimizedLogo;
