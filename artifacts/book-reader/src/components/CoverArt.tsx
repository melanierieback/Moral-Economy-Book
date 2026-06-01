export function CoverArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 430"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        {/* Panel background: dark navy gradient */}
        <radialGradient id="ca-bg" cx="48%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#251765" />
          <stop offset="45%" stopColor="#110c32" />
          <stop offset="100%" stopColor="#05060d" />
        </radialGradient>

        {/* Starburst glow */}
        <radialGradient id="ca-star" cx="48%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#f8eed4" stopOpacity="0.92" />
          <stop offset="15%" stopColor="#e0a830" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#7040c0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Gold gradients for book pages */}
        <linearGradient id="ca-pageL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a07018" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c8982a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="ca-pageR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8982a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a07018" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="ca-pageTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0b848" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#b08828" stopOpacity="0.45" />
        </linearGradient>

        {/* Horizon/landscape glow */}
        <radialGradient id="ca-horizon" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#5028b0" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#2010a0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Root gradient */}
        <linearGradient id="ca-roots" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9902a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8060a0" stopOpacity="0.15" />
        </linearGradient>

        {/* Ray gradients */}
        <linearGradient id="ca-rayL" x1="154" y1="100" x2="55" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8eed4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-rayR" x1="154" y1="100" x2="256" y2="262" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0dca0" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#b08020" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-rayUL" x1="154" y1="100" x2="60" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f4e8c0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-rayUR" x1="154" y1="100" x2="270" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f4e8c0" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
        </linearGradient>

        {/* Dot pattern */}
        <pattern id="ca-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.55" fill="#c9a03a" fillOpacity="0.06" />
        </pattern>

        <filter id="ca-glowBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="ca-softBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="ca-horizonBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* ── Background ───────────────────────────────────────────────── */}
      <rect width="320" height="430" fill="url(#ca-bg)" />
      <rect width="320" height="430" fill="url(#ca-dots)" />

      {/* ── Title text inside the cover ───────────────────────────────── */}
      <text
        x="160" y="32"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        fontWeight="bold"
        letterSpacing="3"
        fill="#c9a03a"
        fillOpacity="0.92"
      >
        CAPITAL
      </text>
      <text
        x="160" y="52"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        fontWeight="bold"
        letterSpacing="3"
        fill="#c9a03a"
        fillOpacity="0.92"
      >
        THAT SERVES LIFE
      </text>

      {/* Subtitle */}
      <text
        x="160" y="70"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="7.5"
        letterSpacing="0.5"
        fill="#c9a03a"
        fillOpacity="0.58"
        fontStyle="italic"
      >
        Recovering Moral Economy
      </text>
      <text
        x="160" y="81"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="7.5"
        letterSpacing="0.5"
        fill="#c9a03a"
        fillOpacity="0.58"
        fontStyle="italic"
      >
        in an Age of Extraction
      </text>

      {/* Title divider */}
      <line x1="100" y1="88" x2="220" y2="88" stroke="#c9a03a" strokeWidth="0.4" strokeOpacity="0.28" />
      <circle cx="160" cy="88" r="1.5" fill="#c9a03a" fillOpacity="0.38" />

      {/* ── Starburst glow (ambient) ──────────────────────────────────── */}
      <ellipse
        cx="154" cy="100" rx="90" ry="68"
        fill="url(#ca-star)"
        filter="url(#ca-glowBlur)"
      />

      {/* ── Starburst rays ────────────────────────────────────────────── */}
      {/* V-shape: apex at (154, 100), arms going lower-left and lower-right */}
      <line x1="154" y1="100" x2="55" y2="270" stroke="url(#ca-rayL)" strokeWidth="1.4" />
      <line x1="154" y1="100" x2="256" y2="262" stroke="url(#ca-rayR)" strokeWidth="1.0" />
      {/* Cross spikes */}
      <line x1="154" y1="100" x2="60" y2="36" stroke="url(#ca-rayUL)" strokeWidth="0.7" />
      <line x1="154" y1="100" x2="270" y2="28" stroke="url(#ca-rayUR)" strokeWidth="0.55" />
      {/* Horizontal cross */}
      <line x1="30" y1="100" x2="290" y2="100" stroke="#d4a040" strokeWidth="0.3" strokeOpacity="0.1" />

      {/* Starburst bright core */}
      <circle cx="154" cy="100" r="12" fill="#e8c870" fillOpacity="0.18" />
      <circle cx="154" cy="100" r="5" fill="#f5e8c0" fillOpacity="0.45" />
      <circle cx="154" cy="100" r="2.2" fill="#f9f4e0" />

      {/* ── Open book ────────────────────────────────────────────────── */}
      {/* Spine shadow */}
      <rect x="156" y="230" width="8" height="80" fill="#050508" fillOpacity="0.4" />

      {/* Left page — main shape */}
      <path
        d="M 158 308 C 140 295 98 278 48 272 L 48 310 C 98 314 140 312 158 310 Z"
        fill="url(#ca-pageL)"
        stroke="#c9a03a"
        strokeWidth="0.7"
        strokeOpacity="0.7"
      />
      {/* Left page top arc */}
      <path
        d="M 158 240 C 138 232 95 220 50 216"
        fill="none"
        stroke="#c9a03a"
        strokeWidth="0.7"
        strokeOpacity="0.6"
      />
      {/* Left page face */}
      <path
        d="M 158 240 C 138 232 95 220 50 216 L 48 310 C 98 308 140 295 158 308 Z"
        fill="url(#ca-pageTop)"
        strokeWidth="0.6"
        stroke="#c9a03a"
        strokeOpacity="0.5"
      />

      {/* Left page text lines */}
      {[248, 256, 264, 272, 280, 288, 296].map((y, i) => {
        const x0 = 55 + i * 2;
        const x1 = 152 - i;
        return (
          <line
            key={y}
            x1={x0} y1={y}
            x2={x1} y2={y - 2}
            stroke="#c9a03a"
            strokeWidth="0.4"
            strokeOpacity={0.18 - i * 0.018}
          />
        );
      })}

      {/* Right page — main shape */}
      <path
        d="M 162 308 C 180 295 222 278 272 272 L 272 310 C 222 314 180 312 162 310 Z"
        fill="url(#ca-pageR)"
        stroke="#c9a03a"
        strokeWidth="0.7"
        strokeOpacity="0.7"
      />
      {/* Right page top arc */}
      <path
        d="M 162 240 C 182 232 225 220 270 216"
        fill="none"
        stroke="#c9a03a"
        strokeWidth="0.7"
        strokeOpacity="0.6"
      />
      {/* Right page face */}
      <path
        d="M 162 240 C 182 232 225 220 270 216 L 272 310 C 222 308 180 295 162 308 Z"
        fill="url(#ca-pageTop)"
        strokeWidth="0.6"
        stroke="#c9a03a"
        strokeOpacity="0.5"
      />

      {/* Right page text lines */}
      {[248, 256, 264, 272, 280, 288, 296].map((y, i) => {
        const x0 = 168 + i;
        const x1 = 265 - i * 2;
        return (
          <line
            key={y}
            x1={x0} y1={y - 2}
            x2={x1} y2={y}
            stroke="#c9a03a"
            strokeWidth="0.4"
            strokeOpacity={0.18 - i * 0.018}
          />
        );
      })}

      {/* Spine center line */}
      <line x1="160" y1="216" x2="160" y2="312" stroke="#c9a03a" strokeWidth="0.9" strokeOpacity="0.45" />

      {/* Additional page arcs behind the main pages (depth) */}
      {[1, 2, 3].map((offset) => (
        <g key={offset}>
          <path
            d={`M 158 ${308 + offset * 1.5} C 140 ${295 + offset} ${95 - offset * 2} ${276 + offset} ${46 - offset * 2} ${270 + offset}`}
            fill="none"
            stroke="#c9a03a"
            strokeWidth="0.5"
            strokeOpacity={0.15 - offset * 0.04}
          />
          <path
            d={`M 162 ${308 + offset * 1.5} C 180 ${295 + offset} ${225 + offset * 2} ${276 + offset} ${274 + offset * 2} ${270 + offset}`}
            fill="none"
            stroke="#c9a03a"
            strokeWidth="0.5"
            strokeOpacity={0.15 - offset * 0.04}
          />
        </g>
      ))}

      {/* ── Root system ───────────────────────────────────────────────── */}
      <g fill="none" strokeLinecap="round" stroke="url(#ca-roots)">
        {/* Main trunk down from spine */}
        <path d="M 160 312 L 160 338" strokeWidth="2" />
        {/* Primary roots */}
        <path d="M 160 328 C 142 338 118 352 90 368" strokeWidth="1.6" />
        <path d="M 160 328 C 178 338 202 352 230 368" strokeWidth="1.6" />
        <path d="M 160 338 L 160 362" strokeWidth="1.4" />
        {/* Secondary roots */}
        <path d="M 90 368 C 74 376 58 382 42 395" strokeWidth="1.1" strokeOpacity="0.55" />
        <path d="M 90 368 C 88 378 86 386 86 400" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 230 368 C 246 376 262 382 278 395" strokeWidth="1.1" strokeOpacity="0.55" />
        <path d="M 230 368 C 232 378 234 386 234 400" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 160 362 C 148 372 140 382 135 400" strokeWidth="1" strokeOpacity="0.35" />
        <path d="M 160 362 C 172 372 180 382 185 400" strokeWidth="1" strokeOpacity="0.35" />
      </g>

      {/* Root nodes */}
      <g fill="#c9a03a" fillOpacity="0.4">
        <circle cx="90" cy="368" r="2.2" />
        <circle cx="230" cy="368" r="2.2" />
        <circle cx="160" cy="338" r="2.5" />
      </g>

      {/* ── Landscape / cityscape at bottom ──────────────────────────── */}
      {/* Horizon glow */}
      <ellipse
        cx="160" cy="418" rx="150" ry="40"
        fill="url(#ca-horizon)"
        filter="url(#ca-horizonBlur)"
      />

      {/* City skyline silhouette */}
      <g fill="#08060e" fillOpacity="0.92">
        {/* Buildings as simple rects */}
        <rect x="30" y="404" width="12" height="26" />
        <rect x="44" y="400" width="10" height="30" />
        <rect x="56" y="408" width="14" height="22" />
        <rect x="72" y="396" width="8" height="34" />
        <rect x="82" y="405" width="16" height="25" />
        <rect x="100" y="400" width="10" height="30" />
        <rect x="112" y="408" width="12" height="22" />
        <rect x="126" y="402" width="8" height="28" />
        <rect x="136" y="406" width="14" height="24" />
        {/* Center gap for root entry */}
        <rect x="174" y="406" width="14" height="24" />
        <rect x="190" y="402" width="8" height="28" />
        <rect x="200" y="408" width="12" height="22" />
        <rect x="214" y="400" width="10" height="30" />
        <rect x="226" y="405" width="16" height="25" />
        <rect x="244" y="396" width="8" height="34" />
        <rect x="254" y="408" width="14" height="22" />
        <rect x="270" y="400" width="10" height="30" />
        <rect x="282" y="404" width="12" height="26" />
      </g>

      {/* Faint purple glow behind buildings */}
      <rect
        x="20" y="400" width="280" height="30"
        fill="#4020a0"
        fillOpacity="0.08"
      />

      {/* ── Gold decorative frame ─────────────────────────────────────── */}
      <rect x="8" y="8" width="304" height="414" fill="none" stroke="#c9a03a" strokeWidth="1.1" strokeOpacity="0.30" />
      <rect x="12" y="12" width="296" height="406" fill="none" stroke="#c9a03a" strokeWidth="0.4" strokeOpacity="0.12" />

      {/* Corner ornaments */}
      {([
        [8, 8], [312, 8], [8, 422], [312, 422],
      ] as [number, number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.8" fill="#c9a03a" fillOpacity="0.38" />
      ))}

      {/* Small corner filigree marks */}
      {/* Top-left */}
      <path d="M 8 20 L 8 8 L 20 8" fill="none" stroke="#c9a03a" strokeWidth="0.7" strokeOpacity="0.25" />
      {/* Top-right */}
      <path d="M 300 8 L 312 8 L 312 20" fill="none" stroke="#c9a03a" strokeWidth="0.7" strokeOpacity="0.25" />
      {/* Bottom-left */}
      <path d="M 8 410 L 8 422 L 20 422" fill="none" stroke="#c9a03a" strokeWidth="0.7" strokeOpacity="0.25" />
      {/* Bottom-right */}
      <path d="M 300 422 L 312 422 L 312 410" fill="none" stroke="#c9a03a" strokeWidth="0.7" strokeOpacity="0.25" />

      {/* Bottom ornament */}
      <line x1="80" y1="422" x2="152" y2="422" stroke="#c9a03a" strokeWidth="0.4" strokeOpacity="0.18" />
      <circle cx="160" cy="422" r="1.5" fill="#c9a03a" fillOpacity="0.30" />
      <line x1="168" y1="422" x2="240" y2="422" stroke="#c9a03a" strokeWidth="0.4" strokeOpacity="0.18" />
    </svg>
  );
}
