import { useState, useEffect } from "react";
import { ChevronRight, BookOpen, ArrowRight, Sun, Moon } from "lucide-react";
import { book } from "../lib/book";
import { CoverArt } from "../components/CoverArt";
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

export function HomePage({ onOpenReading, darkMode, onToggleDark }: HomePageProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [continueSlug, setContinueSlug] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Site header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground border-b border-primary-foreground/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen size={15} className="shrink-0 text-sidebar-primary" />
            <span className="font-sans font-semibold text-sm tracking-wide truncate">
              Non-Extractive Capital
            </span>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <Search onNavigate={(slug) => onOpenReading(
              book.chapters.find(ch => ch.slug === slug || ch.sections.some(s => s.slug === slug))?.slug ?? slug,
              slug
            )} />
            <button
              onClick={onToggleDark}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors p-0.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-foreground"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Cover panel ─────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 md:py-16 lg:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14 lg:gap-20">
          {/* Cover art */}
          <div className="shrink-0 w-48 sm:w-56 md:w-60 lg:w-72 opacity-90">
            <CoverArt className="w-full h-auto rounded shadow-2xl" />
          </div>

          {/* Book info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] font-sans opacity-45 mb-4">
              Working manuscript
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 break-words">
              {book.title}
            </h1>
            <p className="font-serif text-lg sm:text-xl opacity-65 italic leading-relaxed mb-6">
              {book.subtitle}
            </p>
            <p className="font-sans text-[0.88rem] opacity-55 leading-relaxed max-w-lg mx-auto md:mx-0 mb-8">
              A reader on ownership, finance, stewardship, and the recovery of an economy ordered toward life.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <button
                onClick={() => onOpenReading(book.chapters[0].slug)}
                data-testid="button-start-reading"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sidebar-primary text-sidebar-primary-foreground font-sans font-semibold text-sm rounded hover:opacity-90 active:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-2"
              >
                Start with the Prologue
                <ArrowRight size={14} />
              </button>
              {continueChapter && continueChapter.slug !== book.chapters[0].slug && (
                <button
                  onClick={() => onOpenReading(continueChapter.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary-foreground/25 hover:border-primary-foreground/50 text-primary-foreground/70 hover:text-primary-foreground font-sans text-sm rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-foreground"
                >
                  Continue reading
                  <span className="truncate max-w-[14rem] opacity-70 text-xs">
                    {continueChapter.title.replace(/^Chapter \d+:\s*/, "")}
                  </span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents ────────────────────────────────────────── */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-1">
            Table of Contents
          </h2>
          <div className="h-px bg-border mt-4" />
        </div>

        <ol className="space-y-1" role="list">
          {book.chapters.map((chapter, idx) => {
            const label = chapterLabel(idx, book.chapters.length);
            const shortTitle = chapter.title.replace(/^Chapter \d+:\s*/, "");
            const sections = chapter.sections.filter((s) => s.title);
            const isExpanded = expandedChapter === chapter.slug;

            return (
              <li key={chapter.slug} role="listitem" className="group">
                <div className="flex items-stretch rounded-lg hover:bg-muted/40 transition-colors">
                  {/* Expand toggle */}
                  {sections.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(chapter.slug)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse sections" : "Expand sections"}
                      className="shrink-0 flex items-center justify-center w-10 text-muted-foreground/40 hover:text-muted-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-l-lg"
                    >
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </button>
                  ) : (
                    <span className="w-10 shrink-0" />
                  )}

                  {/* Main row — click to open reading view */}
                  <button
                    onClick={() => onOpenReading(chapter.slug)}
                    data-testid={`home-chapter-${chapter.slug}`}
                    className="flex-1 flex items-center justify-between gap-4 px-3 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-r-lg"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.15em] font-sans text-primary/50 font-medium w-20 text-right">
                        {label}
                      </span>
                      <span className="font-serif text-foreground text-[0.97rem] leading-snug truncate">
                        {shortTitle}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      {sections.length > 0 && (
                        <span className="text-[11px] font-sans text-muted-foreground/45 hidden sm:block">
                          {sections.length} sections
                        </span>
                      )}
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground/30 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </button>
                </div>

                {/* Expanded sections */}
                {isExpanded && sections.length > 0 && (
                  <ol className="ml-10 pl-3 border-l border-border/50 mt-0.5 mb-1 space-y-0" role="list">
                    {sections.map((section) => (
                      <li key={section.slug} role="listitem">
                        <button
                          onClick={() => onOpenReading(chapter.slug, section.slug)}
                          data-testid={`home-section-${section.slug}`}
                          className="w-full text-left px-3 py-2 text-[0.82rem] font-sans text-muted-foreground hover:text-primary transition-colors rounded flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1"
                        >
                          <span className="flex-1 leading-snug">{section.title}</span>
                          <ArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-5 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen size={13} className="text-muted-foreground/40" />
            <span className="font-sans text-xs text-muted-foreground/50">
              Non-Extractive Capital
            </span>
          </div>
          <p className="font-sans text-xs text-muted-foreground/40">
            <span className="font-serif italic">{book.title}</span> — Working manuscript
          </p>
        </div>
      </footer>
    </div>
  );
}
