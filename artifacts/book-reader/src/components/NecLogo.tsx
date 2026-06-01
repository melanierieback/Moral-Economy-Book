import necLogoTransparent from "@assets/nec-logo-transparent.png";

interface NecLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NecLogo({ className = "", size = "md" }: NecLogoProps) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const line1Class = size === "sm" ? "text-[11px]" : size === "lg" ? "text-[15px]" : "text-[13px]";
  const line2Class = size === "sm" ? "text-[9px]" : size === "lg" ? "text-[12px]" : "text-[11px]";

  return (
    <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* Real NEC logo mark — transparent PNG, cropped to the icon area */}
      <div
        aria-hidden="true"
        style={{ width: markSize, height: markSize, overflow: "hidden", flexShrink: 0 }}
      >
        <img
          src={necLogoTransparent}
          alt=""
          style={{ height: markSize, width: "auto", display: "block" }}
          draggable={false}
        />
      </div>

      {/* Word mark */}
      <div className="font-sans leading-none">
        <div className={`text-white font-bold tracking-[0.16em] uppercase ${line1Class}`}>
          Non&#8209;Extractive
        </div>
        <div className={`font-medium tracking-[0.20em] uppercase mt-[3px] ${line2Class}`} style={{ color: "rgba(255,255,255,0.55)" }}>
          Capital
        </div>
      </div>
    </div>
  );
}
