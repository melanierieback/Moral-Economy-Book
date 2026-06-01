# Capital That Serves Life — Web Reader

A navigable long-form web reader for the book *Capital That Serves Life: Recovering Moral Economy in an Age of Extraction*.

---

## Quick start

```bash
# 1. Re-parse the LaTeX source into book.json
pnpm --filter @workspace/scripts run parse-book

# 2. Run the dev server (Replit workflow handles this automatically)
pnpm --filter @workspace/book-reader run dev

# 3. Build the static site (outputs to artifacts/book-reader/dist/public/)
pnpm --filter @workspace/book-reader run build

# 4. Build at a custom base path (e.g. for /moral-economy or /book sub-path)
BASE_PATH=/moral-economy pnpm --filter @workspace/book-reader run build
```

## Updating the book

Whenever the LaTeX source changes:

```bash
# 1. Edit the source file
#    attached_assets/Capital_That_Serves_Life_1780345238370.tex

# 2. Re-run the parser
pnpm --filter @workspace/scripts run parse-book

# 3. Rebuild the static site
pnpm --filter @workspace/book-reader run build

# 4. Deploy dist/public/ to your host
```

---

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- Fonts: Lora (serif) + Inter (sans) via Google Fonts
- Routing: wouter + hash-based anchor routing
- **No backend** — fully static, no database, no server required at runtime

---

## Where things live

| Path | Purpose |
|------|---------|
| `attached_assets/Capital_That_Serves_Life_1780345238370.tex` | LaTeX source (source of truth) |
| `scripts/src/parseLatexBook.mjs` | LaTeX → JSON parser |
| `artifacts/book-reader/src/data/book.json` | Parsed book data (committed, regenerable) |
| `artifacts/book-reader/src/` | React app source |
| `artifacts/book-reader/dist/public/` | Static build output |

### App source layout

```
artifacts/book-reader/src/
├── types/book.ts          TypeScript types for book structure
├── lib/book.ts            Data access helpers
├── data/book.json         Parsed book (19 chapters, ~614 sections)
├── pages/Reader.tsx       Root layout: sidebar + content + hash routing
├── components/
│   ├── TOC.tsx            Collapsible TOC with scrollspy + progress bar
│   ├── ChapterView.tsx    Chapter renderer, prev/next nav, back-to-top
│   ├── SectionContent.tsx Section/paragraph renderer, copy-link button
│   └── Search.tsx         ⌘K search modal (client-side, no backend)
└── index.css              Tailwind + custom book typography
```

---

## Content structure (QA verified)

| # | Chapter | Sections |
|---|---------|----------|
| 0 | Prologue: The Question That Was Buried | 4 |
| 1 | Chapter 1: The Question We Stopped Asking | 8 |
| 2 | Chapter 2: Aristotle and the Birth of Moral Economy | 10 |
| 3 | Chapter 3: Christianity Encounters Commerce | 6 |
| 4 | Chapter 4: The Scholastics Discover the Market | 9 |
| 5 | Chapter 5: Franciscans, Merchants, and the Birth of Capital | 12 |
| 6 | Chapter 6: Salamanca — Market Coordination and Moral Ambiguity | 6 |
| 7 | Chapter 7: Vocation, Stewardship, and the Protestant Ethic | 9 |
| 8 | Chapter 8: Adam Smith and the Moral Psychology of Markets | 10 |
| 9 | Chapter 9: The Great Separation | 11 |
| 10 | Chapter 10: What Extraction Means | 14 |
| 11 | Chapter 11: Austrian Economics and Entrepreneurial Discovery | 10 |
| 12 | Chapter 12: The Corporation Becomes Sovereign | 14 |
| 13 | Chapter 13: The Crisis of Financialised Capitalism | 15 |
| 14 | Chapter 14: Subsidiarity, Solidarity, and the Common Good | 6 |
| 15 | Chapter 15: Sphere Sovereignty, Stewardship, and Moral Markets | 6 |
| 16 | Chapter 16: Non-Extractive Capital | 15 |
| 17 | Chapter 17: The Digital Commons and the Future of Civilisation | 14 |
| 18 | Conclusion: Toward an Economy Ordered to Human Flourishing | 8 |

