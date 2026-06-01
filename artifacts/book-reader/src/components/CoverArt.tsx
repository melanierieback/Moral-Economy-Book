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
        {/* Dark purple-navy background */}
        <radialGradient id="cvBg" cx="45%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#2c1a66" />
          <stop offset="40%" stopColor="#130d36" />
          <stop offset="100%" stopColor="#060711" />
        </radialGradient>

        {/* Starburst glow at top */}
        <radialGradient id="cvGlow" cx="45%" cy="29%" r="45%">
          <stop offset="0%" stopColor="#f5e8c0" stopOpacity="0.85" />
          <stop offset="16%" stopColor="#d09828" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#7040c0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Tree gold gradient */}
        <linearGradient id="cvTreeGold" x1="0" y1="0.3" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#c9a03a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c9a03a" stopOpacity="0.25" />
        </linearGradient>

        {/* Gold for nodes */}
        <radialGradient id="cvNodeGold" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f0d07a" />
          <stop offset="100%" stopColor="#a87828" />
        </radialGradient>

        {/* Ray gradients */}
        <linearGradient id="cvRayL" x1="162" y1="140" x2="25" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5e8c0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c49030" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cvRayR" x1="162" y1="140" x2="320" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0dca0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b08020" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cvRayUR" x1="162" y1="140" x2="340" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0e0b0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
        </linearGradient>

        {/* Subtle dot grid pattern */}
        <pattern id="cvDots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="#c9a03a" fillOpacity="0.08" />
        </pattern>

        <filter id="cvGlowBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="cvNodeGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="360" height="480" fill="url(#cvBg)" />

      {/* Dot grid overlay */}
      <rect width="360" height="480" fill="url(#cvDots)" />

      {/* Starburst ambient glow (blurred) */}
      <ellipse
        cx="162"
        cy="138"
        rx="130"
        ry="110"
        fill="url(#cvGlow)"
        filter="url(#cvGlowBlur)"
      />

      {/* Starburst main rays */}
      <line x1="162" y1="138" x2="22" y2="358" stroke="url(#cvRayL)" strokeWidth="1.6" />
      <line x1="162" y1="138" x2="318" y2="360" stroke="url(#cvRayR)" strokeWidth="1.1" />
      <line x1="162" y1="138" x2="340" y2="52" stroke="url(#cvRayUR)" strokeWidth="0.8" />
      <line x1="162" y1="138" x2="18" y2="88" stroke="#d4a040" strokeWidth="0.5" strokeOpacity="0.15" />

      {/* Starburst bright core */}
      <circle cx="162" cy="138" r="10" fill="#e8c060" fillOpacity="0.25" />
      <circle cx="162" cy="138" r="4" fill="#f5e8c0" fillOpacity="0.55" />
      <circle cx="162" cy="138" r="2" fill="#f9f5e0" />

      {/* ── Gold tree network ─────────────────────────────────── */}

      {/* Roots */}
      <g fill="none" strokeLinecap="round">
        <path d="M 180 322 C 162 346 140 372 112 412" stroke="#c9a03a" strokeWidth="1.8" strokeOpacity="0.55" />
        <path d="M 180 322 C 178 355 176 381 174 432" stroke="#c9a03a" strokeWidth="1.6" strokeOpacity="0.45" />
        <path d="M 180 322 C 198 346 220 372 248 412" stroke="#c9a03a" strokeWidth="1.8" strokeOpacity="0.55" />
        <path d="M 112 412 C 96 422 78 428 62 442" stroke="#c9a03a" strokeWidth="1.2" strokeOpacity="0.35" />
        <path d="M 248 412 C 264 422 282 428 298 442" stroke="#c9a03a" strokeWidth="1.2" strokeOpacity="0.35" />
      </g>

      {/* Trunk */}
      <path d="M 180 322 L 180 200" fill="none" stroke="#c9a03a" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.7" />

      {/* Main branches */}
      <g fill="none" strokeLinecap="round">
        <path d="M 180 262 C 150 244 115 220 72 192" stroke="#c9a03a" strokeWidth="1.8" strokeOpacity="0.6" />
        <path d="M 180 232 C 157 215 132 196 110 175" stroke="#c9a03a" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M 180 200 L 180 162" stroke="#c9a03a" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M 180 232 C 203 215 228 196 250 175" stroke="#c9a03a" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M 180 262 C 210 244 245 220 288 192" stroke="#c9a03a" strokeWidth="1.8" strokeOpacity="0.6" />
      </g>

      {/* Sub-branches */}
      <g fill="none" strokeLinecap="round" strokeOpacity="0.38">
        <path d="M 72 192 C 55 176 40 158 34 140" stroke="#c9a03a" strokeWidth="1.3" />
        <path d="M 72 192 C 72 172 74 156 74 136" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 110 175 C 96 158 84 140 78 120" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 110 175 C 116 156 120 140 120 120" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 180 162 C 169 145 160 128 155 110" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 180 162 C 191 145 200 128 205 110" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 250 175 C 254 156 258 140 258 120" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 250 175 C 264 158 276 140 282 120" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 288 192 C 288 172 286 156 286 136" stroke="#c9a03a" strokeWidth="1.2" />
        <path d="M 288 192 C 305 176 320 158 326 140" stroke="#c9a03a" strokeWidth="1.3" />
      </g>

      {/* Leaf/tip dots */}
      <g fill="#c9a03a" fillOpacity="0.55">
        <circle cx="34" cy="140" r="3.5" />
        <circle cx="74" cy="136" r="3" />
        <circle cx="78" cy="120" r="3" />
        <circle cx="120" cy="120" r="3" />
        <circle cx="155" cy="110" r="3.5" />
        <circle cx="205" cy="110" r="3.5" />
        <circle cx="258" cy="120" r="3" />
        <circle cx="282" cy="120" r="3" />
        <circle cx="286" cy="136" r="3" />
        <circle cx="326" cy="140" r="3.5" />
      </g>

      {/* Root-end dots */}
      <g fill="#c9a03a" fillOpacity="0.3">
        <circle cx="62" cy="442" r="2.5" />
        <circle cx="174" cy="432" r="3" />
        <circle cx="298" cy="442" r="2.5" />
      </g>

      {/* Branch junction nodes (gold, glowing) */}
      <g>
        {[
          [72, 192], [110, 175], [180, 162], [250, 175], [288, 192],
          [112, 412], [248, 412],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#c9a03a" fillOpacity="0.12" filter="url(#cvNodeGlow)" />
            <circle cx={cx} cy={cy} r="5.5" fill="url(#cvNodeGold)" fillOpacity="0.8" />
          </g>
        ))}
      </g>

      {/* Root base node — the focal point */}
      <circle cx="180" cy="322" r="14" fill="#0d0a22" stroke="#c9a03a" strokeWidth="1.2" strokeOpacity="0.6" />
      <circle cx="180" cy="322" r="8" fill="#c9a03a" fillOpacity="0.7" />
      <circle cx="180" cy="322" r="3.5" fill="#f5e8c0" />

      {/* Trunk junction nodes */}
      <g fill="#c9a03a" fillOpacity="0.55">
        <circle cx="180" cy="262" r="4.5" />
        <circle cx="180" cy="232" r="4.5" />
        <circle cx="180" cy="200" r="5" />
      </g>

      {/* Gold decorative border */}
      <rect x="10" y="10" width="340" height="460" fill="none" stroke="#c9a03a" strokeWidth="1" strokeOpacity="0.25" />
      <rect x="14" y="14" width="332" height="452" fill="none" stroke="#c9a03a" strokeWidth="0.4" strokeOpacity="0.12" />

      {/* Corner ornaments */}
      {([
        [10, 10], [350, 10], [10, 470], [350, 470],
      ] as [number, number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#c9a03a" fillOpacity="0.35" />
      ))}

      {/* Horizontal rule at bottom */}
      <g opacity="0.2" stroke="#c9a03a" strokeWidth="0.5">
        <line x1="40" y1="462" x2="164" y2="462" />
        <circle cx="180" cy="462" r="1.5" fill="#c9a03a" />
        <line x1="196" y1="462" x2="320" y2="462" />
      </g>
    </svg>
  );
}
