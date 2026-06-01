import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  return (
    <article className="min-h-screen" data-testid={`chapter-${chapter.slug}`}>
      {/* Chapter heading */}
      <header id={chapter.slug} className="scroll-mt-20 mb-10 md:mb-14 pt-2">
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans text-primary/60 font-medium">
            {chapterIndex === 0 ? "Preface" : `Chapter ${chapterIndex}`}
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
          {chapter.title.replace(/^Chapter \d+:\s*/, "")}
        </h2>
        <div className="mt-5 h-px bg-border" />
      </header>

      {/* Sections */}
      <div className="space-y-0">
        {chapter.sections.map((section) => (
          <SectionContent key={section.slug} section={section} />
        ))}
      </div>

      {/* Chapter navigation */}
      <nav className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
        {prevChapter ? (
          <button
            onClick={() => onNavigateChapter(prevChapter.slug)}
            data-testid={`nav-prev-${prevChapter.slug}`}
            className="group flex items-center gap-2 text-left max-w-[45%] text-sm font-sans text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className="truncate">{prevChapter.title.replace(/^Chapter \d+:\s*/, "")}</span>
          </button>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <button
            onClick={() => onNavigateChapter(nextChapter.slug)}
            data-testid={`nav-next-${nextChapter.slug}`}
            className="group flex items-center gap-2 text-right max-w-[45%] text-sm font-sans text-muted-foreground hover:text-primary transition-colors ml-auto"
          >
            <span className="truncate">{nextChapter.title.replace(/^Chapter \d+:\s*/, "")}</span>
            <ChevronRight size={16} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
