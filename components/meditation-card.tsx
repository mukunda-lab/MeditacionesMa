"use client";

import { useState } from "react";
import Image from "next/image";
import type { Meditation } from "@/lib/meditations-data";
import { formatDateDisplay } from "@/lib/meditations-data";

interface MeditationCardProps {
  meditation: Meditation;
  isActive: boolean;
}

export function MeditationCard({ meditation, isActive }: MeditationCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder with meditation info
  const FallbackContent = () => (
    <div className="absolute inset-0 bg-card flex flex-col items-center justify-center p-6 md:p-8 text-center">
      {/* Decorative corner patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-32 h-32 text-secondary"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0 100 Q0 0 100 0"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="0.2" />
          <path d="M10 15 L20 15 M15 10 L15 20" stroke="currentColor" strokeWidth="0.3" />
        </svg>
        <svg
          className="absolute top-0 right-0 w-32 h-32 text-secondary rotate-90"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0 100 Q0 0 100 0"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="0.2" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-32 h-32 text-secondary -rotate-90"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0 100 Q0 0 100 0"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="0.3" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-32 h-32 text-secondary rotate-180"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0 100 Q0 0 100 0"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Floral pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 340 440" fill="none">
          <g transform="translate(30, 30)" className="text-secondary">
            <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="0" cy="-15" rx="4" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="0" cy="15" rx="4" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="-15" cy="0" rx="10" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="15" cy="0" rx="10" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </g>
          <g transform="translate(310, 30)" className="text-secondary">
            <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="0" cy="-15" rx="4" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="0" cy="15" rx="4" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </g>
          <g transform="translate(30, 410)" className="text-secondary">
            <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="-15" cy="0" rx="10" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <ellipse cx="15" cy="0" rx="10" ry="4" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </g>
          <g transform="translate(310, 410)" className="text-secondary">
            <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </g>
        </svg>
      </div>

      {/* Top symbol */}
      <div className="mb-6">
        <svg
          className="w-10 h-10 md:w-12 md:h-12 text-primary"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" />
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="0.75" />
          <path
            d="M24 12L27 24L24 36L21 24L24 12Z"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
          />
          <path
            d="M12 24L24 21L36 24L24 27L12 24Z"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
          />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="font-serif text-xl md:text-2xl font-semibold text-primary uppercase tracking-wider mb-2 text-balance leading-tight">
        {meditation.title}
      </h2>

      {/* Decorative line */}
      <div className="flex items-center gap-3 my-4">
        <div className="w-10 h-px bg-primary/50" />
        <svg className="w-3 h-3 text-primary" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
        </svg>
        <div className="w-10 h-px bg-primary/50" />
      </div>

      {/* Subtitle */}
      <p className="text-card-foreground/80 text-sm font-light tracking-wide mb-3">
        {meditation.subtitle}
      </p>

      {/* Date */}
      <p className="text-primary text-sm font-medium tracking-widest">
        {formatDateDisplay(meditation.dateString)}
      </p>
    </div>
  );

  return (
    <div
      className={`relative w-[280px] md:w-[340px] h-[380px] md:h-[440px] rounded-lg overflow-hidden transition-all duration-500 ${
        isActive ? "shadow-2xl" : "shadow-lg"
      }`}
    >
      {/* Try to load the actual image from the website */}
      {!imageError ? (
        <div className="relative w-full h-full">
          <Image
            src={meditation.imageUrl}
            alt={meditation.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 280px, 340px"
            onError={() => setImageError(true)}
            priority={isActive}
          />
          {/* Overlay with title and date for image cards */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
            <h2 className="font-serif text-lg md:text-xl font-semibold text-white uppercase tracking-wider mb-1 text-balance leading-tight drop-shadow-lg">
              {meditation.title}
            </h2>
            <p className="text-white/80 text-xs font-light tracking-wide mb-2">
              {meditation.subtitle}
            </p>
            <p className="text-primary text-sm font-medium tracking-widest">
              {formatDateDisplay(meditation.dateString)}
            </p>
          </div>
        </div>
      ) : (
        <FallbackContent />
      )}

      {/* Active card highlight */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-primary/30 rounded-lg" />
      )}
    </div>
  );
}
