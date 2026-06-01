import { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight, ArrowDown, Sun, Moon, Search as SearchIcon } from "lucide-react";
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
  return `Ch. ${idx}`;
}

function StarburstDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Main starburst glow blob */}
      <div
        className="absolute nec-starburst-outer"
        style={{
          top: "5%",
          left: "30%",
          width: "70%",
          height: "90%",
          transform: "translate(-20%, 0)",
        }}
      />
      {/* Rays — SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1280 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="homeRayL" x1="560" y1="260" x2="80" y2="780" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f5e8c0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c49030" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="homeRayR" x1="560" y1="260" x2="1050" y2="780" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0dca0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#b08020" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="homeRayUR" x1="560" y1="260" x2="1280" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0e0b0" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="homeRayUL" x1="560" y1="260" x2="0" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8d8a0" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c09028" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Diagonal rays from the starburst origin */}
        <line x1="560" y1="260" x2="80" y2="790" stroke="url(#homeRayL)" strokeWidth="1.5" />
        <line x1="560" y1="260" x2="1060" y2="790" stroke="url(#homeRayR)" strokeWidth="1" />
        <line x1="560" y1="260" x2="1280" y2="18" stroke="url(#homeRayUR)" strokeWidth="0.8" />
        <line x1="560" y1="260" x2="0" y2="75" stroke="url(#homeRayUL)" strokeWidth="0.6" />
        {/* Horizontal faint cross */}
        <line x1="0" y1="262" x2="1280" y2="258" stroke="#d4a040" strokeWidth="0.3" strokeOpacity="0.06" />
        {/* Bright core */}
        <circle cx="560" cy="260" r="4" fill="#f9f5e0" fillOpacity="0.35" />
        <circle cx="560" cy="260" r="12" fill="#e8c870" fillOpacity="0.08" />
        <circle cx="560" cy="260" r="30" fill="#7040c0" fillOpacity="0.06" />
      </svg>
    </div>
  );
}

