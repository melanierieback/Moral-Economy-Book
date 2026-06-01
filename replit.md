# Capital That Serves Life — Web Reader

A navigable long-form web reader for the book *Capital That Serves Life: Recovering Moral Economy in an Age of Extraction*.

## Run & Operate

- `pnpm --filter @workspace/book-reader run dev` — run the web reader (set by workflow)
- `pnpm --filter @workspace/scripts run parse-book` — re-run the LaTeX parser to regenerate book.json
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- Fonts: Lora (serif, for headings & body) + Inter (sans, for navigation)
- Routing: wouter
- No backend — fully static, no database

## Where things live

- `attached_assets/Capital_That_Serves_Life_1780345238370.tex` — source LaTeX book file (source of truth)
- `scripts/src/parseLatexBook.mjs` — LaTeX → JSON parser script
- `artifacts/book-reader/src/data/book.json` — generated structured book data
- `artifacts/book-reader/src/` — React app source
  - `types/book.ts` — TypeScript types for book structure
  - `lib/book.ts` — data access helpers
  - `pages/Reader.tsx` — main reader layout (sidebar TOC + content)
  - `components/TOC.tsx` — sticky table of contents with scrollspy
  - `components/ChapterView.tsx` — chapter renderer with prev/next nav
  - `components/SectionContent.tsx` — section/paragraph renderer with copy-link

## Architecture decisions

- LaTeX is parsed at build time into `book.json`; the React app imports it statically (no runtime fetch needed).
- Scrollspy uses IntersectionObserver watching all chapter/section heading IDs.
- TOC expands section links only for the currently active chapter to keep the sidebar scannable.
- Em dashes, curly quotes, and common LaTeX formatting are converted in both titles and content.
- Dark mode is toggled via CSS class on `document.documentElement`, stored in component state.

## Product

A single-page long-form reader with:
- Deep navy sidebar with sticky TOC (desktop) or mobile drawer
- Warm off-white reading column capped at 820px, serif book typography
- Active TOC highlight follows reader scroll position
- Copy-link button on every section heading
- Previous/next chapter navigation at the bottom of each chapter
- Dark mode toggle
- Re-runnable parser: update the `.tex` file and run `parse-book` to regenerate

## User preferences

_Populate as you build._

## Gotchas

- Always run `pnpm --filter @workspace/scripts run parse-book` after editing the `.tex` source to regenerate `book.json`.
- The `@assets/` import alias points to `attached_assets/` — use it for any attached image files.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
