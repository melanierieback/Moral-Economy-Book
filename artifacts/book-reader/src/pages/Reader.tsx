import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Sun, Moon, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { book } from "../lib/book";
import { TOC } from "../components/TOC";
import { ChapterView } from "../components/ChapterView";
import { Search } from "../components/Search";
import { NecLogo } from "../components/NecLogo";

interface ReaderProps {
  initialChapterSlug: string;
  initialSectionSlug?: string;
  onGoHome: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

function useSectionScrollspy(chapterSlug: string) {
  const chapter = book.chapters.find((c) => c.slug === chapterSlug);
  const sectionSlugs = chapter
    ? chapter.sections.filter((s) => s.title).map((s) => s.slug)
    : [];
  const allSlugs = [chapterSlug, ...sectionSlugs];

  const [activeSlug, setActiveSlug] = useState<string>(chapterSlug);

  useEffect(() => {
    setActiveSlug(chapterSlug);
    const visibleMap = new Map<string, number>();

    const updateActive = () => {
      let best: string | null = null;
      let bestTop = Infinity;
      for (const [slug, top] of visibleMap.entries()) {
        if (top >= 0 && top < bestTop) { bestTop = top; best = slug; }
      }
      if (!best && visibleMap.size > 0) {
        let closestNeg = -Infinity;
        for (const [slug, top] of visibleMap.entries()) {
          if (top < 0 && top > closestNeg) { closestNeg = top; best = slug; }
        }
      }
      if (best) setActiveSlug(best);
    };

    const observers: IntersectionObserver[] = [];
    for (const slug of allSlugs) {
      const el = document.getElementById(slug);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visibleMap.set(slug, entry.boundingClientRect.top);
            } else {
              visibleMap.set(slug, entry.boundingClientRect.top);
            }
            updateActive();
          }
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => { for (const obs of observers) obs.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSlug]);

  return activeSlug;
}

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

export function Reader({ initialChapterSlug, initialSectionSlug, onGoHome, darkMode, onToggleDark }: ReaderProps) {
  const [currentChapterSlug, setCurrentChapterSlug] = useState(initialChapterSlug);
  const [mobileOpen, setMobileOpen] = useState(false);
  const didMount = useRef(false);

  const currentChapterIndex = book.chapters.findIndex((c) => c.slug === currentChapterSlug);
  const currentChapter = book.chapters[currentChapterIndex];
  const prevChapter = currentChapterIndex > 0 ? book.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < book.chapters.length - 1 ? book.chapters[currentChapterIndex + 1] : null;

  const activeSlug = useSectionScrollspy(currentChapterSlug);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    try { localStorage.setItem("nec-last-chapter", currentChapterSlug); } catch { /* ignore */ }
  }, [currentChapterSlug]);

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentChapterSlug]);

  useEffect(() => {
    if (!initialSectionSlug) return;
    const attempt = (tries: number) => {
      const el = document.getElementById(initialSectionSlug);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 150);
      }
    };
    setTimeout(() => attempt(5), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    const id = setTimeout(() => { history.replaceState(null, "", `#${activeSlug}`); }, 200);
    return () => clearTimeout(id);
  }, [activeSlug]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const goToChapter = useCallback((slug: string) => {
    setCurrentChapterSlug(slug);
    setMobileOpen(false);
  }, []);

  const scrollToSection = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${slug}`);
    setMobileOpen(false);
  }, []);

  const activeTocSlug = activeSlug || currentChapterSlug;
  const chapter = currentChapter;
  const sectionSlugs = chapter ? chapter.sections.filter((s) => s.title).map((s) => s.slug) : [];
  const activeSecIdx = sectionSlugs.indexOf(activeSlug);
  const chapterProgress = sectionSlugs.length > 0
    ? Math.max(0, activeSecIdx) / sectionSlugs.length + scrollProgress / sectionSlugs.length
    : scrollProgress;

  const activeSection = chapter?.sections.find((s) => s.slug === activeSlug);
  const chapterShortTitle = currentChapter?.title.replace(/^Chapter \d+:\s*/, "") ?? "";

  const handleSearchNavigate = useCallback((slug: string) => {
    const ch = book.chapters.find(c => c.slug === slug || c.sections.some(s => s.slug === slug));
    if (ch) { goToChapter(ch.slug); setTimeout(() => scrollToSection(slug), 200); }
  }, [goToChapter, scrollToSection]);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Mobile header ─────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 nec-reading-header">
        <div className="flex items-center px-4 h-14 gap-3">
          {/* Back to contents */}
          <button
            onClick={onGoHome}
            data-testid="button-back-home"
            aria-label="Back to Table of Contents"
            className="shrink-0 flex items-center gap-1.5 transition-colors text-xs font-sans font-medium px-1 py-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
            style={{ color: "rgba(201,160,58,0.75)" }}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Contents</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0 px-1">
            <span className="font-sans text-xs truncate" style={{ color: "rgba(240,232,210,0.4)" }}>
              {chapterShortTitle}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <Search onNavigate={handleSearchNavigate} />
            <button
              onClick={() => setMobileOpen(true)}
              className="transition-colors p-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              data-testid="button-open-toc"
              aria-label="Open chapter outline"
              aria-expanded={mobileOpen}
              style={{ color: "rgba(240,232,210,0.55)" }}
            >
              <Menu size={17} />
            </button>
            <button
              onClick={onToggleDark}
              className="transition-colors p-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              style={{ color: "rgba(240,232,210,0.45)" }}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.round(scrollProgress * 100)}%`,
              background: "linear-gradient(90deg, rgba(201,160,58,0.6), rgba(201,160,58,0.3))",
            }}
          />
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Chapter outline">
          <div
            className="fixed inset-0 backdrop-blur-sm"
            style={{ background: "rgba(4,5,16,0.75)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] shadow-2xl" style={{ background: "#070919" }}>
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-4 h-14 shrink-0"
              style={{ borderBottom: "1px solid rgba(201,160,58,0.12)" }}
            >
              <button
                onClick={onGoHome}
                className="flex items-center gap-2 text-sm font-sans font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 rounded"
                style={{ color: "rgba(201,160,58,0.75)" }}
              >
                <ArrowLeft size={14} />
                Table of Contents
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="transition-colors p-1 rounded"
                aria-label="Close"
                style={{ color: "rgba(240,232,210,0.45)" }}
              >
                <X size={18} />
              </button>
            </div>
            {/* TOC */}
            <div className="flex-1 overflow-hidden">
              <TOC
                activeSlug={activeTocSlug}
                scrollProgress={chapterProgress}
                onNavigate={(slug) => {
                  const ch = book.chapters.find(c => c.slug === slug || c.sections.some(s => s.slug === slug));
                  if (ch) {
                    if (ch.slug !== currentChapterSlug) goToChapter(ch.slug);
                    else { scrollToSection(slug); setMobileOpen(false); }
                  }
                }}
                onChapterNavigate={goToChapter}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">

        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 xl:w-72 z-30"
          style={{
            background: "#060718",
            borderRight: "1px solid rgba(201,160,58,0.10)",
          }}
          aria-label="Chapter navigation"
        >
          {/* Sidebar header */}
          <div
            className="shrink-0 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(201,160,58,0.08)" }}
          >
            {/* Top row: back button + controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onGoHome}
                data-testid="button-back-home-desktop"
                className="flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 rounded"
                style={{ color: "rgba(201,160,58,0.72)" }}
              >
                <ArrowLeft size={12} />
                <span>Contents</span>
              </button>
              <div className="flex items-center gap-2.5">
                <Search onNavigate={handleSearchNavigate} />
                <button
                  onClick={onToggleDark}
                  className="transition-colors p-0.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  data-testid="button-toggle-dark"
                  style={{ color: "rgba(240,232,210,0.35)" }}
                >
                  {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                </button>
              </div>
            </div>

            {/* Brand */}
            <NecLogo size="sm" />
          </div>

          {/* TOC */}
          <div className="flex-1 overflow-hidden">
            <TOC
              activeSlug={activeTocSlug}
              scrollProgress={chapterProgress}
              onNavigate={(slug) => {
                const ch = book.chapters.find(c => c.slug === slug || c.sections.some(s => s.slug === slug));
                if (ch) {
                  if (ch.slug !== currentChapterSlug) goToChapter(ch.slug);
                  else scrollToSection(slug);
                }
              }}
              onChapterNavigate={goToChapter}
            />
          </div>

          {/* Sidebar footer */}
          <div
            className="shrink-0 px-5 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="font-sans text-[10px]" style={{ color: "rgba(240,232,210,0.18)" }}>
              Working manuscript
            </p>
          </div>
        </aside>

        {/* ── Main reading content ─────────────────────────────────────── */}
        <main
          className="flex-1 lg:ml-64 xl:ml-72 min-h-screen bg-background"
          id="main-content"
        >
          {/* Desktop reading progress bar */}
          <div
            className="hidden lg:block sticky top-0 z-10 h-0.5 w-full"
            style={{ background: "rgba(201,160,58,0.08)" }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.round(scrollProgress * 100)}%`,
                background: "linear-gradient(90deg, rgba(201,160,58,0.55), rgba(201,160,58,0.22))",
              }}
            />
          </div>

          {/* Breadcrumb */}
          <div className="px-6 sm:px-8 md:px-12 lg:px-16 pt-8 pb-0">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-sans flex-wrap" style={{ color: "rgba(0,0,0,0.35)" }}>
              <button
                onClick={onGoHome}
                className="hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded"
              >
                Contents
              </button>
              <ChevronRight size={10} className="opacity-40 shrink-0" />
              <span className="truncate max-w-[200px]" style={{ color: "rgba(0,0,0,0.55)" }}>
                {chapterShortTitle}
              </span>
              {activeSection && (
                <>
                  <ChevronRight size={10} className="opacity-40 shrink-0" />
                  <span className="truncate max-w-[200px]" style={{ color: "rgba(0,0,0,0.38)" }}>
                    {activeSection.title}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Chapter content */}
          <div className="px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-14 max-w-[820px]">
            {currentChapter && (
              <ChapterView
                chapter={currentChapter}
                chapterIndex={currentChapterIndex}
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                onNavigateChapter={goToChapter}
              />
            )}
          </div>

          {/* Bottom prev/next */}
          <div className="px-6 sm:px-8 md:px-12 lg:px-16 pb-16 max-w-[820px]">
            <div className="flex items-center justify-between gap-4 pt-2">
              {prevChapter ? (
                <button
                  onClick={() => goToChapter(prevChapter.slug)}
                  className="group flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded"
                >
                  <ChevronLeft size={15} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="truncate max-w-[180px]">
                    {prevChapter.title.replace(/^Chapter \d+:\s*/, "")}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onGoHome}
                  className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded"
                >
                  <ArrowLeft size={14} />
                  <span>Table of Contents</span>
                </button>
              )}
              {nextChapter ? (
                <button
                  onClick={() => goToChapter(nextChapter.slug)}
                  className="group flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded ml-auto"
                >
                  <span className="truncate max-w-[180px]">
                    {nextChapter.title.replace(/^Chapter \d+:\s*/, "")}
                  </span>
                  <ChevronRight size={15} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={onGoHome}
                  className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground hover:text-primary transition-colors ml-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded"
                >
                  <span>Table of Contents</span>
                  <ArrowLeft size={14} className="rotate-180" />
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="px-6 sm:px-8 md:px-12 lg:px-16 py-8 border-t border-border">
            <div className="max-w-[820px]">
              <p className="text-xs text-muted-foreground/50 font-sans">
                <span className="font-serif italic">{book.title}</span> &mdash; {book.subtitle}.{" "}
                Working manuscript. Non-Extractive Capital.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
