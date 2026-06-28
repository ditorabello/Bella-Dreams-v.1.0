"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-44 h-44"
  };

  return (
    <div 
      id="bella-dreams-logo" 
      className={`relative shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Colorful gradient for the outermost border ring matching the uploaded image */}
          <linearGradient id="rainbow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEB300" />
            <stop offset="25%" stopColor="#FF5200" />
            <stop offset="50%" stopColor="#E60067" />
            <stop offset="75%" stopColor="#B100CD" />
            <stop offset="100%" stopColor="#7F00FF" />
          </linearGradient>

          {/* Luxury metal gold shine gradient for details, crown, and gold text */}
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3D075" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* 1. Colorful Outer Ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#rainbow-grad)" strokeWidth="2.5" />

        {/* 2. Inner Round Platform Gap & Backdrop (Luxurious Warm Cream Beige color) */}
        <circle cx="50" cy="50" r="46.75" fill="#FAF6ED" />

        {/* 3. Gold Circular Wireframe ring */}
        <circle cx="50" cy="50" r="41.25" fill="none" stroke="url(#gold-grad)" strokeWidth="0.8" />

        {/* 4. Elegant Crown on peak */}
        <g id="crown-and-beads" fill="url(#gold-grad)">
          {/* Five-point royal crown path */}
          <path d="M 42,23 L 44.5,25 L 46,20 L 48.2,23.8 L 50,17 L 51.8,23.8 L 54,20 L 55.5,25 L 58,23 L 57.2,27.5 Q 50,28.5 42.8,27.5 Z" />
          {/* Accent bottom divider line for crown */}
          <path d="M 43,28.5 Q 50,29.5 57,28.5 Q 50,29.1 43,28.5 Z" />
          {/* Jewel round beads on points */}
          <circle cx="42" cy="22.5" r="0.8" />
          <circle cx="46" cy="19.5" r="0.8" />
          <circle cx="50" cy="16.5" r="1.0" />
          <circle cx="54" cy="19.5" r="0.8" />
          <circle cx="58" cy="22.5" r="0.8" />
        </g>

        {/* 5. Sparkles flanking BD Monogram */}
        <path 
          id="left-sparkle" 
          d="M 33,37.5 Q 33,40 35.5,40 Q 33,40 33,42.5 Q 33,40 30.5,40 Q 33,40 33,37.5 Z" 
          fill="url(#gold-grad)" 
        />
        <path 
          id="right-sparkle" 
          d="M 67,37.5 Q 67,40 69.5,40 Q 67,40 67,42.5 Q 67,40 64.5,40 Q 67,40 67,37.5 Z" 
          fill="url(#gold-grad)" 
        />

        {/* 6. Centered BD overlapping Monogram */}
        <g id="monogram-bd">
          <text 
            x="49" 
            y="52" 
            fontFamily="'Playfair Display', 'Times New Roman', serif" 
            fontSize="24" 
            fontWeight="700" 
            fill="url(#gold-grad)" 
            textAnchor="end"
          >
            B
          </text>
          <text 
            x="44.5" 
            y="52" 
            fontFamily="'Playfair Display', 'Times New Roman', serif" 
            fontSize="24" 
            fontWeight="700" 
            fill="url(#gold-grad)" 
            textAnchor="start"
            opacity="0.95"
          >
            D
          </text>
        </g>

        {/* 7. Typography Branding Names */}
        {/* "BELLA" text in deep charcoal bronze brand color */}
        <text 
          x="50.8" 
          y="65.5" 
          fontFamily="'Playfair Display', 'Times New Roman', serif" 
          fontSize="9.8" 
          fontWeight="bold" 
          fill="#2C2623" 
          textAnchor="middle"
          letterSpacing="3.5"
        >
          BELLA
        </text>

        {/* "DREAMS" text in shiny brand gold */}
        <text 
          x="51.2" 
          y="74" 
          fontFamily="'Playfair Display', 'Times New Roman', serif" 
          fontSize="8.4" 
          fontWeight="bold" 
          fill="url(#gold-grad)" 
          textAnchor="middle"
          letterSpacing="4.0"
        >
          DREAMS
        </text>

        {/* 8. Flanked "BY ANABEL" line dividers details */}
        <line x1="31" y1="79.5" x2="41" y2="79.5" stroke="url(#gold-grad)" strokeWidth="0.5" opacity="0.6" />
        <line x1="59" y1="79.5" x2="69" y2="79.5" stroke="url(#gold-grad)" strokeWidth="0.5" opacity="0.6" />

        {/* "BY ANABEL" subtext in sans-serif ultra-crisp display */}
        <text 
          x="50.4" 
          y="80.6" 
          fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" 
          fontSize="3.0" 
          fontWeight="800" 
          fill="#2C2623" 
          textAnchor="middle"
          letterSpacing="2.2"
        >
          BY ANABEL
        </text>

        {/* 9. Tiny centered gold heart at the base */}
        <path 
          id="base-heart"
          d="M 50,84.7 C 49.3,83.9 48.1,83.9 47.4,84.6 C 46.7,85.3 46.7,86.4 47.4,87.1 L 50,89.7 L 52.6,87.1 C 53.3,86.4 53.3,85.3 52.6,84.6 C 51.9,83.9 50.7,83.9 50,84.7 Z" 
          fill="url(#gold-grad)" 
        />
      </svg>
    </div>
  );
}
