interface NecLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NecLogo({ className = "", size = "md" }: NecLogoProps) {
  const markSize = size === "sm" ? 26 : size === "lg" ? 42 : 34;
  const line1Class = size === "sm" ? "text-[10px]" : size === "lg" ? "text-[14px]" : "text-[12px]";
  const line2Class = size === "sm" ? "text-[9px]" : size === "lg" ? "text-[12px]" : "text-[10px]";

  return (
    <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* Starburst mark — V-shaped lens flare on dark purple panel */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="nmBg" cx="42%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#32196e" />
            <stop offset="50%" stopColor="#180d3c" />
            <stop offset="100%" stopColor="#06060e" />
          </radialGradient>
          <radialGradient id="nmGlow" cx="42%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#f8eed4" stopOpacity="0.95" />
            <stop offset="15%" stopColor="#e0a830" stopOpacity="0.65" />
            <stop offset="42%" stopColor="#7040c0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          {/* V-shape: left arm goes lower-left, right arm goes lower-right from apex */}
          <linearGradient id="nmRL" x1="15" y1="11" x2="2" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8eed4" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nmRR" x1="15" y1="11" x2="31" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0dca0" stopOpacity="0.68" />
            <stop offset="100%" stopColor="#b08028" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nmRU" x1="15" y1="11" x2="34" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f4e8c0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
          </linearGradient>
          <filter id="nmBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <rect width="36" height="36" fill="url(#nmBg)" />
        <ellipse cx="15" cy="11" rx="14" ry="11" fill="url(#nmGlow)" filter="url(#nmBlur)" />
        {/* V arms — down-left and down-right from apex (15, 11) */}
        <line x1="15" y1="11" x2="2" y2="34" stroke="url(#nmRL)" strokeWidth="1.4" />
        <line x1="15" y1="11" x2="31" y2="34" stroke="url(#nmRR)" strokeWidth="1.0" />
        {/* Cross spike upper-right */}
        <line x1="15" y1="11" x2="34" y2="2" stroke="url(#nmRU)" strokeWidth="0.55" />
        {/* Soft left glow line */}
        <line x1="15" y1="11" x2="0" y2="13" stroke="#d4a040" strokeWidth="0.35" strokeOpacity="0.2" />
        {/* Bright core */}
        <circle cx="15" cy="11" r="2.6" fill="#f5e8c0" fillOpacity="0.28" />
        <circle cx="15" cy="11" r="1.1" fill="#f9f5e2" />
      </svg>

      {/* Word mark */}
      <div className="font-sans leading-none">
        <div className={`text-white font-bold tracking-[0.16em] uppercase ${line1Class}`}>
          Non&#8209;Extractive
        </div>
        <div className={`text-white/60 font-medium tracking-[0.20em] uppercase mt-[3px] ${line2Class}`}>
          Capital
        </div>
      </div>
    </div>
  );
}
