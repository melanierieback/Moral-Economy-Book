import { useEffect, useRef } from "react";
import { book } from "../lib/book";

interface TOCProps {
  activeSlug: string;
  onNavigate?: () => void;
}

export function TOC({ activeSlug, onNavigate }: TOCProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeSlug]);

  const scrollToSlug = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onNavigate?.();
  };

  return (
    <nav
      className="h-full overflow-y-auto py-6 px-4"
      aria-label="Table of contents"
      data-testid="toc-nav"
    >
      <div className="mb-6 px-2">
        <p className="text-[10px] font-sans uppercase tracking-[0.18em] text-sidebar-foreground/40 font-medium mb-1">
          Contents
        </p>
        <div className="h-px bg-sidebar-border/40" />
      </div>

      <ol className="space-y-0.5">
        {book.chapters.map((chapter, chIdx) => {
          const isChapterActive = activeSlug === chapter.slug || chapter.sections.some(s => s.slug === activeSlug);
          return (
            <li key={chapter.slug}>
              <button
                ref={activeSlug === chapter.slug ? activeRef : undefined}
                onClick={() => scrollToSlug(chapter.slug)}
                data-testid={`toc-chapter-${chapter.slug}`}
                className={`w-full text-left px-3 py-2 rounded-md text-[0.78rem] font-sans transition-colors duration-150 ${
                  activeSlug === chapter.slug
                    ? "text-sidebar-primary font-semibold bg-sidebar-accent/60"
                    : isChapterActive
                    ? "text-sidebar-foreground/90 font-medium"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground/85 hover:bg-sidebar-accent/30"
                }`}
              >
                {chIdx === 0 ? chapter.title : chapter.title}
              </button>

              {isChapterActive && chapter.sections.filter(s => s.title).length > 0 && (
                <ol className="mt-0.5 mb-1 ml-3 border-l border-sidebar-border/30 pl-3 space-y-0">
                  {chapter.sections.filter(s => s.title).map((section) => (
                    <li key={section.slug}>
                      <button
                        ref={activeSlug === section.slug ? activeRef : undefined}
                        onClick={() => scrollToSlug(section.slug)}
                        data-testid={`toc-section-${section.slug}`}
                        className={`w-full text-left px-2 py-1.5 rounded text-[0.72rem] font-sans leading-snug transition-colors duration-150 ${
                          activeSlug === section.slug
                            ? "text-sidebar-primary font-medium"
                            : "text-sidebar-foreground/45 hover:text-sidebar-foreground/75"
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
