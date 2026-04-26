"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Minus, Plus, AlignLeft } from "lucide-react";
import type { Meditation } from "@/lib/meditations-data";
import { formatDateDisplay } from "@/lib/meditations-data";

interface MeditationReaderProps {
  meditation: Meditation;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

interface MeditationContent {
  title: string;
  date: string;
  imageUrl: string | null;
  content: string;
}

const FONT_SIZES = [14, 16, 18, 20, 22, 24];

export function MeditationReader({
  meditation,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: MeditationReaderProps) {
  const [content, setContent] = useState<MeditationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSizeIndex, setFontSizeIndex] = useState(2); // default 18px
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  const fontSize = FONT_SIZES[fontSizeIndex];

  useEffect(() => {
    setLoading(true);
    setContent(null);
    setScrollProgress(0);

    const fetchContent = async () => {
      try {
        // Fetch directly from WordPress REST API (client-side to bypass CORS/firewall issues)
        const res = await fetch(
          `https://shaktianandama.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(meditation.slug)}&_embed=wp:featuredmedia`,
          { mode: "cors" }
        );
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const posts = await res.json();
        
        if (posts.length > 0) {
          const post = posts[0];
          
          // Get best image
          const media = post._embedded?.["wp:featuredmedia"]?.[0];
          let imageUrl: string | null = null;
          if (media) {
            const sizes = media.media_details?.sizes;
            imageUrl = sizes?.full?.source_url || sizes?.large?.source_url || media.source_url || null;
          }
          
          // Clean content (remove scripts, styles, share buttons)
          let content = post.content.rendered;
          content = content
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<div[^>]*class="[^"]*sharedaddy[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
            .replace(/<div[^>]*id="[^"]*jp-relatedposts[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
            .trim();
          
          setContent({
            title: post.title.rendered.replace(/<[^>]+>/g, "").trim(),
            date: post.date.split("T")[0],
            imageUrl,
            content,
          });
          return;
        }
        
        throw new Error("No posts found");
      } catch (err) {
        console.error("[v0] Error fetching meditation content:", err);
        // Fallback to local data
        setContent({
          title: meditation.title,
          date: meditation.dateString,
          imageUrl: meditation.imageUrl || null,
          content: "",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [meditation]);

  // Track scroll progress for reading bar
  useEffect(() => {
    const el = readerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const progress = scrollHeight > clientHeight
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 100;
      setScrollProgress(progress);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [content]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev?.();
      if (e.key === "ArrowRight" && hasNext) onNext?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const displayImage = content?.imageUrl || meditation.imageUrl;

  // Parse content blocks from raw HTML into clean paragraphs
  const parseContentBlocks = (html: string): string[] => {
    if (!html) return [];
    // Split on <p> or <br> tags and extract text
    const blocks = html
      .replace(/<br\s*\/?>/gi, "\n")
      .split(/<\/?p[^>]*>/gi)
      .map((block) => block.replace(/<[^>]+>/g, "").trim())
      .filter((block) => block.length > 0);
    return blocks;
  };

  const contentBlocks = content?.content ? parseContentBlocks(content.content) : [];
  const hasRealContent = contentBlocks.length > 0 && contentBlocks.some(b => b.length > 30);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "oklch(0.08 0.01 240 / 0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Leyendo: ${meditation.title}`}
    >
      {/* Reading progress bar - top of screen */}
      <div className="fixed top-0 left-0 right-0 z-60 h-0.5" style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.3)" }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${scrollProgress}%`, backgroundColor: "oklch(0.75 0.12 85)" }}
        />
      </div>

      {/* Reader container */}
      <div
        className="relative flex flex-col"
        style={{
          width: "min(720px, 96vw)",
          height: "min(90vh, 900px)",
          backgroundColor: "oklch(0.97 0.005 85)", // warm parchment
          borderRadius: "4px",
          boxShadow: "0 32px 80px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.75 0.12 85 / 0.2)",
        }}
      >
        {/* Top toolbar */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{
            borderBottom: "1px solid oklch(0.75 0.12 85 / 0.2)",
            backgroundColor: "oklch(0.95 0.008 85)",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {/* Navigation: prev */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "oklch(0.45 0.03 240)" }}
              aria-label="Cerrar lector"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>

          {/* Center: title */}
          <p
            className="text-xs font-medium tracking-widest uppercase truncate max-w-[200px] text-center"
            style={{ color: "oklch(0.55 0.05 85)" }}
          >
            {meditation.title}
          </p>

          {/* Font size controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSizeIndex((i) => Math.max(0, i - 1))}
              disabled={fontSizeIndex === 0}
              className="p-1.5 rounded transition-colors disabled:opacity-30"
              style={{ color: "oklch(0.45 0.03 240)" }}
              aria-label="Reducir tamaño de texto"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <AlignLeft className="w-3.5 h-3.5" style={{ color: "oklch(0.65 0.05 85)" }} />
            <button
              onClick={() => setFontSizeIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
              disabled={fontSizeIndex === FONT_SIZES.length - 1}
              className="p-1.5 rounded transition-colors disabled:opacity-30"
              style={{ color: "oklch(0.45 0.03 240)" }}
              aria-label="Aumentar tamaño de texto"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          ref={readerRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: "oklch(0.55 0.05 85)" }}>
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: "oklch(0.75 0.12 85 / 0.3)", borderTopColor: "oklch(0.75 0.12 85)" }}
              />
              <p className="text-sm font-light">Cargando meditación...</p>
            </div>
          ) : (
            <article style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 32px 80px" }}>
              {/* Cover image */}
              {displayImage && (
                <div
                  className="relative w-full mb-10 overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    borderRadius: "3px",
                    boxShadow: "0 8px 32px oklch(0 0 0 / 0.15)",
                  }}
                >
                  <Image
                    src={displayImage}
                    alt={meditation.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 720px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Chapter header */}
              <header className="text-center mb-10">
                {/* Ornament */}
                <div className="flex items-center justify-center mb-6">
                  <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
                    <line x1="0" y1="12" x2="44" y2="12" stroke="oklch(0.75 0.12 85)" strokeWidth="0.5" />
                    <circle cx="54" cy="12" r="3" fill="none" stroke="oklch(0.75 0.12 85)" strokeWidth="0.5" />
                    <path d="M60 12L63 8L66 12L63 16L60 12Z" fill="oklch(0.75 0.12 85 / 0.8)" />
                    <circle cx="72" cy="12" r="3" fill="none" stroke="oklch(0.75 0.12 85)" strokeWidth="0.5" />
                    <line x1="76" y1="12" x2="120" y2="12" stroke="oklch(0.75 0.12 85)" strokeWidth="0.5" />
                  </svg>
                </div>

                <p
                  className="text-xs tracking-widest uppercase font-medium mb-3"
                  style={{ color: "oklch(0.55 0.08 85)" }}
                >
                  Meditación con Mataji Shaktiananda
                </p>

                <h1
                  className="font-serif font-semibold leading-tight mb-4 text-balance"
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                    color: "oklch(0.25 0.03 240)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {content?.title || meditation.title}
                </h1>

                <time
                  className="text-sm font-light tracking-widest"
                  style={{ color: "oklch(0.55 0.05 85)" }}
                >
                  {formatDateDisplay(meditation.dateString)}
                </time>

                {/* Bottom ornament */}
                <div className="flex items-center justify-center mt-6">
                  <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
                    <line x1="0" y1="6" x2="30" y2="6" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                    <circle cx="40" cy="6" r="4" fill="none" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                    <line x1="50" y1="6" x2="80" y2="6" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                  </svg>
                </div>
              </header>

              {/* Body content */}
              <div
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.85,
                  color: "oklch(0.28 0.02 240)",
                  letterSpacing: "0.01em",
                }}
              >
                {hasRealContent ? (
                  contentBlocks.map((block, i) => (
                    <p
                      key={i}
                      style={{
                        marginBottom: "1.5em",
                        textIndent: i === 0 ? "0" : "1.5em",
                        hyphens: "auto",
                      }}
                    >
                      {block}
                    </p>
                  ))
                ) : (
                  // Fallback: show excerpt and prominent link to original
                  <div className="py-4">
                    <p
                      style={{
                        marginBottom: "2em",
                        textIndent: "1.5em",
                        hyphens: "auto",
                      }}
                    >
                      {meditation.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-center my-8">
                      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
                        <line x1="0" y1="6" x2="30" y2="6" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                        <circle cx="40" cy="6" r="4" fill="none" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                        <line x1="50" y1="6" x2="80" y2="6" stroke="oklch(0.75 0.12 85 / 0.5)" strokeWidth="0.5" />
                      </svg>
                    </div>
                    
                    <div className="text-center">
                      <p 
                        className="text-sm mb-4 font-light"
                        style={{ color: "oklch(0.55 0.05 85)" }}
                      >
                        Para leer la meditación completa, visita el sitio oficial
                      </p>
                      <a
                        href={`https://shaktianandama.com/${meditation.slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all hover:scale-105"
                        style={{
                          backgroundColor: "oklch(0.75 0.12 85)",
                          borderRadius: "2px",
                          color: "oklch(0.15 0.02 240)",
                          boxShadow: "0 4px 12px oklch(0.75 0.12 85 / 0.3)",
                        }}
                      >
                        Leer meditación completa
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* End ornament */}
              {hasRealContent && (
                <div className="flex items-center justify-center mt-12">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="18" stroke="oklch(0.75 0.12 85 / 0.4)" strokeWidth="0.75" />
                    <circle cx="24" cy="24" r="10" stroke="oklch(0.75 0.12 85 / 0.4)" strokeWidth="0.5" />
                    <path d="M24 14L26 24L24 34L22 24L24 14Z" stroke="oklch(0.75 0.12 85 / 0.6)" strokeWidth="0.75" fill="none" />
                    <path d="M14 24L24 22L34 24L24 26L14 24Z" stroke="oklch(0.75 0.12 85 / 0.6)" strokeWidth="0.75" fill="none" />
                    <circle cx="24" cy="24" r="2" fill="oklch(0.75 0.12 85 / 0.5)" />
                  </svg>
                </div>
              )}
            </article>
          )}
        </div>

        {/* Bottom nav bar */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{
            borderTop: "1px solid oklch(0.75 0.12 85 / 0.2)",
            backgroundColor: "oklch(0.95 0.008 85)",
            borderRadius: "0 0 4px 4px",
          }}
        >
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-2 text-sm font-medium transition-opacity disabled:opacity-30"
            style={{ color: "oklch(0.45 0.05 240)" }}
            aria-label="Meditación anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-2" style={{ color: "oklch(0.55 0.05 85)" }}>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.6)" }}
            />
            <span className="text-xs font-light tracking-wide">{formatDateDisplay(meditation.dateString)}</span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "oklch(0.75 0.12 85 / 0.6)" }}
            />
          </div>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 text-sm font-medium transition-opacity disabled:opacity-30"
            style={{ color: "oklch(0.45 0.05 240)" }}
            aria-label="Siguiente meditación"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
