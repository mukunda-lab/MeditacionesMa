"use client";

import { useState, useEffect, useRef } from "react";
import type { Meditation } from "@/lib/meditations-data";
import { formatDateDisplay } from "@/lib/meditations-data";
import { BookOpen } from "lucide-react";

interface Translation {
  slug: string;
  language: "es" | "it" | "en";
  title: string;
  imageUrl?: string | null;
}

interface MeditationCardProps {
  meditation: Meditation & { translations?: Translation[] };
  isActive: boolean;
  tilt?: number;
  onTranslationClick?: (slug: string) => void;
}

const languageLabels: Record<string, string> = {
  it: "Italiano",
  en: "English",
};

// A small ghost card shown above/below for translations
function TranslationGhost({
  translation,
  position,
  onClick,
}: {
  translation: Translation;
  position: "above" | "below";
  onClick: () => void;
}) {
  const label = languageLabels[translation.language] || translation.language.toUpperCase();

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        ...(position === "above" ? { bottom: "calc(100% + 10px)" } : { top: "calc(100% + 10px)" }),
        width: "200px",
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 4px 16px oklch(0 0 0 / 0.35)",
        outline: "1px solid oklch(0.75 0.12 85 / 0.2)",
        zIndex: 20,
      }}
    >
      {/* Miniature image or solid block */}
      <div
        className="relative"
        style={{
          height: "56px",
          backgroundColor: "oklch(0.22 0.03 240)",
          backgroundImage: translation.imageUrl ? `url(${translation.imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "oklch(0.08 0.02 240 / 0.65)" }}
        />
        {/* Language label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xs font-light tracking-[0.18em] uppercase"
            style={{ color: "oklch(0.85 0.10 85)" }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MeditationCard({ meditation, isActive, tilt = 0, onTranslationClick }: MeditationCardProps) {
  const translations = meditation.translations || [];
  const imageUrl = meditation.imageUrl || null;
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [naturalAspect, setNaturalAspect] = useState<number>(16 / 9);
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

  const cardWidth = isActive ? 320 : 260;
  const cardHeight = Math.round(cardWidth / naturalAspect);

  // Split translations by language
  const aboveTranslations = translations.filter(t => t.language === "it");
  const belowTranslations = translations.filter(t => t.language === "en");

  const FallbackCard = () => (
    <div
      className="flex flex-col items-center justify-center p-6 text-center"
      style={{
        width: "100%",
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
    </div>
  );

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        width: cardWidth,
        // Extra room for ghost cards above/below
        paddingTop: aboveTranslations.length > 0 ? "76px" : "0",
        paddingBottom: belowTranslations.length > 0 ? "76px" : "0",
      }}
    >
      {/* IT ghost card — above */}
      {isActive && aboveTranslations.map(t => (
        <TranslationGhost
          key={t.slug}
          translation={t}
          position="above"
          onClick={() => onTranslationClick?.(t.slug)}
        />
      ))}

      {/* Main card */}
      <div
        className="relative overflow-hidden"
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
            {!loaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: "oklch(0.35 0.04 240)" }}
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt={meditation.title}
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: loaded ? 1 : 0, display: "block" }}
              onLoad={handleLoad}
              onError={() => { setImageError(true); setLoaded(true); }}
            />
          </>
        ) : (
          <FallbackCard />
        )}

        {/* Read overlay — only on active, on hover */}
        {isActive && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            style={{ backgroundColor: "oklch(0.08 0.02 240 / 0.5)" }}
          >
            <div
              className="flex flex-col items-center gap-2 px-5 py-3"
              style={{
                backgroundColor: "oklch(0.10 0.02 240 / 0.80)",
                borderRadius: "2px",
                border: "1px solid oklch(0.75 0.12 85 / 0.3)",
              }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "oklch(0.75 0.12 85)" }} />
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "oklch(0.88 0.05 85)" }}
              >
                {"Leer meditaci\u00f3n"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Title + date below card — fade-up animation when active */}
      <div
        className="text-center mt-3 px-2"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        <p
          className="font-serif font-medium text-balance leading-snug"
          style={{
            fontSize: "0.85rem",
            color: "oklch(0.78 0.04 240)",
            letterSpacing: "0.04em",
            maxWidth: "300px",
          }}
        >
          {meditation.title}
        </p>
        <p
          className="mt-1 text-xs font-light tracking-widest uppercase"
          style={{ color: "oklch(0.62 0.08 85)" }}
        >
          {formatDateDisplay(meditation.dateString)}
        </p>
      </div>

      {/* EN ghost card — below */}
      {isActive && belowTranslations.map(t => (
        <TranslationGhost
          key={t.slug}
          translation={t}
          position="below"
          onClick={() => onTranslationClick?.(t.slug)}
        />
      ))}
    </div>
  );
}
