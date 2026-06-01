import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, BookOpen, Sun, Moon } from "lucide-react";
import { book } from "../lib/book";
import { TOC } from "../components/TOC";
import { ChapterView } from "../components/ChapterView";

function useActiveSlug(allSlugs: string[]) {
  const [activeSlug, setActiveSlug] = useState<string>(allSlugs[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleMap = new Map<string, number>();

    const updateActive = () => {
      let best: string | null = null;
      let bestTop = Infinity;
      for (const [slug, top] of visibleMap.entries()) {
        if (top >= 0 && top < bestTop) {
          bestTop = top;
          best = slug;
        }
      }
      if (!best && visibleMap.size > 0) {
        let closestNeg = -Infinity;
        for (const [slug, top] of visibleMap.entries()) {
          if (top < 0 && top > closestNeg) {
            closestNeg = top;
            best = slug;
          }
        }
      }
      if (best) setActiveSlug(best);
    };

    for (const slug of allSlugs) {
      const el = document.getElementById(slug);
      if (!el) continue;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visibleMap.set(slug, entry.boundingClientRect.top);
            } else {
              if (entry.boundingClientRect.top < 0) {
                visibleMap.set(slug, entry.boundingClientRect.top);
              } else {
                visibleMap.delete(slug);
              }
            }
            updateActive();
          }
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [allSlugs]);

  return activeSlug;
}

export function Reader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const allSlugs = book.chapters.flatMap((ch) => [
    ch.slug,
    ...ch.sections.filter((s) => s.title).map((s) => s.slug),
  ]);

  const activeSlug = useActiveSlug(allSlugs);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToChapter = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center px-4 h-14 gap-3 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors p-1"
          data-testid="button-open-toc"
          aria-label="Open table of contents"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <BookOpen size={15} className="text-sidebar-primary shrink-0" />
          <span className="text-sidebar-foreground text-sm font-sans font-medium truncate">
            {book.title}
          </span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors p-1"
          data-testid="button-toggle-dark-mobile"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Mobile TOC drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-sidebar shadow-2xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-sidebar-primary" />
                <span className="text-sidebar-foreground text-sm font-sans font-medium">Contents</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                data-testid="button-close-toc"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TOC activeSlug={activeSlug} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 xl:w-72 bg-sidebar border-r border-sidebar-border z-30">
          {/* Sidebar header */}
          <div className="shrink-0 px-5 py-5 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-2">
              <BookOpen size={16} className="text-sidebar-primary" />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                data-testid="button-toggle-dark"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
            <h1 className="font-serif text-sm font-semibold text-sidebar-foreground leading-snug">
              {book.title}
            </h1>
            <p className="text-[11px] text-sidebar-foreground/40 font-sans mt-0.5 leading-tight">
              {book.subtitle}
            </p>
          </div>

          {/* TOC */}
          <div className="flex-1 overflow-hidden">
            <TOC activeSlug={activeSlug} />
          </div>

          {/* Sidebar footer */}
          <div className="shrink-0 px-5 py-3 border-t border-sidebar-border">
            <p className="text-[10px] text-sidebar-foreground/30 font-sans">
              Working manuscript
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main
          ref={contentRef}
          className="flex-1 lg:ml-64 xl:ml-72 min-h-screen"
        >
          {/* Hero / landing */}
          <div className="bg-primary text-primary-foreground py-16 md:py-20 px-6 md:px-12 lg:px-16">
            <div className="max-w-2xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.25em] font-sans opacity-60 mb-4">
                Working manuscript
              </p>
              <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4">
                {book.title}
              </h1>
              <p className="font-serif text-lg md:text-xl opacity-70 italic leading-relaxed">
                {book.subtitle}
              </p>
              <div className="mt-8 h-px bg-primary-foreground/20" />
              <p className="mt-5 text-sm opacity-55 font-sans">
                {book.chapters.length} chapters &middot; Use the table of contents to navigate
              </p>
            </div>
          </div>

          {/* Chapters */}
          <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 max-w-[820px]">
            {book.chapters.map((chapter, idx) => (
              <div key={chapter.slug} className={idx > 0 ? "mt-20 md:mt-28 pt-8 border-t-2 border-border/30" : ""}>
                <ChapterView
                  chapter={chapter}
                  chapterIndex={idx}
                  onNavigateChapter={scrollToChapter}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="px-6 md:px-12 lg:px-16 py-10 border-t border-border mt-8">
            <div className="max-w-[820px]">
              <p className="text-xs text-muted-foreground font-sans">
                <span className="font-serif italic">{book.title}</span> &mdash; {book.subtitle}.
                Working manuscript.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
