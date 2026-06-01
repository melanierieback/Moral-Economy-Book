import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, BookOpen, Sun, Moon, ArrowDown } from "lucide-react";
import { book } from "../lib/book";
import { TOC } from "../components/TOC";
import { ChapterView } from "../components/ChapterView";
import { Search } from "../components/Search";

// Build the flat list of all heading slugs for IntersectionObserver
function buildAllSlugs() {
  return book.chapters.flatMap((ch) => [
    ch.slug,
    ...ch.sections.filter((s) => s.title).map((s) => s.slug),
  ]);
}

const ALL_SLUGS = buildAllSlugs();

function useActiveSlug() {
  const [activeSlug, setActiveSlug] = useState<string>(ALL_SLUGS[0] ?? "");

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

    for (const slug of ALL_SLUGS) {
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
  }, []);

  return activeSlug;
}

// Compute scroll progress (0–1) within the active chapter for the TOC progress bar
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

export function Reader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("dark-mode") === "true";
    } catch {
      return false;
    }
  });

  const activeSlug = useActiveSlug();
  const scrollProgress = useScrollProgress();

  // Persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    }
  }, [darkMode]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Hash routing: on mount, scroll to the hash target
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Wait for layout
    const attempt = (tries: number) => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 150);
      }
    };
    setTimeout(() => attempt(5), 100);
  }, []);

  // Update URL hash on active slug change (debounced, replaceState only)
  useEffect(() => {
    if (!activeSlug) return;
    const id = setTimeout(() => {
      history.replaceState(null, "", `#${activeSlug}`);
    }, 200);
    return () => clearTimeout(id);
  }, [activeSlug]);

  const scrollToSlug = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${slug}`);
    }
  }, []);

  const startReading = () => {
    const firstSlug = book.chapters[0]?.slug;
    if (firstSlug) scrollToSlug(firstSlug);
  };

  // Active chapter index for the TOC progress bar denominator
  const activeChapterIndex = book.chapters.findIndex(
    (ch) => ch.slug === activeSlug || ch.sections.some((s) => s.slug === activeSlug)
  );
  // Normalise progress to 0–1 within current chapter count
  const tocProgress = book.chapters.length > 0
    ? (activeChapterIndex + scrollProgress) / book.chapters.length
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center px-4 h-14 gap-3 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-1"
          data-testid="button-open-toc"
          aria-label="Open table of contents"
          aria-expanded={mobileOpen}
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
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary focus-visible:outline-offset-1"
          data-testid="button-toggle-dark-mobile"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Mobile TOC drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Table of contents">
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
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary"
                data-testid="button-close-toc"
                aria-label="Close table of contents"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TOC
                activeSlug={activeSlug}
                scrollProgress={tocProgress}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 xl:w-72 bg-sidebar border-r border-sidebar-border z-30"
          aria-label="Site navigation"
        >
          {/* Sidebar header */}
          <div className="shrink-0 px-5 py-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-2.5">
              <BookOpen size={15} className="text-sidebar-primary" />
              <div className="flex items-center gap-3">
                <Search />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-0.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-sidebar-primary"
                  data-testid="button-toggle-dark"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            </div>
            <h1 className="font-serif text-[0.82rem] font-semibold text-sidebar-foreground leading-snug">
              {book.title}
            </h1>
            <p className="text-[10.5px] text-sidebar-foreground/35 font-sans mt-0.5 leading-tight">
              {book.subtitle}
            </p>
          </div>

          {/* TOC */}
          <div className="flex-1 overflow-hidden">
            <TOC activeSlug={activeSlug} scrollProgress={tocProgress} />
          </div>

          {/* Sidebar footer */}
          <div className="shrink-0 px-5 py-3 border-t border-sidebar-border">
            <p className="text-[10px] text-sidebar-foreground/25 font-sans">Working manuscript</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 xl:ml-72 min-h-screen" id="main-content">
          {/* Hero / landing */}
          <div className="bg-primary text-primary-foreground py-14 md:py-20 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.22em] font-sans opacity-50 mb-5">
                Working manuscript
              </p>
              <h1 className="font-serif text-[1.85rem] sm:text-3xl md:text-[2.8rem] font-bold leading-tight mb-4 tracking-tight break-words">
                {book.title}
              </h1>
              <p className="font-serif text-base sm:text-lg md:text-xl opacity-65 italic leading-relaxed">
                {book.subtitle}
              </p>
              <div className="mt-8 h-px bg-primary-foreground/15" />
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <p className="text-[0.8rem] opacity-45 font-sans">
                  {book.chapters.length} chapters
                </p>
                <button
                  onClick={startReading}
                  data-testid="button-start-reading"
                  className="inline-flex items-center gap-2 text-[0.82rem] font-sans font-medium opacity-80 hover:opacity-100 transition-opacity border border-primary-foreground/25 hover:border-primary-foreground/50 rounded-full px-4 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-foreground"
                >
                  <ArrowDown size={13} />
                  Start reading
                </button>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 max-w-[820px]">
            {book.chapters.map((chapter, idx) => (
              <div
                key={chapter.slug}
                className={idx > 0 ? "mt-20 md:mt-28 pt-8 border-t-2 border-border/25" : ""}
              >
                <ChapterView
                  chapter={chapter}
                  chapterIndex={idx}
                  onNavigateChapter={scrollToSlug}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="px-6 md:px-12 lg:px-16 py-10 border-t border-border mt-4">
            <div className="max-w-[820px]">
              <p className="text-xs text-muted-foreground font-sans">
                <span className="font-serif italic">{book.title}</span> &mdash; {book.subtitle}.{" "}
                Working manuscript.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
