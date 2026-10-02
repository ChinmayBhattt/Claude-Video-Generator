import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const ScanlineOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Moving scan line
  const scanY = (frame * 8) % 1920;

  // Occasional horizontal interference
  const interferenceOpacity = interpolate(
    Math.sin(frame * 0.4),
    [-1, 1],
    [0, 0.08]
  );

  // CRT flicker
  const flickerOpacity = interpolate(
    Math.sin(frame * 2.5),
    [-1, 1],
    [0.92, 1]
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: flickerOpacity }}>
      {/* Subtle scanlines pattern */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          opacity: 0.4,
        }}
      />

      {/* Moving scan line */}
      <div
        style={{
          position: "absolute",
          top: scanY,
          left: 0,
          width: "100%",
          height: 3,
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,255,140,0.15) 20%, rgba(0,255,140,0.25) 50%, rgba(0,255,140,0.15) 80%, transparent 95%)",
          boxShadow: "0 0 15px rgba(0,255,140,0.1)",
        }}
      />

      {/* Second slower scan */}
      <div
        style={{
          position: "absolute",
          top: (1920 - (frame * 3) % 1920),
          left: 0,
          width: "100%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,0,80,0.1), transparent)",
        }}
      />

      {/* Horizontal interference bar */}
      <div
        style={{
          position: "absolute",
          top: `${40 + Math.sin(frame * 0.1) * 20}%`,
          left: 0,
          width: "100%",
          height: 20,
          background: `linear-gradient(0deg, transparent, rgba(255,255,255,${interferenceOpacity}), transparent)`,
        }}
      />

      {/* Film grain noise overlay - very subtle */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.3,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
