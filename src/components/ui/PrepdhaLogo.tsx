"use client";

import Image from "next/image";
import { useState } from "react";

const LOGO_SIZE = 36;

/**
 * Purple diamond-shaped logo (matches Prepdha branding).
 * Used as fallback when /prepdha-logo.png is not present.
 */
function DiamondLogo() {
  return (
    <svg
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 4L36 20L20 36L4 20L20 4Z"
        fill="var(--accent-purple)"
        stroke="var(--accent-purple)"
        strokeWidth="1"
      />
      <path
        d="M20 8L32 20L20 32L8 20L20 8Z"
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
}

export function PrepdhaLogo() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <span className="flex shrink-0 items-center justify-center">
        <DiamondLogo />
      </span>
    );
  }

  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
      <Image
        src="/prepdha-logo.png"
        alt="Prepdha"
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="object-contain"
        onError={() => setUseFallback(true)}
        priority
      />
    </span>
  );
}