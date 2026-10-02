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

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry flash
  const flashOpacity = interpolate(frame, [0, 3, 6], [1, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  // Logo/title spring in
  const titleScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

  // Social handles slide up
  const handleY = interpolate(frame, [20, 35], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const handleOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CTA pulse
  const ctaPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.95, 1.05]
  );

  // Glitch on text
  const glitch =
    frame > 10 && frame < 70
      ? Math.sin(frame * 20) *
        interpolate(frame, [10, 20, 60, 70], [0, 2, 2, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Glow intensity
  const glow = interpolate(Math.sin(frame * 0.12), [-1, 1], [10, 30]);

  // Rotating border
  const borderAngle = frame * 2;

  // Fade out at end
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Follow/Subscribe animation
  const followScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 50% 40%, rgba(0,255,140,0.1) 0%, transparent 50%),
            radial-gradient(circle at 30% 80%, rgba(255,0,80,0.08) 0%, transparent 40%),
            linear-gradient(180deg, #050510, #0a0a0a, #050505)
          `,
        }}
      />

      {/* Animated grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,140,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          backgroundPosition: `0 ${frame * 0.5}px`,
          opacity: 0.5,
        }}
      />

      {/* Flash */}
      <AbsoluteFill
        style={{ backgroundColor: "#fff", opacity: flashOpacity }}
      />

      {/* Center content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo above glow ring */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            transform: `scale(${spring({
              frame: frame - 3,
              fps,
              config: { damping: 12, stiffness: 160, mass: 0.6 },
            })})`,
            filter: `drop-shadow(0 0 ${glow * 1.5}px rgba(0,255,140,0.5)) drop-shadow(0 0 ${glow * 3}px rgba(0,255,140,0.25))`,
            opacity: interpolate(frame, [2, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <Img
            src={staticFile("logo_transparent.png")}
            style={{
              width: 160,
              height: 160,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Rotating glow ring */}
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "2px solid transparent",
            background: `conic-gradient(from ${borderAngle}deg, #00ff8c, #00d4ff, #bf00ff, #ff0050, #00ff8c) border-box`,
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0.6,
            filter: `blur(1px) drop-shadow(0 0 ${glow}px rgba(0,255,140,0.4))`,
          }}
        />

        {/* Main title */}
        <div
          style={{
            transform: `scale(${titleScale})`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Glitch layers */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: glitch * 2,
              width: "100%",
              color: "#ff0050",
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              opacity: Math.abs(glitch) > 0.5 ? 0.6 : 0,
              textTransform: "uppercase",
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
              left: -glitch * 2,
              width: "100%",
              color: "#00d4ff",
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              opacity: Math.abs(glitch) > 0.5 ? 0.6 : 0,
              textTransform: "uppercase",
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
              fontSize: 72,
              fontWeight: 900,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              textTransform: "uppercase",
              textShadow: `
                0 0 ${glow}px rgba(0,255,140,0.6),
                0 0 ${glow * 2}px rgba(0,255,140,0.3)
              `,
              lineHeight: 1.1,
            }}
          >
            HACKER
            <br />
            UNITY
          </div>
        </div>

        {/* Social handles */}
        <div
          style={{
            position: "absolute",
            top: "63%",
            transform: `translateY(${handleY}px)`,
            opacity: handleOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#00ff8c",
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              letterSpacing: 3,
              marginBottom: 16,
              textShadow: `0 0 10px rgba(0,255,140,0.5)`,
            }}
          >
            @HACKERUNITY
          </div>

          {/* Divider */}
          <div
            style={{
              width: interpolate(frame, [30, 45], [0, 200], {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.exp),
              }),
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #ff0050, transparent)",
              margin: "0 auto 16px",
              boxShadow: "0 0 10px rgba(255,0,80,0.4)",
            }}
          />

          {/* Follow CTA */}
          <div
            style={{
              transform: `scale(${followScale * ctaPulse})`,
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: 5,
              textTransform: "uppercase",
              padding: "10px 30px",
              border: "1px solid rgba(0,255,140,0.4)",
              background: "rgba(0,255,140,0.08)",
              textShadow: "0 0 10px rgba(0,255,140,0.4)",
              boxShadow: `0 0 ${glow}px rgba(0,255,140,0.2)`,
            }}
          >
            FOLLOW FOR MORE 🔥
          </div>
        </div>
      </AbsoluteFill>

      {/* Corner brackets */}
      {[0, 1, 2, 3].map((corner) => {
        const isTop = corner < 2;
        const isLeft = corner % 2 === 0;
        return (
          <div
            key={corner}
            style={{
              position: "absolute",
              top: isTop ? 50 : undefined,
              bottom: isTop ? undefined : 50,
              left: isLeft ? 30 : undefined,
              right: isLeft ? undefined : 30,
              width: 40,
              height: 40,
              borderTop: isTop ? "2px solid #00ff8c" : "none",
              borderBottom: isTop ? "none" : "2px solid #00ff8c",
              borderLeft: isLeft ? "2px solid #00ff8c" : "none",
              borderRight: isLeft ? "none" : "2px solid #00ff8c",
              opacity: interpolate(frame, [10, 25], [0, 0.5], {
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
