'use client';

import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'h-9 w-9', size = 36 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs transition-transform group-hover:scale-[1.03] ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="thai-health-logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="shield-border" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="pulse-grad" x1="8" y1="24" x2="40" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Base */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#thai-health-logo-bg)" />
        <rect x="2.5" y="2.5" width="43" height="43" rx="11.5" stroke="url(#shield-border)" strokeWidth="1" />

        {/* Clinical Shield Silhouette */}
        <path
          d="M24 7.5C31.5 7.5 37 9.8 37 16.5C37 28 27.5 37.5 24 40.5C20.5 37.5 11 28 11 16.5C11 9.8 16.5 7.5 24 7.5Z"
          fill="#064e3b"
          fillOpacity="0.35"
        />

        {/* Medical Cross Background Accent */}
        <path
          d="M21.5 13H26.5V31H21.5ZM15 19.5H33V24.5H15Z"
          fill="#ffffff"
          fillOpacity="0.12"
        />

        {/* Health Pulse Line (EKG / Waveform) */}
        <path
          d="M10 25H16L19 19L22.5 30L26 21L28.5 25H38"
          stroke="url(#pulse-grad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Prominent Verification Checkmark */}
        <path
          d="M19 25L23.5 29.5L34 16"
          stroke="#ffffff"
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* AI Neural Node Accents (Signal Points) */}
        <circle cx="34" cy="16" r="2.5" fill="#ffffff" />
        <circle cx="34" cy="16" r="1.25" fill="#059669" />

        <circle cx="10" cy="25" r="1.5" fill="#a7f3d0" />
        <circle cx="38" cy="25" r="1.5" fill="#a7f3d0" />
      </svg>
    </div>
  );
};
