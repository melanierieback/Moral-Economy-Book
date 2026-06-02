import starburstImg from "@assets/starburst_1780380536239.jpg";

interface NecLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NecLogo({ className = "", size = "md" }: NecLogoProps) {
  const markH = size === "sm" ? 34 : size === "lg" ? 48 : 40;
  const line1 = size === "sm" ? "text-[11px]" : size === "lg" ? "text-[15px]" : "text-[12px]";
  const line2 = size === "sm" ? "text-[9px]" : size === "lg" ? "text-[12px]" : "text-[10px]";

  return (
    <div className={`flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      {/* Starburst mark — square JPG, never force both W+H to different values */}
      <img
        src={starburstImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          display: "block",
          width: markH,
          height: markH,
          objectFit: "contain",
          borderRadius: 4,
          flexShrink: 0,
        }}
      />
      {/* Wordmark */}
      <div className="font-sans leading-none">
        <div className={`text-white font-bold tracking-[0.16em] uppercase ${line1}`}>
          Non&#8209;Extractive
        </div>
        <div
          className={`font-medium tracking-[0.20em] uppercase mt-[3px] ${line2}`}
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Capital
        </div>
      </div>
    </div>
  );
}
