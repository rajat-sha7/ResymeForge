"use client";
import React, { useState } from "react";

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="home-mono inline-flex h-9 items-center rounded-full border border-[#d9d4c7] px-4 text-[12px] uppercase tracking-[0.03em] text-[#151b26] transition-colors hover:border-[#151b26]"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
};

export default ShareButton;
