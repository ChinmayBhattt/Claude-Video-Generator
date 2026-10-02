import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  random,
} from "remotion";

export const GlitchTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 20; // total duration of the transition overlay

  const progress = frame / totalFrames;

  // Core intensity curve - peaks in the middle
  const intensity = interpolate(
    frame,
    [0, totalFrames * 0.3, totalFrames * 0.5, totalFrames * 0.7, totalFrames],
    [0, 0.8, 1, 0.8, 0],
    { extrapolateRight: "clamp" }
  );

  // Generate glitch slices
  const sliceCount = 12;
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const seed = frame * 100 + i;
    const y = (i / sliceCount) * 100;
    const height = (1 / sliceCount) * 100 + random(seed) * 3;
    const offset = (random(seed + 1) - 0.5) * 80 * intensity;
    const show = random(seed + 2) > 0.3;

    return { y, height, offset, show };
  });

  // White flash
  const flashOpacity = interpolate(
    frame,
    [totalFrames * 0.4, totalFrames * 0.5, totalFrames * 0.6],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color bars (like VHS tracking)
  const colorBarOpacity = intensity * 0.7;

  // Digital noise blocks
  const noiseBlocks = Array.from({ length: 20 }, (_, i) => {
    const seed = frame * 50 + i * 7;
    return {
      x: random(seed) * 100,
      y: random(seed + 1) * 100,
      w: random(seed + 2) * 30 + 5,
      h: random(seed + 3) * 8 + 2,
      color:
        random(seed + 4) > 0.5
          ? `rgba(0,255,140,${intensity * 0.8})`
          : `rgba(255,0,80,${intensity * 0.6})`,
      visible: random(seed + 5) > 0.4,
    };
  });

  // Horizontal scan distortion lines
  const scanLines = Array.from({ length: 6 }, (_, i) => {
    const seed = frame * 30 + i * 13;
    return {
      y: random(seed) * 100,
      thickness: random(seed + 1) * 4 + 1,
      opacity: intensity * (random(seed + 2) * 0.5 + 0.3),
      color: random(seed + 3) > 0.5 ? "#00ff8c" : "#ff0050",
    };
  });

  if (intensity < 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Horizontal glitch slices */}
      {slices.map(
        (slice, i) =>
          slice.show && (
            <div
              key={`slice-${i}`}
              style={{
                position: "absolute",
                top: `${slice.y}%`,
                left: `${slice.offset}%`,
                width: "100%",
                height: `${slice.height}%`,
                background: `rgba(${random(frame * 10 + i) > 0.5 ? "0,255,140" : "255,0,80"}, ${intensity * 0.15})`,
                mixBlendMode: "screen",
              }}
            />
          )
      )}

      {/* Digital noise blocks */}
      {noiseBlocks.map(
        (block, i) =>
          block.visible && (
            <div
              key={`noise-${i}`}
              style={{
                position: "absolute",
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.w}%`,
                height: `${block.h}%`,
                background: block.color,
                mixBlendMode: "screen",
              }}
            />
          )
      )}

      {/* Scan distortion lines */}
      {scanLines.map((line, i) => (
        <div
          key={`scan-${i}`}
          style={{
            position: "absolute",
            top: `${line.y}%`,
            left: 0,
            width: "100%",
            height: line.thickness,
            background: line.color,
            opacity: line.opacity,
            boxShadow: `0 0 10px ${line.color}`,
          }}
        />
      ))}

      {/* Color channel offset bars */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            0deg,
            rgba(255,0,80,${colorBarOpacity * 0.2}) 0%,
            transparent 20%,
            rgba(0,255,140,${colorBarOpacity * 0.15}) 40%,
            transparent 60%,
            rgba(0,200,255,${colorBarOpacity * 0.2}) 80%,
            transparent 100%
          )`,
          mixBlendMode: "screen",
        }}
      />

      {/* White flash at peak */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: flashOpacity,
        }}
      />

      {/* Chromatic border flicker */}
      <AbsoluteFill
        style={{
          border: `${intensity * 3}px solid rgba(0,255,140,${intensity * 0.5})`,
          boxShadow: `
            inset ${intensity * 5}px 0 0 rgba(255,0,80,${intensity * 0.3}),
            inset -${intensity * 5}px 0 0 rgba(0,200,255,${intensity * 0.3})
          `,
        }}
      />
    </AbsoluteFill>
  );
};
