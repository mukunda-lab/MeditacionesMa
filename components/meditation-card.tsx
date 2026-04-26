"use client";

import { useState, useEffect, useRef } from "react";
import type { Meditation } from "@/lib/meditations-data";
import { formatDateDisplay } from "@/lib/meditations-data";
import { BookOpen } from "lucide-react";

interface Translation {
  slug: string;
  language: "es" | "it" | "en";
  title: string;
}

interface MeditationCardProps {
  meditation: Meditation & { translations?: Translation[] };
  isActive: boolean;
  tilt?: number; // subtle per-card tilt in degrees
  onTranslationClick?: (slug: string) => void;
}

const languageLabels: Record<string, string> = {
  it: "IT",
  en: "EN",
};

export function MeditationCard({ meditation, isActive, tilt = 0, onTranslationClick }: MeditationCardProps) {
  const translations = meditation.translations || [];
  const imageUrl = meditation.imageUrl || null;
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [naturalAspect, setNaturalAspect] = useState<number>(16 / 9); // default landscape
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageError(false);
    setLoaded(false);
    setNaturalAspect(16 / 9);
  }, [meditation.slug]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setNaturalAspect(img.naturalWidth / img.naturalHeight);
    }
    setLoaded(true);
  };

  // Card width is fixed, height adapts to aspect ratio
  const cardWidth = isActive ? 320 : 260;
  const cardHeight = Math.round(cardWidth / naturalAspect);

  const FallbackCard = () => (
    <div
      className="flex flex-col items-center justify-center p-6 text-center"
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundColor: "oklch(0.38 0.05 240)",
      }}
    >
      {[0, 90, 180, 270].map((rot) => (
        <svg
          key={rot}
          className="absolute w-20 h-20 opacity-15"
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
        </svg>
      ))}

      <svg className="w-9 h-9 mb-3 opacity-70" viewBox="0 0 48 48" fill="none" style={{ color: "oklch(0.75 0.12 85)" }}>
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" />
        <path d="M24 12L27 24L24 36L21 24L24 12Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <path d="M12 24L24 21L36 24L24 27L12 24Z" stroke="currentColor" strokeWidth="0.75" fill="none" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>

      <h2
        className="font-serif font-semibold uppercase tracking-wider text-balance leading-tight mb-2"
        style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", color: "oklch(0.75 0.12 85)" }}
      >
        {meditation.title}
      </h2>
      <p className="text-xs font-light tracking-widest" style={{ color: "oklch(0.75 0.12 85 / 0.8)" }}>
        {formatDateDisplay(meditation.dateString)}
      </p>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center" style={{ width: cardWidth }}>
      {/* Translation tabs — above active card */}
      {translations.length > 0 && isActive ? (
        <div className="flex gap-1.5 mb-1.5">
          {translations.map((t) => (
            <button
              key={t.slug}
              onClick={(e) => {
                e.stopPropagation();
                onTranslationClick?.(t.slug);
              }}
              className="px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-200"
              style={{
                backgroundColor: "oklch(0.22 0.03 240 / 0.95)",
                color: "oklch(0.75 0.10 85)",
                borderRadius: "2px 2px 0 0",
                border: "1px solid oklch(0.75 0.12 85 / 0.25)",
                borderBottom: "none",
                boxShadow: "0 -2px 8px oklch(0 0 0 / 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.28 0.04 240)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.85 0.12 85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.22 0.03 240 / 0.95)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.75 0.10 85)";
              }}
            >
              {languageLabels[t.language] || t.language.toUpperCase()}
            </button>
          ))}
        </div>
      ) : translations.length > 0 && !isActive ? (
        /* Small language indicator for inactive cards with translations */
        <div className="flex gap-1.5 mb-1.5">
          {translations.map((t) => (
            <span
              key={t.slug}
              className="text-[9px] font-medium tracking-widest uppercase"
              style={{ color: "oklch(0.60 0.06 85 / 0.55)" }}
            >
              {languageLabels[t.language] || t.language.toUpperCase()}
            </span>
          ))}
        </div>
      ) : (
        /* Spacer to keep vertical alignment consistent */
        <div style={{ height: "28px" }} />
      )}

      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          width: "100%",
          height: imageUrl && !imageError ? (loaded ? cardHeight : Math.round(cardWidth / (16 / 9))) : cardHeight,
          borderRadius: "3px",
          boxShadow: isActive
            ? `0 2px 0 oklch(0.60 0.04 240 / 0.6),
               0 4px 0 oklch(0.50 0.03 240 / 0.4),
               0 6px 0 oklch(0.40 0.02 240 / 0.25),
               0 16px 40px oklch(0 0 0 / 0.55),
               0 32px 64px oklch(0 0 0 / 0.25),
               inset 0 1px 0 oklch(1 0 0 / 0.12)`
            : `0 1px 0 oklch(0.50 0.03 240 / 0.4),
               0 2px 0 oklch(0.40 0.02 240 / 0.25),
               0 3px 0 oklch(0.35 0.02 240 / 0.15),
               0 8px 20px oklch(0 0 0 / 0.35),
               inset 0 1px 0 oklch(1 0 0 / 0.06)`,
          rotate: isActive ? "0deg" : `${tilt}deg`,
          outline: isActive
            ? "1px solid oklch(0.75 0.12 85 / 0.35)"
            : "1px solid oklch(1 0 0 / 0.05)",
          transition: "width 0.5s ease, height 0.5s ease, box-shadow 0.5s ease, rotate 0.5s ease, outline 0.5s ease",
        }}
      >
      {imageUrl && !imageError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={meditation.title}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
            onLoad={handleLoad}
            onError={() => {
              setImageError(true);
              setLoaded(true);
            }}
          />
        </>
      ) : (
        <FallbackCard />
      )}

        {/* Hover overlay on active card */}
        {isActive && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            style={{ backgroundColor: "oklch(0.08 0.02 240 / 0.55)" }}
          >
            <div
              className="flex flex-col items-center gap-2 px-5 py-3"
              style={{
                backgroundColor: "oklch(0.10 0.02 240 / 0.75)",
                borderRadius: "2px",
                border: "1px solid oklch(0.75 0.12 85 / 0.3)",
              }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "oklch(0.75 0.12 85)" }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "oklch(0.88 0.05 85)" }}>
                Leer meditación
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Title and date — below image */}
      <div className="w-full pt-2.5 pb-1 text-center px-1">
        <h2
          className="font-serif font-semibold uppercase tracking-wider text-balance leading-tight mb-1"
          style={{
            fontSize: isActive ? "clamp(0.85rem, 2vw, 1rem)" : "clamp(0.7rem, 1.8vw, 0.85rem)",
            color: isActive ? "oklch(0.30 0.03 80)" : "oklch(0.45 0.03 80)",
          }}
        >
          {meditation.title}
        </h2>
        <p
          className="text-xs font-light tracking-widest"
          style={{ color: isActive ? "oklch(0.50 0.06 80)" : "oklch(0.60 0.04 80 / 0.7)" }}
        >
          {formatDateDisplay(meditation.dateString)}
        </p>
      </div>

      {/* Translation buttons — below active card */}
      {translations.length > 0 && isActive && (
        <div className="flex gap-1.5 mt-1.5">
          {translations.map((t) => (
            <button
              key={t.slug}
              onClick={(e) => {
                e.stopPropagation();
                onTranslationClick?.(t.slug);
              }}
              className="px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-200"
              style={{
                backgroundColor: "oklch(0.22 0.03 240 / 0.95)",
                color: "oklch(0.75 0.10 85)",
                borderRadius: "0 0 2px 2px",
                border: "1px solid oklch(0.75 0.12 85 / 0.25)",
                borderTop: "none",
                boxShadow: "0 2px 8px oklch(0 0 0 / 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.28 0.04 240)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.85 0.12 85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.22 0.03 240 / 0.95)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.75 0.10 85)";
              }}
            >
              {languageLabels[t.language] || t.language.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
