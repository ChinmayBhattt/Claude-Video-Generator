import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  OffthreadVideo,
  staticFile,
} from "remotion";

interface ClipSegmentProps {
  src: string;
  label: string;
  clipIndex: number;
  totalClips: number;
}

export const ClipSegment: React.FC<ClipSegmentProps> = ({
  src,
  label,
  clipIndex,
  totalClips,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === ENTRANCE ANIMATIONS ===
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.8 },
  });

  const enterZoom = interpolate(enterScale, [0, 1], [1.3, 1]);

  // === CONTINUOUS ZOOM (Ken Burns effect) ===
  const kenBurnsScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.12],
    { extrapolateRight: "clamp" }
  );

  // === SHAKE EFFECT (every few frames) ===
  const shakeIntensity = interpolate(
    frame,
    [0, 5, 10, durationInFrames - 10],
    [3, 0.5, 0.5, 0],
    { extrapolateRight: "clamp" }
  );
  const shakeX = Math.sin(frame * 7.3) * shakeIntensity;
  const shakeY = Math.cos(frame * 5.7) * shakeIntensity;

  // === FLASH ON ENTRY ===
  const flashOpacity = interpolate(frame, [0, 2, 5], [0.8, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  // === TEXT LABEL ANIMATION ===
  const labelDelay = 8;
  const labelY = interpolate(frame, [labelDelay, labelDelay + 12], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const labelOpacity = interpolate(
    frame,
    [labelDelay, labelDelay + 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  // === NEON BORDER GLOW ===
  const glowPulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [5, 20]
  );

  // === RGB SPLIT on entry ===
  const rgbOffset = interpolate(frame, [0, 8], [6, 0], {
    extrapolateRight: "clamp",
  });

  // === COUNTER / CLIP NUMBER ===
  const counterScale = spring({
    frame: frame - 3,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // === EXIT ANIMATION ===
  const exitProgress = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const exitScale = 1 + exitProgress * 0.15;
  const exitBrightness = 1 + exitProgress * 2;

  // Choose different accent colors per clip
  const accentColors = [
    "#00ff8c",
    "#ff0050",
    "#00d4ff",
    "#ff6b00",
    "#bf00ff",
    "#ffdd00",
    "#00ff8c",
    "#ff0050",
  ];
  const accent = accentColors[clipIndex % accentColors.length];

  return (
    <AbsoluteFill>
      {/* VIDEO LAYER with effects */}
      <AbsoluteFill
        style={{
          transform: `scale(${enterZoom * kenBurnsScale * exitScale}) translate(${shakeX}px, ${shakeY}px)`,
          filter: `brightness(${exitBrightness}) contrast(1.1) saturate(1.2)`,
        }}
      >
        {/* RGB Split layers */}
        {rgbOffset > 0.5 && (
          <>
            <AbsoluteFill
              style={{
                left: rgbOffset,
                opacity: 0.5,
                mixBlendMode: "screen",
                filter: "url(#redChannel)",
              }}
            >
              <OffthreadVideo
                src={staticFile(src)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                left: -rgbOffset,
                opacity: 0.5,
                mixBlendMode: "screen",
                filter: "hue-rotate(180deg)",
              }}
            >
              <OffthreadVideo
                src={staticFile(src)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </>
        )}

        {/* Main video */}
        <OffthreadVideo
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: flashOpacity,
          mixBlendMode: "overlay",
        }}
      />

      {/* Gradient overlay bottom for text */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            0deg,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.4) 25%,
            transparent 50%,
            rgba(0,0,0,0.2) 85%,
            rgba(0,0,0,0.5) 100%
          )`,
        }}
      />

      {/* Text label at bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 220,
        }}
      >
        <div
          style={{
            transform: `translateY(${labelY}px)`,
            opacity: labelOpacity,
            textAlign: "center",
          }}
        >
          {/* Accent line above text */}
          <div
            style={{
              width: interpolate(frame, [labelDelay, labelDelay + 20], [0, 200], {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.exp),
              }),
              height: 3,
              background: accent,
              margin: "0 auto 12px",
              boxShadow: `0 0 ${glowPulse}px ${accent}`,
              borderRadius: 2,
            }}
          />

          <div
            style={{
              color: "#fff",
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 2,
              textShadow: `
                0 0 15px ${accent}80,
                0 2px 10px rgba(0,0,0,0.8),
                ${accent === "#00ff8c" ? "0 0 30px rgba(0,255,140,0.3)" : `0 0 30px ${accent}40`}
              `,
              lineHeight: 1.2,
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>

      {/* Clip counter top-right */}
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 40,
          transform: `scale(${counterScale})`,
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "'Courier New', monospace",
            textShadow: `0 0 10px ${accent}80`,
            padding: "6px 14px",
            border: `1px solid ${accent}50`,
            background: `rgba(0,0,0,0.5)`,
            borderRadius: 4,
          }}
        >
          {String(clipIndex + 1).padStart(2, "0")}/{String(totalClips).padStart(2, "0")}
        </div>
      </div>

      {/* Side accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          width: 4,
          height: `${interpolate(frame, [0, 15], [0, 60], { extrapolateRight: "clamp" })}%`,
          background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 15px ${accent}60`,
        }}
      />

      {/* Neon frame border (subtle) */}
      <AbsoluteFill
        style={{
          border: `1px solid ${accent}20`,
          boxShadow: `inset 0 0 ${glowPulse * 2}px ${accent}10`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