**Total: 19 chapters, 187 sections**

Parser conversion status (all clean):
- ✅ Em dashes (`---` → `—`), en dashes (`--` → `–`)
- ✅ Curly quotes (` `` ` / `''` → `"` / `"`)
- ✅ `\emph{}` → `<em>`
- ✅ `\textbf{}` → `<strong>`
- ✅ `\textit{}` → `<em>`
- ✅ `\begin{quote}` / `\end{quote}` → `<blockquote>`
- ✅ `\footnote{...}` → superscript marker + hidden inline span
- ✅ `\textsc{}` → `<span class="sc">` (small-caps via CSS)
- ✅ Escaped characters (`\%`, `\$`, `\&`, `\#`, etc.)
- ✅ No raw LaTeX commands in rendered output

---

## Architecture decisions

- LaTeX is parsed at build time into `book.json`; React imports it statically — no runtime fetch.
- Scrollspy uses `IntersectionObserver` over all chapter/section heading IDs.
- TOC expands only the active chapter; manual expand/collapse is respected.
- URL hash is updated on scroll via `history.replaceState` and read on mount for deep linking.
- Dark mode persisted in `localStorage`.
- Search is fully client-side over the in-memory book structure.

---

## Integration checklist — adding to Non-Extractive Capital website

### Recommended route

Mount the reader at `/moral-economy` or `/book` on the main site.

### Files to copy

```
artifacts/book-reader/dist/public/   ← the entire static build output
```

All assets (JS, CSS, fonts are Google-loaded) are self-contained in this folder.

### Build command

```bash
BASE_PATH=/moral-economy pnpm --filter @workspace/book-reader run build
# Output: artifacts/book-reader/dist/public/
```

### Static output folder

```
artifacts/book-reader/dist/public/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── (no server-side code required)
```

### Serving the static files

**Nginx example:**
```nginx
location /moral-economy {
    alias /var/www/moral-economy;
    try_files $uri $uri/ /moral-economy/index.html;
    index index.html;
}
```

**Any static host** (Netlify, Vercel, Cloudflare Pages, GitHub Pages):
- Set base directory to `artifacts/book-reader`
- Build command: `BASE_PATH=/moral-economy pnpm run build`
- Publish directory: `dist/public`
- Add a rewrite rule: all paths under `/moral-economy/*` → `index.html` (for hash navigation this is optional but recommended)

### Base path configuration

| Deployment target | BASE_PATH value |
|-------------------|----------------|
| Standalone at root | `/` (default, no env var needed) |
| Sub-path `/moral-economy` | `BASE_PATH=/moral-economy` |
| Sub-path `/book` | `BASE_PATH=/book` |

### Logo / branding assets

- Place any logo images in `artifacts/book-reader/src/assets/` or `attached_assets/`
- Reference via the `@assets/` alias in source, e.g. `import logo from "@assets/logo.png"`
- Branding colors are CSS custom properties in `artifacts/book-reader/src/index.css` under `:root` — edit `--primary`, `--sidebar`, `--sidebar-primary` to match the main site's palette

### How to update the book later

1. Edit `attached_assets/Capital_That_Serves_Life_*.tex`
2. Run `pnpm --filter @workspace/scripts run parse-book`
3. Commit the updated `artifacts/book-reader/src/data/book.json`
4. Run `BASE_PATH=/moral-economy pnpm --filter @workspace/book-reader run build`
5. Deploy the new `dist/public/` to your host

---

## Gotchas

- Always run `parse-book` after editing the `.tex` source — `book.json` is the generated artifact.
- The `@assets/` import alias points to `attached_assets/` — use it for any attached image files.
- `pnpm run build` requires no environment variables for standalone static builds (BASE_PATH defaults to `/`).
- The dev server (Replit workflow) requires `PORT` and `BASE_PATH` env vars, which the workflow config provides automatically.

## User preferences

_Populate as you build._
