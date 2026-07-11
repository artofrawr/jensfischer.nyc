/**
 * Shared mutable state, replacing the original global `Karaoke.soundPitch`.
 * The Trail visualizer writes `soundPitch` based on how accurately the player
 * matches the melody, and the Sound/Sparkler read it back.
 */
export const demoState = {
  soundPitch: 1,
}

/** Base URL for demo assets served from /public. */
export const ASSET_BASE = "/demos/karaoke"
