---
name: NEC Book Reader Design System
description: Visual identity conventions for the Capital That Serves Life book reader — dark NEC branding, color palette, key components.
---

## Core palette (hardcoded in homepage/reader header — not CSS vars)
- Hero bg: `radial-gradient(ellipse at 44% 42%, #2e1b6a 0%, #1a1042 28%, #0d0c28 55%, #060712 82%, #030410 100%)`
- TOC bg: `linear-gradient(180deg, #080a1c 0%, #050611 100%)`
- Reader sidebar bg: `#060718`
- Gold accent: `rgba(201,160,58,…)` — used for labels, borders, chapter numbers, node dots
- CTA button: `linear-gradient(135deg, #4a28c4 0%, #3a20a8 100%)` with purple glow shadow

## Key components
- `NecLogo.tsx` — SVG starburst mark (purple panel + V-ray flare) + "NON-EXTRACTIVE / CAPITAL" text. Props: `size?: 'sm'|'md'|'lg'`.
- `CoverArt.tsx` — dark NEC-branded SVG: purple radial bg, starburst glow at top, gold tree network below, gold border frame.
- `StarburstDecor` (inside HomePage.tsx) — SVG overlay with 4 diagonal rays from ~(560,260) origin + CSS radial glow div.

## CSS classes (in index.css)
- `.nec-hero` — radial-gradient dark purple hero bg
- `.nec-toc-bg` — dark linear-gradient for TOC section
- `.nec-header` — frosted dark header (backdrop-blur, rgba(5,6,17,0.92))
- `.nec-reading-header` — reader header variant with gold-tinted border
- `.nec-starburst-outer` — CSS radial glow layer for starburst effect

## Architecture reminder
- Home page is always dark (hardcoded colors, not CSS vars)
- Reader sidebar is always dark (`#060718`)  
- Reader content area respects light/dark mode via CSS vars (`--background` = ivory in light)
- `--primary` in light mode = `252 62% 28%` (deep purple-blue, not navy)
- `--sidebar-primary` = gold `42 62% 58%`

**Why:** The NEC website (nec-website-7f7561.gitlab.io) uses near-black + deep blue-purple gradient + luminous starburst + white text + gold accents. The book reader should feel like a publication *inside* the NEC ecosystem.
