import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { book } from "../lib/book";

interface TOCProps {
  activeSlug: string;
  onNavigate?: () => void;
  scrollProgress?: number;
}

function getActiveChapterSlug(activeSlug: string): string {
  const chapter = book.chapters.find(
    (ch) => ch.slug === activeSlug || ch.sections.some((s) => s.slug === activeSlug)
  );
  return chapter?.slug ?? "";
}

export function TOC({ activeSlug, onNavigate, scrollProgress = 0 }: TOCProps) {
  const activeChapterSlug = getActiveChapterSlug(activeSlug);
  // Track manually toggled chapters (override auto-expand behavior)
  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set());
  const [manualCollapsed, setManualCollapsed] = useState<Set<string>>(new Set());
  const activeRef = useRef<HTMLElement>(null);

  // Auto-expand new active chapter; if user manually collapsed it, respect that
  useEffect(() => {
    setManualCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(activeChapterSlug);
      return next;
    });
  }, [activeChapterSlug]);

  // Scroll active item into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeSlug]);

  const isExpanded = useCallback(
    (chapterSlug: string) => {
      if (manualCollapsed.has(chapterSlug)) return false;
      if (manualExpanded.has(chapterSlug)) return true;
      return chapterSlug === activeChapterSlug;
    },
    [manualCollapsed, manualExpanded, activeChapterSlug]
  );

  const toggleChapter = useCallback((chapterSlug: string, currentlyExpanded: boolean) => {
    if (currentlyExpanded) {
      setManualCollapsed((prev) => new Set([...prev, chapterSlug]));
      setManualExpanded((prev) => {
        const next = new Set(prev);
        next.delete(chapterSlug);
        return next;
      });
    } else {
      setManualExpanded((prev) => new Set([...prev, chapterSlug]));
      setManualCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(chapterSlug);
        return next;
      });
    }
  }, []);

  const scrollToSlug = useCallback(
    (slug: string) => {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update hash
        history.replaceState(null, "", `#${slug}`);
      }
      onNavigate?.();
    },
    [onNavigate]
  );

  const activeChapterIndex = book.chapters.findIndex((c) => c.slug === activeChapterSlug);
  const progressPct = book.chapters.length > 0
    ? Math.round(((activeChapterIndex + scrollProgress) / book.chapters.length) * 100)
    : 0;

  return (
    <nav
      className="flex flex-col h-full"
      aria-label="Table of contents"
      data-testid="toc-nav"
    >
      {/* Progress bar */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-sans uppercase tracking-[0.18em] text-sidebar-foreground/35 font-medium">
            Contents
          </p>
          <span className="text-[10px] font-sans text-sidebar-foreground/30 tabular-nums">
            {progressPct}%
          </span>
        </div>
        <div className="h-0.5 bg-sidebar-border/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-sidebar-primary/60 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress: ${progressPct}%`}
          />
        </div>
        <div className="mt-3 h-px bg-sidebar-border/30" />
      </div>

      {/* Chapter list */}
      <ol className="flex-1 overflow-y-auto py-2 px-2.5 space-y-0.5" role="list">
        {book.chapters.map((chapter, chIdx) => {
          const isActive = activeSlug === chapter.slug;
          const isChapterInView = activeChapterSlug === chapter.slug;
          const expanded = isExpanded(chapter.slug);
          const hasSections = chapter.sections.filter((s) => s.title).length > 0;

          return (
            <li key={chapter.slug} role="listitem">
              {/* Chapter row */}
              <div className="flex items-center gap-0.5">
                {/* Expand/collapse toggle */}
                {hasSections ? (
                  <button
                    onClick={() => toggleChapter(chapter.slug, expanded)}
                    aria-expanded={expanded}
                    aria-label={expanded ? `Collapse ${chapter.title}` : `Expand ${chapter.title}`}
                    className={`shrink-0 p-1 rounded transition-colors ${
                      isChapterInView
                        ? "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                        : "text-sidebar-foreground/25 hover:text-sidebar-foreground/50"
                    }`}
                    data-testid={`toc-toggle-${chapter.slug}`}
                  >
                    <ChevronRight
                      size={11}
                      className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>
                ) : (
                  <span className="w-[23px] shrink-0" />
                )}

                {/* Chapter title button */}
                <button
                  ref={isActive ? (activeRef as React.RefObject<HTMLButtonElement>) : undefined}
                  onClick={() => scrollToSlug(chapter.slug)}
                  data-testid={`toc-chapter-${chapter.slug}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex-1 text-left px-2 py-1.5 rounded text-[0.77rem] font-sans leading-snug transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-1 ${
                    isActive
                      ? "text-sidebar-primary font-semibold"
                      : isChapterInView
                      ? "text-sidebar-foreground/90 font-medium"
                      : "text-sidebar-foreground/55 hover:text-sidebar-foreground/85 hover:bg-sidebar-accent/20"
                  }`}
                >
                  {chapter.title.replace(/^Chapter \d+:\s*/, "") || chapter.title}
                </button>
              </div>

              {/* Section list */}
              {expanded && hasSections && (
                <ol
                  className="mt-0.5 mb-1 ml-5 border-l border-sidebar-border/25 pl-3 space-y-0"
                  role="list"
                >
                  {chapter.sections
                    .filter((s) => s.title)
                    .map((section) => {
                      const isSectionActive = activeSlug === section.slug;
                      return (
                        <li key={section.slug} role="listitem">
                          <button
                            ref={isSectionActive ? (activeRef as React.RefObject<HTMLButtonElement>) : undefined}
                            onClick={() => scrollToSlug(section.slug)}
                            data-testid={`toc-section-${section.slug}`}
                            aria-current={isSectionActive ? "location" : undefined}
                            className={`w-full text-left px-2 py-[5px] rounded text-[0.7rem] font-sans leading-snug transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-1 ${
                              isSectionActive
                                ? "text-sidebar-primary font-medium"
                                : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/15"
                            }`}
                          >
                            {section.title}
                          </button>
                        </li>
                      );
                    })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
