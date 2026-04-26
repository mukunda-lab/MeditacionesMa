"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Meditation } from "@/lib/meditations-data";
import { formatDateDisplay } from "@/lib/meditations-data";
import { BookOpen } from "lucide-react";

interface MeditationCardProps {
  meditation: Meditation;
  isActive: boolean;
}

export function MeditationCard({ meditation, isActive }: MeditationCardProps) {
  // Use imageUrl directly from props (comes from API merge in timeline)
  const imageUrl = meditation.imageUrl || null;
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset error state when meditation changes
  useEffect(() => {
    setImageError(false);
    setLoaded(false);
  }, [meditation.slug]);

  const FallbackCard = () => (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: "oklch(0.42 0.05 240)" }}
    >
      {/* Corner decorations */}
      {[0, 90, 180, 270].map((rot) => (
        <svg
          key={rot}
          className="absolute w-24 h-24 opacity-20"
          style={{
            top: rot < 180 ? 0 : "auto",
            bottom: rot >= 180 ? 0 : "auto",
            left: rot === 0 || rot === 270 ? 0 : "auto",
            right: rot === 90 || rot === 180 ? 0 : "auto",
            transform: `rotate(${rot}deg)`,
          }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path d="M0 100 Q0 0 100 0" stroke="oklch(0.75 0.12 85)" strokeWidth="0.5" />
          <circle cx="15" cy="15" r="8" stroke="oklch(0.75 0.12 85)" strokeWidth="0.3" />
          <circle cx="15" cy="15" r="14" stroke="oklch(0.75 0.12 85)" strokeWidth="0.2" />
        </svg>
      ))}

      {/* Symbol */}
      <svg className="w-10 h-10 mb-4 opacity-80" viewBox="0 0 48 48" fill="none" style={{ color: "oklch(0.75 0.12 85)" }}>
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="0.75" />
        <path d="M24 12L27 24L24 36L21 24L24 12Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <path d="M12 24L24 21L36 24L24 27L12 24Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      </svg>

      <h2
        className="font-serif font-semibold uppercase tracking-wider mb-3 text-balance leading-tight"
        style={{ fontSize: "clamp(1rem, 4vw, 1.3rem)", color: "oklch(0.75 0.12 85)" }}
      >
        {meditation.title}
      </h2>

      <div className="flex items-center gap-2 my-3">
        <div className="w-8 h-px" style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.5)" }} />
        <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="oklch(0.75 0.12 85 / 0.8)">
          <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" />
        </svg>
        <div className="w-8 h-px" style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.5)" }} />
      </div>

      <p className="text-xs font-light tracking-wide mb-2" style={{ color: "oklch(0.80 0.02 85)" }}>
        Meditación con Mataji Shaktiananda
      </p>
      <p className="text-sm font-medium tracking-widest" style={{ color: "oklch(0.75 0.12 85)" }}>
        {formatDateDisplay(meditation.dateString)}
      </p>
    </div>
  );

  return (
    <div
      className="relative overflow-hidden transition-all duration-500"
      style={{
        width: "clamp(200px, 30vw, 340px)",
        height: "clamp(260px, 40vw, 440px)",
        borderRadius: "4px",
        boxShadow: isActive
          ? "0 24px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.75 0.12 85 / 0.3)"
          : "0 8px 24px oklch(0 0 0 / 0.3)",
      }}
    >
      {imageUrl && !imageError ? (
        <>
          {/* Skeleton while loading */}
          {!loaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: "oklch(0.38 0.04 240)" }}
            />
          )}
          <Image
            src={imageUrl}
            alt={meditation.title}
            fill
            className="object-cover transition-opacity duration-500"
            style={{ opacity: loaded ? 1 : 0 }}
            sizes="(max-width: 768px) 200px, 340px"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setImageError(true);
              setLoaded(true);
            }}
            priority={isActive}
            unoptimized
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, oklch(0.15 0.02 240 / 0.9) 0%, oklch(0.15 0.02 240 / 0.3) 45%, transparent 70%)",
            }}
          />
          {/* Text overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <h2
              className="font-serif font-semibold uppercase tracking-wider mb-1 text-balance leading-tight"
              style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", color: "oklch(0.90 0.03 85)" }}
            >
              {meditation.title}
            </h2>
            <p className="text-xs font-light tracking-widest" style={{ color: "oklch(0.75 0.12 85)" }}>
              {formatDateDisplay(meditation.dateString)}
            </p>
          </div>
        </>
      ) : (
        <FallbackCard />
      )}

      {/* Active: hover overlay with "read" hint */}
      {isActive && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          style={{ backgroundColor: "oklch(0.10 0.02 240 / 0.5)" }}
        >
          <div
            className="flex flex-col items-center gap-2 px-5 py-3 rounded"
            style={{ backgroundColor: "oklch(0.10 0.02 240 / 0.7)" }}
          >
            <BookOpen className="w-6 h-6" style={{ color: "oklch(0.75 0.12 85)" }} />
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "oklch(0.85 0.05 85)" }}
            >
              Leer meditación
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
