interface NecLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NecLogo({ className = "", size = "md" }: NecLogoProps) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textClass =
    size === "sm"
      ? "text-[10px]"
      : size === "lg"
      ? "text-[14px]"
      : "text-[12px]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Starburst mark */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="necMarkBg" cx="40%" cy="33%" r="72%">
            <stop offset="0%" stopColor="#30196b" />
            <stop offset="45%" stopColor="#180d3e" />
            <stop offset="100%" stopColor="#07060f" />
          </radialGradient>
          <radialGradient id="necMarkGlow" cx="40%" cy="33%" r="48%">
            <stop offset="0%" stopColor="#f5e8c0" stopOpacity="1" />
            <stop offset="18%" stopColor="#d09828" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#6b38b8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="necRayL" x1="14" y1="12" x2="2" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f5e8c0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c49030" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="necRayR" x1="14" y1="12" x2="28" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0d8a0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#b08020" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="necRayUR" x1="14" y1="12" x2="34" y2="3" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0e0b0" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#d4a040" stopOpacity="0" />
          </linearGradient>
          <filter id="necGlowBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Background panel */}
        <rect width="36" height="36" fill="url(#necMarkBg)" />

        {/* Ambient purple glow */}
        <ellipse
          cx="14"
          cy="12"
          rx="14"
          ry="12"
          fill="url(#necMarkGlow)"
          filter="url(#necGlowBlur)"
        />

        {/* Starburst rays */}
        <line x1="14" y1="12" x2="1" y2="35" stroke="url(#necRayL)" strokeWidth="1.3" />
        <line x1="14" y1="12" x2="28" y2="35" stroke="url(#necRayR)" strokeWidth="0.9" />
        <line x1="14" y1="12" x2="34" y2="3" stroke="url(#necRayUR)" strokeWidth="0.55" />
        <line
          x1="14" y1="12" x2="0" y2="14"
          stroke="#d4a040"
          strokeWidth="0.4"
          strokeOpacity="0.18"
        />

        {/* Bright core */}
        <circle cx="14" cy="12" r="2.5" fill="#f5e8c0" fillOpacity="0.28" />
        <circle cx="14" cy="12" r="1.1" fill="#f9f4e0" />
      </svg>

      {/* Word mark */}
      <div className={`font-sans leading-none ${textClass}`}>
        <div className="text-white font-bold tracking-[0.18em] uppercase">
          Non&#8209;Extractive
        </div>
        <div className="text-white/65 font-medium tracking-[0.22em] uppercase mt-[2px]">
          Capital
        </div>
      </div>
    </div>
  );
}
