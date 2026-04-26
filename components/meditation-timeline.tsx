"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { meditations as fallbackMeditations, type Meditation } from "@/lib/meditations-data";
import { MeditationCard } from "./meditation-card";
import { MeditationReader } from "./meditation-reader";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// API meditation type
interface APIMeditation {
  id: number;
  title: string;
  slug: string;
  dateString: string;
  excerpt: string;
  imageUrl: string | null;
  link: string;
  language?: "es" | "it" | "en";
}

// Meditation with translations
interface MeditationGroup {
  primary: APIMeditation;
  translations: APIMeditation[];
}

export function MeditationTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTimelineDragging, setIsTimelineDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredTickIndex, setHoveredTickIndex] = useState<number | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [apiMeditations, setApiMeditations] = useState<APIMeditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serendipiaAnimating, setSerendipiaAnimating] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch meditations directly from WordPress REST API (client-side to bypass server restrictions)
  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        // Fetch page 1 to discover total pages, then fetch all remaining pages in parallel
        const firstRes = await fetch(
          `https://shaktianandama.com/wp-json/wp/v2/posts?per_page=100&page=1&_embed=wp:featuredmedia`,
          { mode: "cors" }
        );

        if (!firstRes.ok) {
          throw new Error(`API error: ${firstRes.status}`);
        }

        const firstPage = await firstRes.json();
        const totalPages = parseInt(firstRes.headers.get("X-WP-TotalPages") || "1");

        let allPosts: any[] = firstPage;

        if (totalPages > 1) {
          const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const remainingResults = await Promise.all(
            remainingPages.map(page =>
              fetch(
                `https://shaktianandama.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`,
                { mode: "cors" }
              ).then(r => r.json())
            )
          );
          allPosts = [firstPage, ...remainingResults].flat();
        }
        
        // Filter to keep only meditation posts (exclude pages, categories, etc.)
        // Meditation posts typically have a featured image and meaningful content
        const meditationPosts = allPosts.filter((post: any) => {
          // Must have featured image
          const hasImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          // Exclude common non-meditation slugs
          const excludedSlugs = ["contacto", "sobre", "about", "privacy", "legal", "terms", "cookie", "aviso-legal"];
          const isExcluded = excludedSlugs.some(s => post.slug.includes(s));
          return hasImage && !isExcluded;
        });
        
        // Process posts and detect language
        const meditations: APIMeditation[] = meditationPosts.map((post: {
          id: number;
          date: string;
          slug: string;
          title: { rendered: string };
          excerpt: { rendered: string };
          link: string;
          _embedded?: {
            "wp:featuredmedia"?: Array<{
              source_url: string;
              media_details?: {
                sizes?: {
                  full?: { source_url: string };
                  large?: { source_url: string };
                };
              };
            }>;
          };
        }) => {
          // Get the best available image
          const media = post._embedded?.["wp:featuredmedia"]?.[0];
          let imageUrl: string | null = null;
          if (media) {
            const sizes = media.media_details?.sizes;
            imageUrl = sizes?.full?.source_url || sizes?.large?.source_url || media.source_url || null;
          }
          
          const title = post.title.rendered.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
          const slug = post.slug;
          
          // Detect language from slug suffix
          let language: "es" | "it" | "en" = "es";
          if (slug.endsWith("-it") || slug.endsWith("-italiano")) {
            language = "it";
          } else if (slug.endsWith("-en") || slug.endsWith("-english")) {
            language = "en";
          }
          
          return {
            id: post.id,
            title,
            slug,
            dateString: post.date.split("T")[0],
            excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 300),
            imageUrl,
            link: post.link,
            language,
          };
        });
        
        setApiMeditations(meditations);
      } catch (err) {
        console.error("[v0] Failed to fetch from WordPress API:", err);
        // Fall back to local API
        try {
          const res = await fetch("/api/meditations");
          const data = await res.json();
          if (data.meditations?.length) {
            setApiMeditations(data.meditations);
          }
        } catch {
          // Will use fallback static data
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeditations();
  }, []);

  // Group meditations by base slug (Spanish primary, other languages as translations)
  const groupedMeditations = useMemo((): MeditationGroup[] => {
    if (apiMeditations.length === 0) return [];
    
    // Separate Spanish (primary) and other languages
    const spanish = apiMeditations.filter(m => m.language === "es");
    const translations = apiMeditations.filter(m => m.language !== "es");
    
    // Create a map of base slug to translations
    const translationMap = new Map<string, APIMeditation[]>();
    translations.forEach(t => {
      // Remove language suffix to get base slug
      const baseSlug = t.slug.replace(/-it$|-italiano$|-en$|-english$/, "");
      const existing = translationMap.get(baseSlug) || [];
      existing.push(t);
      translationMap.set(baseSlug, existing);
    });
    
    // Group Spanish meditations with their translations
    return spanish.map(primary => ({
      primary,
      translations: translationMap.get(primary.slug) || [],
    }));
  }, [apiMeditations]);

  // Convert to Meditation type for display (only primary Spanish meditations)
  const sortedMeditations: (Meditation & { translations?: APIMeditation[] })[] = useMemo(() => {
    if (groupedMeditations.length > 0) {
      return groupedMeditations
        .map((g, i) => ({
          id: g.primary.id || i + 1,
          title: g.primary.title,
          subtitle: "Meditación con Mataji Shaktiananda",
          dateString: g.primary.dateString,
          excerpt: g.primary.excerpt,
          imageUrl: g.primary.imageUrl || undefined,
          slug: g.primary.slug,
          translations: g.translations,
        }))
        .sort((a, b) => b.dateString.localeCompare(a.dateString));
    }
    // Fallback to static data
    return [...fallbackMeditations].sort((a, b) => b.dateString.localeCompare(a.dateString));
  }, [groupedMeditations]);

  const scrollToIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, sortedMeditations.length - 1));
    setActiveIndex(clampedIndex);
  }, [sortedMeditations.length]);

  const handlePrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);
  const handleNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);

  // Cards drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - cardsContainerRef.current.offsetLeft);
    setScrollLeft(activeIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!cardsContainerRef.current) return;
    const x = e.pageX - cardsContainerRef.current.offsetLeft;
    const walk = (startX - x) / 150;
    const newIndex = Math.round(scrollLeft + walk);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < sortedMeditations.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Touch handlers for cards
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cardsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - cardsContainerRef.current.offsetLeft);
    setScrollLeft(activeIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !cardsContainerRef.current) return;
    const x = e.touches[0].pageX - cardsContainerRef.current.offsetLeft;
    const walk = (startX - x) / 150;
    const newIndex = Math.round(scrollLeft + walk);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < sortedMeditations.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Timeline drag handlers
  const updateIndexFromPosition = useCallback((clientX: number) => {
    if (!timelineTrackRef.current) return;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.round(percentage * (sortedMeditations.length - 1));
    setActiveIndex(newIndex);
  }, [sortedMeditations.length]);

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTimelineDragging(true);
    updateIndexFromPosition(e.clientX);
  };

  const handleTimelineMouseMove = useCallback((e: MouseEvent) => {
    if (!isTimelineDragging) return;
    updateIndexFromPosition(e.clientX);
  }, [isTimelineDragging, updateIndexFromPosition]);

  const handleTimelineMouseUp = useCallback(() => setIsTimelineDragging(false), []);

  const handleTimelineTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsTimelineDragging(true);
    updateIndexFromPosition(e.touches[0].clientX);
  };

  const handleTimelineTouchMove = useCallback((e: TouchEvent) => {
    if (!isTimelineDragging) return;
    e.preventDefault();
    updateIndexFromPosition(e.touches[0].clientX);
  }, [isTimelineDragging, updateIndexFromPosition]);

  const handleTimelineTouchEnd = useCallback(() => setIsTimelineDragging(false), []);

  useEffect(() => {
    if (isTimelineDragging) {
      window.addEventListener("mousemove", handleTimelineMouseMove);
      window.addEventListener("mouseup", handleTimelineMouseUp);
      window.addEventListener("touchmove", handleTimelineTouchMove, { passive: false });
      window.addEventListener("touchend", handleTimelineTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleTimelineMouseMove);
      window.removeEventListener("mouseup", handleTimelineMouseUp);
      window.removeEventListener("touchmove", handleTimelineTouchMove);
      window.removeEventListener("touchend", handleTimelineTouchEnd);
    };
  }, [isTimelineDragging, handleTimelineMouseMove, handleTimelineMouseUp, handleTimelineTouchMove, handleTimelineTouchEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readerOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, readerOpen, handlePrev, handleNext]);

  // Scroll to navigate cards
  const scrollAccumulator = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (readerOpen) return;
      e.preventDefault();
      scrollAccumulator.current += e.deltaY + e.deltaX;
      // Throttle: only advance once per ~120px of scroll
      if (Math.abs(scrollAccumulator.current) > 120) {
        if (scrollAccumulator.current > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        scrollAccumulator.current = 0;
      }
      // Reset accumulator if user stops scrolling
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0;
      }, 300);
    },
    [readerOpen, handleNext, handlePrev]
  );

  useEffect(() => {
    const el = cardsContainerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Stable per-card tilt values (seeded by id so consistent across renders)
  const cardTilts = useMemo(() => {
    return sortedMeditations.map((m) => {
      // deterministic tilt from id: small values between -1.5 and 1.5 degrees
      const seed = m.id % 31;
      return ((seed - 15) / 15) * 1.5;
    });
  }, [sortedMeditations]);

  // Year positions
  const getYearPositions = () => {
    const positions: { year: number; position: number; index: number }[] = [];
    let currentYear = -1;
    sortedMeditations.forEach((meditation, index) => {
      const year = parseInt(meditation.dateString.split('-')[0]);
      if (year !== currentYear) {
        positions.push({
          year,
          position: (index / (sortedMeditations.length - 1)) * 100,
          index,
        });
        currentYear = year;
      }
    });
    return positions;
  };

  const formatDateShort = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthName = months[parseInt(month) - 1];
    return `${parseInt(day)} ${monthName} ${year}`;
  };

  const yearPositions = getYearPositions();
  const progressPercentage = sortedMeditations.length > 1
    ? (activeIndex / (sortedMeditations.length - 1)) * 100
    : 0;

  const activeMeditation: Meditation = sortedMeditations[activeIndex];

  // Show loading state
  if (isLoading && sortedMeditations.length === 0) {
    return (
      <div className="relative w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-light tracking-wide">Cargando meditaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Reader overlay */}
      {readerOpen && activeMeditation && (
        <MeditationReader
          meditation={activeMeditation}
          onClose={() => setReaderOpen(false)}
          onPrev={() => { scrollToIndex(activeIndex - 1); }}
          onNext={() => { scrollToIndex(activeIndex + 1); }}
          hasPrev={activeIndex > 0}
          hasNext={activeIndex < sortedMeditations.length - 1}
        />
      )}

      {/* Header */}
      <header className="text-center pt-12 pb-8 px-4">
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-primary" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" />
            <path d="M24 10L28 24L24 38L20 24L24 10Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M10 24L24 20L38 24L24 28L10 24Z" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide mb-3">
          MEDITACIONES
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-light">
          Guiadas por Mataji Shaktiananda
        </p>
      </header>

      {/* Cards Carousel */}
      <div className="relative flex-1 flex items-center justify-center py-8">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm text-card-foreground disabled:opacity-30 hover:bg-card transition-all duration-300 shadow-lg"
          aria-label="Anterior meditación"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={activeIndex === sortedMeditations.length - 1}
          className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm text-card-foreground disabled:opacity-30 hover:bg-card transition-all duration-300 shadow-lg"
          aria-label="Siguiente meditación"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={cardsContainerRef}
          className="relative w-full flex items-center justify-center select-none"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            minHeight: "260px",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full max-w-5xl flex items-center justify-center"
            style={{ perspective: "1200px", transformStyle: "preserve-3d", height: "340px" }}
          >
            {sortedMeditations.map((meditation, index) => {
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);
              if (absOffset > 4) return null;

              const translateX = offset * 90;
              const translateZ = -absOffset * 80;
              const rotateY = offset * -10;
              const scale = 1 - absOffset * 0.08;
              const opacity = 1 - absOffset * 0.22;
              const zIndex = 10 - absOffset;
              const isActive = index === activeIndex;

              return (
                <div
                  key={meditation.id}
                  className="absolute"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: Math.max(0, opacity),
                    zIndex,
                    cursor: isActive ? "pointer" : "default",
                    transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.45s ease",
                    willChange: "transform, opacity",
                  }}
                  onClick={() => {
                    if (isActive && !isDragging) {
                      setReaderOpen(true);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <MeditationCard
                    meditation={meditation}
                    isActive={isActive}
                    tilt={cardTilts[index] ?? 0}
                    onTranslationClick={(slug) => {
                      // Open the translation in a new tab
                      window.open(`https://shaktianandama.com/${slug}/`, "_blank");
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Click hint for active card */}
      <div className="text-center -mt-4 mb-6">
        <p className="text-xs text-muted-foreground tracking-widest uppercase font-light">
          Clic en la tarjeta para leer
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative px-8 md:px-16 pb-16">

        {/* Serendipia button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              if (serendipiaAnimating) return;
              const targetIndex = Math.floor(Math.random() * sortedMeditations.length);
              setSerendipiaAnimating(true);
              
              // Animate through cards to reach target
              const distance = Math.abs(targetIndex - activeIndex);
              const direction = targetIndex > activeIndex ? 1 : -1;
              const steps = Math.min(distance, 20); // Cap at 20 steps for long distances
              const stepSize = distance / steps;
              let currentStep = 0;
              
              const animateStep = () => {
                currentStep++;
                if (currentStep >= steps) {
                  setActiveIndex(targetIndex);
                  setSerendipiaAnimating(false);
                  return;
                }
                const nextIndex = Math.round(activeIndex + (direction * stepSize * currentStep));
                setActiveIndex(Math.max(0, Math.min(nextIndex, sortedMeditations.length - 1)));
                setTimeout(animateStep, 80 - (currentStep * 2)); // Speed up gradually
              };
              
              setTimeout(animateStep, 100);
            }}
            disabled={serendipiaAnimating}
            className="group relative px-8 py-2.5 text-xs tracking-[0.25em] uppercase font-light transition-all duration-300"
            style={{
              border: "1px solid oklch(0.75 0.12 85 / 0.5)",
              color: serendipiaAnimating ? "oklch(0.75 0.12 85)" : "oklch(0.55 0.08 85)",
              borderRadius: "1px",
              letterSpacing: "0.2em",
              opacity: serendipiaAnimating ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (serendipiaAnimating) return;
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.75 0.12 85 / 0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.75 0.12 85 / 0.9)";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.65 0.12 85)";
            }}
            onMouseLeave={e => {
              if (serendipiaAnimating) return;
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.75 0.12 85 / 0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.08 85)";
            }}
          >
            {serendipiaAnimating ? "Buscando..." : "Serendipia"}
          </button>
        </div>

        <div className="relative" style={{ height: "100px" }}>
          {/* Tick marks — rendered as absolute positioned bars anchored to bottom */}
          <div className="absolute inset-x-0" style={{ bottom: "28px", height: "56px" }}>
            {sortedMeditations.map((meditation, i) => {
              const isYearStart = yearPositions.some((yp) => yp.index === i);
              const isActive = i === activeIndex;
              const isHovered = i === hoveredTickIndex;
              const leftPct = sortedMeditations.length > 1
                ? (i / (sortedMeditations.length - 1)) * 100
                : 0;

              // Base heights in px
              const baseH = isYearStart ? 20 : 12;
              const hoveredH = 48;
              const activeH = 40;

              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center justify-end"
                  style={{
                    left: `${leftPct}%`,
                    bottom: 0,
                    height: "100%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div
                      className="absolute pointer-events-none z-30 px-2.5 py-1.5 text-xs rounded-sm shadow-lg"
                      style={{
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "oklch(0.18 0.02 240)",
                        color: "oklch(0.92 0.02 85)",
                        whiteSpace: "nowrap",
                        maxWidth: "220px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <div className="font-medium truncate">{meditation.title}</div>
                      <div className="mt-0.5" style={{ color: "oklch(0.70 0.06 85)", fontSize: "10px" }}>
                        {formatDateShort(meditation.dateString)}
                      </div>
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full"
                        style={{
                          width: 0, height: 0,
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: "4px solid oklch(0.18 0.02 240)",
                        }}
                      />
                    </div>
                  )}

                  {/* Hit area + visible tick */}
                  <button
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setHoveredTickIndex(i)}
                    onMouseLeave={() => setHoveredTickIndex(null)}
                    aria-label={`Ir a: ${meditation.title}`}
                    className="relative flex items-end justify-center"
                    style={{
                      width: "12px",
                      height: "100%",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    {/* The visible bar */}
                    <div
                      style={{
                        width: isActive || isHovered ? "2px" : "1px",
                        height: isActive
                          ? `${activeH}px`
                          : isHovered
                          ? `${hoveredH}px`
                          : `${baseH}px`,
                        backgroundColor: isActive
                          ? "oklch(0.75 0.12 85)"
                          : isHovered
                          ? "oklch(0.60 0.10 85)"
                          : isYearStart
                          ? "oklch(0.38 0.02 240)"
                          : "oklch(0.55 0.02 240 / 0.45)",
                        transition: "height 0.15s ease, width 0.15s ease, background-color 0.15s ease",
                        transformOrigin: "bottom",
                        borderRadius: "1px 1px 0 0",
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Draggable track — sits just below the ticks */}
          <div
            ref={timelineTrackRef}
            className="absolute inset-x-0"
            style={{
              bottom: "16px",
              height: "24px",
              cursor: isTimelineDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleTimelineMouseDown}
            onTouchStart={handleTimelineTouchStart}
          >
            {/* Track background line */}
            <div
              className="absolute inset-x-0"
              style={{
                top: "50%",
                height: "1px",
                backgroundColor: "oklch(0.55 0.02 240 / 0.2)",
                transform: "translateY(-50%)",
              }}
            />
            {/* Progress line */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                height: "1px",
                width: `${progressPercentage}%`,
                backgroundColor: "oklch(0.75 0.12 85)",
                transform: "translateY(-50%)",
                transition: "width 0.15s ease",
              }}
            />
            {/* Draggable dot */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${progressPercentage}%`,
                transform: `translate(-50%, -50%) scale(${isTimelineDragging ? 1.35 : 1})`,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "oklch(0.75 0.12 85)",
                border: "2.5px solid oklch(0.98 0.005 240)",
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.18)",
                transition: "transform 0.15s ease",
                zIndex: 10,
              }}
            >
              {isTimelineDragging && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.35)" }}
                />
              )}
            </div>
          </div>

          {/* Year labels — only show labels that are spaced far enough apart */}
          <div className="absolute inset-x-0" style={{ bottom: 0 }}>
            {(() => {
              const MIN_GAP_PCT = 7; // minimum % between year labels
              const shown: { year: number; position: number; index: number }[] = [];
              for (const yp of yearPositions) {
                const tooClose = shown.some(s => Math.abs(s.position - yp.position) < MIN_GAP_PCT);
                if (!tooClose) shown.push(yp);
              }
              const activeYear = parseInt(sortedMeditations[activeIndex]?.dateString?.split('-')[0]);
              return shown.map(({ year, position, index }) => (
                <button
                  key={year}
                  onClick={() => setActiveIndex(index)}
                  className="absolute -translate-x-1/2 transition-colors duration-200"
                  style={{
                    left: `${position}%`,
                    bottom: 0,
                    fontSize: "11px",
                    fontWeight: activeYear === year ? 600 : 400,
                    letterSpacing: "0.05em",
                    color: activeYear === year
                      ? "oklch(0.75 0.12 85)"
                      : "oklch(0.45 0.02 240)",
                    lineHeight: 1,
                  }}
                >
                  {year}
                </button>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
