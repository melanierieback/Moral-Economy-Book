import { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight, ArrowDown, Sun, Moon, ExternalLink } from "lucide-react";
import { book } from "../lib/book";
import { CoverArt } from "../components/CoverArt";
import { NecLogo } from "../components/NecLogo";
import { Search } from "../components/Search";

interface HomePageProps {
  onOpenReading: (chapterSlug: string, sectionSlug?: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

function chapterLabel(idx: number, total: number): string {
  if (idx === 0) return "Prologue";
  if (idx === total - 1) return "Conclusion";
  return `Chapter ${idx}`;
}

function chapterBadge(idx: number, total: number) {
  if (idx === 0) {
    return (
      <span
        className="shrink-0 flex items-center justify-center w-7 h-7 text-[12px] rounded"
        style={{
          background: "rgba(201,160,58,0.12)",
          border: "1px solid rgba(201,160,58,0.30)",
          color: "rgba(201,160,58,0.85)",
        }}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }
  if (idx === total - 1) {
    return (
      <span
        className="shrink-0 flex items-center justify-center w-7 h-7 text-[9px] font-sans font-bold tracking-wide rounded"
        style={{
          background: "rgba(201,160,58,0.10)",
          border: "1px solid rgba(201,160,58,0.22)",
          color: "rgba(201,160,58,0.65)",
        }}
        aria-hidden="true"
      >
        END
      </span>
    );
  }
  return (
    <span
      className="shrink-0 flex items-center justify-center w-7 h-7 text-[11px] font-sans font-bold rounded"
      style={{
        background: "rgba(201,160,58,0.10)",
        border: "1px solid rgba(201,160,58,0.22)",
        color: "rgba(201,160,58,0.72)",
        fontVariantNumeric: "tabular-nums",
      }}
      aria-hidden="true"
    >
      {idx}
    </span>
  );
}

function StarburstDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute nec-starburst-outer"
        style={{ top: "-5%", left: "25%", width: "75%", height: "105%" }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1280 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hpRayL" x1="520" y1="300" x2="80" y2="750" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f5e8c0" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#c49030" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hpRayR" x1="520" y1="300" x2="1000" y2="750" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0dca0" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#b08020" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hpRayUR" x1="520" y1="300" x2="1280" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0e0b0" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hpRayUL" x1="520" y1="300" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8d8a0" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#c09028" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="520" y1="300" x2="80" y2="760" stroke="url(#hpRayL)" strokeWidth="1.2" />
        <line x1="520" y1="300" x2="1010" y2="760" stroke="url(#hpRayR)" strokeWidth="0.9" />
        <line x1="520" y1="300" x2="1280" y2="35" stroke="url(#hpRayUR)" strokeWidth="0.7" />
        <line x1="520" y1="300" x2="80" y2="55" stroke="url(#hpRayUL)" strokeWidth="0.5" />
        <circle cx="520" cy="300" r="3" fill="#f9f5e0" fillOpacity="0.22" />
        <circle cx="520" cy="300" r="10" fill="#e8c870" fillOpacity="0.06" />
      </svg>
    </div>
  );
}

export function HomePage({ onOpenReading, darkMode, onToggleDark }: HomePageProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [continueSlug, setContinueSlug] = useState<string | null>(null);
  const tocRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nec-last-chapter");
      if (saved && book.chapters.find((c) => c.slug === saved)) {
        setContinueSlug(saved);
      }
    } catch { /* ignore */ }
  }, []);

  const continueChapter = continueSlug
    ? book.chapters.find((c) => c.slug === continueSlug)
    : null;

  const toggleExpand = (slug: string) => {
    setExpandedChapter((prev) => (prev === slug ? null : slug));
  };

  const isChapterExpanded = (slug: string) =>
    expandAll || expandedChapter === slug;

  const scrollToTOC = () => {
    tocRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchNavigate = (slug: string) => {
    const ch = book.chapters.find(
      (c) => c.slug === slug || c.sections.some((s) => s.slug === slug)
    );
    if (ch) onOpenReading(ch.slug, ch.slug !== slug ? slug : undefined);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#04050f", color: "#f0ede6" }}>

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="nec-hero relative min-h-screen flex flex-col">
        <StarburstDecor />

        {/* Header */}
        <header className="relative z-20 nec-header">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-6">
            <NecLogo size="sm" />

            {/* Center nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Site navigation">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-1.5 text-[12px] font-sans font-medium transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 relative"
                style={{ color: "rgba(240,232,210,0.88)" }}
              >
                Contents
                <span
                  className="absolute bottom-0 left-3 right-3 h-px"
                  style={{ background: "rgba(201,160,58,0.65)" }}
                />
              </button>
              <div className="w-px h-3 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
              <Search onNavigate={handleSearchNavigate} />
              <div className="w-px h-3 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
              <button
                className="px-3 py-1.5 text-[12px] font-sans transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
                style={{ color: "rgba(240,232,210,0.38)" }}
              >
                About
              </button>
              <div className="w-px h-3 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <a
                href="https://non-extractive.capital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-sans transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
                style={{ color: "rgba(240,232,210,0.38)" }}
              >
                NEC Home
                <ExternalLink size={10} />
              </a>
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <span className="md:hidden">
                <Search onNavigate={handleSearchNavigate} />
              </span>
              <button
                onClick={onToggleDark}
                aria-label={darkMode ? "Switch to light reading mode" : "Switch to dark reading mode"}
                className="text-white/35 hover:text-white/65 transition-colors p-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero body — Cover LEFT, Info RIGHT */}
        <div className="relative z-10 flex flex-1 items-start">
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 pt-14 md:pt-20 pb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-16">

              {/* LEFT — Cover art (prominent) */}
              <div
                className="shrink-0 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] rounded shadow-2xl"
                style={{
                  boxShadow: "0 12px 60px rgba(60,30,140,0.55), 0 2px 20px rgba(0,0,0,0.70)",
                }}
              >
                <CoverArt className="w-full h-auto rounded" />
              </div>

              {/* RIGHT — Book info */}
              <div className="flex-1 min-w-0 md:pt-4">
                <p
                  className="font-sans text-[10px] tracking-[0.30em] uppercase mb-6 font-semibold"
                  style={{ color: "rgba(201,160,58,0.62)" }}
                >
                  Working Manuscript
                </p>

                <h1
                  className="font-serif font-bold leading-tight tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                    color: "#f5f2ec",
                  }}
                >
                  {book.title}
                </h1>

                <p
                  className="font-serif italic leading-relaxed mb-3"
                  style={{
                    fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                    color: "rgba(240,232,210,0.52)",
                  }}
                >
                  {book.subtitle}
                </p>

                {/* Ornamental divider */}
                <div className="flex items-center gap-3 my-5" aria-hidden="true">
                  <div className="flex-1 max-w-[80px] h-px" style={{ background: "rgba(201,160,58,0.22)" }} />
                  <span style={{ color: "rgba(201,160,58,0.45)", fontSize: "8px" }}>◆</span>
                  <div className="flex-1 max-w-[80px] h-px" style={{ background: "rgba(201,160,58,0.22)" }} />
                </div>

                <p
                  className="font-sans leading-relaxed mb-10 max-w-lg"
                  style={{ fontSize: "0.90rem", color: "rgba(220,215,200,0.40)" }}
                >
                  A reader on ownership, finance, stewardship, and the recovery of an economy ordered toward life.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Primary — GOLD fill */}
                  <button
                    onClick={() => onOpenReading(book.chapters[0].slug)}
                    data-testid="button-start-reading"
                    className="inline-flex items-center gap-2 px-6 py-3 font-sans font-semibold text-sm rounded transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400/50"
                    style={{
                      background: "linear-gradient(135deg, #c9a03a 0%, #a87828 100%)",
                      color: "#0a0810",
                      boxShadow: "0 0 20px rgba(201,160,58,0.22), 0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    Start with the Prologue
                    <ArrowRight size={14} />
                  </button>

                  {/* Secondary — outlined */}
                  <button
                    onClick={scrollToTOC}
                    className="inline-flex items-center gap-2 px-5 py-3 font-sans text-sm rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                    style={{
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "rgba(240,232,210,0.70)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    View Table of Contents
                    <ArrowDown size={13} />
                  </button>

                  {/* Continue */}
                  {continueChapter && continueChapter.slug !== book.chapters[0].slug && (
                    <button
                      onClick={() => onOpenReading(continueChapter.slug)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 font-sans text-xs rounded transition-colors"
                      style={{
                        color: "rgba(201,160,58,0.68)",
                        border: "1px solid rgba(201,160,58,0.16)",
                        background: "rgba(201,160,58,0.04)",
                      }}
                    >
                      Continue: <span className="truncate max-w-[140px]">
                        {continueChapter.title.replace(/^Chapter \d+:\s*/, "")}
                      </span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex justify-center pb-8">
          <button
            onClick={scrollToTOC}
            aria-label="Scroll to Table of Contents"
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-75 focus-visible:outline-none"
            style={{ color: "rgba(201,160,58,0.35)" }}
          >
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase">Contents</span>
            <ArrowDown size={13} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── TABLE OF CONTENTS ─────────────────────────────────────────── */}
      <section
        ref={tocRef}
        id="toc-section"
        className="nec-toc-bg px-5 sm:px-8 py-20 md:py-28"
        aria-label="Table of Contents"
      >
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-4">
            <h2
              className="font-sans font-bold uppercase tracking-[0.22em] text-sm"
              style={{ color: "rgba(240,232,210,0.70)" }}
            >
              Table of Contents
            </h2>
            <button
              onClick={() => setExpandAll((e) => !e)}
              className="font-sans text-[11px] flex items-center gap-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 rounded px-1"
              style={{ color: "rgba(201,160,58,0.50)" }}
            >
              {expandAll ? "Collapse all ↑" : "Expand all ↓"}
            </button>
          </div>

          {/* Gold ornamental divider */}
          <div className="flex items-center gap-3 mb-10" aria-hidden="true">
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, rgba(201,160,58,0.35) 0%, rgba(201,160,58,0.06) 70%, transparent 100%)" }}
            />
            <span style={{ color: "rgba(201,160,58,0.45)", fontSize: "8px" }}>◆</span>
            <div className="flex-1 max-w-[60px] h-px" style={{ background: "rgba(201,160,58,0.06)" }} />
          </div>

          {/* Chapter list */}
          <ol className="space-y-[3px]" role="list">
            {book.chapters.map((chapter, idx) => {
              const label = chapterLabel(idx, book.chapters.length);
              const shortTitle = chapter.title.replace(/^Chapter \d+:\s*/, "");
              const sections = chapter.sections.filter((s) => s.title);
              const isExpanded = isChapterExpanded(chapter.slug);

              return (
                <li key={chapter.slug} role="listitem">
                  <div
                    className="rounded transition-all duration-150"
                    style={{
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: isExpanded
                        ? "rgba(201,160,58,0.03)"
                        : "rgba(255,255,255,0.015)",
                    }}
                  >
                    <div className="flex items-center gap-3 px-3 py-0">
                      {/* Badge */}
                      <div className="shrink-0 py-3">
                        {chapterBadge(idx, book.chapters.length)}
                      </div>

                      {/* Label + title */}
                      <button
                        onClick={() => onOpenReading(chapter.slug)}
                        data-testid={`home-chapter-${chapter.slug}`}
                        className="flex-1 flex flex-col gap-[2px] py-3 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20 rounded min-w-0"
                      >
                        <span
                          className="text-[9px] font-sans uppercase tracking-[0.22em] font-semibold"
                          style={{ color: "rgba(201,160,58,0.52)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="font-serif text-[0.93rem] leading-snug group-hover:text-white transition-colors"
                          style={{ color: "rgba(240,232,210,0.82)" }}
                        >
                          {shortTitle}
                        </span>
                      </button>

                      {/* Section count */}
                      {sections.length > 0 && (
                        <span
                          className="shrink-0 font-sans text-[10px] hidden sm:block tabular-nums"
                          style={{ color: "rgba(255,255,255,0.20)" }}
                        >
                          {sections.length} sections
                        </span>
                      )}

                      {/* Expand/arrow */}
                      <button
                        onClick={() => sections.length > 0 ? toggleExpand(chapter.slug) : onOpenReading(chapter.slug)}
                        aria-expanded={sections.length > 0 ? isExpanded : undefined}
                        className="shrink-0 p-2 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
                        style={{ color: "rgba(201,160,58,0.30)" }}
                        aria-label={
                          sections.length > 0
                            ? isExpanded ? "Collapse" : "Expand sections"
                            : `Open ${shortTitle}`
                        }
                      >
                        <ChevronRight
                          size={13}
                          className={`transition-transform duration-200 ${isExpanded && sections.length > 0 ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Expanded sections */}
                    {isExpanded && sections.length > 0 && (
                      <div
                        className="pb-2 px-3 ml-[52px]"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        <ol className="space-y-0" role="list">
                          {sections.map((section) => (
                            <li key={section.slug} role="listitem">
                              <button
                                onClick={() => onOpenReading(chapter.slug, section.slug)}
                                data-testid={`home-section-${section.slug}`}
                                className="w-full text-left px-2 py-[6px] text-[0.76rem] font-sans rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/15 flex items-center gap-2 group"
                                style={{ color: "rgba(220,210,188,0.40)" }}
                              >
                                <span
                                  className="w-[3px] h-[3px] rounded-full shrink-0"
                                  style={{ background: "rgba(201,160,58,0.30)" }}
                                />
                                <span className="flex-1 leading-snug group-hover:text-white/65 transition-colors">
                                  {section.title}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Bottom link */}
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => onOpenReading(book.chapters[book.chapters.length - 2]?.slug ?? book.chapters[0].slug)}
              className="flex items-center gap-1.5 font-sans text-[12px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 rounded"
              style={{ color: "rgba(201,160,58,0.45)" }}
            >
              Continue through all {book.chapters.length - 2} chapters and Conclusion
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="px-5 sm:px-8 py-8"
        style={{ background: "#030410", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <NecLogo size="sm" />
          <p className="font-sans text-xs" style={{ color: "rgba(220,210,188,0.20)" }}>
            <span className="font-serif italic">{book.title}</span> — Working manuscript
          </p>
        </div>
      </footer>
    </div>
  );
}
