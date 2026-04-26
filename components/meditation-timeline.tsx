"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { meditations, getYears, type Meditation } from "@/lib/meditations-data";
import { MeditationCard } from "./meditation-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MeditationTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const years = getYears();
  const sortedMeditations = [...meditations].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const scrollToIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, sortedMeditations.length - 1));
    setActiveIndex(clampedIndex);
  }, [sortedMeditations.length]);

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  // Mouse drag handlers
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cardsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - cardsContainerRef.current.offsetLeft);
    setScrollLeft(activeIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (!cardsContainerRef.current) return;
    const x = e.touches[0].pageX - cardsContainerRef.current.offsetLeft;
    const walk = (startX - x) / 150;
    const newIndex = Math.round(scrollLeft + walk);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < sortedMeditations.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  // Calculate year marker positions
  const getYearPositions = () => {
    const positions: { year: number; position: number; index: number }[] = [];
    let currentYear = -1;

    sortedMeditations.forEach((meditation, index) => {
      const year = meditation.date.getFullYear();
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

  const yearPositions = getYearPositions();
  const currentMeditation = sortedMeditations[activeIndex];
  const progressPercentage = (activeIndex / (sortedMeditations.length - 1)) * 100;

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="text-center pt-12 pb-8 px-4">
        <div className="mb-4">
          <svg
            className="w-12 h-12 mx-auto text-primary"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" />
            <path
              d="M24 10L28 24L24 38L20 24L24 10Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M10 24L24 20L38 24L24 28L10 24Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
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
        {/* Navigation Arrows */}
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

        {/* Cards Container */}
        <div
          ref={cardsContainerRef}
          className="relative w-full h-[420px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
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

              // Only render nearby cards for performance
              if (absOffset > 4) return null;

              const translateX = offset * 85;
              const translateZ = -absOffset * 60;
              const rotateY = offset * -8;
              const scale = 1 - absOffset * 0.1;
              const opacity = 1 - absOffset * 0.2;
              const zIndex = 10 - absOffset;

              return (
                <div
                  key={meditation.id}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: Math.max(0, opacity),
                    zIndex,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <MeditationCard
                    meditation={meditation}
                    isActive={index === activeIndex}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative px-8 md:px-16 pb-16">
        {/* Timeline Track */}
        <div className="relative h-32">
          {/* Tick marks */}
          <div className="absolute top-0 left-0 right-0 h-16 flex justify-between px-4">
            {Array.from({ length: sortedMeditations.length }).map((_, i) => {
              const isYearStart = yearPositions.some((yp) => yp.index === i);
              return (
                <div
                  key={i}
                  className={`w-px transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-primary h-10"
                      : isYearStart
                      ? "bg-foreground/60 h-8"
                      : "bg-foreground/30 h-5"
                  }`}
                />
              );
            })}
          </div>

          {/* Main timeline line */}
          <div className="absolute top-16 left-4 right-4 h-0.5 bg-foreground/20">
            {/* Progress indicator */}
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Active dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg transition-all duration-500"
              style={{ left: `${progressPercentage}%`, marginLeft: "-8px" }}
            />
          </div>

          {/* Year labels */}
          <div className="absolute top-20 left-4 right-4">
            {yearPositions.map(({ year, position }) => (
              <button
                key={year}
                className="absolute transform -translate-x-1/2 text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-colors"
                style={{ left: `${position}%` }}
                onClick={() => {
                  const yearMeditationIndex = sortedMeditations.findIndex(
                    (m) => m.date.getFullYear() === year
                  );
                  if (yearMeditationIndex !== -1) {
                    setActiveIndex(yearMeditationIndex);
                  }
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Current meditation info */}
        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm">
            {activeIndex + 1} de {sortedMeditations.length} meditaciones
          </p>
        </div>
      </div>
    </div>
  );
}
