import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Sun, Moon, ArrowLeft, Bookmark, ChevronRight } from "lucide-react";
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
            visibleMap.set(slug, entry.boundingClientRect.top);
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
      if (el) { el.scrollIntoView({ behavior: "instant", block: "start" }); }
      else if (tries > 0) { setTimeout(() => attempt(tries - 1), 150); }
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

  const activeChapterIndex = book.chapters.findIndex((c) => c.slug === currentChapterSlug);
  const sectionSlugs = currentChapter?.sections.filter((s) => s.title).map((s) => s.slug) ?? [];
  const activeSecIdx = sectionSlugs.indexOf(activeSlug);
  const chapterProgress = sectionSlugs.length > 0
    ? Math.max(0, activeSecIdx) / sectionSlugs.length + scrollProgress / sectionSlugs.length
    : scrollProgress;
  const overallPct = book.chapters.length > 0
    ? Math.round(((activeChapterIndex + chapterProgress) / book.chapters.length) * 100)
    : 0;

  const activeSection = currentChapter?.sections.find((s) => s.slug === activeSlug);
  const chapterShortTitle = currentChapter?.title.replace(/^Chapter \d+:\s*/, "") ?? "";

  const handleSearchNavigate = useCallback((slug: string) => {
    const ch = book.chapters.find(c => c.slug === slug || c.sections.some(s => s.slug === slug));
    if (ch) { goToChapter(ch.slug); setTimeout(() => scrollToSection(slug), 200); }
  }, [goToChapter, scrollToSection]);

  const handleTocNavigate = useCallback((slug: string) => {
    const ch = book.chapters.find(c => c.slug === slug || c.sections.some(s => s.slug === slug));
    if (ch) {
      if (ch.slug !== currentChapterSlug) goToChapter(ch.slug);
      else scrollToSection(slug);
    }
  }, [currentChapterSlug, goToChapter, scrollToSection]);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Mobile header ────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 nec-reading-header">
        <div className="flex items-center px-4 h-14 gap-2">
          <NecLogo size="sm" className="shrink-0" />

          <div className="flex-1 min-w-0 px-2">
            <span className="font-sans text-[11px] truncate" style={{ color: "rgba(240,232,210,0.35)" }}>
              {chapterShortTitle}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onGoHome}
              data-testid="button-back-home"
              className="flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-1.5 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              style={{ color: "rgba(201,160,58,0.75)" }}
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Contents</span>
            </button>
            <Search onNavigate={handleSearchNavigate} />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              data-testid="button-open-toc"
              aria-label="Open chapter outline"
              style={{ color: "rgba(240,232,210,0.50)" }}
            >
              <Menu size={17} />
            </button>
            <button
              onClick={onToggleDark}
              className="p-1.5 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
              aria-label={darkMode ? "Light mode" : "Dark mode"}
              style={{ color: "rgba(240,232,210,0.40)" }}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${overallPct}%`,
              background: "linear-gradient(90deg, rgba(201,160,58,0.6), rgba(201,160,58,0.25))",
            }}
          />
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 backdrop-blur-sm"
            style={{ background: "rgba(4,5,16,0.75)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] shadow-2xl" style={{ background: "#070919" }}>
            <div
              className="flex items-center justify-between px-4 h-14 shrink-0"
              style={{ borderBottom: "1px solid rgba(201,160,58,0.10)" }}
            >
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 text-[11px] font-sans font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 rounded"
                style={{ color: "rgba(201,160,58,0.72)" }}
              >
                <ArrowLeft size={13} />
                Table of Contents
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded transition-colors"
                aria-label="Close"
                style={{ color: "rgba(240,232,210,0.40)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TOC
                activeSlug={activeTocSlug}
                scrollProgress={chapterProgress}
                onNavigate={handleTocNavigate}
                onChapterNavigate={goToChapter}
                onGoHome={() => { setMobileOpen(false); onGoHome(); }}
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
            borderRight: "1px solid rgba(201,160,58,0.09)",
          }}
          aria-label="Chapter navigation"
        >
          {/* Sidebar header */}
          <div
            className="shrink-0 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(201,160,58,0.08)" }}
          >
            {/* Back + controls row */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onGoHome}
                data-testid="button-back-home-desktop"
                className="flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 rounded"
                style={{ color: "rgba(201,160,58,0.70)" }}
              >
                <ArrowLeft size={12} />
                Back to Contents
              </button>
              <div className="flex items-center gap-2">
                <Search onNavigate={handleSearchNavigate} />
                <button
                  aria-label="Bookmark (coming soon)"
                  className="p-0.5 rounded opacity-30 cursor-default"
                  style={{ color: "rgba(240,232,210,0.5)" }}
                >
                  <Bookmark size={13} />
                </button>
                <button
                  onClick={onToggleDark}
                  className="p-0.5 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30"
                  aria-label={darkMode ? "Light mode" : "Dark mode"}
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
              onNavigate={handleTocNavigate}
              onChapterNavigate={goToChapter}
              onGoHome={onGoHome}
            />
          </div>
        </aside>

        {/* ── Main reading content ──────────────────────────────────────── */}
        <main
          className="flex-1 lg:ml-64 xl:ml-72 min-h-screen bg-background"
          id="main-content"
        >
          {/* Desktop reading header */}
          <div
            className="hidden lg:block sticky top-0 z-10 nec-reading-header"
          >
            <div className="max-w-[820px] mx-auto px-8 h-11 flex items-center justify-between gap-4">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] font-sans min-w-0 flex-1">
                <button
                  onClick={onGoHome}
                  className="hover:text-white/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/25 rounded shrink-0"
                  style={{ color: "rgba(201,160,58,0.55)" }}
                >
                  Contents
                </button>
                <ChevronRight size={10} className="opacity-25 shrink-0" />
                <span className="truncate" style={{ color: "rgba(240,232,210,0.38)" }}>
                  {chapterShortTitle}
                </span>
                {activeSection && (
                  <>
                    <ChevronRight size={10} className="opacity-20 shrink-0" />
                    <span className="truncate" style={{ color: "rgba(240,232,210,0.28)" }}>
                      {activeSection.title}
                    </span>
                  </>
                )}
              </nav>
              {/* Progress */}
              <span
                className="shrink-0 font-sans text-[10px] tabular-nums font-medium"
                style={{ color: "rgba(201,160,58,0.45)" }}
              >
                {overallPct}% complete
              </span>
            </div>
            {/* Reading progress bar */}
            <div className="h-px w-full" style={{ background: "rgba(201,160,58,0.07)" }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.round(scrollProgress * 100)}%`,
                  background: "linear-gradient(90deg, rgba(201,160,58,0.50), rgba(201,160,58,0.18))",
                }}
              />
            </div>
          </div>

          {/* Chapter content */}
          <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-10 md:py-14 max-w-[820px]">
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

          {/* Footer */}
          <footer className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 border-t border-border">
            <div className="max-w-[820px]">
              <p className="text-xs text-muted-foreground/40 font-sans">
                <span className="font-serif italic">{book.title}</span> &mdash; Working manuscript.
                Non-Extractive Capital.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
