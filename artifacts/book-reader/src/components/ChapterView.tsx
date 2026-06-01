import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import type { Chapter } from "../types/book";
import { SectionContent } from "./SectionContent";
import { book } from "../lib/book";

interface ChapterViewProps {
  chapter: Chapter;
  chapterIndex: number;
  onNavigateChapter: (slug: string) => void;
}

export function ChapterView({ chapter, chapterIndex, onNavigateChapter }: ChapterViewProps) {
  const prevChapter = chapterIndex > 0 ? book.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < book.chapters.length - 1 ? book.chapters[chapterIndex + 1] : null;

  const shortTitle = (title: string) => title.replace(/^Chapter \d+:\s*/, "");

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Label: "Prologue" / "Conclusion" / "Chapter N"
  const chapterLabel = () => {
    if (chapterIndex === 0) return "Prologue";
    if (chapterIndex === book.chapters.length - 1) return "Conclusion";
    return `Chapter ${chapterIndex}`;
  };

  return (
    <article
      className="min-h-[60vh]"
      aria-labelledby={`chapter-heading-${chapter.slug}`}
      data-testid={`chapter-${chapter.slug}`}
    >
      {/* Chapter heading */}
      <header id={chapter.slug} className="scroll-mt-24 mb-10 md:mb-14 pt-2">
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-[0.22em] font-sans text-primary/50 font-medium select-none">
            {chapterLabel()}
          </span>
        </div>
        <h2
          id={`chapter-heading-${chapter.slug}`}
          className="font-serif text-3xl md:text-[2.1rem] font-bold text-foreground leading-tight tracking-tight"
        >
          {shortTitle(chapter.title)}
        </h2>
        <div className="mt-6 h-px bg-border" />
      </header>

      {/* Sections */}
      <div>
        {chapter.sections.map((section) => (
          <SectionContent key={section.slug} section={section} />
        ))}
      </div>

      {/* Chapter footer navigation */}
      <footer className="mt-16 pt-8 border-t border-border">
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="Chapter navigation"
        >
          {prevChapter ? (
            <button
              onClick={() => onNavigateChapter(prevChapter.slug)}
              data-testid={`nav-prev-${prevChapter.slug}`}
              aria-label={`Previous chapter: ${shortTitle(prevChapter.title)}`}
              className="group flex items-center gap-2 text-left max-w-[42%] text-sm font-sans text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
            >
              <ChevronLeft
                size={15}
                className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="truncate leading-snug">{shortTitle(prevChapter.title)}</span>
            </button>
          ) : (
            <div />
          )}

          {/* Back to top */}
          <button
            onClick={scrollTop}
            data-testid="button-back-to-top"
            aria-label="Back to top"
            className="shrink-0 text-[11px] font-sans text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
          >
            <ArrowUp size={12} />
            <span>Top</span>
          </button>

          {nextChapter ? (
            <button
              onClick={() => onNavigateChapter(nextChapter.slug)}
              data-testid={`nav-next-${nextChapter.slug}`}
              aria-label={`Next chapter: ${shortTitle(nextChapter.title)}`}
              className="group flex items-center gap-2 text-right max-w-[42%] text-sm font-sans text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded ml-auto"
            >
              <span className="truncate leading-snug">{shortTitle(nextChapter.title)}</span>
              <ChevronRight
                size={15}
                className="shrink-0 group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          ) : (
            <div />
          )}
        </nav>
      </footer>
    </article>
  );
}
