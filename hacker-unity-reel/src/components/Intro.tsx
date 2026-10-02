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

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash in
  const flashOpacity = interpolate(frame, [0, 3, 6], [1, 0, 0], {
    extrapolateRight: "clamp",
  });

  // Title animation
  const titleScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const titleY = interpolate(frame, [8, 25], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Subtitle slide in
  const subtitleX = interpolate(frame, [20, 38], [-600, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const subtitleOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glitch effect on title
  const glitchOffset =
    frame > 15 && frame < 55
      ? Math.sin(frame * 15) * interpolate(frame, [15, 30, 50, 55], [0, 4, 4, 0], { extrapolateRight: "clamp" })
      : 0;

  // Line decorations
  const lineWidth = interpolate(frame, [12, 35], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Pulsing glow
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [15, 40]
  );

  // Exit animation
  const exitOpacity = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitScale = interpolate(frame, [60, 75], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scan line effect
  const scanY = (frame * 12) % 1920;

  // Lightning bolts / energy lines
  const energyOpacity = interpolate(
    Math.sin(frame * 0.3),
    [-1, 1],
    [0.2, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Animated background gradient */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 50% 30%, rgba(0, 255, 140, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 30% 70%, rgba(255, 0, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(0, 200, 255, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #050510 50%, #0a0505 100%)
          `,
        }}
      />

      {/* Grid pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,140,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: interpolate(frame, [5, 20], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Moving scan line */}
      <div
        style={{
          position: "absolute",
          top: scanY,
          left: 0,
          width: "100%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,140,0.5), transparent)",
          boxShadow: "0 0 20px rgba(0,255,140,0.3)",
        }}
      />

      {/* Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: flashOpacity,
        }}
      />

      {/* Center content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Decorative lines top */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${lineWidth}%`,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #00ff8c, transparent)",
            boxShadow: `0 0 ${glowIntensity}px rgba(0,255,140,0.5)`,
          }}
        />

        {/* Logo Image */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            transform: `scale(${spring({
              frame: frame - 5,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.7 },
            })})`,
            filter: `drop-shadow(0 0 ${glowIntensity * 1.5}px rgba(0,255,140,0.5)) drop-shadow(0 0 ${glowIntensity * 3}px rgba(0,255,140,0.2))`,
            opacity: interpolate(frame, [3, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <Img
            src={staticFile("logo_transparent.png")}
            style={{
              width: 180,
              height: 180,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Main title */}
        <div
          style={{
            transform: `translateY(${titleY + 60}px) scale(${titleScale})`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Glitch layers */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: glitchOffset * 2,
              width: "100%",
              opacity: Math.abs(glitchOffset) > 1 ? 0.7 : 0,
              color: "#ff0050",
              fontSize: 90,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: "-2px",
              textTransform: "uppercase",
              WebkitTextStroke: "1px #ff0050",
            }}
          >
            HACKER
            <br />
            UNITY
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -glitchOffset * 2,
              width: "100%",
              opacity: Math.abs(glitchOffset) > 1 ? 0.7 : 0,
              color: "#00d4ff",
              fontSize: 90,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: "-2px",
              textTransform: "uppercase",
              WebkitTextStroke: "1px #00d4ff",
            }}
          >
            HACKER
            <br />
            UNITY
          </div>

          {/* Main text */}
          <div
            style={{
              color: "#fff",
              fontSize: 90,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: "-2px",
              textTransform: "uppercase",
              textShadow: `
                0 0 ${glowIntensity}px rgba(0,255,140,0.8),
                0 0 ${glowIntensity * 2}px rgba(0,255,140,0.4),
                0 4px 20px rgba(0,0,0,0.8)
              `,
              lineHeight: 1.05,
            }}
          >
            HACKER
            <br />
            UNITY
          </div>

          {/* Emoji fire */}
          <div
            style={{
              fontSize: 50,
              marginTop: 10,
              opacity: interpolate(frame, [25, 35], [0, 1], {
                extrapolateRight: "clamp",
              }),
              transform: `scale(${spring({
                frame: frame - 25,
                fps,
                config: { damping: 8, stiffness: 150 },
              })})`,
            }}
          >
            🔥💀🔥
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "absolute",
            top: "62%",
            transform: `translateX(${subtitleX}px)`,
            opacity: subtitleOpacity,
            color: "#00ff8c",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "'Courier New', monospace",
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: "0 0 15px rgba(0,255,140,0.6)",
            padding: "8px 24px",
            border: "1px solid rgba(0,255,140,0.3)",
            background: "rgba(0,255,140,0.05)",
          }}
        >
          EVENT HIGHLIGHTS
        </div>

        {/* Decorative lines bottom */}
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${lineWidth * 0.6}%`,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #ff0050, transparent)",
            boxShadow: `0 0 ${glowIntensity}px rgba(255,0,80,0.5)`,
          }}
        />
      </AbsoluteFill>

      {/* Corner decorations */}
      {[0, 1, 2, 3].map((corner) => {
        const isTop = corner < 2;
        const isLeft = corner % 2 === 0;
        const cornerOpacity = interpolate(frame, [15, 30], [0, 0.6], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={corner}
            style={{
              position: "absolute",
              top: isTop ? 60 : undefined,
              bottom: isTop ? undefined : 60,
              left: isLeft ? 40 : undefined,
              right: isLeft ? undefined : 40,
              width: 50,
              height: 50,
              borderTop: isTop ? "2px solid #00ff8c" : "none",
              borderBottom: isTop ? "none" : "2px solid #00ff8c",
              borderLeft: isLeft ? "2px solid #00ff8c" : "none",
              borderRight: isLeft ? "none" : "2px solid #00ff8c",
              opacity: cornerOpacity,
              boxShadow: `0 0 10px rgba(0,255,140,0.3)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
