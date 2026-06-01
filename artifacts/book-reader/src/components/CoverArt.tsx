export function CoverArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <pattern id="covergrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#c8bfa0" strokeWidth="0.35" />
        </pattern>
        <radialGradient id="bgGlow" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#f9f4ea" />
          <stop offset="100%" stopColor="#ede5cc" />
        </radialGradient>
        <filter id="nodeShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#1e3260" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="360" height="480" fill="url(#bgGlow)" />
      <rect width="360" height="480" fill="url(#covergrid)" />

      {/* Outer border */}
      <rect x="10" y="10" width="340" height="460" fill="none" stroke="#1e3260" strokeWidth="1.5" />
      <rect x="14" y="14" width="332" height="452" fill="none" stroke="#1e3260" strokeWidth="0.4" opacity="0.45" />

      {/* Corner ornaments */}
      {[
        [10, 10], [350, 10], [10, 470], [350, 470],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3.5" fill="#1e3260" />
        </g>
      ))}

      {/* Horizontal connectors between branches (network feel) */}
      <g fill="none" stroke="#1e3260" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.35">
        <line x1="75" y1="188" x2="115" y2="168" />
        <line x1="245" y1="168" x2="285" y2="188" />
        <line x1="82" y1="120" x2="125" y2="112" />
        <line x1="235" y1="112" x2="278" y2="120" />
        <line x1="152" y1="68" x2="208" y2="68" />
      </g>

      {/* Roots */}
      <g fill="none" stroke="#1e3260" strokeLinecap="round">
        <path d="M 180 318 C 162 342 140 368 112 408" strokeWidth="2.2" />
        <path d="M 180 318 C 178 352 176 378 174 428" strokeWidth="2" />
        <path d="M 180 318 C 198 342 220 368 248 408" strokeWidth="2.2" />
        <path d="M 112 408 C 96 418 78 424 62 438" strokeWidth="1.5" opacity="0.75" />
        <path d="M 248 408 C 264 418 282 424 298 438" strokeWidth="1.5" opacity="0.75" />
        <path d="M 174 428 C 168 436 160 440 152 448" strokeWidth="1.2" opacity="0.6" />
        <path d="M 174 428 C 180 436 188 440 196 448" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* Trunk */}
      <path d="M 180 318 L 180 175" fill="none" stroke="#1e3260" strokeWidth="3.2" strokeLinecap="round" />

      {/* Main branches */}
      <g fill="none" stroke="#1e3260" strokeLinecap="round">
        <path d="M 180 258 C 152 240 118 215 75 188" strokeWidth="2.2" />
        <path d="M 180 225 C 158 208 135 188 115 168" strokeWidth="2" />
        <path d="M 180 175 L 180 112" strokeWidth="2" />
        <path d="M 180 225 C 202 208 225 188 245 168" strokeWidth="2" />
        <path d="M 180 258 C 208 240 242 215 285 188" strokeWidth="2.2" />
      </g>

      {/* Sub-branches */}
      <g fill="none" stroke="#1e3260" strokeLinecap="round" opacity="0.78">
        <path d="M 75 188 C 58 172 44 155 38 136" strokeWidth="1.5" />
        <path d="M 75 188 C 76 168 78 152 78 132" strokeWidth="1.4" />
        <path d="M 115 168 C 100 150 88 132 82 112" strokeWidth="1.4" />
        <path d="M 115 168 C 120 148 124 132 125 112" strokeWidth="1.4" />
        <path d="M 180 112 C 168 96 158 80 152 68" strokeWidth="1.4" />
        <path d="M 180 112 C 192 96 202 80 208 68" strokeWidth="1.4" />
        <path d="M 245 168 C 248 148 252 132 253 112" strokeWidth="1.4" />
        <path d="M 245 168 C 260 150 272 132 278 112" strokeWidth="1.4" />
        <path d="M 285 188 C 284 168 282 152 282 132" strokeWidth="1.4" />
        <path d="M 285 188 C 302 172 316 155 322 136" strokeWidth="1.5" />
      </g>

      {/* Leaf/tip nodes */}
      <g fill="#1e3260">
        <circle cx="38" cy="136" r="4" />
        <circle cx="78" cy="132" r="3.5" />
        <circle cx="82" cy="112" r="3.5" />
        <circle cx="125" cy="112" r="3.5" />
        <circle cx="152" cy="68" r="4" />
        <circle cx="208" cy="68" r="4" />
        <circle cx="253" cy="112" r="3.5" />
        <circle cx="278" cy="112" r="3.5" />
        <circle cx="282" cy="132" r="3.5" />
        <circle cx="322" cy="136" r="4" />
      </g>

      {/* Root-end nodes */}
      <g fill="#1e3260" opacity="0.6">
        <circle cx="62" cy="438" r="3" />
        <circle cx="152" cy="448" r="2.5" />
        <circle cx="196" cy="448" r="2.5" />
        <circle cx="174" cy="428" r="4" />
        <circle cx="298" cy="438" r="3" />
      </g>

      {/* Gold branch-junction nodes */}
      <g filter="url(#nodeShadow)">
        <circle cx="75" cy="188" r="7" fill="#c9a74e" />
        <circle cx="115" cy="168" r="7" fill="#c9a74e" />
        <circle cx="180" cy="112" r="7" fill="#c9a74e" />
        <circle cx="245" cy="168" r="7" fill="#c9a74e" />
        <circle cx="285" cy="188" r="7" fill="#c9a74e" />
        <circle cx="112" cy="408" r="5.5" fill="#c9a74e" opacity="0.85" />
        <circle cx="248" cy="408" r="5.5" fill="#c9a74e" opacity="0.85" />
      </g>

      {/* Central node — the focal point */}
      <circle cx="180" cy="258" r="5" fill="#c9a74e" opacity="0.9" />
      <circle cx="180" cy="225" r="5" fill="#c9a74e" opacity="0.9" />
      <circle cx="180" cy="175" r="5.5" fill="#c9a74e" />

      {/* Root base node (large) */}
      <circle cx="180" cy="318" r="13" fill="#f5f0e6" stroke="#1e3260" strokeWidth="1.5" />
      <circle cx="180" cy="318" r="8" fill="#c9a74e" />
      <circle cx="180" cy="318" r="4" fill="#1e3260" />

      {/* Decorative horizontal rule near bottom */}
      <g opacity="0.3" stroke="#1e3260" strokeWidth="0.5">
        <line x1="40" y1="458" x2="160" y2="458" />
        <circle cx="180" cy="458" r="2" fill="#1e3260" />
        <line x1="200" y1="458" x2="320" y2="458" />
      </g>
    </svg>
  );
}
