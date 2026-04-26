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
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch meditations directly from WordPress REST API (client-side to bypass server restrictions)
  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        // Fetch directly from WordPress API in the browser
        const res = await fetch(
          "https://shaktianandama.com/wp-json/wp/v2/posts?per_page=100&_embed=wp:featuredmedia",
          { mode: "cors" }
        );
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const posts = await res.json();
        
        const meditations: APIMeditation[] = posts.map((post: {
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
          
          return {
            id: post.id,
            title: post.title.rendered.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim(),
            slug: post.slug,
            dateString: post.date.split("T")[0],
            excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 300),
            imageUrl,
            link: post.link,
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

  // Merge API data with fallback, prioritizing API data for images
  const sortedMeditations: Meditation[] = useMemo(() => {
    if (apiMeditations.length > 0) {
      // Use API data directly - it has real images
      return apiMeditations.map((m, i) => ({
        id: m.id || i + 1,
        title: m.title,
        subtitle: "Meditación con Mataji Shaktiananda",
        dateString: m.dateString,
        excerpt: m.excerpt,
        imageUrl: m.imageUrl || undefined,
        slug: m.slug,
      })).sort((a, b) => b.dateString.localeCompare(a.dateString));
    }
    // Fallback to static data
    return [...fallbackMeditations].sort((a, b) => b.dateString.localeCompare(a.dateString));
  }, [apiMeditations]);

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
          className="relative w-full h-[420px] md:h-[480px] flex items-center justify-center select-none"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-1000">
            {sortedMeditations.map((meditation, index) => {
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);
              if (absOffset > 4) return null;

              const translateX = offset * 85;
              const translateZ = -absOffset * 60;
              const rotateY = offset * -8;
              const scale = 1 - absOffset * 0.1;
              const opacity = 1 - absOffset * 0.2;
              const zIndex = 10 - absOffset;
              const isActive = index === activeIndex;

              return (
                <div
                  key={meditation.id}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: Math.max(0, opacity),
                    zIndex,
                    cursor: isActive ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (isActive && !isDragging) {
                      setReaderOpen(true);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <MeditationCard meditation={meditation} isActive={isActive} />
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
        <div className="relative h-40">
          {/* Tick marks */}
          <div className="absolute top-0 left-0 right-0 h-20 flex justify-between items-end">
            {sortedMeditations.map((meditation, i) => {
              const isYearStart = yearPositions.some((yp) => yp.index === i);
              const isActive = i === activeIndex;
              const isHovered = i === hoveredTickIndex;

              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center"
                  style={{ width: `${100 / sortedMeditations.length}%` }}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      className="absolute bottom-full mb-2 px-3 py-1.5 text-xs rounded shadow-lg whitespace-nowrap z-30 pointer-events-none"
                      style={{
                        backgroundColor: "oklch(0.25 0.03 240)",
                        color: "oklch(0.92 0.02 85)",
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                    >
                      <div className="font-medium">{meditation.title}</div>
                      <div style={{ color: "oklch(0.70 0.05 85)" }}>{formatDateShort(meditation.dateString)}</div>
                      {/* Arrow */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                        style={{
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: "4px solid oklch(0.25 0.03 240)",
                        }}
                      />
                    </div>
                  )}

                  {/* Tick */}
                  <button
                    className="w-px transition-all duration-200"
                    style={{
                      height: isActive ? "40px" : isHovered ? "32px" : isYearStart ? "26px" : "16px",
                      backgroundColor: isActive
                        ? "oklch(0.75 0.12 85)"
                        : isHovered
                        ? "oklch(0.65 0.10 85)"
                        : isYearStart
                        ? "oklch(0.35 0.02 240)"
                        : "oklch(0.55 0.02 240 / 0.5)",
                      transform: isHovered && !isActive ? "translateY(-6px)" : "translateY(0)",
                    }}
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setHoveredTickIndex(i)}
                    onMouseLeave={() => setHoveredTickIndex(null)}
                    aria-label={`Ir a: ${meditation.title}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Draggable track */}
          <div
            ref={timelineTrackRef}
            className="absolute left-0 right-0 h-6"
            style={{
              top: "80px",
              cursor: isTimelineDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleTimelineMouseDown}
            onTouchStart={handleTimelineTouchStart}
          >
            {/* Track background */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                height: "1px",
                backgroundColor: "oklch(0.55 0.02 240 / 0.25)",
              }}
            />
            {/* Progress */}
            <div
              className="absolute left-0 transition-all duration-150"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                height: "1px",
                width: `${progressPercentage}%`,
                backgroundColor: "oklch(0.75 0.12 85)",
              }}
            />
            {/* Dot */}
            <div
              className="absolute transition-transform duration-150"
              style={{
                top: "50%",
                left: `${progressPercentage}%`,
                transform: `translate(-50%, -50%) scale(${isTimelineDragging ? 1.4 : 1})`,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "oklch(0.75 0.12 85)",
                border: "3px solid oklch(0.98 0.005 240)",
                boxShadow: "0 2px 8px oklch(0 0 0 / 0.2)",
              }}
            >
              {isTimelineDragging && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.4)" }}
                />
              )}
            </div>
          </div>

          {/* Year labels */}
          <div className="absolute left-0 right-0" style={{ top: "110px" }}>
            {yearPositions.map(({ year, position, index }) => (
              <button
                key={year}
                className="absolute transform -translate-x-1/2 text-sm md:text-base font-semibold transition-colors"
                style={{
                  left: `${position}%`,
                  color: parseInt(sortedMeditations[activeIndex]?.dateString?.split('-')[0]) === year
                    ? "oklch(0.75 0.12 85)"
                    : "oklch(0.45 0.02 240)",
                }}
                onClick={() => setActiveIndex(index)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm">
            {activeIndex + 1} de {sortedMeditations.length} meditaciones
          </p>
        </div>
      </div>
    </div>
  );
}
