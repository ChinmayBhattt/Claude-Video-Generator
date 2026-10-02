import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";

interface Particle {
  id: number;
  x: number;
  speed: number;
  size: number;
  opacity: number;
  delay: number;
  color: string;
  drift: number;
}

export const ParticleOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: random(`particle-x-${i}`) * 100,
      speed: random(`particle-speed-${i}`) * 2 + 0.5,
      size: random(`particle-size-${i}`) * 3 + 1,
      opacity: random(`particle-opacity-${i}`) * 0.4 + 0.1,
      delay: random(`particle-delay-${i}`) * 200,
      color:
        random(`particle-color-${i}`) > 0.6
          ? "#00ff8c"
          : random(`particle-color-${i}`) > 0.3
            ? "#ff0050"
            : "#00d4ff",
      drift: (random(`particle-drift-${i}`) - 0.5) * 50,
    }));
  }, []);

  // Ember/spark particles
  const sparks: Particle[] = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 100,
      x: random(`spark-x-${i}`) * 100,
      speed: random(`spark-speed-${i}`) * 3 + 1,
      size: random(`spark-size-${i}`) * 2 + 0.5,
      opacity: random(`spark-opacity-${i}`) * 0.6 + 0.2,
      delay: random(`spark-delay-${i}`) * 150,
      color: "#ff6b00",
      drift: (random(`spark-drift-${i}`) - 0.5) * 80,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Rising particles (like embers/digital dust) */}
      {particles.map((p) => {
        const adjustedFrame = Math.max(0, frame - p.delay * 0.1);
        const y = 110 - ((adjustedFrame * p.speed) % 130);
        const xOffset =
          Math.sin(adjustedFrame * 0.03 + p.id) * p.drift * 0.3;
        const flickerOpacity =
          p.opacity *
          interpolate(
            Math.sin(adjustedFrame * 0.2 + p.id * 2),
            [-1, 1],
            [0.3, 1]
          );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x + xOffset * 0.1}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: flickerOpacity,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
            }}
          />
        );
      })}

      {/* Sparks (brighter, faster) */}
      {sparks.map((s) => {
        const adjustedFrame = Math.max(0, frame - s.delay * 0.1);
        const y = 110 - ((adjustedFrame * s.speed) % 140);
        const xOffset = Math.sin(adjustedFrame * 0.05 + s.id) * s.drift * 0.5;
        const sparkOpacity =
          s.opacity *
          (Math.sin(adjustedFrame * 0.5 + s.id * 3) > 0.3 ? 1 : 0.1);

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x + xOffset * 0.1}%`,
              top: `${y}%`,
              width: s.size,
              height: s.size * 2,
              borderRadius: "50%",
              backgroundColor: s.color,
              opacity: sparkOpacity,
              boxShadow: `0 0 ${s.size * 5}px ${s.color}`,
            }}
          />
        );
      })}

      {/* Floating digital code fragments (subtle) */}
      {Array.from({ length: 8 }, (_, i) => {
        const seed = `code-${i}`;
        const x = random(seed + "-x") * 90 + 5;
        const baseY = random(seed + "-y") * 80 + 10;
        const y = baseY + Math.sin(frame * 0.02 + i * 2) * 5;
        const opacity = interpolate(
          Math.sin(frame * 0.08 + i * 1.5),
          [-1, 1],
          [0, 0.12]
        );
        const chars = ["01", "//", "{}",  ">>", "0x", "<<", "##", "**"];

        return (
          <div
            key={`code-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              color: "#00ff8c",
              fontSize: 12,
              fontFamily: "'Courier New', monospace",
              opacity,
              fontWeight: 700,
            }}
          >
            {chars[i]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
