import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronRight, List } from "lucide-react";
import { book } from "../lib/book";

interface TOCProps {
  activeSlug: string;
  onNavigate?: (slug: string) => void;
  onChapterNavigate?: (slug: string) => void;
  onGoHome?: () => void;
  scrollProgress?: number;
}

function getActiveChapterSlug(activeSlug: string): string {
  const chapter = book.chapters.find(
    (ch) => ch.slug === activeSlug || ch.sections.some((s) => s.slug === activeSlug)
  );
  return chapter?.slug ?? "";
}

export function TOC({ activeSlug, onNavigate, onChapterNavigate, onGoHome, scrollProgress = 0 }: TOCProps) {
  const activeChapterSlug = getActiveChapterSlug(activeSlug);
  const [manualExpanded, setManualExpanded] = useState<Set<string>>(new Set());
  const [manualCollapsed, setManualCollapsed] = useState<Set<string>>(new Set());
  const activeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setManualCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(activeChapterSlug);
      return next;
    });
  }, [activeChapterSlug]);

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
        history.replaceState(null, "", `#${slug}`);
      }
      onNavigate?.(slug);
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
      {/* Progress + label */}
      <div className="shrink-0 px-4 pt-4 pb-3">
        {/* Progress text */}
        <div className="flex items-baseline justify-between mb-2">
          <p
            className="text-[9px] font-sans uppercase tracking-[0.22em] font-semibold"
            style={{ color: "rgba(201,160,58,0.55)" }}
          >
            Contents Outline
          </p>
          <span
            className="text-[9px] font-sans tabular-nums font-medium"
            style={{ color: "rgba(240,232,210,0.35)" }}
          >
            {progressPct}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, rgba(201,160,58,0.7), rgba(201,160,58,0.3))",
            }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress: ${progressPct}%`}
          />
        </div>

        <div className="mt-3 h-px" style={{ background: "rgba(201,160,58,0.08)" }} />
      </div>

      {/* Chapter list */}
      <ol className="flex-1 overflow-y-auto py-1 px-2 space-y-0" role="list">
        {book.chapters.map((chapter, chIdx) => {
          const isActive = activeSlug === chapter.slug;
          const isChapterInView = activeChapterSlug === chapter.slug;
          const expanded = isExpanded(chapter.slug);
          const hasSections = chapter.sections.filter((s) => s.title).length > 0;

          return (
            <li key={chapter.slug} role="listitem">
              <div className="flex items-center gap-0.5">
                {/* Expand/collapse toggle */}
                {hasSections ? (
                  <button
                    onClick={() => toggleChapter(chapter.slug, expanded)}
                    aria-expanded={expanded}
                    aria-label={expanded ? `Collapse ${chapter.title}` : `Expand ${chapter.title}`}
                    className="shrink-0 p-1 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20"
                    style={{
                      color: isChapterInView
                        ? "rgba(240,232,210,0.55)"
                        : "rgba(240,232,210,0.20)",
                    }}
                    data-testid={`toc-toggle-${chapter.slug}`}
                  >
                    <ChevronRight
                      size={10}
                      className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>
                ) : (
                  <span className="w-[22px] shrink-0" />
                )}

                {/* Chapter title button */}
                <button
                  ref={isActive ? (activeRef as React.RefObject<HTMLButtonElement>) : undefined}
                  onClick={() => onChapterNavigate ? onChapterNavigate(chapter.slug) : scrollToSlug(chapter.slug)}
                  data-testid={`toc-chapter-${chapter.slug}`}
                  aria-current={isActive ? "location" : undefined}
                  className="flex-1 text-left px-2 py-[7px] rounded text-[0.72rem] font-sans leading-snug transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 focus-visible:outline-offset-1"
                  style={{
                    color: isActive
                      ? "rgba(201,160,58,0.95)"
                      : isChapterInView
                      ? "rgba(240,232,210,0.88)"
                      : "rgba(240,232,210,0.42)",
                    fontWeight: isActive ? 600 : isChapterInView ? 500 : 400,
                  }}
                >
                  {chapter.title.replace(/^Chapter \d+:\s*/, "") || chapter.title}
                </button>
              </div>

              {/* Section list */}
              {expanded && hasSections && (
                <ol
                  className="mt-0.5 mb-1 ml-5 pl-3 space-y-0"
                  style={{ borderLeft: "1px solid rgba(201,160,58,0.12)" }}
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
                            className="w-full text-left px-2 py-[5px] rounded text-[0.67rem] font-sans leading-snug transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20 focus-visible:outline-offset-1"
                            style={{
                              color: isSectionActive
                                ? "rgba(201,160,58,0.90)"
                                : "rgba(240,232,210,0.35)",
                              fontWeight: isSectionActive ? 500 : 400,
                            }}
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

      {/* View full contents link */}
      {onGoHome && (
        <div
          className="shrink-0 px-4 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={onGoHome}
            className="w-full flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.18em] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 rounded"
            style={{ color: "rgba(201,160,58,0.45)" }}
          >
            <List size={11} />
            View Full Contents
          </button>
        </div>
      )}
    </nav>
  );
}
