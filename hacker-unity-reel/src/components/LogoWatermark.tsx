import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";

export const LogoWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glow effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [8, 25]
  );

  // Subtle breathing scale
  const breathe = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.97, 1.03]
  );

  // Fade in
  const opacity = interpolate(frame, [0, 20], [0, 0.85], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Top-left watermark logo */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 35,
          opacity,
          transform: `scale(${breathe})`,
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(0, 255, 140, 0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.6))`,
          display: "flex",
          alignItems: "center",
          gap: 0,
        }}
      >
        <Img
          src={staticFile("logo_transparent.png")}
          style={{
            width: 55,
            height: 55,
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