export function HomePage({ onOpenReading, darkMode, onToggleDark }: HomePageProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [continueSlug, setContinueSlug] = useState<string | null>(null);
  const tocRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nec-last-chapter");
      if (saved && book.chapters.find((c) => c.slug === saved)) {
        setContinueSlug(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const continueChapter = continueSlug
    ? book.chapters.find((c) => c.slug === continueSlug)
    : null;

  const toggleExpand = (slug: string) => {
    setExpandedChapter((prev) => (prev === slug ? null : slug));
  };

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

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="nec-hero relative min-h-screen flex flex-col">
        <StarburstDecor />

        {/* Header */}
        <header className="relative z-20 nec-header">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
            <NecLogo size="sm" />
            <div className="flex items-center gap-3">
              <Search onNavigate={handleSearchNavigate} />
              <button
                onClick={onToggleDark}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="text-white/40 hover:text-white/80 transition-colors p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero body */}
        <div className="relative z-10 flex flex-1 items-center">
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-20">

              {/* Left — book info */}
              <div className="flex-1 min-w-0 max-w-2xl md:pt-6">
                <p
                  className="font-sans text-[10px] tracking-[0.30em] uppercase mb-8 font-medium"
                  style={{ color: "rgba(201,160,58,0.65)" }}
                >
                  Working Manuscript
                </p>

                <h1
                  className="font-serif font-bold leading-tight tracking-tight mb-5"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                    color: "#f5f2ec",
                  }}
                >
                  {book.title}
                </h1>

                <p
                  className="font-serif italic leading-relaxed mb-8"
                  style={{
                    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                    color: "rgba(240,232,210,0.55)",
                  }}
                >
                  {book.subtitle}
                </p>

                <p
                  className="font-sans leading-relaxed mb-12 max-w-lg"
                  style={{
                    fontSize: "0.92rem",
                    color: "rgba(220,215,200,0.42)",
                  }}
                >
                  A reader on ownership, finance, stewardship, and the recovery of an economy ordered toward life.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onOpenReading(book.chapters[0].slug)}
                    data-testid="button-start-reading"
                    className="inline-flex items-center gap-2.5 px-6 py-3 font-sans font-semibold text-sm rounded transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: "linear-gradient(135deg, #4a28c4 0%, #3a20a8 100%)",
                      color: "#ffffff",
                      boxShadow: "0 0 24px rgba(80,50,200,0.35), 0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    Start with the Prologue
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={scrollToTOC}
                    className="inline-flex items-center gap-2 px-5 py-3 font-sans text-sm rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "rgba(240,232,210,0.72)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    View Table of Contents
                    <ArrowDown size={13} />
                  </button>

                  {continueChapter && continueChapter.slug !== book.chapters[0].slug && (
                    <button
                      onClick={() => onOpenReading(continueChapter.slug)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 font-sans text-xs rounded transition-colors"
                      style={{
                        color: "rgba(201,160,58,0.75)",
                        border: "1px solid rgba(201,160,58,0.18)",
                        background: "rgba(201,160,58,0.05)",
                      }}
                    >
                      <span>Continue:</span>
                      <span className="truncate max-w-[160px]">
                        {continueChapter.title.replace(/^Chapter \d+:\s*/, "")}
                      </span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right — cover art */}
              <div
                className="shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 rounded-sm shadow-2xl"
                style={{
                  boxShadow: "0 8px 48px rgba(60,30,140,0.45), 0 2px 16px rgba(0,0,0,0.6)",
                }}
              >
                <CoverArt className="w-full h-auto rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 flex justify-center pb-10">
          <button
            onClick={scrollToTOC}
            aria-label="Scroll to Table of Contents"
            className="flex flex-col items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none"
            style={{ color: "rgba(201,160,58,0.4)" }}
          >
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase">Contents</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── TABLE OF CONTENTS ─────────────────────────────────────────── */}
      <section
        ref={tocRef}
        id="toc-section"
        className="nec-toc-bg flex-1 px-6 sm:px-8 lg:px-12 py-20 md:py-28"
        aria-label="Table of Contents"
      >
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="mb-14">
            <p
              className="font-sans text-[10px] tracking-[0.30em] uppercase font-medium mb-4"
              style={{ color: "rgba(201,160,58,0.55)" }}
            >
              Full Contents
            </p>
            <h2
              className="font-serif font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#f0ede6" }}
            >
              Table of Contents
            </h2>
            <div
              className="mt-6 h-px"
              style={{ background: "linear-gradient(90deg, rgba(201,160,58,0.3) 0%, rgba(201,160,58,0.06) 60%, transparent 100%)" }}
            />
          </div>

          {/* Chapter list */}
          <ol className="space-y-1" role="list">
            {book.chapters.map((chapter, idx) => {
              const label = chapterLabel(idx, book.chapters.length);
              const shortTitle = chapter.title.replace(/^Chapter \d+:\s*/, "");
              const sections = chapter.sections.filter((s) => s.title);
              const isExpanded = expandedChapter === chapter.slug;

              return (
                <li key={chapter.slug} role="listitem">
                  <div
                    className="rounded transition-all duration-150"
                    style={{
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: isExpanded
                        ? "rgba(201,160,58,0.04)"
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="flex items-stretch">
                      {/* Expand toggle */}
                      {sections.length > 0 ? (
                        <button
                          onClick={() => toggleExpand(chapter.slug)}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse" : "Expand sections"}
                          className="shrink-0 flex items-center justify-center w-10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20 rounded-l"
                          style={{ color: isExpanded ? "rgba(201,160,58,0.6)" : "rgba(255,255,255,0.18)" }}
                        >
                          <ChevronRight
                            size={13}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </button>
                      ) : (
                        <span className="w-10 shrink-0" />
                      )}

                      {/* Main chapter row */}
                      <button
                        onClick={() => onOpenReading(chapter.slug)}
                        data-testid={`home-chapter-${chapter.slug}`}
                        className="flex-1 flex items-center justify-between gap-4 px-3 py-4 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 rounded-r transition-all"
                      >
                        <div className="flex items-baseline gap-4 min-w-0">
                          {/* Chapter label */}
                          <span
                            className="shrink-0 font-sans text-[10px] tracking-[0.18em] uppercase font-medium w-14 text-right"
                            style={{ color: "rgba(201,160,58,0.55)" }}
                          >
                            {label}
                          </span>
                          {/* Chapter title */}
                          <span
                            className="font-serif text-[0.98rem] leading-snug group-hover:text-white transition-colors"
                            style={{ color: "rgba(240,232,210,0.82)" }}
                          >
                            {shortTitle}
                          </span>
                        </div>

                        <div className="shrink-0 flex items-center gap-3">
                          {sections.length > 0 && (
                            <span
                              className="font-sans text-[10px] hidden sm:block"
                              style={{ color: "rgba(255,255,255,0.20)" }}
                            >
                              {sections.length} sections
                            </span>
                          )}
                          <ArrowRight
                            size={13}
                            className="transition-all group-hover:translate-x-0.5"
                            style={{ color: "rgba(201,160,58,0.30)" }}
                          />
                        </div>
                      </button>
                    </div>

                    {/* Expanded sections */}
                    {isExpanded && sections.length > 0 && (
                      <div
                        className="pb-2 pt-1 mx-10"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <ol className="space-y-0" role="list">
                          {sections.map((section) => (
                            <li key={section.slug} role="listitem">
                              <button
                                onClick={() => onOpenReading(chapter.slug, section.slug)}
                                data-testid={`home-section-${section.slug}`}
                                className="w-full text-left px-3 py-2 text-[0.79rem] font-sans rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20 flex items-center gap-2 group"
                                style={{ color: "rgba(220,210,188,0.48)" }}
                              >
                                <span
                                  className="w-1 h-1 rounded-full shrink-0"
                                  style={{ background: "rgba(201,160,58,0.35)" }}
                                />
                                <span className="flex-1 leading-snug group-hover:text-white/70 transition-colors">
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
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="px-6 sm:px-8 lg:px-12 py-10"
        style={{ background: "#030410", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <NecLogo size="sm" />
          <p className="font-sans text-xs" style={{ color: "rgba(220,210,188,0.25)" }}>
            <span className="font-serif italic">{book.title}</span> — Working manuscript
          </p>
        </div>
      </footer>
    </div>
  );
}
