import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  OffthreadVideo,
  staticFile,
  Audio,
} from "remotion";
import { Intro } from "./components/Intro";
import { ClipSegment } from "./components/ClipSegment";
import { GlitchTransition } from "./components/GlitchTransition";
import { Outro } from "./components/Outro";
import { ParticleOverlay } from "./components/ParticleOverlay";
import { ScanlineOverlay } from "./components/ScanlineOverlay";
import { LogoWatermark } from "./components/LogoWatermark";

const CLIPS = [
  { src: "clips/clip1.mp4", label: "THE STAGE IS SET 🔥", duration: 100 },
  { src: "clips/clip2.mp4", label: "CROWD GOES WILD 🎤", duration: 100 },
  { src: "clips/clip3.mp4", label: "HACKER UNITY VIBES 💀", duration: 120 },
  { src: "clips/clip4.mp4", label: "UNSTOPPABLE ENERGY ⚡", duration: 90 },
  { src: "clips/clip5.mp4", label: "MIC DROP MOMENTS 🎙️", duration: 100 },
  { src: "clips/clip6.mp4", label: "OG EDITING 🍷", duration: 100 },
  { src: "clips/clip7.mp4", label: "PURE CHAOS MODE 🔥", duration: 120 },
  { src: "clips/clip8.mp4", label: "LEGENDS NEVER DIE 👑", duration: 100 },
];

const INTRO_DURATION = 75; // 2.5s intro
const TRANSITION_DURATION = 12; // 0.4s glitch transition
const OUTRO_DURATION = 90; // 3s outro

export const HackerUnityReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  let currentFrame = INTRO_DURATION;
  const clipSequences: Array<{
    start: number;
    clip: (typeof CLIPS)[0];
    index: number;
  }> = [];

  CLIPS.forEach((clip, i) => {
    clipSequences.push({ start: currentFrame, clip, index: i });
    currentFrame += clip.duration;
    if (i < CLIPS.length - 1) {
      currentFrame += TRANSITION_DURATION;
    }
  });

  const outroStart = currentFrame;

  // Audio volume envelope: fade in at start, fade out at end
  const audioVolume = interpolate(
    frame,
    [0, 15, durationInFrames - 45, durationInFrames],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* === BACKGROUND MUSIC === */}
      <Audio
        src={staticFile("beat.wav")}
        volume={audioVolume}
      />

      {/* === INTRO === */}
      <Sequence from={0} durationInFrames={INTRO_DURATION + 10}>
        <Intro />
      </Sequence>

      {/* === CLIPS WITH TRANSITIONS === */}
      {clipSequences.map(({ start, clip, index }) => (
        <React.Fragment key={index}>
          <Sequence from={start} durationInFrames={clip.duration}>
            <ClipSegment
              src={clip.src}
              label={clip.label}
              clipIndex={index}
              totalClips={CLIPS.length}
            />
          </Sequence>

          {/* Glitch transition between clips */}
          {index < CLIPS.length - 1 && (
            <Sequence
              from={start + clip.duration - 4}
              durationInFrames={TRANSITION_DURATION + 8}
            >
              <GlitchTransition />
            </Sequence>
          )}
        </React.Fragment>
      ))}

      {/* === OUTRO === */}
      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>

      {/* === GLOBAL OVERLAYS === */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <ScanlineOverlay />
        <ParticleOverlay />
      </AbsoluteFill>

      {/* === LOGO WATERMARK (always visible) === */}
      <LogoWatermark />

      {/* === VIGNETTE === */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
