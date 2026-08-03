import React from 'react';

interface CubeLogoProps {
  size?: number;
}

export function CubeLogo({ size = 20 }: CubeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top face - Cyan */}
      <path
        d="M12 2L21 7V12L12 7L3 12V7L12 2Z"
        fill="#22d3ee"
        opacity="0.9"
      />
      {/* Left face - Purple */}
      <path
        d="M3 12L12 17V22L3 17V12Z"
        fill="#a855f7"
      />
      {/* Right face - Indigo */}
      <path
        d="M12 17L21 12V17L12 22V17Z"
        fill="#6366f1"
      />
      {/* Inner core accent */}
      <path
        d="M12 7L17 9.8V14.2L12 17L7 14.2V9.8L12 7Z"
        fill="#060606"
        stroke="#22d3ee"
        strokeWidth="1"
      />
    </svg>
  );
}
