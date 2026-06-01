import { ArrowUp } from "lucide-react";
import type { Chapter } from "../types/book";
import { SectionContent } from "./SectionContent";
import { book } from "../lib/book";

interface ChapterViewProps {
  chapter: Chapter;
  chapterIndex: number;
  prevChapter?: Chapter | null;
  nextChapter?: Chapter | null;
  onNavigateChapter: (slug: string) => void;
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center gap-3 my-6" aria-hidden="true">
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,58,0.28))" }}
      />
      <span style={{ color: "rgba(201,160,58,0.55)", fontSize: "9px" }}>◆</span>
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to left, transparent, rgba(201,160,58,0.28))" }}
      />
    </div>
  );
}

export function ChapterView({
  chapter,
  chapterIndex,
  prevChapter,
  nextChapter,
  onNavigateChapter,
}: ChapterViewProps) {
  const shortTitle = (title: string) => title.replace(/^Chapter \d+:\s*/, "");

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const chapterLabel = () => {
    if (chapterIndex === 0) return "Prologue";
    if (chapterIndex === book.chapters.length - 1) return "Conclusion";
    return `Chapter ${chapterIndex}`;
  };

  const totalSections = chapter.sections.filter((s) => s.title).length;

  return (
    <article
      className="min-h-[60vh]"
      aria-labelledby={`chapter-heading-${chapter.slug}`}
      data-testid={`chapter-${chapter.slug}`}
    >
      {/* Chapter heading */}
      <header id={chapter.slug} className="scroll-mt-24 mb-10 md:mb-14 pt-2">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span
            className="text-[10px] uppercase tracking-[0.28em] font-sans font-semibold select-none"
            style={{ color: "rgba(201,160,58,0.65)" }}
          >
            {chapterLabel()}
          </span>
          {totalSections > 0 && (
            <span className="text-[10px] font-sans text-muted-foreground/38">
              {totalSections} sections
            </span>
          )}
        </div>

        <h2
          id={`chapter-heading-${chapter.slug}`}
          className="font-serif text-3xl md:text-[2.2rem] font-bold text-foreground leading-tight tracking-tight"
        >
          {shortTitle(chapter.title)}
        </h2>

        {/* Ornamental gold divider */}
        <OrnamentalDivider />
      </header>

      {/* Sections */}
      <div>
        {chapter.sections.map((section) => (
          <SectionContent key={section.slug} section={section} />
        ))}
      </div>

      {/* Footer navigation */}
      <footer className="mt-16 pt-8 border-t border-border">
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="Chapter navigation"
        >
          {prevChapter ? (
            <button
              onClick={() => onNavigateChapter(prevChapter.slug)}
              data-testid={`nav-prev-${prevChapter.slug}`}
              aria-label={`Previous: ${shortTitle(prevChapter.title)}`}
              className="group flex flex-col gap-0.5 text-left max-w-[42%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] font-sans text-muted-foreground/35">
                ← Previous
              </span>
              <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors truncate leading-snug">
                {shortTitle(prevChapter.title)}
              </span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={scrollTop}
            data-testid="button-back-to-top"
            aria-label="Back to top"
            className="shrink-0 text-[10px] font-sans text-muted-foreground/35 hover:text-primary transition-colors flex flex-col items-center gap-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
          >
            <ArrowUp size={11} />
            <span className="uppercase tracking-[0.18em]">Top</span>
          </button>

          {nextChapter ? (
            <button
              onClick={() => onNavigateChapter(nextChapter.slug)}
              data-testid={`nav-next-${nextChapter.slug}`}
              aria-label={`Next: ${shortTitle(nextChapter.title)}`}
              className="group flex flex-col gap-0.5 text-right max-w-[42%] ml-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] font-sans text-muted-foreground/35 self-end">
                Next →
              </span>
              <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors truncate leading-snug">
                {shortTitle(nextChapter.title)}
              </span>
            </button>
          ) : (
            <div />
          )}
        </nav>
      </footer>
    </article>
  );
}
